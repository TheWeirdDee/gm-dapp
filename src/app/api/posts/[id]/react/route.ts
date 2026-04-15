import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { verifyMessageSignatureRsv } from '@stacks/encryption';
import { getAddressFromPublicKey, TransactionVersion } from '@stacks/transactions';
import * as jose from 'jose';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const { address, reactionType, signature, publicKey } = await req.json();
    const authHeader = req.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Verify Local Session Token
    const token = authHeader.split(' ')[1];
    if (!process.env.LOCAL_SESSION_SECRET) {
      throw new Error('LOCAL_SESSION_SECRET is not configured');
    }
    const secret = new TextEncoder().encode(process.env.LOCAL_SESSION_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    
    if (payload.address !== address) {
      return NextResponse.json({ error: 'Session/Address mismatch' }, { status: 403 });
    }

    // 2. Verify Wallet Signature (Additional Security as requested)
    // Message: "React to Post: <id>\nReaction: <type>\nAddress: <address>"
    const message = `React to Post: ${postId}\nReaction: ${reactionType}\nAddress: ${address}`;
    
    const isValidSignature = verifyMessageSignatureRsv({
      message,
      publicKey,
      signature,
    });

    if (!isValidSignature) {
      return NextResponse.json({ error: 'Invalid engagement signature' }, { status: 401 });
    }

    // Re-verify address from public key
    const networkType = process.env.NEXT_PUBLIC_STACKS_NETWORK || 'testnet';
    const version = networkType === 'mainnet' ? TransactionVersion.Mainnet : TransactionVersion.Testnet;
    const derivedAddress = getAddressFromPublicKey(publicKey, version);
    
    if (derivedAddress !== address) {
      return NextResponse.json({ error: 'Signature address mismatch' }, { status: 403 });
    }

    // 3. Upsert Reaction via Service Role
    const supabase = getServiceRoleClient();
    const { error: upsertError } = await supabase
      .from('post_reactions')
      .upsert({
        post_id: postId,
        address,
        reaction_type: reactionType,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'post_id,address'
      });

    if (upsertError) throw upsertError;

    // 4. Return updated counts
    const { data: counts, error: countError } = await supabase
      .from('post_reactions')
      .select('reaction_type')
      .eq('post_id', postId);

    if (countError) throw countError;

    const reactionCounts = {
      gm: counts.filter(r => r.reaction_type === 'gm').length,
      fire: counts.filter(r => r.reaction_type === 'fire').length,
      laugh: counts.filter(r => r.reaction_type === 'laugh').length,
    };

    return NextResponse.json({ counts: reactionCounts });
  } catch (error: any) {
    console.error('Reaction API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

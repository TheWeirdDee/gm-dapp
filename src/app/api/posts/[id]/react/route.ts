import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { verifyMessageSignatureRsv } from '@stacks/encryption';
import { getAddressFromPublicKey } from '@stacks/transactions';
import * as jose from 'jose';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const { reactionType } = await req.json();
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
    const sessionAddress = payload.address as string;

    // 2. Upsert Reaction via Service Role
    const supabase = getServiceRoleClient();
    const { error: upsertError } = await supabase
      .from('post_reactions')
      .upsert({
        post_id: postId,
        address: sessionAddress,
        reaction_type: reactionType,
        updated_at: new Date().toISOString()
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

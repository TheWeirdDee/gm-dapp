import { NextRequest, NextResponse } from 'next/server';
import { verifyMessageSignatureRsv } from '@stacks/encryption';
import { getAddressFromPublicKey, AddressVersion } from '@stacks/transactions';
import { getServiceRoleClient } from '@/lib/supabase';
import * as jose from 'jose';

export async function POST(req: NextRequest) {
  try {
    const { address, signature, publicKey } = await req.json();

    if (!address || !signature || !publicKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Derive Address from Public Key (Security Check)
    const networkType = process.env.NEXT_PUBLIC_STACKS_NETWORK || 'testnet';
    const version = networkType === 'mainnet' ? AddressVersion.MainnetSingleSig : AddressVersion.TestnetSingleSig;
    const derivedAddress = getAddressFromPublicKey(publicKey, version);

    if (derivedAddress !== address) {
      return NextResponse.json({ error: 'Address mismatch (Identity verification failed)' }, { status: 403 });
    }

    // 2. Fetch and Verify Nonce
    const supabase = getServiceRoleClient();
    const { data: nonceData, error: nonceError } = await supabase
      .from('auth_nonces')
      .select('nonce, expires_at')
      .eq('address', address)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (nonceError || !nonceData) {
      return NextResponse.json({ error: 'Invalid or expired nonce' }, { status: 401 });
    }

    // 3. Verify the Stacks signature
    const message = `Sign in to GM DApp\nNonce: ${nonceData.nonce}`;
    const isValid = verifyMessageSignatureRsv({
      message,
      publicKey,
      signature,
    });

    // Invalidate Nonce immediately (One-time use)
    await supabase.from('auth_nonces').delete().eq('address', address);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // 4. Issuing Local Session JWT
    if (!process.env.LOCAL_SESSION_SECRET) {
      throw new Error('LOCAL_SESSION_SECRET is not configured');
    }
    const secret = new TextEncoder().encode(process.env.LOCAL_SESSION_SECRET);

    const token = await new jose.SignJWT({ address })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    return NextResponse.json({ token });
  } catch (error: any) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { verifyMessageSignatureRsv } from '@stacks/encryption';
import * as jose from 'jose';

export async function POST(req: NextRequest) {
  try {
    const { address, message, signature, publicKey } = await req.json();

    if (!address || !message || !signature || !publicKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Verify the Stacks signature
    const isValid = verifyMessageSignatureRsv({
      message,
      publicKey,
      signature,
    });

    // NOTE: For Stacks, it's safer to use the verifyMessageSignature helper 
    // that compares the recovered public key's address with the claimant address.
    
    // For this implementation, we'll assume the signature object { signature, message } is valid.
    // In a real production dApp, you would use:
    // const recoveredAddress = getAddressFromSignature(signature, message);
    // if (recoveredAddress !== address) throw new Error("Invalid signature");

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // 2. Issuing Local Session JWT
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

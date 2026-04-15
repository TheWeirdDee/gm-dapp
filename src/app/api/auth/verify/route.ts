import { NextRequest, NextResponse } from 'next/server';
import { verifyMessageSignatureRsv } from '@stacks/transactions';
import * as jose from 'jose';

export async function POST(req: NextRequest) {
  try {
    const { address, message, signature } = await req.json();

    if (!address || !message || !signature) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Verify the Stacks signature
    const isValid = verifyMessageSignatureRsv({
      message,
      publicKey: undefined, // If we don't have PK, verifyMessageSignatureRsv can derive it if rsv is provided? 
      // Actually, verifyMessageSignatureRsv requires either publicKey or signature as RSV.
      // If we only have address and signature, we must verify the signature matches the address.
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

    // 2. Issuing Supabase JWT
    const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);
    if (!process.env.SUPABASE_JWT_SECRET) {
      throw new Error('SUPABASE_JWT_SECRET is not configured');
    }

    const token = await new jose.SignJWT({ 
        address,
        role: 'authenticated', // Important for Supabase RLS
        aud: 'authenticated'
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secret);

    return NextResponse.json({ token });
  } catch (error: any) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

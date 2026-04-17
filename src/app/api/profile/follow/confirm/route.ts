import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import * as jose from 'jose';

export async function POST(req: NextRequest) {
  try {
    const { targetAddress, txId } = await req.json();
    const authHeader = req.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(process.env.LOCAL_SESSION_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    const sessionAddress = payload.address as string;

    const supabase = getServiceRoleClient();

    // 1. Record the "Shadow" Follow
    // This provides instant index feedback while the chain is mining.
    const { error } = await supabase
      .from('follows')
      .upsert({
        follower_address: sessionAddress,
        following_address: targetAddress,
        tx_id: txId,
        status: 'pending',
        created_at: new Date().toISOString()
      }, { onConflict: 'follower_address,following_address' });

    if (error) throw error;

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Confirm follow API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

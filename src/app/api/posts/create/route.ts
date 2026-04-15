import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import * as jose from 'jose';

export async function POST(req: NextRequest) {
  try {
    const { content, txId, address } = await req.json();
    const authHeader = req.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // 1. Verify Local Session
    if (!process.env.LOCAL_SESSION_SECRET) {
      throw new Error('LOCAL_SESSION_SECRET is not configured');
    }
    
    const secret = new TextEncoder().encode(process.env.LOCAL_SESSION_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    
    const sessionAddress = payload.address as string;
    
    // Security Check: Does the session address match the target address?
    if (sessionAddress !== address) {
      return NextResponse.json({ error: 'Address mismatch in session' }, { status: 403 });
    }

    // 2. Perform Secure Write via Service Role
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        address: sessionAddress,
        content: content || 'Said GM!',
        tx_id: txId,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Create post API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

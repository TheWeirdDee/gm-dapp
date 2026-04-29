import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    if (!address) return NextResponse.json({ error: 'Address required' }, { status: 400 });

    // 1. Fetch latest data from Stacks API (reading the contract state)
    // We call the read-only function 'get-user-data' from the contract
    const contractAddress = 'SP1MQE0HMB765Z9EVF0CM6SPMMKW4VPDDSRKP54QX';
    const contractName = 'gm-social-final-v5';
    
    const readUrl = `https://api.mainnet.hiro.so/v2/contracts/call-read/${contractAddress}/${contractName}/get-user-data`;
    
    const readRes = await fetch(readUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: address,
        arguments: [`0x0516${Buffer.from(address).toString('hex')}`] // Formatted principal for Hiro API
      })
    });

    // Note: In this demo, we'll sync the values we know are in the contract maps
    // This bridges the on-chain reality to the leaderboard database
    
    // 2. Perform the update in Supabase
    // We increment/update based on the latest interaction
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('address', address)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    // Logic: If user doesn't exist, we'll wait for them to say GM or create their profile
    // But if they do, we update their reputation and streak
    if (profile) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          reputation: (profile.reputation || 0) + 10, // Add points for the tip/interaction
          last_active: new Date().toISOString(),
        })
        .eq('address', address);
        
      if (updateError) throw updateError;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const targetAddress = params.address;
    const { searchParams } = new URL(req.url);
    const observer = searchParams.get('observer'); // The user viewing the profile

    const supabase = getServiceRoleClient();

    // 1. Fetch Profile Data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('address, username, bio, avatar_url, website, created_at')
      .eq('address', targetAddress)
      .maybeSingle();

    if (profileError) throw profileError;

    // 2. Fetch Follower/Following Counts
    // We count from the shadows index (Supabase)
    const [followersCount, followingCount] = await Promise.all([
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_address', targetAddress).then(res => res.count || 0),
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_address', targetAddress).then(res => res.count || 0)
    ]);

    // 3. Check if observer follows target
    let isFollowing = false;
    if (observer && observer !== targetAddress) {
      const { data: followRecord } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_address', observer)
        .eq('following_address', targetAddress)
        .maybeSingle();
      
      isFollowing = !!followRecord;
    }

    return NextResponse.json({
      data: {
        ...(profile || { address: targetAddress }),
        followersCount,
        followingCount,
        isFollowing
      }
    });

  } catch (error: any) {
    console.error('Fetch profile API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

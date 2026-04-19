import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { postId, type, amount } = await req.json();

    if (!postId || !type) {
      return NextResponse.json({ error: 'Missing postId or type' }, { status: 400 });
    }

    const supabase = getServiceRoleClient();

    if (type === 'boost') {
      const { data, error } = await supabase.rpc('increment_post_boost', { row_id: postId });
      if (error) {
        // Fallback if RPC doesn't exist yet
        await supabase
          .from('posts')
          .update({ boost_count: supabase.rpc('increment') as any })
          .eq('id', postId);
      }
    } else if (type === 'tip') {
      const { data, error } = await supabase.rpc('increment_post_tips', { row_id: postId, tip_amount: amount });
      if (error) {
         // Fallback manual update
         const { data: post } = await supabase.from('posts').select('total_tips').eq('id', postId).single();
         await supabase
          .from('posts')
          .update({ total_tips: (Number(post?.total_tips || 0) + Number(amount)) })
          .eq('id', postId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Vigor Sync Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

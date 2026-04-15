import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const cursor = searchParams.get('cursor'); // This should be an ISO timestamp

    const supabase = getServiceRoleClient();
    
    let query = supabase
      .from('posts')
      .select('*, post_reactions(reaction_type)')
      .order('created_at', { ascending: false })
      .limit(limit);

    // If cursor is provided, fetch posts older than the cursor
    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Format the response consistent with the old fetch (to avoid breaking the frontend mapping)
    const posts = (data || []).map((p: any) => {
      const reactions = p.post_reactions || [];
      return {
        id: p.id,
        authorAddress: p.address,
        content: p.content || 'Said GM!',
        timestamp: p.created_at,
        txId: p.tx_id,
        reactions: {
          gm: reactions.filter((r: any) => r.reaction_type === 'gm').length,
          fire: reactions.filter((r: any) => r.reaction_type === 'fire').length,
          laugh: reactions.filter((r: any) => r.reaction_type === 'laugh').length,
        },
        commentsCount: 0,
        repostsCount: 0,
        points: p.points || 0,
        isPro: p.is_pro || false,
        avatar: p.avatar_url || null,
        mediaUrl: p.media_url || null,
        pollData: p.poll_data || null,
      };
    });

    return NextResponse.json({ 
      posts,
      nextCursor: posts.length === limit ? posts[posts.length - 1].timestamp : null
    });
  } catch (error: any) {
    console.error('Feed API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import * as jose from 'jose';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const cursor = searchParams.get('cursor'); // This should be an ISO timestamp

    const authHeader = req.headers.get('Authorization');
    let sessionAddress: string | null = null;

    // 1. Check for authenticated user
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = new TextEncoder().encode(process.env.LOCAL_SESSION_SECRET);
      try {
        const { payload } = await jose.jwtVerify(token, secret);
        sessionAddress = payload.address as string;
      } catch (e) {
        console.warn('Invalid token in feed request, proceeding as guest');
      }
    }

    const supabase = getServiceRoleClient();
    
    let query = supabase
      .from('posts')
      .select('*, post_reactions(reaction_type, address)')
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
      
      // Find current user's specific reaction if session exists
      const userReactionObj = sessionAddress 
        ? reactions.find((r: any) => r.address === sessionAddress)
        : null;

      return {
        id: p.id,
        authorAddress: p.address,
        content: p.content,
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
        currentUserReaction: userReactionObj ? userReactionObj.reaction_type : null
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

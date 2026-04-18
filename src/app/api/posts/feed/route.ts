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
        const { payload } = await jose.jwtVerify(token, secret, {
          clockTolerance: 300
        });
        sessionAddress = payload.address as string;
      } catch (e) {
        console.warn('Invalid token in feed request, proceeding as guest');
      }
    }

    const supabase = getServiceRoleClient();

    // 2. Fetch Posts first (Simple query to avoid missing relationship error)
    const { data: rawPosts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (postsError) throw postsError;

    // 3. Batch fetch profiles for these addresses
    const addresses = Array.from(new Set(rawPosts.map((p: any) => p.address)));
    const { data: rawProfiles } = await supabase
      .from('profiles')
      .select('address, avatar_url, username')
      .in('address', addresses);

    const profileMap = (rawProfiles || []).reduce((acc: any, prof: any) => {
      acc[prof.address] = prof;
      return acc;
    }, {});

    // 4. Batch fetch reactions if table exists
    let reactionsMap: any = {};
    try {
      const postIds = rawPosts.map((p: any) => p.id);
      const { data: reactions } = await supabase
        .from('post_reactions')
        .select('*')
        .in('post_id', postIds);
      
      (reactions || []).forEach((r: any) => {
        if (!reactionsMap[r.post_id]) reactionsMap[r.post_id] = [];
        reactionsMap[r.post_id].push(r);
      });
    } catch (e) {
      console.warn('post_reactions table not available, skipping reactions');
    }

    // 5. Connect the dots
    const posts = rawPosts.map((p: any) => {
      const authorProfile = profileMap[p.address] || {};
      const postReactions = reactionsMap[p.id] || [];
      const userReactionObj = sessionAddress 
        ? postReactions.find((r: any) => r.address === sessionAddress)
        : null;

      return {
        id: p.id,
        authorAddress: p.address,
        content: p.content,
        timestamp: p.created_at,
        txId: p.tx_id,
        reactions: {
          gm: postReactions.filter((r: any) => r.reaction_type === 'gm').length,
          fire: postReactions.filter((r: any) => r.reaction_type === 'fire').length,
          laugh: postReactions.filter((r: any) => r.reaction_type === 'laugh').length,
        },
        commentsCount: 0,
        repostsCount: 0,
        points: p.points || 0,
        isPro: p.is_pro || false,
        avatar: authorProfile.avatar_url || null,
        username: authorProfile.username || null,
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
    return NextResponse.json({ 
      error: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    }, { status: 500 });
  }
}

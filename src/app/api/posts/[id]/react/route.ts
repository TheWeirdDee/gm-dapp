import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import { verifyMessageSignatureRsv } from '@stacks/encryption';
import { getAddressFromPublicKey } from '@stacks/transactions';
import * as jose from 'jose';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const body = await req.json();
    const reactionType = body.reactionType || body.type;
    
    if (!reactionType) {
      return NextResponse.json({ error: 'Missing reactionType' }, { status: 400 });
    }

    const authHeader = req.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!process.env.LOCAL_SESSION_SECRET) {
      throw new Error('LOCAL_SESSION_SECRET is not configured');
    }
    const secret = new TextEncoder().encode(process.env.LOCAL_SESSION_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    const sessionAddress = payload.address as string;

    const supabase = getServiceRoleClient();
    
    const { data: existing } = await supabase
      .from('post_reactions')
      .select('id, reaction_type')
      .eq('post_id', postId)
      .eq('address', sessionAddress)
      .single();

    if (existing) {
      if (existing.reaction_type === reactionType) {
        const { error: deleteError } = await supabase
          .from('post_reactions')
          .delete()
          .eq('id', existing.id);
        
        if (deleteError) throw deleteError;
      } else {
        const { error: updateError } = await supabase
          .from('post_reactions')
          .update({ reaction_type: reactionType, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
          
        if (updateError) throw updateError;
      }
    } else {
      const { error: insertError } = await supabase
        .from('post_reactions')
        .insert({
          post_id: postId,
          address: sessionAddress,
          reaction_type: reactionType
        });

      if (insertError) throw insertError;
    }

    const { data: counts, error: countError } = await supabase
      .from('post_reactions')
      .select('reaction_type')
      .eq('post_id', postId);

    if (countError) throw countError;

    const reactionCounts = {
      gm: counts.filter(r => r.reaction_type === 'gm').length,
      fire: counts.filter(r => r.reaction_type === 'fire').length,
      laugh: counts.filter(r => r.reaction_type === 'laugh').length,
    };

    return NextResponse.json({ counts: reactionCounts });
  } catch (error: any) {
    console.error('Reaction API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

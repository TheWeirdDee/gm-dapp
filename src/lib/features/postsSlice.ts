import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '@/lib/types';
import { supabase, getSupaClient } from '@/lib/supabase';

interface PostsState {
  feed: Post[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  feed: [],
  isLoading: false,
  error: null,
};

export const fetchPostsFromSupabase = createAsyncThunk(
  'posts/fetchFromSupabase',
  async (_, { rejectWithValue }) => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return (data || []).map((p: any) => ({
        id: p.id,
        authorAddress: p.address,
        content: p.content || 'Said GM!',
        timestamp: p.created_at,
        txId: p.tx_id,
        reactions: {
          gm: p.gm_count || 0,
          fire: p.fire_count || 0,
          laugh: p.laugh_count || 0,
        },
        commentsCount: p.comments_count || 0,
        repostsCount: p.reposts_count || 0,
        points: 0, // Points are calculated on-chain, not stored in posts table
        isPro: p.is_pro || false,
        avatar: p.avatar_url || null,
        mediaUrl: p.media_url || null,
        pollData: p.poll_data || null,
      })) as Post[];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createRealPost = createAsyncThunk(
  'posts/createReal',
  async (postData: { 
    address: string, 
    content: string, 
    mediaUrl?: string, 
    pollData?: any,
    isPro: boolean,
    txId?: string
  }, { rejectWithValue, dispatch }) => {
    if (!supabase) return rejectWithValue('Supabase not initialized');
    try {
      const { data, error } = await getSupaClient()
        .from('posts')
        .insert([{
          address: postData.address,
          content: postData.content,
          media_url: postData.mediaUrl,
          poll_data: postData.pollData,
          is_pro: postData.isPro,
          tx_id: postData.txId
        }])
        .select()
        .single();

      if (error) throw error;
      
      const newPost: Post = {
        id: data.id,
        authorAddress: data.address,
        content: data.content,
        timestamp: data.created_at,
        txId: data.tx_id,
        reactions: { gm: 0, fire: 0, laugh: 0 },
        commentsCount: 0,
        repostsCount: 0,
        points: data.points,
        isPro: data.is_pro,
        mediaUrl: data.media_url,
        pollData: data.poll_data,
      };

      dispatch(addOptimisticPost(newPost));
      return newPost;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addOptimisticPost: (state, action: PayloadAction<Post>) => {
      state.feed = [action.payload, ...state.feed];
    },
    reactToPost: (state, action: PayloadAction<{ postId: string; reactionType: 'gm' | 'fire' | 'laugh' }>) => {
      const { postId, reactionType } = action.payload;
      const post = state.feed.find(p => p.id === postId);
      if (post) {
        if (!post.reactions) {
          post.reactions = { gm: 0, fire: 0, laugh: 0 };
        }
        post.reactions[reactionType]++;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsFromSupabase.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPostsFromSupabase.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feed = action.payload;
      })
      .addCase(fetchPostsFromSupabase.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addOptimisticPost, reactToPost } = postsSlice.actions;
export default postsSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '@/lib/types';
import { supabase } from '@/lib/supabase';

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
        points: p.points || 10,
        isPro: p.is_pro || false,
        avatar: p.avatar_url || null,
      })) as Post[];
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

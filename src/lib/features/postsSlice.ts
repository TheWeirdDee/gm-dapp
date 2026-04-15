import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Post } from '@/lib/types';
import { supabase, getSupaClient } from '@/lib/supabase';

interface PostsState {
  feed: Post[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  lastCursor: string | null;
}

const initialState: PostsState = {
  feed: [],
  isLoading: false,
  error: null,
  hasMore: true,
  lastCursor: null,
};

// Initial Fetch (First Page)
export const fetchPostsFromSupabase = createAsyncThunk(
  'posts/fetchFromSupabase',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/posts/feed?limit=20');
      if (!response.ok) throw new Error('Failed to fetch feed');
      const data = await response.json();
      return {
        posts: data.posts,
        nextCursor: data.nextCursor
      };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Fetch Next Page (Pagination)
export const fetchPaginatedPosts = createAsyncThunk(
  'posts/fetchMore',
  async (cursor: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/posts/feed?limit=20&cursor=${cursor}`);
      if (!response.ok) throw new Error('Failed to fetch more posts');
      const data = await response.json();
      return {
        posts: data.posts,
        nextCursor: data.nextCursor
      };
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
    const tempId = `temp-${Date.now()}`;
    const optimisticPost: Post = {
      id: tempId,
      authorAddress: postData.address,
      content: postData.content,
      timestamp: new Date().toISOString(),
      txId: postData.txId,
      reactions: { gm: 0, fire: 0, laugh: 0 },
      commentsCount: 0,
      repostsCount: 0,
      points: 0,
      isPro: postData.isPro,
      mediaUrl: postData.mediaUrl,
      pollData: postData.pollData,
    };

    // 1. Optimistic Update (UI)
    dispatch(addOptimisticPost(optimisticPost));

    try {
      const token = localStorage.getItem('gm_session_token');
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: postData.content,
          txId: postData.txId,
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to create post');
      }

      const { data } = await response.json();
      
      // 2. Resolve temporary post with real data
      return { tempId, realPost: data };
    } catch (err: any) {
      // 3. Rollback on failure
      dispatch(removeOptimisticPost(tempId));
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
    removeOptimisticPost: (state, action: PayloadAction<string>) => {
      state.feed = state.feed.filter(p => p.id !== action.payload);
    },
    addRealtimePost: (state, action: PayloadAction<Post>) => {
      // Deduplicate: Don't add if already exists (e.g., from our own optimistic update)
      if (!state.feed.find(p => p.id === action.payload.id)) {
        state.feed = [action.payload, ...state.feed];
      }
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
        state.feed = action.payload.posts;
        state.lastCursor = action.payload.nextCursor;
        state.hasMore = !!action.payload.nextCursor;
      })
      .addCase(fetchPostsFromSupabase.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPaginatedPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPaginatedPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feed = [...state.feed, ...action.payload.posts];
        state.lastCursor = action.payload.nextCursor;
        state.hasMore = !!action.payload.nextCursor;
      })
      .addCase(createRealPost.fulfilled, (state, action) => {
        const { tempId, realPost } = action.payload as any;
        const index = state.feed.findIndex(p => p.id === tempId);
        if (index !== -1) {
          state.feed[index] = {
            ...state.feed[index],
            id: realPost.id,
            timestamp: realPost.created_at
          };
        }
      });
  },
});

export const { addOptimisticPost, removeOptimisticPost, addRealtimePost, reactToPost } = postsSlice.actions;
export default postsSlice.reducer;

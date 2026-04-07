import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MOCK_POSTS, Post } from '../mock-data';

interface PostsState {
  feed: Post[];
}

const initialState: PostsState = {
  feed: MOCK_POSTS,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactToPost(
      state,
      action: PayloadAction<{ postId: string; reactionType: 'gm' | 'fire' | 'laugh' }>
    ) {
      const post = state.feed.find((p) => p.id === action.payload.postId);
      if (post) {
        post.reactions[action.payload.reactionType] += 1;
      }
    },
    createPost(
      state,
      action: PayloadAction<{ authorAddress: string; content: string }>
    ) {
      const newPost: Post = {
        id: `post_${Date.now()}`,
        authorAddress: action.payload.authorAddress,
        content: action.payload.content,
        timestamp: new Date().toISOString(),
        reactions: { gm: 0, fire: 0, laugh: 0 },
        commentsCount: 0,
        repostsCount: 0,
      };
      state.feed.unshift(newPost);
    },
  },
});

export const { reactToPost, createPost } = postsSlice.actions;
export default postsSlice.reducer;

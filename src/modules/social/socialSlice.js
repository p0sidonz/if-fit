import { createSlice } from "@reduxjs/toolkit";

const socialSlice = createSlice({
  name: "social",
  initialState: {
    posts: {
      posts: [],
      currentPage: 1,
      total: 1
    },
    followers: {
      followers: [],
      currentPage: 1,
      total: 1
    },
    following: {
      following: [],
      currentPage: 1,
      total: 1
    }
  },
  reducers: {
    setSocialPosts: (state, action) => {
      state.posts.posts = action.payload;
      state.posts.currentPage = action.payload.currentPage;
      state.posts.total = action.payload.total;

    },
    setFollowers: (state, action) => {
      state.followers.followers = action.payload;
      state.followers.currentPage = action.payload.currentPage;
      state.followers.total = action.payload.total;
    },
    setFollowing: (state, action) => {
      state.following = action.payload;
      state.following.currentPage = action.payload.currentPage;
      state.following.total = action.payload.totalPages;
    },
  },
});

export const { setSocialPosts, setFollowers, setFollowing } =
  socialSlice.actions;
export default socialSlice.reducer;

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { setSocialPosts, setFollowers } from "../socialSlice";
import axios from "../../../utils/axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { FollowerAndFollowingNormalizer } from "../normalizer";

const fetchSocialFollowingData = async ({ queryKey }) => {
  const data = {};
  const [_key, { take, skip, username }] = queryKey;
  console.log("username x123", username);
  const followers = await axios.get(
    `/followersystem/getFollowing?take=${take}&skip=${skip}&username=${username}`
  );
  const normalizedData = FollowerAndFollowingNormalizer(
    followers.data.following,
    "following"
  );
  data.following = normalizedData.users;
  data.total = followers.data.total;
  return data;
};

export const useSocialData = (take = 10, skip = 0, username) => {
  const dispatch = useDispatch();
  return useQuery({
    queryKey: ["socialData", { take, skip }],
    queryFn: async ({ queryKey }) => {
      const [_key, { take, skip }] = queryKey;
      const data = {};
      const allPosts = await axios.get(
        `/posts/myposts?take=${take}&skip=${skip}&username=${username}`
      );
      data.posts = allPosts.data.posts;
      data.total = allPosts.data.total;
      dispatch(
        setSocialPosts({
          posts: allPosts.data.posts,
          total: allPosts.data.total,
        })
      );
      return data;
    },
  });
};

export const useGetFollowers = (take = 3, skip = 0, username) => {
  const query = useQuery({
    queryKey: ["socialFollowerData", { take, skip, username }],
    queryFn: async ({ queryKey }) => {
      const [_key, { take, skip, username }] = queryKey;
      try {
        const followers = await axios.get(
          `/followersystem/getFollowers?take=${take}&skip=${skip}&username=${username}`
        );
        const NormalLizedUsers = FollowerAndFollowingNormalizer(
          followers?.data?.followers,
          "follower"
        );
        return {
          followers: NormalLizedUsers.users,
          total: followers.data.total,
        };
      } catch (error) {
        // Handle error
        console.error("Error fetching followers:", error);
        return [];
      }
    },
    enabled: !!username,
  });
  return query;
};

export const useGetFollowing = (take = 3, skip = 0, username) => {
  console.log("username", username);
  return useQuery({
    queryKey: ["socialFollowingData", { take, skip, username }],
    queryFn: fetchSocialFollowingData,
    enabled: !!username,
  });
};

// Mutation hooks
export const useUnFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const response = await axios.post(`/followersystem/unfollow/`, {
        userId: JSON.stringify(userId),
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Success actions
      // queryClient.invalidateQueries("socialFollowerData");
      // queryClient.invalidateQueries("socialFollowingData");
      return toast.success("User unfollowed successfully");
    },
    onError: (error) => {
      // Error actions
      return toast.error("Error unfollowing user: " + error.message);
    },
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      const response = await axios.post(`/followersystem/follow/`, {
        userId: JSON.stringify(userId),
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Success actions
      // queryClient.invalidateQueries("socialFollowerData");
      // queryClient.invalidateQueries("whoYouAre");
      return toast.success("User followed successfully");
    },
    onError: (error) => {
      // Error actions
      return toast.error("Error following user: " + error.message);
    },
  });
};

export const useAddPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("photo", data.photo); // 'photo' should be the key expected by the backend
      formData.append("content", data.content);

      const response = await axios.post("/posts/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Success actions
      queryClient.invalidateQueries("socialData");
      toast.success("Post added successfully");
    },
    onError: (error) => {
      toast.error("Error adding post: " + error.message);
    },
  });
};

export const useSinglePost = (id) => {
  return useQuery({
    queryKey: ["singlePost"],
    enabled: false,
    queryFn: async () => {
      const response = await axios.get(`/posts/${id}`);
      return response.data;
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      console.log("useAddComment", data)
      const response = await axios.post("/posts/comment", data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["comments", { postId: variables.post_id }],
        (oldData = { comments: [], total: 0 }) => ({
          comments: [data, ...oldData.comments],
          total: oldData.total + 1,
        })
      );
      toast.success("Comment added successfully");
    },
    onError: (error) => {
      toast.error("Error adding comment: " + error.message);
    },
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({comment_id}) => {
      
      const response = await axios.delete(`/posts/comment/${comment_id}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      const postId = variables.post_id;
      queryClient.setQueryData(
        ["comments", { postId }],
        (oldData = { comments: [], total: 0 }) => ({
          comments: oldData.comments.filter(comment => comment.id !== variables.comment_id),
          total: oldData.total - 1,
        })
      );
      toast.success("Comment deleted successfully");
    },
    onError: (error) => {
      toast.error("Error deleting comment: " + error.message);
    },
  });
};
export const useGetCommentsForPost = (postId, take = 3, skip = 0) => {
  return useQuery({
    queryKey: ["comments", { postId, take, skip }],
    queryFn: async ({ queryKey }) => {
      const [_key, { postId, take, skip }] = queryKey;
      try {
        const response = await axios.get(`/posts/comment/${postId}/?skip=${skip}&take=${take}`);
        return {
          comments: response.data.comments,
          total: response.data.total,
        };
      } catch (error) {
        console.error("Error fetching comments:", error);
        return { comments: [], total: 0 };
      }
    },
    keepPreviousData: true,
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId) => {
      const response = await axios.post(`/posts/like/${postId}`);
      return response.data;
    },
    onSettled: () => {
      // Invalidate the posts query to refetch the data
      queryClient.invalidateQueries("socialData");
    },
    onError: (error) => {
      toast.error("Error liking post: " + error.message);
    },
  });


}

export const useUnLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId) => {
      const response = await axios.post(`/posts/unlikepost/${postId}`);
      return response.data;
    },
    onSettled: () => {
      // Invalidate the posts query to refetch the data
      queryClient.invalidateQueries("socialData");
    },
    onError: (error) => {
      toast.error("Error liking post: " + error.message);
    },
  });


}

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId) => {
      const response = await axios.delete(`/posts/delete/${postId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("socialData");
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      toast.error("Error deleting post: " + error.message);
    },
  });
}
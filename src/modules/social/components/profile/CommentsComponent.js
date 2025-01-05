import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { GET_AVATAR_COMPRESSED_URL } from "src/utils/utils";
import useNavigateTo from 'src/modules/components/useRouterPush';

import {
  useGetCommentsForPost,
  useAddComment,
  useDeleteComment,
} from "../../hooks/useSocialData"; // Adjust the import path as necessary
import {
  Avatar,
  Box,
  Typography,
  Divider,
  IconButton,
  CircularProgress,
  Button,
  TextField,
} from "@mui/material";
import { Icon } from "@iconify/react"; // Adjust the import path for the icon library you're using

const IndividualComment = ({ comment, user, onDelete, isFetching }) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const userInfo = comment?.user;
  const navigateTo = useNavigateTo();
  console.log(user, comment)
  return (
    <Box
      sx={{
        display: isDeleted ? "none" : "flex",
        alignItems: "flex-start",
        gap: 2,
        marginBottom: 2,
        padding: 2,
        borderRadius: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      <Avatar
        src={GET_AVATAR_COMPRESSED_URL(userInfo?.avatar?.avatar_compressed)}
        sx={{
          width: 40,
          height: 40,
          cursor: 'pointer',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            transform: 'scale(1.05)',
            transition: 'transform 0.2s',
          },
        }}
        onClick={() => navigateTo(`/${userInfo.username}/view`)}
      >
        {!userInfo?.avatar?.avatar_compressed && `${userInfo?.first_name[0]}${userInfo?.last_name[0]}`}
      </Avatar>

      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Typography
            fontSize={13}
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              '&:hover': {
                opacity: 0.8,
                cursor: 'pointer',
              },
            }}
            onClick={() => navigateTo(`/${userInfo.username}/view`)}
          >
            {userInfo?.first_name} {userInfo?.last_name}
          </Typography>
          <Typography
            component="span"
            fontSize={12}
            sx={{
              ml: 1,
              color: 'text.secondary',
              opacity: 0.7,
              fontWeight: 400,
              '&:hover': {
                color: 'primary.main',
                cursor: 'pointer',
              },
            }}
            onClick={() => navigateTo(`/${userInfo.username}/view`)}
          >
            @{userInfo?.username}
          </Typography>
        </Box>
        
        <Typography
          variant="body2"
          sx={{
            color: (theme) => theme.palette.text.primary,
            lineHeight: 1.7,
            fontSize: '0.9rem',
            letterSpacing: '0.01em',
            fontWeight: 400,
            opacity: 0.87,
          }}
        >
          {comment?.comment}
        </Typography>
      </Box>

      {userInfo?.id === user?.id && (
        <IconButton
          onClick={() => onDelete(comment.id, setIsDeleted)}
          size="small"
          sx={{
            opacity: { xs: 1, sm: 0 },
            transition: 'all 0.2s ease',
            color: 'text.secondary',
            '&:hover': {
              color: 'error.main',
              backgroundColor: 'error.lighter',
            },
            [`${Box}:hover &`]: {
              opacity: 1,
            },
          }}
        >
          {isFetching ? (
            <CircularProgress size={16} />
          ) : (
            <Icon icon="mdi:delete" width={20} />
          )}
        </IconButton>
      )}
    </Box>
  );
};

const CommentsComponent = ({ postId, user }) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const take = 3;
  const skip = page * take;
  const [newComment, setNewComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [totalComments, setTotalComments] = useState(0);

  if (!postId) return null;

  const { data, isLoading, isFetching, refetch } = useGetCommentsForPost(
    postId,
    take,
    skip
  );
  const addCommentMutation = useAddComment();
  const deleteCommentMutation = useDeleteComment();

  useEffect(() => {
    if (data) {
      setAllComments((prevComments) => {
        if (page === 0) {
          return data.comments;
        } else {
          const newComments = [...prevComments, ...data.comments];
          return Array.from(
            new Set(newComments.map((comment) => comment.id))
          ).map((id) => newComments.find((comment) => comment.id === id));
        }
      });
      setTotalComments(data.total);
    }
  }, [data]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const newCommentData = await addCommentMutation.mutateAsync({
        post_id: postId,
        comment: newComment,
      });
      
      // Ensure the comment has the full user data structure
      const commentWithUser = {
        ...newCommentData.comment,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          avatar: user.avatar
        }
      };

      console.log("New Comment with User:", commentWithUser); // Debug log
      setNewComment("");

      setAllComments((prevComments) => [commentWithUser, ...prevComments]);
      setTotalComments((prevTotal) => prevTotal + 1);
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId, setIsDeleted) => {
    try {
      await deleteCommentMutation.mutateAsync({
        comment_id: commentId,
        post_id: postId,
      });
      setIsDeleted(true);
      setAllComments((prevComments) => {
        const updatedComments = prevComments.filter(
          (comment) => comment.id !== commentId
        );
        if (updatedComments.length < prevComments.length) {
          setTotalComments((prevTotal) => prevTotal - 1);
          if (updatedComments.length < take && skip > 0) {
            refetch();
          }
        }
        return updatedComments;
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleShowMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const hasMore = skip + take < totalComments;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <TextField
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        sx={{
          width: "100%",
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          },
        }}
        label="Add a comment"
        variant="outlined"
        multiline
        rows={1}
        placeholder="Share your thoughts..."
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 3 }}>
        <Button
          disabled={addCommentMutation.isLoading || !newComment.trim()}
          onClick={handleAddComment}
          size="small"
          variant="contained"
          sx={{
            borderRadius: 2,
            px: 3,
            '&:not(:disabled)': {
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            },
          }}
        >
          {addCommentMutation.isLoading ? (
            <CircularProgress size={16} sx={{ color: 'white' }} />
          ) : (
            'Post'
          )}
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        {allComments.map((comment, index) => (
          <React.Fragment key={comment.id}>
            {index > 0 && <Divider sx={{ my: 2, opacity: 0.1 }} />}
            <IndividualComment
              isFetching={isFetching}
              comment={comment}
              user={user}
              onDelete={handleDeleteComment}
            />
          </React.Fragment>
        ))}
      </Box>

      {hasMore && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            size="small"
            onClick={handleShowMore}
            variant="outlined"
            disabled={isFetching}
            sx={{
              borderRadius: 2,
              px: 4,
              '&:not(:disabled)': {
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'rgba(33, 150, 243, 0.08)',
                },
              },
            }}
          >
            {isFetching ? <CircularProgress size={16} /> : "Show More"}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CommentsComponent;

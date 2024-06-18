import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

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

  return (
    <Box
      sx={{
        display: isDeleted ? "none" : "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 2,
        marginLeft: 2,
        position: "relative",
        "&:hover .delete-icon": {
          display: "flex",
        },
      }}
    >
      <Avatar
        sizes="small"
        alt="Username"
        sx={{ width: 24, height: 24, mr: 1 }}
      >
        {comment?.user?.first_name?.[0]}
      </Avatar>
      <Typography
        fontSize={12}
        variant="body2"
        sx={{ my: 1, flex: 1, marginLeft: 1 }}
      >
        {comment?.comment}
      </Typography>
      {comment?.user?.id === user?.id && (
        <IconButton
          onClick={() => onDelete(comment.id, setIsDeleted)}
          className="delete-icon"
          sx={{
            display: "none",
            position: "absolute",
            right: 0,
          }}
        >
          {isFetching ? (
            <CircularProgress size={16} />
          ) : (
            <Icon fontSize={16} icon="mdi:bin" />
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
      let { comment } = newCommentData;
      console.log("New Comment Data:", newCommentData); // Debug log
      setNewComment("");

      setAllComments((prevComments) => [comment, ...prevComments]);
      setTotalComments((prevTotal) => prevTotal + 1);
    } catch (error) {
      console.error("Error adding comment:", error);
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
    <div>
      <TextField
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        sx={{ width: "100%", marginTop: 2 }}
        label="Add a comment"
        variant="outlined"
        multiline
        rows={1}
      />
      <div
        style={{
          marginTop: "5px",
          display: "flex",
          justifyContent: "end",
          alignItems: "flex-end",
        }}
      >
        <Button
          disabled={addCommentMutation.isLoading || !newComment.trim()}
          onClick={handleAddComment}
          size="small"
          variant="contained"
          color="primary"
          sx={{ marginTop: 1 }}
        >
          {addCommentMutation.isLoading && <CircularProgress size={16} />}
          Post
        </Button>
      </div>

      {allComments.map((comment, index) => (
        <React.Fragment key={comment.id}>
          {index > 0 && <Divider sx={{ my: 2 }} />}
          <IndividualComment
            isFetching={isFetching}
            comment={comment}
            user={user}
            onDelete={handleDeleteComment}
          />
        </React.Fragment>
      ))}

      {hasMore && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            size="small"
            onClick={handleShowMore}
            variant="outlined"
            disabled={isFetching}
          >
            {isFetching ? <CircularProgress size={16} /> : "Show More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentsComponent;

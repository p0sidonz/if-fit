import React, { Fragment, useState } from "react";
import { formatDate } from "src/utils/utils";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Button,
  Avatar,
  Link,
  Divider,
  IconButton,
  CardMedia,
  TextField,
} from "@mui/material";
import Icon from "src/@core/components/icon";
import {
  useAddComment,
  useDeleteComment,
  useLikePost,
  useUnLikePost,
} from "../../hooks/useSocialData";
import CommentsComponent from "./CommentsComponent";
import { Tooltip } from "@mui/material";

const PreviewPost = ({ open, onClose, isLoading, post }) => {
  const user = JSON.parse(localStorage.getItem("userData"));

  const [newComment, setNewComment] = useState("");
  const postComment = useAddComment();
  const deletePost = useDeleteComment();
  const likePost = useLikePost();
  const unLikePost = useUnLikePost();

  if (isLoading) {
    return <CircularProgress />;
  }

  const handleDeleteComment = (commentId) => {
    if (deletePost.isPending) return;
    deletePost.mutate(commentId, {
      onSuccess: (data) => {
        console.log("onSuccess deletePost ", data);
        // need to remove post from list
        //filter out the comment from post.PostComment
        const newComments = post.PostComment.filter(
          (comment) => comment.id !== data.comment.id
        );
        post.PostComment = newComments;
      },
    });
  };

  const handleLikePost = () => {
    if (likePost.isPending) return;
    likePost.mutate(post.id, {
      onSuccess: (data) => {
        console.log("onSuccess likePost ", data);
        post.isLiked = !post.isLiked;
        post._count.Likes = post._count.Likes + 1;
      },
    });
  };
  const handleUnLikePost = () => {
    if (unLikePost.isPending) return;
    unLikePost.mutate(post.id, {
      onSuccess: (data) => {
        console.log("onSuccess unLikePost ", data);
        post.isLiked = !post.isLiked;
        post._count.Likes =  post._count.Likes - 1;

      },
    });
  };

  return (
    <Fragment>
      <Dialog
        keepMounted={false}
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            width: "60vw",
            height: "90vh",
            maxWidth: "none",
            padding: 0,
          },
        }}
      >
        <DialogContent sx={{ m: 0, p: 0 }}>
          <Box sx={{ display: "flex", flexDirection: "row", height: "100%" }}>
            <Box
              sx={{
                width: "70%",
                height: "100%",
                justifyContent: "flex-start",
                position: "relative", // Added position relative
              }}
            >
              <CardMedia
                component="img"
                image="https://picsum.photos/id/237/1600/1200"
                alt="Your image description"
                sx={{
                  height: "100%",
                  width: "100%",
                  objectFit: "contain",
                  backgroundColor: "#00000008",
                }}
              />
            </Box>
            <Box sx={{ width: "30%", padding: 2, height: "100%" }}>
              <Box sx={{ height: "80%", overflowY: "auto" }}>
                {" "}
                {/* Added overflowY: "auto" */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    justifyContent: "space-between",
                  }}
                >
                  <Avatar alt="Username" sx={{ mr: 1 }}>
                    {" "}
                    AS
                  </Avatar>

                  <Typography variant="body1">
                    @{post?.user?.username}
                  </Typography>
                  <Link href="#" sx={{ ml: "auto" }}>
                    View Profile
                  </Link>
                </Box>
                <Box sx={{p: 2}}>
                  <Typography variant="body1"> {post?.content}</Typography>
                </Box>
               <div style={{display: 'flex', justifyContent: 'space-between'}}>
               <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Tooltip
                      title={post?.isLiked ? "Unlike Post" : "Like Post"}
                      arrow
                      placement="top"
                    >
                      <IconButton
                        disabled={likePost?.isPending || unLikePost?.isPending}
                        onClick={
                          post?.isLiked ? handleUnLikePost : handleLikePost
                        }
                      >
                        <Icon
                          icon="mdi:heart"
                          color={post?.isLiked ? "red" : ""}
                        />
                      </IconButton>
                    </Tooltip>

                    <Typography color={"primary"} variant="body1">
                    {post?._count.Likes} {post?._count.Likes > 1 ? 'Likes' : 'Like'}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography  variant="caption">
                    {formatDate(post?.created_at)}
                  </Typography>
                </Box>

               </div>
                <Divider sx={{ m: 2 }} />
                {post?.id && (
                  <CommentsComponent
                    postId={post?.id}
                    user={user}
                    handleDeleteComment={handleDeleteComment}
                  />
                )}
              </Box>

              {/* <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "flex-end",
                }}
              >
                <Button
                  disabled={postComment.isPending}
                  onClick={handlePostComment}
                  size="small"
                  variant="contained"
                  color="primary"
                >
                  {postComment.isPending && <CircularProgress size={16} />}
                  Post
                </Button>
              </div> */}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default PreviewPost;

import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import PostCard from "src/views/components/PostCard";
import { useSocialData, useSinglePost } from "../../hooks/useSocialData";
import CircularProgress from "@mui/material/CircularProgress";
import PreviewPost from "src/modules/social/components/profile/PreviewPost";

const ProfileTab = ({ tab }) => {
  const [open, setOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const { data: singleData, refetch, isRefetching } = useSinglePost(selectedPostId);

  const handleClickOpen = (id) => {
    setSelectedPostId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [page, setPage] = useState(0);
  const take = 10;
  const skip = page * take;

  const { data, isLoading, isFetching } = useSocialData(take, skip);

  const [localPosts, setLocalPosts] = useState([]);
  const [localTotal, setLocalTotal] = useState(0);

  useEffect(() => {
    if (selectedPostId) {
      refetch(selectedPostId);
    }
  }, [selectedPostId, refetch]);

  useEffect(() => {
    setLocalPosts(data?.posts || []);
    setLocalTotal(data?.total || 0);
  }, [data]);

  useEffect(() => {
    setPage(0); // Reset page on tab change
  }, [tab]);

  const totalPosts = localTotal || 0;
  const hasMore = skip + take < totalPosts;

  if (isLoading) {
    return <>Loading...</>;
  }

  const handleNextPage = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    setPage(page > 0 ? page - 1 : 0);
  };

  // useEffect(() => {}, [selectedPostId]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item lg={12} md={12} xs={12}>
          <Grid container justifyContent="space-between" spacing={2}>
            {localPosts.length > 0 &&
              localPosts.map((post, index) => (
                <Grid key={index} item lg={4} md={4} xs={12}>
                  <PostCard
                    data={post}
                    title={post.content}
                    id={post.id}
                    handleClickOpen={handleClickOpen}
                  />
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent="center"
        spacing={2}
        style={{ marginTop: 20 }}
      >
        {isFetching && <CircularProgress />}
        <Button onClick={handlePreviousPage} disabled={page === 0}>
          Previous
        </Button>
        <Button onClick={handleNextPage} disabled={!hasMore}>
          Next
        </Button>
        <PreviewPost open={open} onClose={handleClose} post={singleData} isLoading={isRefetching} />
      </Grid>
    </>
  );
};

export default ProfileTab;

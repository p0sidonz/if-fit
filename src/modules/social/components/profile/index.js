import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import PostCard from "src/views/components/PostCard";
import { useSocialData, useSinglePost } from "../../hooks/useSocialData";
import CircularProgress from "@mui/material/CircularProgress";
import PreviewPost from "src/modules/social/components/profile/PreviewPost";
import { useRouter } from "next/router";
import NoPhotographyIcon from '@mui/icons-material/NoPhotography';
import { Box, Typography } from "@mui/material";

const ProfileTab = () => {
  const router = useRouter();
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


  const { username } = router.query;



  const [page, setPage] = useState(0);
  const take = 10;
  const skip = page * take;

  const { data, isLoading, isFetching, refetch: refetchAll } = useSocialData(take, skip,username);

  const [localPosts, setLocalPosts] = useState([]);
  const [localTotal, setLocalTotal] = useState(0);

  useEffect(() => {
    if (selectedPostId) {
      refetch(selectedPostId);
    }
  }, [selectedPostId, refetch]);


  useEffect(() => {
    if(username) {
      refetchAll()
    }
  }, [username]);

  useEffect(() => {
    setLocalPosts(data?.posts || []);
    setLocalTotal(data?.total || 0);
  }, [data]);

  useEffect(() => {
    setPage(0); // Reset page on tab change
  }, []);

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
            {localPosts.length === 0 ? (
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 8,
                  px: 2,
                  bgcolor: 'background.paper.main',
                  borderRadius: 1,
                  width: '100%',
                }}
              >
                <NoPhotographyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Posts Yet
                </Typography>
               
              </Box>
            ) : (
              localPosts.map((post, index) => (
                <Grid key={index} item lg={4} md={4} xs={12}>
                  <PostCard
                    image={post.photo?.photo_thumbnail}
                    data={post}
                    title={post.content}
                    id={post.id}
                    handleClickOpen={handleClickOpen}
                  />
                </Grid>
              ))
            )}
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
        {localPosts.length > 0 && (
          <>
            <Button onClick={handlePreviousPage} disabled={page === 0}>
              Previous
            </Button>
            <Button onClick={handleNextPage} disabled={!hasMore}>
              Next
            </Button>
          </>
        )}
        <PreviewPost open={open} onClose={handleClose} post={singleData} isLoading={isRefetching} />
      </Grid>
    </>
  );
};

export default ProfileTab;

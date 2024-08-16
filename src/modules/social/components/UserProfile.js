// ** React Imports
import { useState, useEffect } from "react";
// ** Next Import
import { useRouter } from "next/router";
import { Button } from "@mui/material";
// ** MUI Components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useWhoAmI, useWhoYouAre } from "../../user/hooks/useUserData";

import useMediaQuery from "@mui/material/useMediaQuery";
import CircularProgress from "@mui/material/CircularProgress";
import ShowNewPost from "./profile/ShowNewPostDrawer";
// ** Icon Imports
import Icon from "src/@core/components/icon";
import { Hidden } from "@mui/material";
// ** Demo Components
import Profile from "./profile";

import UserProfileHeader from "./UserProfileHeader";
import { FloatBarAction } from "../../components/FloatBarAction";

const UserProfile = ({ data = [] }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  // ** State
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [isSameUser, setIsSameUser] = useState(false);

  const router = useRouter();
  const { username } = router.query;
  const { data: user, isLoading } = useWhoAmI();
  const { data: otherUser, isLoading: otherUserLoading, refetch: refetchWhoAreYou } = useWhoYouAre(username);

  


  useEffect(() => {
    refetchWhoAreYou();
  }, [username])



  const handleOpenNewPost = () => {
    setShowNewPostModal(true)
  }

  const handleCloseNewPost = () => {
    setShowNewPostModal(false)
  }

if(isLoading || otherUserLoading) return <CircularProgress />

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader
          isSameUser={isSameUser}
          user={data}
          otherUser={otherUser}
          refetchWhoAreYou={refetchWhoAreYou}
          username={username}
        />
      </Grid>

      <Grid item xs={12}>
        <Grid justifyContent={"space-between"} container spacing={6}>
          <Grid item >
          </Grid>
          <Grid>
            <Hidden mdDown>
              {<Box
                sx={{
                  mt: 6,
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "flex-end",
                }}
              >

              {user?.username === otherUser?.username &&  <Button onClick={handleOpenNewPost} variant="contained" color="primary">
                  <Icon icon="mdi:plus" />
                  {isSmallScreen ? null : "New Post"}
                </Button>}

              </Box>}

            </Hidden>
          </Grid>
          <Grid item xs={12}>
            {isLoading ? (
              <Box
                sx={{
                  mt: 6,
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <CircularProgress sx={{ mb: 4 }} />
                <Typography>Loading...</Typography>
              </Box>
            ) : (
              <Profile/>
            )}
          </Grid>
        </Grid>
      </Grid>

      <ShowNewPost
        open={showNewPostModal}
        onClose={handleCloseNewPost}
      />

      <Hidden mdUp>
      {user?.username === otherUser?.username &&  <FloatBarAction name="Post" handleClick={handleOpenNewPost} />}
      </Hidden>

    </Grid>
  );
};

export default UserProfile;

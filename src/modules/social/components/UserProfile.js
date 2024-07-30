// ** React Imports
import { useState, useEffect } from "react";
// ** Next Import
import { useRouter } from "next/router";
import { Button } from "@mui/material";
// ** MUI Components
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TabPanel from "@mui/lab/TabPanel";
import Packages from "./package/Package"
import TabContext from "@mui/lab/TabContext";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MuiTabList from "@mui/lab/TabList";
import CircularProgress from "@mui/material/CircularProgress";
import ShowNewPost from "./profile/ShowNewPostDrawer";
// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Demo Components
import Profile from "./profile";
import Followers from "./followers";
import Following from "./following";
import UserProfileHeader from "./UserProfileHeader";


const UserProfile = ({ data = [], username }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  // ** State
  const [showNewPostModal, setShowNewPostModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true);

  // ** Hooks
  const router = useRouter();
  const hideText = useMediaQuery((theme) => theme.breakpoints.down("sm"));


  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);

  const currentUser = JSON.parse(localStorage.getItem("userData"));

  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.username === username) {
      setIsCurrentUser(true)
    }
  }, [username])


  const handleOpenNewPost = () => {
    setShowNewPostModal(true)
  }

  const handleCloseNewPost = () => {
    setShowNewPostModal(false)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader
          currentUser={currentUser}
          isSame={isCurrentUser}
          username={isCurrentUser ? null : username}
        />
      </Grid>

      <Grid item xs={12}>
        <Grid justifyContent={"space-between"} container spacing={6}>
          <Grid item >
          </Grid>
          <Grid>
            <Box
              sx={{
                mt: 6,
                display: "flex",
                justifyContent: "end",
                alignItems: "flex-end",
              }}
            >
              <Button onClick={handleOpenNewPost} variant="contained" color="primary">
                <Icon icon="mdi:plus" />
                {isSmallScreen ? null : "New Post"}
              </Button>
            </Box>

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
              <Profile
                currentUser={currentUser}
                isSame={isCurrentUser}
                username={username}
              />
            )}
          </Grid>
        </Grid>
      </Grid>

      <ShowNewPost
        open={showNewPostModal}
        onClose={handleCloseNewPost}
      />
    </Grid>
  );
};

export default UserProfile;

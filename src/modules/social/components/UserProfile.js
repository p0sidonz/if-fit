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

const TabList = styled(MuiTabList)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
  },
  "& .MuiTab-root": {
    minWidth: 65,
    minHeight: 38,
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up("sm")]: {
      minWidth: 130,
    },
  },
}));

const UserProfile = ({ tab, data = [] }) => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  // ** State
  const [showNewPostModal , setShowNewPostModal] = useState(false)
  const [activeTab, setActiveTab] = useState(tab);
  const [isLoading, setIsLoading] = useState(true);

  // ** Hooks
  const router = useRouter();
  const hideText = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleChange = (event, value) => {
    setIsLoading(false);
    setActiveTab(value);
    router
      .push({
        pathname: `/profile/${value.toLowerCase()}`,
      })
      .then(() => setIsLoading(false));
  };
  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleOpenNewPost = () => {
    setShowNewPostModal(true)
  }

  const handleCloseNewPost = () => {
    setShowNewPostModal(false)
  }

  const tabContentList = {
    profile: <Profile tab={tab} />,
    followers: <Followers tab={tab} />,
    following: <Following tab={tab}/>,
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserProfileHeader />
      </Grid>
      {activeTab === undefined ? null : (
        <Grid item xs={12}>
          <TabContext value={activeTab}>
            <Grid justifyContent={"space-between"} container spacing={6}>
              <Grid item >
                <TabList
                  scrollButtons="auto"
                  onChange={handleChange}
                  aria-label="customized tabs example"
                >
                  <Tab
                    
                    value="profile"
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          ...(!hideText && { "& svg": { mr: 2 } }),
                        }}
                      >
                        <Icon icon="mdi:account-outline" />
                        {!hideText && "Home"}
                      </Box>
                    }
                  />
                  <Tab
                    value="followers"
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          ...(!hideText && { "& svg": { mr: 2 } }),
                        }}
                      >
                        <Icon icon="mdi:link-variant" />
                        {!hideText && "followers"}
                      </Box>
                    }
                  />
                  <Tab
                    value="following"
                    label={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          ...(!hideText && { "& svg": { mr: 2 } }),
                        }}
                      >
                        <Icon icon="mdi:link-variant" />
                        {!hideText && "following"}
                      </Box>
                    }
                  />
                </TabList>
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
                  <TabPanel sx={{ p: 0 }} value={activeTab} >
                    {tabContentList[activeTab]}
                  </TabPanel>
                )}
              </Grid>
            </Grid>
          </TabContext>
        </Grid>
      )}
      <ShowNewPost
      open={showNewPostModal}
      onClose={handleCloseNewPost}
      />
    </Grid>
  );
};

export default UserProfile;

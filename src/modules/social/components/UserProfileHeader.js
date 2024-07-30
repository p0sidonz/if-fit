// ** React Imports
import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
// ** MUI Components
import { LoadingButton } from "@mui/lab";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { useWhoAmI, useWhoYouAre } from "../../user/hooks/useUserData";
import { formatDate } from "../../../utils/utils";
import { useRouter } from "next/router";
import { useUnFollowUser, useFollowUser } from "../hooks/useSocialData";
import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText } from '@mui/material';
import Followers from "./followers";
import Following from "./following";

// ** Icon Imports
import Icon from "src/@core/components/icon";
import Packages from "./package/Package";

const ProfilePicture = styled("img")(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius,
  border: `5px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(4),
  },
}));

const InfoItem = ({ icon, text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Icon icon={icon} sx={{ color: 'text.secondary' }} />
    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
      {text}
    </Typography>
  </Box>
);

const StatItem = ({ label, count, onClick }) => (
  <Typography
    onClick={onClick}
    sx={{
      color: 'text.primary',
      fontWeight: 600,
      cursor: 'pointer',
      '&:hover': { textDecoration: 'underline' },
    }}
  >
    <Box component="span" sx={{ fontWeight: 'bold', mr: 1 }}>{count}</Box>
    {label}
  </Typography>
);

const UserProfileHeader = () => {
  
  const followUser = useFollowUser();
  const unFollowUser = useUnFollowUser();
  const router = useRouter();
  const { username } = router.query;
  const { data: user, isLoading } = useWhoAmI();
  const { data: otherUser, isLoading: otherUserLoading, refetch: refetchWhoAreYou } = useWhoYouAre(username);

  const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false);
  const [packagesDialogOpen, setPackagesDialogOpen] = useState(false);

  const handleFollowersClick = () => {
    setFollowersDialogOpen(true);
  };

  const handleFollowingClick = () => {
    setFollowingDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setFollowersDialogOpen(false);
    setFollowingDialogOpen(false);
    setPackagesDialogOpen(false);
  };


  // ** State
  const [data, setData] = useState({
    profileImg:
      "https://demos.pixinvent.com/materialize-nextjs-admin-template/demo-1/images/pages/profile-banner.png",
    designationIcon: "mdi:fountain-pen-tip",
  });

  const handleFollowOrUnFollow = async (type) => {
    if (type !== "unfollow") {

      await unFollowUser.mutateAsync(otherUser?.followingId);
    } else {
      await followUser.mutateAsync(otherUser?.id);
    }
    refetchWhoAreYou();
  }

  useEffect(() => {
    refetchWhoAreYou();
    handleCloseDialog();
  }, [username])

  const designationIcon = 'mdi:fountain-pen-tip'
  return (
    <>
      <Card elevation={3}>
        <CardContent
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <ProfilePicture
            src={data.profileImg}
            alt="profile-picture"
            sx={{ width: 120, height: 120, borderRadius: '50%', mb: 3 }}
          />

          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
            {`${otherUser?.first_name} ${otherUser?.last_name}`}
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}>
            {otherUser?.bio || "No bio available"}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3, mb: 3 }}>
            <InfoItem icon="mdi:badge-account-horizontal" text={otherUser?.role === "trainer" ? "Trainer" : "Trainee"} />
            {otherUser?.country && <InfoItem icon="mdi:map-marker" text={otherUser.country} />}
            <InfoItem icon="mdi:calendar" text={`Joined ${formatDate(otherUser?.created_at)}`} />
          </Box>

          <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
            <StatItem label="followers" count={otherUser?.following || 0} onClick={handleFollowersClick} />
            <StatItem label="following" count={otherUser?.followers || 0} onClick={handleFollowingClick} />
          </Box>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-end' },
              alignItems: 'center',
              flexWrap: 'wrap',
              mt: 2,
              gap: 1,
            }}
          >
            {user?.username === otherUser?.username ? (
              <Button
                onClick={() => router.push('/settings/account/')}
                variant="outlined"
                startIcon={<Icon icon="mdi:account-edit-outline" />}
              >
                Edit Profile
              </Button>
            ) : (
              <LoadingButton
                sx={{ mt: { xs: 1, md: 0 } }}
                onClick={() => { handleFollowOrUnFollow(otherUser?.isFollowing ? 'unfollow' : 'follow') }}
                variant={otherUser?.isFollowing ? 'outlined' : 'contained'}
                startIcon={
                  <Icon
                    fontSize={20}
                    icon={
                      otherUser?.isFollowing
                        ? 'mdi:account-check-outline'
                        : 'mdi:account-plus-outline'
                    }
                  />
                }
              >
                {otherUser?.isFollowing ? 'Following' : 'Follow'}
              </LoadingButton>
            )}
            <Button
              variant="contained"
              startIcon={<Icon icon="mdi:package-variant-closed" />}
            onClick={() => setPackagesDialogOpen(true)}
            >
              Packages
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog maxWidth="md" fullWidth open={followersDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Followers</DialogTitle>
        <DialogContent>
          <Followers
            username={username}
          />
        </DialogContent>
      </Dialog>

      <Dialog maxWidth="md" fullWidth open={followingDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Following</DialogTitle>
        <DialogContent>
          <Following
            username={username}
          />
        </DialogContent>
      </Dialog>

      <Dialog maxWidth="md" fullWidth open={packagesDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Following</DialogTitle>
        <DialogContent>
          <Packages/>
                    {/* <Following
            username={username}
          /> */}
        </DialogContent>
      </Dialog>

    </>
  );
};

export default UserProfileHeader;

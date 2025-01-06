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
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import { GET_AVATAR_COMPRESSED_URL } from "../../../utils/utils";
// ** Icon Imports
import Icon from "src/@core/components/icon";
import Packages from "./package/Package";
import usePackagesEvents from "../../user/hooks/usePackagesEvents";

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

const UserProfileHeader = ({user, otherUser, refetchWhoAreYou, isSameUser, username}) => {
  console.log("otherUser", otherUser);
  const sameUser = user?.username === otherUser?.username;
  const followUser = useFollowUser();
  const unFollowUser = useUnFollowUser();
  const router = useRouter();
  const {isPackageExpired} = usePackagesEvents()
  const avatarUrl = otherUser?.avatar?.avatar_compressed ?  GET_AVATAR_COMPRESSED_URL(otherUser?.avatar?.avatar_compressed) : "/images/avatars/1.png";

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
    profileImg: avatarUrl,
    designationIcon: "mdi:fountain-pen-tip",
  });

  const handleFollowOrUnFollow = async (type) => {
    if (type == "unfollow") {

      await unFollowUser.mutateAsync(otherUser?.followingId);
    } else {
     
      await followUser.mutateAsync(otherUser?.id);
    }
    refetchWhoAreYou();
  }

  useEffect(() => {
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
        {user?.status === "pending" || otherUser?.status === "pending" ? (
          // Skeleton loader for profile
          <>
            <Skeleton variant="circular" width={120} height={120} sx={{ mb: 3 }} />
            <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
            <Skeleton variant="text" width={300} height={20} sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3, mb: 3 }}>
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton variant="text" width={100} height={20} />
            </Box>
            <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
              <Skeleton variant="text" width={80} height={40} />
              <Skeleton variant="text" width={80} height={40} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="rectangular" width={120} height={36} />
              <Skeleton variant="rectangular" width={120} height={36} />
            </Box>
          </>
        ) : (
          // Actual content
          <>
            <ProfilePicture
              src={avatarUrl || data.profileImg }
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
              {sameUser ? (
                <Button
                  onClick={() => router.push('/settings/account/')}
                  variant="outlined"
                  startIcon={<Icon icon="mdi:account-edit-outline" />}
                >
                  Edit Profile
                </Button>
              ) : (
                <LoadingButton
                  loading={followUser.status === "pending" || unFollowUser.status === "pending"}
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

              {otherUser?.role === "trainer" && (
                <Tooltip title={
                  !sameUser && user?.role === "trainer" 
                    ? "Sorry, trainers cannot purchase packages" 
                    : isPackageExpired 
                      ? "Packages are not available currently"
                      : ""
                }>
                  <span>
                    <Button
                      variant="contained"
                      startIcon={<Icon icon="mdi:package-variant-closed" />}
                      onClick={() => setPackagesDialogOpen(true)}
                      disabled={(!sameUser && user?.role === "trainer") || isPackageExpired}
                    >
                      Packages
                    </Button>
                  </span>
                </Tooltip>
              )}
            </Box>
          </>
        )}
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
        <DialogTitle>Buy Plans</DialogTitle>
        <DialogContent>
          <Packages username={username}/>
                    {/* <Following
            username={username}
          /> */}
        </DialogContent>
      </Dialog>

    </>
  );
};

export default UserProfileHeader;

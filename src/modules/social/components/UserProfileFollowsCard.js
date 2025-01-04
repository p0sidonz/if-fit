// ** Icon Imports
import React from "react";
import Icon from "src/@core/components/icon";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Chip from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
// ** Custom Components Imports
import CustomChip from "src/@core/components/mui/chip";
import OptionsMenu from "src/@core/components/option-menu";
import Button from "@mui/material/Button";
import LoadingButton from '@mui/lab/LoadingButton';
import useNavigateTo from "src/modules/components/useRouterPush";
import { GET_AVATAR_COMPRESSED_URL } from "src/utils/utils";
import { 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
} from '@mui/material';


import { useState } from "react";
import { useUnFollowUser,useFollowUser} from "../hooks/useSocialData";

const UserProfileFollowsListItem = ({ item }) => {
  const currentUser = JSON.parse(localStorage.getItem("userData"));
  const navigateTo = useNavigateTo();
  const { mutate: unFollowUser } = useUnFollowUser();
  const { mutate: followUser } = useFollowUser();

  const [user, setUser] = useState(item);
  const avatarUrl = user?.avatar?.avatar_compressed ? GET_AVATAR_COMPRESSED_URL(user?.avatar?.avatar_compressed) : "/images/avatars/1.png";
  const handleFollowOrUnFollow = async () => {
    if (user.isFollowing) {
      unFollowUser(user.isFollowingId, {
        onSuccess: () => {
          setUser({ ...user, isFollowing: false, isFollowingId: null });
        }
      });
    } else {
      followUser(user.userId, {
        onSuccess: (data) => {
          setUser({ ...user, isFollowing: true, isFollowingId: data.id });
        }
      });
    }
  };

  return (
<ListItem 
  sx={{
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'flex-start', sm: 'center' },
    padding: { xs: 1, sm: 2 },
    gap: { xs: 1, sm: 2 }
  }}
>
  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
    <ListItemAvatar>
      <Avatar
        src={avatarUrl}
        alt={`${user.first_name} ${user.last_name}`}
        sx={{ width: { xs: 40, sm: 50 }, height: { xs: 40, sm: 50 } }}
      />
    </ListItemAvatar>
    
    <ListItemText
      primary={
        <Typography variant="subtitle2" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}>
          {user.first_name} {user.last_name}
        </Typography>
      }
      secondary={
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <CustomChip
            onClick={() => navigateTo(`/${user?.username}/view`)}
            label={`@${user.username}`}
            sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' }, alignSelf: 'flex-start' }}
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
          >
            {user.followersCount} followers
          </Typography>
        </Box>
      }
    />
  </Box>
  
  {user.userId !== currentUser.id && (
    <Box sx={{ 
      width: '100%',
      display: 'flex', 
      justifyContent: { xs: 'flex-start', sm: 'flex-end' },
      mt: { xs: 1, sm: 0 }
    }}>
      <LoadingButton
        onClick={handleFollowOrUnFollow}
        variant={user.isFollowing ? "outlined" : "contained"}
        size="small"
        sx={{ 
          fontSize: { xs: '0.7rem', sm: '0.8rem' },
          minWidth: { xs: '100%', sm: 'auto' }
        }}
        startIcon={
          <Icon
            fontSize={{ xs: 16, sm: 20 }}
            icon={
              user.isFollowing
                ? "mdi:account-check-outline"
                : "mdi:account-plus-outline"
            }
          />
        }
      >
        {user.isFollowing ? "Following" : "Follow"}
      </LoadingButton>
    </Box>
  )}
</ListItem>
  );
};

export default UserProfileFollowsListItem
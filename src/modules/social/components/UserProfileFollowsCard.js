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
    <ListItem alignItems="flex-start" >
      
      <ListItemAvatar>

        <Avatar
          src={user.avatar}
          alt={`${user.first_name} ${user.last_name}`}
          sx={{ width: 50, height: 50 }}
        />
      </ListItemAvatar>
      
      <ListItemText
        primary={
          <Typography variant="subtitle1">
            {user.first_name} {user.last_name}
          </Typography>
        }

        secondary={
          
          <React.Fragment>
            <CustomChip
              onClick={() => navigateTo(`/${user?.username}/view`)}
              label={`@${user.username}`}
            />
            {" — "}
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
            >
              {user.followersCount} followers
            </Typography>
          </React.Fragment>
        }
      />
      {/* Follow Button */}
{ user.userId !== currentUser.id   &&  <Box sx={{ ml: 2, mt: 3, display: 'flex', alignItems: 'center' }}>
        <LoadingButton
          onClick={handleFollowOrUnFollow}
          variant={user.isFollowing ? "outlined" : "contained"}
          size="small"
          startIcon={
            <Icon
              fontSize={20}
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
      </Box>}
    </ListItem>
  );
};

export default UserProfileFollowsListItem
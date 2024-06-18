// ** Icon Imports
import Icon from "src/@core/components/icon";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
// ** Custom Components Imports
import CustomChip from "src/@core/components/mui/chip";
import OptionsMenu from "src/@core/components/option-menu";
import Button from "@mui/material/Button";
import LoadingButton from '@mui/lab/LoadingButton';

import { useState } from "react";
import { useUnFollowUser,useFollowUser} from "../hooks/useSocialData";

const UserProfileFollowsCard = ({ item }) => {
    const { mutate: unFollowUser, isPending: isPendingUnFollow, isSuccess: isSuccessUnFollow, data: unFollowData } = useUnFollowUser();
  const { mutate: followUser, isPending: isPendingFollow, isSuccess: isSuccessFollow, data: dataFollow } = useFollowUser();

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
            console.log("onSuccess followUser ",data)
          setUser({ ...user, isFollowing: true, isFollowingId: data.id });
        }
      });
    }
  };

    return (
        <Card sx={{ position: "relative" }}>
        <OptionsMenu
          iconButtonProps={{
            size: "small",
            sx: { top: 12, right: 12, position: "absolute" },
          }}
          options={[
            {
              text: "UnFollow",
              menuItemProps: { sx: { color: "error.main" } },
            },
          ]}
        />
        <CardContent>
            
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Avatar
              src={item.avatar}
              sx={{ mb: 4, width: 100, height: 100 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {user.first_name} {user.last_name}
            </Typography>
            <Box sx={{ mb: 8, display: "flex", alignItems: "center" }}>
              <CustomChip
                size="small"
                skin="light"
                label= {`@${user.username}`}
              />
            </Box>
            <Box
              sx={{
                mb: 8,
                gap: 2,
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h5">0</Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Posts
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h5">{user.followersCount}</Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Followers
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h5">{user.followingCount}</Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Following
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LoadingButton
                onClick={handleFollowOrUnFollow}
                variant={user.isFollowing ? "outlined" : "contained"}
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
              
            </Box>
          </Box>
        </CardContent>
      </Card>
    )
}

export default UserProfileFollowsCard
// ** React Imports
import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
// ** MUI Components
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import { useWhoAmI } from "../../user/hooks/useUserData";
import { formatDate } from "../../../utils/utils";
import { useRouter } from "next/router";

// ** Icon Imports
import Icon from "src/@core/components/icon";

const ProfilePicture = styled("img")(({ theme }) => ({
  width: 120,
  height: 120,
  borderRadius: theme.shape.borderRadius,
  border: `5px solid ${theme.palette.common.white}`,
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(4),
  },
}));

const UserProfileHeader = () => {
  const router = useRouter();
  const { data: user, isLoading } = useWhoAmI();

  // ** State
  const [data, setData] = useState({
    fullName: "John Doe",
    location: "Vatican City",
    joiningDate: "April 2021",
    designation: "UX Designer",
    profileImg:
      "https://demos.pixinvent.com/materialize-nextjs-admin-template/demo-1/images/pages/profile-banner.png",
    designationIcon: "mdi:fountain-pen-tip",
    coverImg:
      "https://demos.pixinvent.com/materialize-nextjs-admin-template/demo-1/images/pages/profile-banner.png",
  });

  const designationIcon = data?.designationIcon || "mdi:briefcase-outline";
  return (
<Card>
  <CardContent
    sx={{
      pt: 2, // Adjust padding top
      display: "flex",
      alignItems: "center", // Center the content vertically
      flexWrap: { xs: "wrap", md: "wrap" },
      justifyContent: { xs: "center", md: "center" },
    }}
  >
    <ProfilePicture src={data.profileImg} alt="profile-picture" />
    <Box
      sx={{
        width: "100%",
        display: "flex",
        ml: { xs: 6, md: 6 },
        alignItems: "flex-end",
        flexWrap: ["wrap", "wrap"],
        justifyContent: ["center", "center"],
      }}
    >
      <Box
        sx={{
          mb: [6, 0],
          display: "flex",
          flexDirection: "column",
          alignItems: ["center", "center"],
        }}
      >
        <Typography variant="h5" sx={{ mb: 4, fontSize: "1.375rem" }}>
          {user?.first_name + " " + user?.last_name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: ["center", "center"],
          }}
        >
          <Box
            sx={{
              mr: 4,
              display: "flex",
              alignItems: "center",
              "& svg": { mr: 1, color: "text.secondary" },
            }}
          >
            <Icon icon={designationIcon} />
            <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>
              {data.designation}
            </Typography>
          </Box>
          {user?.country && (
            <Box
              sx={{
                mr: 4,
                display: "flex",
                alignItems: "center",
                "& svg": { mr: 1, color: "text.secondary" },
              }}
            >
              <Icon icon="mdi:map-marker-outline" />
              <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>
                {user?.country}
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              "& svg": { mr: 1, color: "text.secondary" },
            }}
          >
            <Icon icon="mdi:calendar-blank-outline" />
            <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>
              Joined {formatDate(user?.created_at)}
            </Typography>
          </Box>
        </Box>
      </Box>
     
    </Box>
    <Button
      onClick={() => router.push('/settings/account/')}
      sx={{ mt: 4, ml: { xs: 0, md: "auto" }}} // Adjust margin top and margin left for button
        size="small"
        variant="outlined"
        startIcon={<Icon icon="mdi:account-edit-outline" fontSize={20} />}
      >
        Edit Profile
      </Button>
  </CardContent>
</Card>
  );
};

export default UserProfileHeader;

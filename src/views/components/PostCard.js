// ** MUI Imports
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import { Icon } from "@iconify/react"; // Adjust the import path for the icon library you're using
import { GET_POST_THUMBNAIL_URL } from "../../utils/utils"


const PostCard = ({
  data,
  id,
  image = "https://picsum.photos/id/237/200/300",
  title = "Default title",
  handleClickOpen,
}) => {
  let imageUrl = image ? GET_POST_THUMBNAIL_URL(image) : null;
  console.log("_count", data._count);
  return (
    <Card sx={{ position: "relative", minHeight: 400, maxHeight: 300 }}>
      <CardMedia
        component="img"
        image={imageUrl}
        alt="Post image"
        sx={{ minHeight: 400, maxHeight: 300 }}
      />
      <Box
        onClick={() => handleClickOpen(id)}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: "white",
          opacity: 0,
          transition: "opacity 0.3s",
          "&:hover": {
            opacity: 1,
            cursor: "pointer",
          },
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "0 10px",
          }}
        >
          <Typography
            variant="h5"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Icon fontSize={26} icon="mdi:heart" style={{ marginRight: 4 }} />
            {data?._count?.Likes}
          </Typography>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: "0 10px",
          }}
        >
          <Typography
            variant="h5"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Icon fontSize={26} icon="mdi:comment" style={{ marginRight: 4 }} />
            {data?._count?.PostComment}
          </Typography>
        </div>
      </Box>
    </Card>
  );
};

export default PostCard;

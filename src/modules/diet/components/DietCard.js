import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  CardMedia,
  Alert,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  CardActions,
} from "@mui/material";
import Link from "next/link";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import OpacityIcon from "@mui/icons-material/Opacity";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const DietCard = ({ diet, onEdit, onDelete, id }) => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push(`/diet/${diet.id}`);
  };

  const {
    title,
    description,
    is_macro_set,
    macro_type,
    target_calories,
    target_carbs,
    target_fat,
    target_protein,
    created_at,
    updated_at,

    type,
    image,
  } = diet;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(diet);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(diet);
    handleMenuClose();
  };

  return (
      <Card
        sx={{
          maxWidth: 400,
          height: 400,
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: 3,
          margin: 2,
          position: "relative",
        }}
      >
        <IconButton
          aria-label="settings"
          onClick={handleMenuClick}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
        <CardContent        onClick={handleNavigation}
 sx={{ paddingBottom: "16px !important", cursor: 'pointer' }}>
          <Typography variant="h5" component="div" gutterBottom>
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginBottom: 2 }}
          >
            {description}
          </Typography>
          {/* {!macro_type && <Alert icon={false} sx={{fontSize: '12px', padding: 0,textAlign: 'center' }} severity="success" color="warning">
  Please set macros
</Alert>} */}

          <List>
            <ListItem>
              <LocalFireDepartmentIcon color="error" />
              <ListItemText
                primary={`Calories: ${target_calories || 0}`}
                sx={{ marginLeft: 0.4 }}
              />
            </ListItem>
            <ListItem>
              <FastfoodIcon color="primary" />
              <ListItemText
                primary={`Carbs: ${target_carbs || 0}g`}
                sx={{ marginLeft: 0.4 }}
              />
            </ListItem>
            <ListItem>
              <OpacityIcon color="secondary" />
              <ListItemText
                primary={`Fat: ${target_fat || 0}g`}
                sx={{ marginLeft: 0.4 }}
              />
            </ListItem>
            <ListItem>
              <FitnessCenterIcon color="success" />
              <ListItemText
                primary={`Protein: ${target_protein || 0}g`}
                sx={{ marginLeft: 0.4 }}
              />
            </ListItem>
            <ListItem>
              <Chip
                label={type === "veg" ? "Vegetarian" : "Non-Vegetarian"}
                color={type === "veg" ? "success" : "error"}
                variant="outlined"
              />
            </ListItem>
          </List>

          <Box sx={{ textAlign: "right", fontStyle: "italic" }}>
            {/* <Typography variant="body2">Created at: {new Date(created_at).toLocaleDateString()}</Typography> */}
            <Typography variant="body2">
              Updated at: {new Date(updated_at).toLocaleDateString()}
            </Typography>
          </Box>
        </CardContent>
      </Card>
  );
};

export default DietCard;

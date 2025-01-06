import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import OpacityIcon from "@mui/icons-material/Opacity";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { Button, Tooltip } from "@mui/material";


import { Card, CardContent, Typography, List, ListItem, ListItemText, IconButton, Menu, MenuItem, Box, Chip, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';



const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: '100%',
  width: '100%',
  height: 350,
  
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: theme.shadows[3],
  position: 'relative',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
  [theme.breakpoints.up('sm')]: {
    width: 400,
  },
}));

const MacroItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(0.5, 0),
}));

const MacroIcon = styled(Avatar)(({ theme, color }) => ({
  backgroundColor: theme.palette[color].main,
  width: 24,
  height: 24,
}));

const MacroText = styled(ListItemText)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  '& .MuiListItemText-primary': {
    fontSize: '0.9rem',
  },
}));

const DietPlanCard = ({ diet,onAssignClick, dietId,title, description, target_calories, target_carbs, target_fat, target_protein, type, updated_at, handleEdit, handleDelete, handleNavigation, disabled }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onAssignClicked = (dietId) => {
    console.log("Diet ID: ", dietId);
    onAssignClick(dietId.id);

  }

  return (
<StyledCard>
  <IconButton
    aria-label="settings"
    onClick={handleMenuClick}
    sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
  >
    <MoreVertIcon />
  </IconButton>
  <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
    <MenuItem onClick={handleEdit}>Edit</MenuItem>
    <MenuItem onClick={handleDelete}>Delete</MenuItem>
  </Menu>
  <CardContent onClick={handleNavigation} sx={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Typography variant="h5" component="div" gutterBottom fontWeight="bold">
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
      {description}
    </Typography>
    <List sx={{ width: '100%', mt: 'auto' }}>
      <MacroItem>
        <MacroIcon color="error"><LocalFireDepartmentIcon fontSize="small" /></MacroIcon>
        <MacroText primary={`Calories: ${target_calories || 0}`} />
      </MacroItem>
      <MacroItem>
        <MacroIcon color="primary"><FastfoodIcon fontSize="small" /></MacroIcon>
        <MacroText primary={`Carbs: ${target_carbs || 0}g`} />
      </MacroItem>
      <MacroItem>
        <MacroIcon color="secondary"><OpacityIcon fontSize="small" /></MacroIcon>
        <MacroText primary={`Fat: ${target_fat || 0}g`} />
      </MacroItem>
      <MacroItem>
        <MacroIcon color="success"><FitnessCenterIcon fontSize="small" /></MacroIcon>
        <MacroText primary={`Protein: ${target_protein || 0}g`} />
      </MacroItem>
    </List>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
      <Chip
        label={type === "veg" ? "Vegetarian" : "Non-Vegetarian"}
        color={type === "veg" ? "success" : "error"}
        size="small"
      />
      <Box sx={{ display: 'flex', alignItems: 'center', typography: 'caption', color: 'text.secondary' }}>
        <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
        {new Date(updated_at).toLocaleDateString()}
      </Box>
    </Box>
    <Tooltip title={disabled ? "Package expired. Please renew to assign diet." : ""} arrow>
      <span>
        <Button
          fullWidth
          disabled={disabled}
          sx={{mt: 4}}
          onClick={(e) => {
            e.stopPropagation();
            onAssignClicked(dietId);
          }}
          startIcon={<AssignmentIndIcon />}
          color="primary"
          variant="contained"
          size="small"
        >
          Assign
        </Button>
      </span>
    </Tooltip>
  </CardContent>
</StyledCard>
  );
};




const DietCard = ({ diet, onEdit, onDelete, id,onAssignClick, disabled }, props) => {
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
    <DietPlanCard
       {...props}
       onAssignClick={onAssignClick}
      dietId={diet}
      title={title}
      description={description}
      target_calories={target_calories}
      target_carbs={target_carbs}
      target_fat={target_fat}
      target_protein={target_protein}
      type={type}
      updated_at={updated_at}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      disabled={disabled}
      handleNavigation={handleNavigation}
    />
  );
};

export default DietCard;

import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, CardActions, Typography, Box, Button, Avatar, IconButton, Menu, MenuItem, Chip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { ListItem, ListItemText, List } from '@mui/material';



const StyledWorkoutCard = styled(Card)(({ theme }) => ({
    width: '100%',
    height: 350,
    maxWidth: '100%',
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
  
  const WorkoutItem = styled(ListItem)(({ theme }) => ({
    padding: theme.spacing(0.5, 0),
  }));
  
  const WorkoutIcon = styled(Avatar)(({ theme, color }) => ({
    backgroundColor: theme.palette[color].main,
    width: 24,
    height: 24,
  }));
  
  const WorkoutText = styled(ListItemText)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    '& .MuiListItemText-primary': {
      fontSize: '0.9rem',
    },
  }));
  
  const WorkoutCard = ({ workout, handleNavigation, handleDelete }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
  
    const handleMenuClick = (event) => {
      event.stopPropagation();
      setAnchorEl(event.currentTarget);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
  
    return (
      <StyledWorkoutCard>
        <IconButton
          aria-label="settings"
          onClick={handleMenuClick}
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleNavigation(workout.id)}>View</MenuItem>
          <MenuItem onClick={() => handleDelete(workout)}>Delete</MenuItem>
        </Menu>
        <CardContent onClick={() => handleNavigation(workout.id)} sx={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h5" component="div" gutterBottom fontWeight="bold">
            {workout.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
            {workout.description}
          </Typography>
          <List sx={{ width: '100%', mt: 'auto' }}>
            <WorkoutItem>
              <WorkoutIcon color="primary"><PlaylistAddCheckIcon fontSize="small" /></WorkoutIcon>
              <WorkoutText primary={`Total Sets: ${workout.totalSets}`} />
            </WorkoutItem>
            <WorkoutItem>
              <WorkoutIcon color="secondary"><FitnessCenterIcon fontSize="small" /></WorkoutIcon>
              <WorkoutText primary={`Total Exercises: ${workout.totalExercises}`} />
            </WorkoutItem>
          </List>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Chip
              label={workout.type}
              color="primary"
              size="small"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', typography: 'caption', color: 'text.secondary' }}>
              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
              {new Date(workout.updated_at).toLocaleDateString()}
            </Box>
          </Box>
        </CardContent>
        <CardActions sx={{ padding: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(workout);
            }}
            startIcon={<DeleteIcon />}
            color="error"
            variant="contained"
            size="small"
            fullWidth
          >
            Delete Workout
          </Button>
        </CardActions>
      </StyledWorkoutCard>
    );
  };

  export default WorkoutCard;
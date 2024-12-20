import React from 'react';
import { styled } from '@mui/material/styles';
import { Grid,Card, CardContent, CardActions, Typography, Box, Button, Avatar, IconButton, Menu, MenuItem, Chip, List, ListItem, ListItemText } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import AssignmentIcon from '@mui/icons-material/Assignment';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // New icon for total weeks
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'; // New icon for total workouts
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'; // New icon for assign



const StyledProgramCard = styled(Card)(({ theme }) => ({
  maxWidth: '100%',
  width: '100%',
  minWidth: 300,
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

const ProgramItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(0.5, 0),
}));

const ProgramIcon = styled(Avatar)(({ theme, color }) => ({
  backgroundColor: theme.palette[color].main,
  width: 24,
  height: 24,
}));

const ProgramText = styled(ListItemText)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  '& .MuiListItemText-primary': {
    fontSize: '0.9rem',
  },
}));

const ProgramCard = ({ program, onEdit, onDelete, handleNavigation, onAssignClick }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Calculate totals from program data
  const totalWeeks = program.Program_Week?.length || 0;
  const totalDays = program.Program_Week?.reduce((acc, week) => {
    return acc + week.Program_Days.filter(day => !day.rest_day).length;
  }, 0) || 0;
  const totalWorkouts = program.Program_Week?.reduce((acc, week) => {
    return acc + week.Program_Days.filter(day => day.workout_id !== null).length;
  }, 0) || 0;

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} key={program.id}>
      <StyledProgramCard>
        <IconButton
          aria-label="settings"
          onClick={handleMenuClick}
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={() => onEdit(program)}>Edit</MenuItem>
          <MenuItem onClick={() => onDelete(program)}>Delete</MenuItem>
        </Menu>
        <CardContent onClick={() => handleNavigation(program.id)} sx={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h5" component="div" gutterBottom fontWeight="bold">
            {program.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
            {program.description}
          </Typography>
          <List sx={{ width: '100%', mt: 'auto' }}>
            <ProgramItem>
              <ProgramIcon color="primary"><CalendarTodayIcon fontSize="small" /></ProgramIcon>
              <ProgramText primary={`Weeks: ${totalWeeks}`} />
            </ProgramItem>
            {/* <ProgramItem>
              <ProgramIcon color="secondary"><FitnessCenterIcon fontSize="small" /></ProgramIcon>
              <ProgramText primary={`Days: ${totalDays}`} />
            </ProgramItem> */}
            <ProgramItem>
              <ProgramIcon color="success"><DirectionsRunIcon fontSize="small" /></ProgramIcon>
              <ProgramText primary={`Workouts: ${totalWorkouts}`} />
            </ProgramItem>
          </List>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Chip
              label={program.type || 'Program'}
              color="primary"
              size="small"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', typography: 'caption', color: 'text.secondary' }}>
              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
              {new Date(program.updated_at).toLocaleDateString()}
            </Box>
          </Box>
        </CardContent>
        <CardActions sx={{ padding: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAssignClick(program.id);
            }}
            startIcon={<AssignmentIndIcon />}
            color="primary"
            variant="contained"
            size="small"
            fullWidth
          >
            Assign Program
          </Button>
        </CardActions>
      </StyledProgramCard>
    </Grid>
  );
};

export default ProgramCard;
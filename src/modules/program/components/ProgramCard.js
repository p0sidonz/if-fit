import React from 'react';
import {Tooltip,
  Card, CardHeader, CardContent, CardActions, Button, Typography, Box, IconButton, Chip, Avatar,
  Icon,
  Grid,
  Link

} from '@mui/material';

import AssignmentIcon from '@mui/icons-material/Assignment';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'; // New icon for total weeks
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'; // New icon for total workouts


const ProgramCard = ({ program, onEdit, onDelete, handleNavigation }) => (
  
  <Grid item xs={12} sm={6} md={4} lg={3} key={program.id}>
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => handleNavigation(program.id)}>
      <Box display="flex" alignItems="center" mb={2}>
        <Tooltip title="Program">
          <AssignmentIcon color="primary" sx={{ mr: 2 }} />
        </Tooltip>
        <Typography variant="h6" component="div">
          <Link to={`/workouts/${program.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {program.title}
          </Link>
        </Typography>
      </Box>
      
      <Typography variant="body2" color="textSecondary" mb={2}>
        {program.description}
      </Typography>

      <Box display="flex" justifyContent="space-around" alignItems="center" mb={2} pt={4}>
        <Box textAlign="center">
          <Tooltip title="Total Weeks">
            <CalendarTodayIcon color="secondary" sx={{ mb: 1 }} />
          </Tooltip>
          <Typography variant="h6" color="textSecondary">
            {program.total_weeks || 0}
          </Typography>
          <Typography variant="body2">Weeks</Typography>
          
         
        </Box>

        <Box textAlign="center">
          <Tooltip title="Total Exercises">
            <FitnessCenterIcon color="action" sx={{ mb: 1 }} />
          </Tooltip>
          <Typography variant="h6" color="textSecondary">
            {program.total_days  || 0}
          </Typography>
          <Typography variant="body2">Exercises</Typography>
         
        </Box>

        <Box textAlign="center">
          <Tooltip title="Total Workouts">
            <DirectionsRunIcon color="action" sx={{ mb: 1 }} />
          </Tooltip>
          <Typography variant="h6" color="textSecondary">
            {program.total_workouts || 0}
          </Typography>
          <Typography variant="body2">Workouts</Typography>
          
        </Box>
      </Box>
    </CardContent>
    
    <CardActions>
      <Tooltip title="Delete Workout">
        <Button
          onClick={() => onDelete(program)}
          startIcon={<DeleteIcon />}
          color="error"
          fullWidth
        >
          Delete
        </Button>
      </Tooltip>
    </CardActions>
  </Card>
</Grid>


  // <Card sx={{ margin: 1, borderRadius: 1, boxShadow: 3 }}>
  //   <CardHeader
  //     title={
  //       <Typography variant="h5" sx={{ color: '#FFF' }}>
  //         {program.title}
  //       </Typography>
  //     }
  //     action={
  //       <Tooltip title="Edit Program">
  //         <IconButton onClick={() => onEdit(program)} sx={{ color: '#FFF' }}>
  //           <EditIcon />
  //         </IconButton>
  //       </Tooltip>
  //     }
  //     sx={{ backgroundColor: '#666CFF', padding: 2 }}
  //   />
  //   <CardContent sx={{ padding: 2 }}>
  //     <Typography variant="body1" color="textSecondary">
  //       {program.description}
  //     </Typography>
  //     <Box sx={{ marginTop: 3, textAlign: 'start' }}>
  //       <Typography variant="h6" component="h2">
  //         Total Weeks: {program.total_weeks}
  //       </Typography>
  //       <Typography variant="h6" component="h2">
  //         Total Days: {program.total_days}
  //       </Typography>
  //       <Typography variant="h6" component="h2">
  //         Total Workouts: {program.total_workouts}
  //       </Typography>
  //     </Box>
  //   </CardContent>
   
  //   <CardActions sx={{ justifyContent: 'space-between', padding: 2 }}>
  //     {/* <Tooltip title="Edit Program">
  //       <Button
  //         onClick={() => onEdit(program)}
  //         variant="contained"
  //         color="primary"
  //         startIcon={<EditIcon />}
  //       >
  //         Edit
  //       </Button>
  //     </Tooltip> */}
  //       <Tooltip title="View Program">
  //       <Button variant="text" color="primary" startIcon={<EyeIcon />}>
  //         View Program
  //       </Button>
  //     </Tooltip>
  //     <Tooltip title="Delete Program">
  //       <Button
  //         onClick={() => onDelete(program)}
  //         variant="text"
  //         color="error"
  //         startIcon={<DeleteIcon />}
  //       >
  //         Delete
  //       </Button>
  //     </Tooltip>
  //   </CardActions>
  // </Card>
);

export default ProgramCard;
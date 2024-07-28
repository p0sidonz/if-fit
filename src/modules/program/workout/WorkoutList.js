import React, { useState } from 'react';
import WorkoutDetail from './WorkoutDetail';
import AddIcon from '@mui/icons-material/Add';
import { Drawer, SwipeableDrawer, Grid, List, ListItem, ListItemText, Typography, Button, Card, Alert, Box, Stack } from '@mui/material';
import { ListItemSecondaryAction, IconButton } from '@mui/material';
const WorkoutList = ({ workouts, onAddWorkout, onClose }) => {
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  return (

    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <List>
          {workouts?.map((workout) => (
            <ListItem button key={workout.id} onClick={() => setSelectedWorkout(workout)}>
              <ListItemText primary={workout.title} />
              <ListItemSecondaryAction>
                <IconButton color='primary' size='small' edge="end" aria-label="add" onClick={() => onAddWorkout(workout.id)}>
                  <AddIcon /> Add
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item xs={12} sm={8}>
        <Card variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
          {selectedWorkout ? (
            <Box>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Typography color="primary" variant="h5">
                  {selectedWorkout.title}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Button onClick={() => onAddWorkout(selectedWorkout.id)} variant="contained" color="primary">
                  Add Workout
                </Button>
              </Stack>
              <Typography variant="body1" paragraph>
                {selectedWorkout.description}
              </Typography>
              {selectedWorkout.Workout_Exercise.map((exercise, index) => (
                <WorkoutDetail key={index} exercise={exercise} />
              ))}
            </Box>
          ) : (
            <Alert severity="info">Select a workout to view details</Alert>
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

export default WorkoutList;

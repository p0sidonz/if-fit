import React, { useState } from 'react';
import WorkoutDetail from './WorkoutDetail';
import Alert from '@mui/material/Alert';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Grid, List, ListItem, ListItemText, Button, Card, Typography, Box } from '@mui/material';


const WorkoutList = ({ workouts, onAddWorkout}) => {
  JSON.stringify(workouts.id);
  const [selectedWorkout, setSelectedWorkout] = useState(null);


  return (<Grid container spacing={2}>
    <Grid item xs={4}>
      <List>
        {workouts.map((workout) => (
          <ListItem button key={workout.id} onClick={() => setSelectedWorkout(workout)}>
            <ListItemText primary={workout.title} />
          </ListItem>
        ))}
      </List>
    </Grid>
    <Grid item xs={8}>
      <Card variant="outlined" sx={{ padding: 2, marginBottom: 2 }}>
        {selectedWorkout ? (
          <div>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <Typography color="primary" variant="h5" gutterBottom>
                  {selectedWorkout.title}
                </Typography>
              </Grid>
              <Grid item xs={4} style={{ textAlign: 'right' }}>
                <Button onClick={()=> onAddWorkout(selectedWorkout.id)}  variant="contained" color="primary">
                  Add Workout
                </Button>
              </Grid>
            </Grid>
            <Typography variant="body1">{selectedWorkout.description}</Typography>
            {selectedWorkout.Workout_Exercise.map((exercise, index) => (

              <WorkoutDetail exercise={exercise} />
            ))}
          </div>
        ) : (
          <Alert severity="info">Select a workout to view details</Alert>
        )}
      </Card>

    </Grid>
  </Grid>)
}

export default WorkoutList;
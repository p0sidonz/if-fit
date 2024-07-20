'use client'
import React, { useState } from 'react';
import { useGetWorkouts, useDeleteWorkout, useCreateWorkout } from './hooks/useWorkout';
import {
  List, ListItem, ListItemText, Button, Typography, Box, Link
  , Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Card, CardContent, CardActions, Tooltip,
  Hidden
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useRouter } from "next/router";
import { FloatBarAction } from '../components/FloatBarAction';



const WorkoutsList = () => {
  const [openWorkoutDialog, setOpenWorkoutDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [newWorkout, setNewWorkout] = useState({ title: '', description: '' });
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const { data: workouts, isLoading, error } = useGetWorkouts();
  const { mutateAsync: createNewWorkout, isLoading: newWorkoutLoading, error: newWorkoutError, } = useCreateWorkout();
  const { mutateAsync: deleteWorkout, isLoading: deleteWorkoutLoading, error: deleteWorkoutError, } = useDeleteWorkout();


  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>An error occurred: {error.message}</Typography>;



  const handleAddWorkout = async () => {
    try {
      await createNewWorkout({
        ...newWorkout,
      });
      setNewWorkout({ title: "", description: "" });
      setOpenWorkoutDialog(false);
      fetchWorkouts();
    } catch (error) {
      console.error('Error creating workout:', error);
      setOpenWorkoutDialog(false);
    }
  };


  const handleNewWorkout = () => {
    setNewWorkout({ title: "", description: "" });
    setOpenWorkoutDialog(true);
  }

  const handleOpenDelete = (workout) => {
    setSelectedWorkout(workout);
    setOpenDeleteDialog(true);
  }

  const handleDeleteWorkout = async () => {

    try {
      await deleteWorkout(selectedWorkout.id);
      setOpenDeleteDialog(false);
    }
    catch (error) {
      setOpenDeleteDialog(false);

      console.error('Error deleting workout:', error);
    }
  }

  const router = useRouter();

  const handleNavigation = (id) => {
    router.push(`/workout/${id}`);
  };


  return (
    <>
      <Typography variant="h4" gutterBottom>Workouts</Typography>
      <Hidden smDown>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleNewWorkout} variant="contained" color="primary" sx={{ mb: 2 }}>
            Create New Workout
          </Button>
        </div>
      </Hidden>

      <Grid container spacing={3}>
        {workouts.map((workout) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={workout.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => handleNavigation(workout.id)}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Tooltip title="Workout">
                    <AssignmentIcon color="primary" sx={{ mr: 2 }} />
                  </Tooltip>
                  <Typography variant="h6" component="div">
                    <Link to={`/workouts/${workout.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {workout.title}
                    </Link>
                  </Typography>
                </Box>

                <Typography variant="body2" color="textSecondary" mb={2}>
                  {workout.description}
                </Typography>

                <Box display="flex" justifyContent="space-around" alignItems="center" mb={2}>
                  <Box textAlign="center">
                    <Tooltip title="Total Sets">
                      <PlaylistAddCheckIcon color="secondary" sx={{ mb: 1 }} />
                    </Tooltip>
                    <Typography variant="body2">Total Sets:</Typography>
                    <Typography variant="h6" color="textSecondary">
                      {workout.totalSets}
                    </Typography>
                  </Box>

                  <Box textAlign="center">
                    <Tooltip title="Total Exercises">
                      <FitnessCenterIcon color="action" sx={{ mb: 1 }} />
                    </Tooltip>
                    <Typography variant="body2">Total Exercises:</Typography>
                    <Typography variant="h6" color="textSecondary">
                      {workout.totalExercises}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions>
                <Tooltip title="Delete Workout">
                  <Button
                    onClick={() => handleOpenDelete(workout)}
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
        ))}
      </Grid>


      {/* Add Workout Dialog */}
      <Dialog open={openWorkoutDialog} onClose={() => setOpenWorkoutDialog(false)}>
        <DialogTitle>Add New Workout</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newWorkout.title}
            onChange={(e) => setNewWorkout({ ...newWorkout, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newWorkout.description}
            onChange={(e) => setNewWorkout({ ...newWorkout, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={newWorkoutLoading} onClick={() => setOpenWorkoutDialog(false)}>Cancel</Button>
          <LoadingButton disabled={newWorkoutLoading} onClick={handleAddWorkout}>Add</LoadingButton>
        </DialogActions>
      </Dialog>

      {/* Delete Workout Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this <span style={{ color: '#666cff' }}> {selectedWorkout?.title} </span> workout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button disabled={deleteWorkoutLoading} onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <LoadingButton disabled={deleteWorkoutLoading} onClick={handleDeleteWorkout}>Delete</LoadingButton>
        </DialogActions>
      </Dialog>
      <Hidden smUp>
        <FloatBarAction name="Workout" handleClick={handleNewWorkout} />
      </Hidden>

    </>

  );
};






export default WorkoutsList;
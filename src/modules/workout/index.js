'use client'
import React, { useState } from 'react';
import { useGetWorkouts, useDeleteWorkout, useCreateWorkout } from './hooks/useWorkout';
import {
  List, ListItem, ListItemText, Button, Typography, Box, Link
  , Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Card, CardContent, CardActions, Tooltip,
  Hidden, Divider, IconButton, Avatar, InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useRouter } from "next/router";
import { FloatBarAction } from '../components/FloatBarAction';
import WorkoutCard from './component/WorkoutCard';
import AddIcon from '@mui/icons-material/Add';

const WorkoutsList = () => {
  const [openWorkoutDialog, setOpenWorkoutDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [newWorkout, setNewWorkout] = useState({ title: '', description: '' });
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const { data: workouts, isLoading, error } = useGetWorkouts();
  const { mutateAsync: createNewWorkout, isLoading: newWorkoutLoading, error: newWorkoutError, } = useCreateWorkout();
  const { mutateAsync: deleteWorkout, isLoading: deleteWorkoutLoading, error: deleteWorkoutError, } = useDeleteWorkout();
  const [searchQuery, setSearchQuery] = useState("");


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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredWorkouts = workouts.filter((workout) => {
    const matchesSearchQuery =
      workout.title.toLowerCase().includes(searchQuery) ||
      workout.description.toLowerCase().includes(searchQuery);
    return matchesSearchQuery
  });



  return (
    <>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h4" gutterBottom>
            Workouts
          </Typography>
          <Hidden smDown>
            <Tooltip title={`Add New Workout`} aria-label="add">
              <Button startIcon={<AddIcon />} onClick={handleNewWorkout} variant="contained" color="primary" sx={{ mb: 2 }}>
                Add New Workout
              </Button>
            </Tooltip>
          </Hidden>
        </div>


      <Card sx={{ marginTop: 3, padding: 2, marginBottom: 3 }}>
        <CardContent sx={{ display: "flex", gap: 2 }}>
          <TextField
            label="Search Workout"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>


      <Grid container spacing={3}>
        {filteredWorkouts?.map((workout) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={workout.id}>
            {/* <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 3,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  cursor: 'pointer',
                  padding: 3,
                }}
                onClick={() => handleNavigation(workout.id)}
              >
                <Box display="flex" alignItems="center" mb={3}>
                  <AssignmentIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                  <Typography variant="h5" component="div" fontWeight="bold">
                    <Link
                      to={`/workouts/${workout.id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {workout.title}
                    </Link>
                  </Typography>
                </Box>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  mb={3}
                  sx={{ lineHeight: 1.6 }}
                >
                  {workout.description}
                </Typography>

                <Box
                  display="flex"
                  justifyContent="space-around"
                  alignItems="center"
                  mb={2}
                  sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: 2,
                    padding: 2,
                  }}
                >
                  <Box textAlign="center">
                    <PlaylistAddCheckIcon color="secondary" sx={{ fontSize: 36, mb: 1 }} />
                    <Typography variant="body2" fontWeight="medium">Total Sets</Typography>
                    <Typography variant="h4" color="secondary" fontWeight="bold">
                      {workout.totalSets}
                    </Typography>
                  </Box>

                  <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

                  <Box textAlign="center">
                    <FitnessCenterIcon color="primary" sx={{ fontSize: 36, mb: 1 }} />
                    <Typography variant="body2" fontWeight="medium">Total Exercises</Typography>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {workout.totalExercises}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ padding: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button
                  onClick={() => handleOpenDelete(workout)}
                  startIcon={<DeleteIcon />}
                  color="error"
                  fullWidth
                  variant="outlined"
                  sx={{
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: 'error.light',
                      color: 'error.contrastText',
                    },
                  }}
                >
                  Delete Workout
                </Button>
              </CardActions>
            </Card> */}
            <WorkoutCard workout={workout} handleDelete={handleOpenDelete} handleNavigation={handleNavigation} />
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
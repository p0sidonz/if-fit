'use client'
import React, { useState } from 'react';
import { useGetWorkouts, useDeleteWorkout, useCreateWorkout, useUpdateWorkout } from './hooks/useWorkout';
import {
  List, ListItem, ListItemText, Button, Typography, Box, Link
  , Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Card, CardContent, CardActions, Tooltip,
  Hidden, Divider, IconButton, Avatar, InputAdornment, Alert
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
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editWorkout, setEditWorkout] = useState({ title: '', description: '' });
  const { mutateAsync: updateWorkout, isLoading: updateWorkoutLoading } = useUpdateWorkout();

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

  const handleEditWorkout = (workout) => {
    setEditWorkout({
      id: workout.id,
      title: workout.title,
      description: workout.description
    });
    setOpenEditDialog(true);
  };

  const handleUpdateWorkout = async () => {
    try {
      await updateWorkout({
        workout_id: editWorkout.id,
        title: editWorkout.title,
        description: editWorkout.description,
      });
      setOpenEditDialog(false);
    } catch (error) {
      console.error('Error updating workout:', error);
      setOpenEditDialog(false);
    }
  };

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

      {/* Add alert when no workouts exist */}
      {filteredWorkouts.length === 0 && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="info">
            No workouts created yet. Click the "Add New Workout" button to create one.
          </Alert>
        </Box>
      )}

      <Grid container spacing={3}>
        {filteredWorkouts?.map((workout) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={workout.id}>

            <WorkoutCard workout={workout} handleDelete={handleOpenDelete} handleNavigation={handleNavigation} handleEdit={handleEditWorkout} />
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

      {/* Add Edit Workout Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Workout</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={editWorkout.title}
            onChange={(e) => setEditWorkout({ ...editWorkout, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={editWorkout.description}
            onChange={(e) => setEditWorkout({ ...editWorkout, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button disabled={updateWorkoutLoading} onClick={() => setOpenEditDialog(false)}>
            Cancel
          </Button>
          <LoadingButton 
            loading={updateWorkoutLoading} 
            onClick={handleUpdateWorkout}
            variant="contained"
          >
            Update
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Hidden smUp>
        <FloatBarAction name="Workout" handleClick={handleNewWorkout} />
      </Hidden>

    </>

  );
};






export default WorkoutsList;
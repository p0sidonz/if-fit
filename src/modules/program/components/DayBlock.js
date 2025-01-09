import React, { useState } from 'react';
import {
  Box, IconButton,
  Chip,
  Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  Tooltip


} from '@mui/material';
import BottomSlider from '../workout/BottomSlider';
import CloseIcon from '@mui/icons-material/Cancel';
import JustWorkout from '../workout/JustWorkout';

const DayBlock = ({ day, onUpdate, index, weekNumber, workouts }) => {

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [jusWorkoutSlider, setJustWorkoutSlider] = useState(false);
  const [sliderOpen, setSliderOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const openSlider = () => setSliderOpen(true);
  const closeSlider = () => setSliderOpen(false);


  const handleSetRestDay = () => {
    onUpdate({ workout_id: null, rest_day: true, });
    closeSlider();
  };

  const handleOpenWorkoutDialog = () => {
    setOpen(true);
  };

  const handleCloseWorkoutDialog = () => {
    setOpen(false);
  };

  const handleAddWorkout = (workout_id) => {
    console.log('workout_id', workout_id);
    onUpdate({ workout_id, rest_day: false });
    closeSlider();
  };

  const handleShowOnlyWorkout = (day) => {
    console.log('day', day);
    setSelectedWorkout(day);
    setJustWorkoutSlider(true)
  }

  const justWorkoutClose = () => {
    setJustWorkoutSlider(false);
  }

  const WorkoutDay = ({ day, onRemoveWorkout }) => {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography sx={{fontSize: '1rem'}}>
          {day.rest_day ? (
            <Chip label="Rest Day" color="secondary" />
          ) : day.workout_id ? (
            <Box display="flex" alignItems="center">
              <Chip
                onClick={() => { handleShowOnlyWorkout(day) }}
                deleteIcon={
                  <Tooltip title={`Remove Workout from day ${index}`}>
                    <CloseIcon />
                  </Tooltip>
                }
                onDelete={onRemoveWorkout} label={`${day.Workout.title}`} color="primary" />

            </Box>
          ) : (
            'No Workout'
          )}
        </Typography>
      </Box>
    );
  };


  return (
    <Card>
      <CardContent style={{ position: 'relative', overflow: 'hidden' }}>
        {/* {day.isRestDay || day.workout_id ? (<IconButton size='small' color='error' sx={{ position: 'absolute', right: -7, top: -5 }} onClick={() => onRemoveWorkout(day.workout_id)} aria-label="remove">
          <CancelIcon />
        </IconButton>) : null} */}
        <WorkoutDay
          day={day}
          onRemoveWorkout={handleSetRestDay}
        />
        {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <Button variant="text" color="primary" size="small" onClick={handleSetRestDay}>Set Rest Day</Button>
          <Button variant="text" color="secondary" size="small" onClick={openSlider}>Add Workout</Button>
        </div> */}
        <div style={{ justifyContent: 'space-between', marginTop: '16px' }}>
          <Button color='secondary' variant="text" size="small" onClick={handleSetRestDay}>Set Rest Day</Button>
          <Button
            color="primary"
            variant="text"
            size="small"
            onClick={openSlider}
          >
            {day.workout_id ? 'Change Workout' : 'Add Workout'}
          </Button>        </div>

        <div style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          fontSize: '2.5rem',
          lineHeight: 1,
          color: 'rgba(0, 0, 0, 0.1)',
          pointerEvents: 'none',
        }}>
          {index}
        </div>
      </CardContent>
      <BottomSlider
        open={sliderOpen}
        onClose={closeSlider}
        workouts={workouts}
        onAddWorkout={handleAddWorkout}
      />

      <Dialog 
        open={jusWorkoutSlider} 
        onClose={justWorkoutClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '80vh',
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          py: 2
        }}>
          Workout Detail
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <JustWorkout workout={selectedWorkout?.Workout} />
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            fullWidth 
            onClick={justWorkoutClose} 
            color="primary"
            variant="contained"
            size="large"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </Card>
  );
};

export default DayBlock;
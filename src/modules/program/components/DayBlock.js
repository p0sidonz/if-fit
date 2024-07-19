import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions

} from '@mui/material';
import BottomSlider from '../workout/BottomSlider';
const DayBlock = ({ day, onUpdate, index, weekNumber, workouts }) => {

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [sliderOpen, setSliderOpen] = useState(false);

  const openSlider = () => setSliderOpen(true);
  const closeSlider = () => setSliderOpen(false);


  const handleSetRestDay = () => {
    onUpdate({ rest_day: true, workout_id: null });
  };

  const handleOpenWorkoutDialog = () => {
    setOpen(true);
  };

  const handleCloseWorkoutDialog = () => {
    setOpen(false);
  };

  const handleAddWorkout = (workout_id) => {
    console.log('workout_id', workout_id);
    onUpdate(workout_id)
    handleCloseWorkoutDialog();
  };

  return (
    <Card>
      <CardContent style={{ position: 'relative', overflow: 'hidden' }}>
        {JSON.stringify(day)}
        <Typography variant="h6">
          {day.rest_day ? 'Rest Day' : day.workout_id ? `Workout: ${day.workout_id}` : 'No Workout'}
        </Typography>
        {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <Button variant="text" color="primary" size="small" onClick={handleSetRestDay}>Set Rest Day</Button>
          <Button variant="text" color="secondary" size="small" onClick={openSlider}>Add Workout</Button>
        </div> */}
        <div style={{ justifyContent: 'space-between', marginTop: '16px' }}>
          <Button variant="text" color="primary" size="small" onClick={handleSetRestDay}>Set Rest Day</Button>
          <Button variant="text" color="secondary" size="small" onClick={openSlider}>Add Workout</Button>
        </div>

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
    </Card>
  );
};

export default DayBlock;
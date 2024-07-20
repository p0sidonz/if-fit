import React, { useState, useEffect } from 'react';
import { SwipeableDrawer, Button, Box } from '@mui/material';
import WorkoutList from './WorkoutList';
import WorkoutDetail from './WorkoutDetail';
import PerfectScrollbar from 'react-perfect-scrollbar';

const BottomSlider = ({ open, onClose, workouts, onAddWorkout }) => {
  const [selectedWorkout, setSelectedWorkout] = useState(null);


  useEffect(() => {
    if (!open) {
      setSelectedWorkout(null);
    }
  }, [open]);


  return (
    <SwipeableDrawer
      PaperProps={{ sx: { maxHeight: "70%" } }}
      anchor="bottom"
      open={open}
      onClose={onClose}
    >
        <WorkoutList workouts={workouts} onSelect={setSelectedWorkout} onAddWorkout={onAddWorkout} />
    </SwipeableDrawer>
  );
};

export default BottomSlider;
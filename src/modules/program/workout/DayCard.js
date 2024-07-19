import React, { useState } from 'react';
import { CardContent, Typography, Button, Card } from '@mui/material';
import BottomSlider from './BottomSlider';

const DayCard = ({ day, index, handleSetRestDay, workouts, onAddWorkout }) => {
  const [sliderOpen, setSliderOpen] = useState(false);

  const openSlider = () => setSliderOpen(true);
  const closeSlider = () => setSliderOpen(false);

  return (
    <Card>
      <CardContent style={{ position: 'relative', overflow: 'hidden' }}>
        <Typography variant="h6">
          {day.rest_day ? 'Rest Day' : day.workout_id ? `Workout: ${day.Workout.title}` : 'No Workout'}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <Button variant="text" color="primary" size="small" onClick={handleSetRestDay}>Set Rest Day</Button>
          <Button variant="text" color="secondary" size="small" onClick={openSlider}>Add Workout</Button>
          {day.workout_id && (
            <Button variant="text" color="error" size="small" >
              Remove Workout
            </Button>
          )}
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
        onAddWorkout={onAddWorkout}
      />
    </Card>
  );
};

export default DayCard;
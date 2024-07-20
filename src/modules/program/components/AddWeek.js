import React, { useState } from 'react';
import { Button, TextField, Grid } from '@mui/material';
import DayBlock from './DayBlock';

const AddWeek = ({ programId, onAddWeek }) => {
  const [notes, setNotes] = useState('');
  const [days, setDays] = useState(Array(7).fill({ rest_day: false, workout_id: null }));

  const handleAddWeek = () => {
    onAddWeek({ program_id: programId, notes, days });
  };

  const updateDay = (index, data) => {
    const newDays = [...days];
    newDays[index] = data;
    setDays(newDays);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Week Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </Grid>
      {days.map((day, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <DayBlock day={day} onUpdate={(data)=> console.log(data)} />
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button variant="contained" onClick={handleAddWeek}>
          Add Week
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddWeek;
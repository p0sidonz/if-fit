import React, { useState, useEffect } from 'react';
import { Drawer, Button, Box } from '@mui/material';
import WorkoutList from './WorkoutList';
import WorkoutDetail from './WorkoutDetail';
import PerfectScrollbar from 'react-perfect-scrollbar';

const ScrollWrapper = ({ children, hidden }) => {
  if (hidden) {
    return <Box sx={{ height: "100%", overflow: "auto" }}>{children}</Box>;
  } else {
    return (
      <Box sx={{ height: "100%", overflow: "auto" }}>
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          {children}
        </PerfectScrollbar>
      </Box>
    );
  }
};

const BottomSlider = ({ open, onClose, workouts, onAddWorkout }) => {
  const [selectedWorkout, setSelectedWorkout] = useState(null);


  useEffect(() => {
    if (!open) {
      setSelectedWorkout(null);
    }
  }, [open]);


  return (
    <Drawer
      PaperProps={{
        sx: {
          height: 'calc(100% - 64px)',
          top: 500,
        },
      }}
      
      anchor="bottom"
      open={open}
      onClose={onClose}
    >
      <div style={{ padding: '16px', minWidth: '500px', }}>
        {JSON.stringify(selectedWorkout)}
          <WorkoutList workouts={workouts} onSelect={setSelectedWorkout} onAddWorkout={onAddWorkout} />
          {/* {selectedWorkout && (<WorkoutDetail workout={selectedWorkout} />
          )} */}
          {/* {selectedWorkout && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => onAddWorkout(selectedWorkout.id)}
            >
              Add to Day
            </Button>
          )} */}

      </div>
    </Drawer>
  );
};

export default BottomSlider;
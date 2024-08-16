import React from 'react';
import { Dialog, DialogContent } from '@mui/material';
import JustWorkout from './../program/workout/JustWorkout';

const ShowWorkout = ({ workout_id, open, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth='md'
        >

            <DialogContent>
                <JustWorkout workout={{ id: workout_id }} />
            </DialogContent>
        </Dialog>
    );
}

export default ShowWorkout;
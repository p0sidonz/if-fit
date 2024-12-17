import React, { useState, forwardRef } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
    TextField,
    Alert,
    Select,
    MenuItem,
} from '@mui/material';
import DatePicker from "react-datepicker";
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import { useAddProgramToCalendar } from 'src/modules/program/hooks/useProgram';

const AddProgramToCalendar = ({ open, onClose, data, programId }) => {
    console.log('programId', data);
    const addProgramToCalendar = useAddProgramToCalendar();

    const PickersComponent = forwardRef(({ ...props }, ref) => (
        <TextField

            inputRef={ref}
            fullWidth
            {...props}
            label={props.label || ''}
            sx={{ width: '100%', mt: 5, }}
            error={props.error}
        />
    ))



    const [startDate, setStartDate] = useState(new Date());
    const [workoutDuration, setWorkoutDuration] = useState(2);


    const handleAddProgram = () => {
        addProgramToCalendar.mutate({ program_id: programId, start_date: startDate, duration: parseInt(workoutDuration) }, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return (
        <>
            <Dialog sx={{
                '& .MuiDialog-paper': {
                    overflowY: 'inherit'
                }
            }} open={open} onClose={onClose} fullWidth>
                <DialogTitle>
                    Add Program to Calendar
                </DialogTitle>
                <DialogContent   >
                    <DatePickerWrapper>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>

                            <div style={{ flex: 1 }}>
                                <DatePicker
                                    selectsStart
                                    id='event-start-date'
                                    selected={startDate}
                                    startDate={startDate}
                                    showDateSelect={false}
                                    showTimeSelect
                                    dateFormat={'yyyy-MM-dd hh:mm'}
                                    customInput={<PickersComponent label='Select the date you want to start the program' registername='startDate' />}
                                    onChange={date => setStartDate(new Date(date))}
                                />
                            </div>
                            <div style={{ flex: '0 1 200px' }}>
                                <TextField
                                    type="number"
                                    value={workoutDuration}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value >= 0) {
                                            setWorkoutDuration(value);
                                        }
                                    }}
                                    sx={{ mt: '20px' }}
                                    label="For how many hours?"
                                    fullWidth
                                />


                            </div>
                        </div>
                    </DatePickerWrapper>
                    <Alert severity="info" sx={{ mt: 2 }}>
                        The program will be added to your calendar starting from the selected date. (This action cannot be undone)
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddProgram} color="primary">
                        Add Program
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );

}

export default AddProgramToCalendar;
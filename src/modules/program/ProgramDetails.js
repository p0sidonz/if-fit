import React, { useState, useEffect } from 'react';
import { useGetProgram, useAddNewWeek, useAddWorkoutToProgramDay } from './hooks/useProgram';
import DayBlock from './components/DayBlock';

import {
    Container,
    Typography,
    Button,
    Box,
    Card,
    CardContent,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Tooltip

} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingButton from '@mui/lab/LoadingButton';
import { useGetWorkouts } from '../workout/hooks/useWorkout';

import AddWeek from './components/AddWeek';

const ProgramDetails = ({ param }) => {
    const { data: workoutsList, status } = useGetWorkouts();
    const addWorkoutToProgramDay = useAddWorkoutToProgramDay();
    let programId = param;
    const { data: program, refetch: refetchProgram } = useGetProgram(programId);
    const addWeek = useAddNewWeek();
    // const [program, setProgram] = useState(null);
    const [openAddWeek, setOpenAddWeek] = useState(false);
    useEffect(() => {
        fetchProgram();
    }, [programId]);

    const fetchProgram = async () => {
        try {
            refetchProgram();
        } catch (error) {
            console.error('Error fetching program:', error);
        }
    };


    const handleAddWeek = async () => {
        addWeek.mutate(programId);
        // try {
        //     // Simulate API call to add week
        //     const response = await fetch(`/api/programs/${programId}/weeks`, {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(weekData),
        //     });
        //     const newWeek = await response.json();

        //     setProgram(prevProgram => ({
        //         ...prevProgram,
        //         Program_Week: [...prevProgram?.Program_Week, newWeek]
        //     }));

        //     setOpenAddWeek(false);
        // } catch (error) {
        //     console.error('Error adding week:', error);
        // }
    };

    const onUpdateDay = (params) => {
        addWorkoutToProgramDay.mutate(params);
    }




    return (
        <Container maxWidth="lg">
            <Box my={4}>
                <Card variant="elevation" >
                    <CardContent>
                        <Grid container direction="column" alignItems="center">
                            <Grid item xs={12}>
                                <Typography color={"primary"} variant="h4" gutterBottom align="center">
                                    {program?.title || "default"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body1" paragraph align="center">
                                    {program?.description || "default"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} container justifyContent="flex-end">
                                <Tooltip title="Click to add a new week to this program">
                                    <LoadingButton
                                        loading={addWeek.status === "pending"}
                                        variant="contained"
                                        color="primary"
                                        onClick={handleAddWeek}
                                    >
                                        Add Week
                                    </LoadingButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                <Box mt={4}>
                    <Grid container spacing={4}>
                        {program?.Program_Week?.map((week, weekIndex) => (
                            <Grid item xs={12} key={week.id}>
                                <Card elevation={3}>
                                    <CardContent>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                            <Typography variant="h5" component="h2">
                                                Week {weekIndex + 1}
                                            </Typography>
                                            <Box>
                                                <IconButton onClick={() => onEditWeek(week.id)} size="small">
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={() => onDeleteWeek(week.id)} size="small">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" color="textSecondary" paragraph>
                                            {week.notes}
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {week.Program_Days.map((day, dayIndex) => {
                                                const cumulativeDayIndex = weekIndex * 7 + dayIndex + 1;
                                                return (
                                                    <Grid item xs={12} sm={6} md={4} lg={1.7} key={dayIndex}>
                                                        <DayBlock
                                                            workouts={workoutsList}
                                                            day={day}
                                                            onUpdate={(workout_id, rest_day) => onUpdateDay({
                                                                week_id: week.id,
                                                                day_id: day.id,
                                                                workout_id,
                                                                rest_day
                                                            })}
                                                            index={cumulativeDayIndex}
                                                            weekNumber={weekIndex + 1}
                                                        />
                                                    </Grid>
                                                );
                                            })}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>

            <Dialog open={openAddWeek} onClose={() => setOpenAddWeek(false)} maxWidth="md" fullWidth>
                <DialogTitle>Add New Week</DialogTitle>
                <DialogContent>
                    <AddWeek programId={programId} onAddWeek={handleAddWeek} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddWeek(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};




export default ProgramDetails;
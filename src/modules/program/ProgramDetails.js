import React, { useState, useEffect } from 'react';
import { useGetProgram, useAddNewWeek, useAddWorkoutToProgramDay, useUpdateWeek, useDeleteWeek } from './hooks/useProgram';
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
    Tooltip,
    Hidden

} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingButton from '@mui/lab/LoadingButton';
import { useGetWorkouts } from '../workout/hooks/useWorkout';

import AddWeek from './components/AddWeek';
import { FloatBarAction } from '../components/FloatBarAction';
import EditableText from '../components/EditableText';

const ProgramDetails = ({ param }) => {
    const { data: workoutsList, status } = useGetWorkouts();
    const addWorkoutToProgramDay = useAddWorkoutToProgramDay();
    const onUpdateWeek = useUpdateWeek();
    const onDeleteweek = useDeleteWeek();
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
    };

    const onUpdateDay = (params) => {
        console.log('params', params);
        addWorkoutToProgramDay.mutate(params);
    }

    const handleDeleteWeek = (id) => {
        window.confirm("Are you sure you want to delete this week?")
            ? onDeleteweek.mutate({program_week_id: id})
            : null;
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
                                <Hidden smDown>
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
                                </Hidden>
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
                                                <Tooltip title="Delete this week?">
                                                <IconButton onClick={() => handleDeleteWeek(week.id)} size="small">
                                                    <DeleteIcon color='error' />
                                                </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Box>
                                        <EditableText text={week.notes} onChange={(value) => onUpdateWeek.mutate({ week_id: week.id, notes: value })} /> 
                                        <Grid container spacing={2}>
                                            {week.Program_Days.map((day, dayIndex) => {
                                                const cumulativeDayIndex = weekIndex * 7 + dayIndex + 1;
                                                return (
                                                    <Grid item xs={12} sm={6} md={4} lg={1.7} key={dayIndex}>
                                                        <DayBlock
                                                            workouts={workoutsList}
                                                            day={day}
                                                            onUpdate={({workout_id, rest_day = false}) => onUpdateDay({
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
            <Hidden smUp>
                <FloatBarAction name="Week" handleClick={handleAddWeek} />
            </Hidden>
        </Container>
    );
};




export default ProgramDetails;
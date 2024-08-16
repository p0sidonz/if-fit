import React from 'react';
import { useEffect } from 'react';
import { Box, Card, CardContent, Grid, Typography, Chip, DialogTitle } from '@mui/material';
import { Dialog, DialogActions, Button, DialogContent } from '@mui/material';
import JustWorkout from './workout/JustWorkout';
import { CalendarMonth } from '@mui/icons-material';
import { useGetUserProgram } from './hooks/useProgram';
import AddProgramToCalendar from './AddProgramToCalendar';


const TraineeProgramView = ({ param, relationId }) => {
    let programId = param;
    const [addCalendarOpen, setAddCalendarOpen] = React.useState(false);
    const [jsonProgram, setJsonProgram] = React.useState({});
    const { data: program, refetch: refetchProgram } = useGetUserProgram(programId, relationId);
    console.log('TraineeProgramView', program);
    useEffect(() => {
        fetchProgram();
    }, [programId, relationId]);


    const fetchProgram = async () => {
        try {
            refetchProgram();
        } catch (error) {
            console.error('Error fetching program:', error);
        }
    };

    useEffect(() => {
        if (program) {
            if (program?.shoudsync) {
                setJsonProgram(program)
            } else {
                try {
                    let programJson = JSON.parse(program?.programJson);
                    setJsonProgram(programJson)
                } catch (error) {
                    console.error('Error parsing json:', error)

                }
            }

        }

    }, [program])



    return (
        <Box my={4}>
            <Card variant="elevation">
                <CardContent>
                    <Grid container direction="column" alignItems="center">
                        <Grid item xs={12}>
                            <Typography color="primary" variant="h4" gutterBottom align="center">
                                {program?.programInfo?.title || "Program Title"}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" paragraph align="center">
                                {program?.programInfo?.description || "Program Description"}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={() => setAddCalendarOpen(true)} > <CalendarMonth /> Add to Calendar</Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Box mt={4}>
                <Grid container spacing={4}>
                    {program?.programInfo?.Program_Week?.map((week, weekIndex) => (
                        <Grid item xs={12} key={week.id}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant="h5" component="h2" gutterBottom>
                                        Week {weekIndex + 1}
                                    </Typography>
                                    <Typography variant="body2" paragraph>
                                        {week.notes}
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {week.Program_Days.map((day, dayIndex) => {
                                            const cumulativeDayIndex = weekIndex * 7 + dayIndex + 1;
                                            return (
                                                <Grid item xs={12} sm={6} md={4} lg={1.7} key={dayIndex}>
                                                    <TraineeDayBlock
                                                        day={day}
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
            <AddProgramToCalendar programId={program?.id} open={addCalendarOpen} onClose={() => setAddCalendarOpen(false)} />

        </Box>
    );
};

const TraineeDayBlock = ({ day, index, weekNumber }) => {
    const [jusWorkoutSlider, setJustWorkoutSlider] = React.useState(false);
    const [selectedWorkout, setSelectedWorkout] = React.useState(null);




    const handleShowOnlyWorkout = (day) => {
        console.log('day', day);
        setSelectedWorkout(day);
        setJustWorkoutSlider(true)
    }

    const justWorkoutClose = () => {
        setJustWorkoutSlider(false);
    }

    return (
        <Card>
            <CardContent style={{ position: 'relative', overflow: 'hidden', minHeight: '120px' }}>
                <Box display="flex" alignItems="center" justifyContent="center">
                    <Typography variant="h6">
                        {day.rest_day ? (
                            <Chip label="Rest Day" color="secondary" />
                        ) : day.workout_id ? (
                            <Chip onClick={() => { handleShowOnlyWorkout(day) }} label={day.Workout.title} color="primary" />
                        ) : (
                            <Chip label="Rest Day" color="secondary" />
                        )}
                    </Typography>
                </Box>
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    fontSize: '2.5rem',
                    lineHeight: 1,
                    color: 'rgba(0, 0, 0, 0.1)',
                    pointerEvents: 'none',
                }}>
                    Day {index}
                </div>
            </CardContent>


            <Dialog open={jusWorkoutSlider} onClose={justWorkoutClose}>
                <DialogTitle>Workout Detail</DialogTitle>
                <DialogContent>
                    <JustWorkout workout={selectedWorkout?.Workout} />
                </DialogContent>
                <DialogActions>
                    <Button fullWidth onClick={justWorkoutClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default TraineeProgramView;
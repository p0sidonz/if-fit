import { Card, Typography, Container, Box, Divider } from "@mui/material";
import { useGetWorkout } from "../.././workout/hooks/useWorkout";
import WorkoutDetail from "./WorkoutDetail";

const JustWorkout = ({ workout }) => {
    const { data, isLoading } = useGetWorkout(workout.id);

    if (isLoading) return <div>Loading...</div>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography 
                        color="primary" 
                        variant="h4" 
                        sx={{ 
                            mb: 2,
                            fontWeight: 'bold'
                        }}
                    >
                        {data.title}
                    </Typography>

                    <Typography 
                        variant="subtitle1" 
                        color="text.secondary"
                        sx={{ mb: 2 }}
                    >
                        {data.description}
                    </Typography>
                    <Divider />
                </Box>

                <Box>
                    {data.Workout_Exercise.map((exercise, index) => (
                        <WorkoutDetail key={index} exercise={exercise} />
                    ))}
                </Box>
        </Container>
    );
}

export default JustWorkout;
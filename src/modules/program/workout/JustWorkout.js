import { CardContent, Card, Typography } from "@mui/material";
import { useGetWorkout } from "../.././workout/hooks/useWorkout";
import WorkoutDetail from "./WorkoutDetail";

const JustWorkout = ({ workout, workout_id }) => {
    const { data, isLoading } = useGetWorkout(workout.id);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <div >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography color={'primary'} variant="h4">{data.title}</Typography>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="subtitle2">{data.description}</Typography>
                </div>


            </div>

            <div >
                {data.Workout_Exercise.map((exercise, index) => (
                    <WorkoutDetail key={index} exercise={exercise} />
                ))}

            </div>








        </div>
    );
}

export default JustWorkout;
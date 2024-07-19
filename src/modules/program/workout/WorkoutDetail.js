import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, List, ListItem, Grid, Alert, Divider, 
  TextField, InputAdornment
 } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ViewWorkoutSets = ({ weight, reps, rest, tempo, typesOfSet }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          disabled
          label="Weight"
          value={typesOfSet?.weight === 'bodyweight' ? 'Bodyweight' : weight}
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography color={"primary"}>
                  {typesOfSet?.weight === 'bodyweight' ? '' : typesOfSet?.weight}
                </Typography>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          disabled
          label="Reps"
          value={reps}
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography color={"primary"}>
                  {typesOfSet?.reps}
                </Typography>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          disabled
          label="Rest"
          value={rest}
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography color={"primary"}>
                  {typesOfSet?.rest}
                </Typography>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          disabled
          label="Tempo"
          value={tempo}
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Typography color={"primary"}>
                  {typesOfSet?.tempo}
                </Typography>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Grid>
  );
};



const WorkoutDetail = ({ exercise }) => {
  const [expanded, setExpanded] = React.useState(false);
  if(!exercise) return null;
  return (
    <Accordion onChange={()=>{setExpanded(!expanded)}} expanded={expanded} key={exercise.id} sx={{ mb: 4, borderRadius: 1, minHeight: '50%', }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography gutterBottom sx={{ fontWeight: 'bold' }} color={"primary"} variant='h5'>
          {exercise.Exercise.name}
        </Typography>
        {/* <ViewExerciseInDetail exercise={exercise.Exercise} /> */}
      </AccordionSummary>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
        <Typography
          color={exercise.note ? 'textPrimary' : 'textSecondary'}
          variant="subtitle2"
          sx={{
            widows: '90%',
            mx: 4,
            py: 4,
            padding: '10px',
            borderRadius: '6px',
          }}
        >
          {exercise.note || 'No note available'}
        </Typography>
      </Box>

      <AccordionDetails>
        <Typography variant="h6">Sets </Typography>
        <List>
          <Grid sx={{ px: 4 }} container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <Typography>Weight: {exercise?.typesOfSet?.weight}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography>Reps: {exercise?.typesOfSet?.reps}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography>Rest: {exercise?.typesOfSet?.rest}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography>Tempo: {exercise?.typesOfSet?.tempo}</Typography>
            </Grid>
          </Grid>

          {
            exercise.Workout_Set.length > 0 ? (
              exercise.Workout_Set.map((set) => (
                <ListItem key={set.id}>
                  <ViewWorkoutSets
                    weight={set.weight}
                    reps={set.reps}
                    tempo={set.tempo}
                    rest={set.rest}
                    id={set.id}
                    typesOfSet={exercise.typesOfSet}
                    exerciseId={exercise.id}
                  />
                </ListItem>
              ))
            ) : (
              <Grid container justifyContent="center">
                <Grid item xs={12} sx={{ mt: 3, px: 4 }}>
                  <Alert severity="info" style={{ width: '100%' }}>
                    No sets added yet.
                  </Alert>
                </Grid>
              </Grid>
            )
          }

          <Divider sx={{ margin: 6 }} />
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default WorkoutDetail;
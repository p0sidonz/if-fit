import React from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails, Typography, Box, List, ListItem, Grid, Alert, Divider,
  TextField, InputAdornment
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ViewWorkoutSets = ({ weight, reps, rest, tempo, typesOfSet }) => {
  return (
    <Grid container spacing={3} sx={{ p: 1 }}>
      <Grid item xs={3} sm={3} md={3} lg={3}>
        <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1, bgcolor: 'background.paper' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Weight
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 0.5 }}>
            {typesOfSet?.weight === 'bodyweight' ? 'BW' : weight}
            {typesOfSet?.weight !== 'bodyweight' && (
              <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                {typesOfSet?.weight}
              </Typography>
            )}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={3} sm={3} md={3} lg={3}>
        <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1, bgcolor: 'background.paper' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Reps
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 0.5 }}>
            {reps}
            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              {typesOfSet?.reps}
            </Typography>
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={3} sm={3} md={3} lg={3}>
        <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1, bgcolor: 'background.paper' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Rest
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 0.5 }}>
            {rest}
            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              {typesOfSet?.rest}
            </Typography>
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={3} sm={3} md={3} lg={3}>
        <Box sx={{ textAlign: 'center', p: 1, borderRadius: 1, bgcolor: 'background.paper' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Tempo
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 0.5 }}>
            {tempo}
            <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              {typesOfSet?.tempo}
            </Typography>
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};


const WorkoutDetail = ({ exercise }) => {
  const [expanded, setExpanded] = React.useState(false);
  if (!exercise) return null;
  return (
    <Accordion
      onChange={() => { setExpanded(!expanded); }}
      expanded={expanded}
      key={exercise.id}
      sx={{ mb: 4, borderRadius: 1, minHeight: '50%' }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography gutterBottom sx={{ fontWeight: 'bold' }} color={"primary"} variant="h5">
          {exercise.Exercise.name}
        </Typography>
      </AccordionSummary>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
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
          {exercise.note || ''}
        </Typography>
      </Box>

      <AccordionDetails>
        <Typography variant="h6">Sets</Typography>
        <List>

          {exercise.Workout_Set.length > 0 ? (
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
          )}

          <Divider sx={{ margin: 6 }} />
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default WorkoutDetail;
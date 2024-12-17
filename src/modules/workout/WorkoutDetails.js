import React, { useState, useCallback, useEffect } from 'react';
import { useUpdateWorkoutNew,useSearchExercises, useGetWorkout, useAddExerciseToWorkout, useDeleteExerciseFromWorkout, useAddSet, useDeleteSet, useUpdateWorkout, useUpdateExcercise } from './hooks/useWorkout';
import {
  FormControl, InputLabel, Select, MenuItem,
  Grid, Card, CardContent,
  IconButton, InputAdornment, List, ListItem, ListItemText, Button, TextField, Typography, Box, Accordion, AccordionSummary, AccordionDetails, Dialog,
  DialogTitle, DialogContent, DialogActions,
  Divider, Alert
} from '@mui/material';
import Model from 'react-body-highlighter';
import {checkMuscleGroup} from '../../utils/utils';
import { LoadingButton } from '@mui/lab';
import debounce from 'lodash/debounce';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ArrowLeft } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import { width } from '@mui/system';
import ExerciseDetail from './ExerciseDetail';

const muscleMapping = {
  "abdominals": "abs",
  "hamstrings": "hamstring",
  "calves": "calves",
  "shoulders": ["back-deltoids", "front-deltoids"], // Assuming shoulders can be mapped to both
  "shoulders": "back-deltoids",
  "adductors": "adductor",
  "glutes": "gluteal",
  "quadriceps": "quadriceps",
  "biceps": "biceps",
  "forearms": "forearm",
  "abductors": "abductors",
  "triceps": "triceps",
  "chest": "chest",
  "lower back": "lower-back",
  "traps": "trapezius",
  "middle back": "upper-back",
  "lats": "upper-back", // Assuming lats can be part of upper back
  "neck": "neck"
};


// const muscleMapping = {
//   /* Back */
//   traps: 'trapezius',
//   'upper-back': 'middle back',
//   'lower-back': 'lower back',

//   /* Chest */
//   chest: 'chest',

//   /* Arms */
//   biceps: 'biceps',
//   triceps: 'triceps',
//   forearm: 'forearms',
//   'back-deltoids': 'shoulders',
//   'front-deltoids': 'shoulders',

//   /* Abs */
//   abs: 'abdominals',
//   obliques: 'abdominals',

//   /* Legs */
//   adductor: 'adductors',
//   hamstrings: 'hamstring',
//   quadriceps: 'quadriceps',
//   abductors: 'abductors',
//   calves: 'calves',
//   gluteal: 'glutes',

//   /* Head */
//   head: 'head',
//   neck: 'neck'
// };

const mapMuscles = (muscleNames) => {
  return muscleNames?.map((muscle) => muscleMapping[muscle] || muscle);
};



const InputPropsForType = {
  weight: {
    kg: 'KG',
    lbs: 'LBS'
  },
  reps: {
    range: 'Range',
    rpe: 'RPE',
    rm: '1RM%',
    time: 'Time',
    many: 'AMRAP'
  },
  rest: {
    ready: 'When Ready',
    seconds: 'S',
    minute: 'M'
  },
  tempo: {
    epcp: 'EPCP',
    normal: 'Normal',
    fast: 'Fast'
  }



}

const WorkoutSets = ({ weight, reps, tempo, rest, id, typesOfSet, excerciseId, updateWorkout }) => {
  const addSetMutation = useAddSet();
  const deleteSetMutation = useDeleteSet();

  const [localSet, setLocalSet] = useState({
    weight: String(weight || ''),
    reps: String(reps || ''),
    tempo: String(tempo || ''),
    rest: String(rest || '')
  });
  const [hasChanges, setHasChanges] = useState(false);

  const handleEditSet = (e) => {
    const { name, value } = e.target;
    setLocalSet((old) => ({
      ...old,
      [name]: String(value)
    }));
  };

  useEffect(() => {
    setHasChanges(
      localSet.weight !== String(weight) ||
      localSet.reps !== String(reps) ||
      localSet.tempo !== String(tempo) ||
      localSet.rest !== String(rest)
    );
  }, [localSet, weight, reps, tempo, rest]);

  const handleCopySet = () => {
    addSetMutation.mutate({
      workout_exercise_id: excerciseId,
      weight: localSet.weight,
      reps: localSet.reps,
      tempo: localSet.tempo,
      rest: localSet.rest
    });
  }

  const handleDeleteSet = (workout_set_id) => {
    console.log(workout_set_id);
    if (window.confirm('Are you sure you want to delete this set?')) {
      deleteSetMutation.mutate({ workout_id: id, workout_set_id });
    }
  };



  return (



    <Grid container spacing={2}>

      {id && <>

        <Grid item xs={12} sm={6} md={2}>
          <TextField
            disabled={typesOfSet.weight === 'bodyweight'}
            defaultValue={typesOfSet.weight === 'bodyweight' && 'Bodyweight'}
            name="weight"
            label="Weight"
            value={typesOfSet.weight === 'bodyweight' ? 'Bodyweight' : localSet.weight}
            onChange={handleEditSet}
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography color={"primary"}>{InputPropsForType["weight"][typesOfSet.weight]}</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            type={typesOfSet.reps === 'range' ? 'text' : 'number'}
            name='reps'
            label="Reps"
            value={localSet.reps}
            onChange={handleEditSet}
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography color={"primary"}> {InputPropsForType["reps"][typesOfSet.reps]}</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            type='number'
            name='rest'
            label="Rest"
            value={localSet.rest}
            onChange={handleEditSet}
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography color={"primary"}>  {InputPropsForType["rest"][typesOfSet.rest]}</Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            type='number'
            name='tempo'
            label="Tempo"
            value={localSet.tempo}
            onChange={handleEditSet}
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography color={"primary"}>    {InputPropsForType["tempo"][typesOfSet.tempo]} </Typography>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={2} >
          <Button disabled={!hasChanges} 
            onClick={() => updateWorkout({
              workout_set_id: id,
              ...localSet
            })}
            type="submit" variant="contained" fullWidth>
            Update Set
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={1}>
          <LoadingButton 
            loading={addSetMutation.status === "pending"} 
            color="primary" 
            variant='outlined' 
            onClick={handleCopySet}
            fullWidth
          >
            Copy
          </LoadingButton>
        </Grid>
        <Grid item xs={12} sm={12} md={1}>
          <LoadingButton 
            loading={deleteSetMutation.status === "pending"} 
            variant='outlined' 
            onClick={() => handleDeleteSet(id)} 
            color="error"
            fullWidth
          >
            Delete
          </LoadingButton>
        </Grid> </>

      }

    </Grid>

  );
};


const WorkoutDetail = (props) => {
  const id = props.param
  const { data: workout, isLoading, error } = useGetWorkout(id);
  const [searchQuery, setSearchQuery] = useState("");
  const addExerciseMutation = useAddExerciseToWorkout();
  const updateWorkoutMutation = useUpdateWorkout();
  const updateExerciseMutation = useUpdateExcercise();
  const deleteExerciseMutation = useDeleteExerciseFromWorkout();
  const addSetMutation = useAddSet();
  const [newExercise, setNewExercise] = useState('');
  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const updateWorkoutNew = useUpdateWorkoutNew();

  const { data: searchResults, refetch: refetchExcercises, isFetched: isExcerceriseFetched, isLoading: excerciseSearchLoading } = useSearchExercises(searchQuery || '');


  const handleAddExercise = () => {
    addExerciseMutation.mutate({ workout_id: id, exercise_id: newExercise });
    setNewExercise('');
  };



  const debouncse = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const query = args[0]; // Assuming query is the first argument
        if (query.trim()) {
          func(query);
        }
      }, wait);
    };
  };

  const debouncedFetchExercises = useCallback(
    debouncse((value) => {
      setSearchQuery(value);
      refetchExcercises(value);
    }, 1000),
    []
  );

  const handleSearch = (value) => {
    debouncedFetchExercises(value);
  };


  const handleDeleteExercise = (workout_exercise_id) => {
    if (window.confirm('Are you sure you want to remove this exercise?')) {
      deleteExerciseMutation.mutate({ workout_id: id, workout_exercise_id });
    }
  };








  if (isLoading) return <Typography>Loading...</Typography>
  if (error) return <Typography>An error occurred: {error.message}</Typography>


  const WorkoutExercises = ({ exercise }) => {
    const [newSet, setNewSet] = useState({ weight: '', reps: '', rest: '', tempo: '' });
    const [isExpanded, setIsExpanded] = useState(true);
    const handleAddSet = (workout_exercise_id) => {
      addSetMutation.mutate({ ...newSet, workout_id: id, workout_exercise_id });
      setNewSet({ weight: '', reps: '', rest: '', tempo: '' });
    };


    const [typesOfSet, setTypesOfSet] = useState({
      weight: '',
      reps: '',
      rest: '',
      tempo: ''
    });

    useEffect(() => {
      console.log('Exercise:', exercise);
      setTypesOfSet({
        weight: exercise.weight || '',
        reps: exercise.reps || '',
        rest: exercise.rest || '',
        tempo: exercise.tempo || ''
      });
    }, [exercise]);

    // Handle changes in typesOfSet
    const handleChangeTypesOfSet = (e) => {
      const { name, value } = e.target;

      // Optimistically update the local state first
      setTypesOfSet(prevTypesOfSet => ({
        ...prevTypesOfSet,
        [name]: value
      }));

      // Debounce the API call to prevent rapid consecutive updates
      const debouncedUpdate = debounce(() => {
        updateWorkoutNew.mutate({
          [name]: value,
          excercise_id: exercise.id
        }, {
          // Add optimistic update configuration
          onError: () => {
            // Revert to previous state if the update fails
            setTypesOfSet(prevTypesOfSet => ({
              ...prevTypesOfSet,
              [name]: exercise[name] || ''
            }));
          }
        });
      }, 500);

      debouncedUpdate();
    };

    // Memoize the select components to prevent unnecessary re-renders
    const SelectComponents = React.useMemo(() => (
      <Grid sx={{ px: 4 }} container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              onChange={handleChangeTypesOfSet}
              id='weight'
              name='weight'
              label="Type"
              value={typesOfSet.weight}
            >
              <MenuItem value="kg">Weight - kg</MenuItem>
              <MenuItem value="lbs">Weight - lbs</MenuItem>
              <MenuItem value="bodyweight">Bodyweight</MenuItem>


            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>

          <FormControl fullWidth size="small">
            <InputLabel>Reps</InputLabel>
            <Select
              onChange={handleChangeTypesOfSet}
              id='reps'
              name='reps'
              label="Type"
              value={typesOfSet.reps}
            >
              <MenuItem value="range">Range</MenuItem>
              <MenuItem value="rpe">RPE</MenuItem>
              <MenuItem value="rm">1RM%</MenuItem>
              <MenuItem value="time">Time</MenuItem>


            </Select>
          </FormControl>

        </Grid>
        <Grid item xs={12} sm={6} md={2}>

          <FormControl fullWidth size="small">
            <InputLabel>Rest</InputLabel>
            <Select

              onChange={handleChangeTypesOfSet}
              id='rest'
              name='rest'
              label="Rest"

              value={typesOfSet.rest}
            >
              <MenuItem value="seconds">Seconds</MenuItem>
              <MenuItem value="minute">Minutes</MenuItem>


            </Select>
          </FormControl>

        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Tempo</InputLabel>

            <Select
              onChange={handleChangeTypesOfSet}
              name='tempo'
              id='tempo'
              label="tempo"
              value={typesOfSet.tempo}
            >
              <MenuItem value="epcp">EPCP</MenuItem>
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="fast">Fast</MenuItem>

            </Select>
          </FormControl>
        </Grid>
      </Grid>
    ), [typesOfSet, handleChangeTypesOfSet]);

    // Update workout mutation handler
    const updateWorkout = (data) => {
      updateExerciseMutation.mutate({
        ...data,
        excercise_id: exercise.id
      });
      console.log('Updating workout with data:', data);
    };


    const [note, setNote] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
      setNote(exercise.notes || '');
    }, []);

    const handleNoteChange = (event) => {
      setNote(event.target.value);

    };

    const handleNoteClick = () => {
      setIsEditing(true);
    };

    const handleNoteBlur = () => {
      setIsEditing(false);
      if (exercise.notes === note) return;
      updateWorkoutNew.mutate({
        excercise_id: exercise.id,
        notes: note,
      })
    };

    const ViewExerciseInDetail = ({ exercise }) => {
      const [showExcercise, setShowExcercise] = useState(false);
      return (
        <div>
          <Typography sx={{p: 2}} variant="subtitle" color="primary" onClick={() => setShowExcercise(true)} style={{ cursor: 'pointer' }}> (View in detail)</Typography>
          <Dialog onClose={()=> setShowExcercise(false)} open={showExcercise} style={{ width: '100%', height: '100%' }}>
            <DialogContent style={{ width: '100%', height: '100%' }}>

            <ExerciseDetail exercise={exercise} />
            </DialogContent>
            <DialogActions sx={{justifyContent: 'center', mt: 2}}>
            <Button variant='contained' fullWidth onClick={() => setShowExcercise(false)}>Close</Button>
            </DialogActions>


          </Dialog>
          
        </div>
      );
    }

    return (
      <Accordion
        // onChange={() => setIsExpanded(!isExpanded)}
        expanded={isExpanded}
        key={exercise.id}
        sx={{ mb: 4, borderRadius: 1, width: '100%' }}

      >

        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography gutterBottom sx={{ fontWeight: 'bold' }} color={"primary"} variant='h5'>{exercise.Exercise.name}</Typography>
          <ViewExerciseInDetail exercise={exercise.Exercise} />
        </AccordionSummary>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '50%' }}>
          {isEditing ? (
            <TextField
              sx={{
                overflow: 'hidden', mx: 4,
                py: 4, width: '98%',
              }}
              fullWidth
              multiline
              rows={4}
              value={note}
              onChange={handleNoteChange}
              onBlur={handleNoteBlur}
              autoFocus
            />
          ) : (
            <Typography
              color={note ? 'textPrimary' : 'textSecondary'}
              variant="subtitle2"
              onClick={handleNoteClick}
              sx={{
                widows: '90%',
                mx: 4,
                py: 4,
                padding: '10px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {note || 'Click to add a note'}
            </Typography>
          )}
        </Box>

        <AccordionDetails>
          <Typography variant="h6">Sets </Typography>
          <List>
            {SelectComponents}
            {
              exercise.Workout_Set.length > 0 ? (
                exercise.Workout_Set.map((set) => (
                  <ListItem key={set.id}>
                    <WorkoutSets
                      updateWorkout={updateWorkout}
                      weight={set.weight}
                      reps={set.reps}
                      tempo={set.tempo}
                      rest={set.rest}
                      id={set.id}
                      typesOfSet={typesOfSet}
                      excerciseId={exercise.id}
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
            <Grid sx={{ px: 4 }} container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={2} >
                <TextField
                  type='number'
                  label="Weight"
                  value={newSet.weight}
                  fullWidth
                  onChange={(e) => setNewSet({ ...newSet, weight: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  type='number'
                  label="Reps"
                  value={newSet.reps}
                  fullWidth
                  onChange={(e) => setNewSet({ ...newSet, reps: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Rest"
                  type='number'
                  value={newSet.rest}
                  fullWidth
                  onChange={(e) => setNewSet({ ...newSet, rest: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Tempo"
                  type='number'
                  value={newSet.tempo}
                  fullWidth
                  onChange={(e) => setNewSet({ ...newSet, tempo: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  onClick={(e) => { e.preventDefault(); handleAddSet(exercise.id); }}
                  sx={{ 
                    mb: { xs: 1, md: 0 },
                    height: '36px',  // Fixed height
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }  // Smaller font on mobile
                  }}
                > 
                  Add Set
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  variant="contained"
                  onClick={() => handleDeleteExercise(exercise.id)}
                  color="error"
                  fullWidth
                  sx={{ 
                    height: '36px',  // Fixed height
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }  // Smaller font on mobile
                  }}
                >
                  Remove 
                </Button>
              </Grid>
            </Grid>
          </List> 


        </AccordionDetails>
      </Accordion>)
  }

  return (
    <div>

      <Card sx={{ margin: 'auto', marginTop: 4, boxShadow: 3 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography color={"primary"} variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            {workout?.title}
          </Typography>
          <Typography variant="body1" paragraph >
            {workout?.description}
          </Typography>
          {/* <Typography variant="subtitl2" paragraph >
           Created :  { new Date(workout?.created_at)?.toISOString().split('T')[0]}
          </Typography>
          <Typography variant="subtitl2" paragraph >
           Last Updated :  { new Date(workout?.updated_at)?.toISOString()}
          </Typography> */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
            <Button
              onClick={() => setOpenSearchDialog(true)}
              variant="contained"
            >
              Add Exercise
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ margin: 'auto', mt: 4 }}>



        <List sx={{ mb: 2 }} >


          {workout?.Workout_Exercise?.map((exercise, indx) => (
            <ListItem key={exercise.id} >
              <WorkoutExercises exercise={exercise} />
            </ListItem>
          ))}
        </List>

        <Dialog
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "500px",
                padding: "10px", // Add some padding
                borderRadius: "10px", // Rounded corners
              },
            },
          }}
          open={openSearchDialog}
          onClose={() => setOpenSearchDialog(false)}
        >
          <DialogTitle sx={{ padding: "0 10px" }}>Search Exercise</DialogTitle>
          <DialogContent sx={{ padding: "0 10px" }}>
            <TextField
              helperText="Search for an exercise by name like 'Bench Press'"
              autoFocus
              margin="dense"
              label="Search"
              fullWidth
              onChange={(e) => handleSearch(e.target.value)}
              variant="outlined"
              InputProps={{
                sx: { borderRadius: "20px" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}

            />
            {excerciseSearchLoading && (<div style={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></div>)}
            {searchResults?.length > 0 && (
              <List>
                {searchResults?.map((exercise) => (
                  <ListItem key={exercise.id}>
                    <ListItemText primary={exercise.name} />
                    <Button onClick={() => {
                      addExerciseMutation.mutate({ workout_id: id, exercise_id: exercise.id });
                      setOpenSearchDialog(false);
                    }} color="primary" sx={{ borderRadius: "20px" }}>
                      Add
                    </Button>
                  </ListItem>
                ))}
              </List>
            )
            }
          </DialogContent>
          <DialogActions sx={{ justifyContent: "space-between", padding: "10px" }}>
            <Button onClick={() => setOpenSearchDialog(false)} color="secondary" sx={{ borderRadius: "20px" }}>
              <ArrowLeft /> Back
            </Button>
            {/* <LoadingButton color="primary" onClick={handleAddExercise} sx={{ borderRadius: "20px" }}>
    <SearchIcon /> Search
    </LoadingButton> */}
          </DialogActions>
        </Dialog>
      </Box>
    </div>

  );
};

export default WorkoutDetail;
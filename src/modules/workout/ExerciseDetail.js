import React from 'react';
import { Card, CardContent, CardMedia, Typography, List, ListItem, ListItemText, Divider, Box, Badge, Chip } from '@mui/material';
import Model from 'react-body-highlighter';

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

const muscleSide = {
  "abs": "anterior",
  "hamstring": "posterior",
  "calves": "posterior",
  "back-deltoids": "posterior",
  "front-deltoids": "anterior",
  "adductor": "anterior",
  "gluteal": "posterior",
  "quadriceps": "anterior",
  "biceps": "anterior",
  "forearm": ["anterior", "posterior"], // Assuming forearm can be both
  "abductors": "posterior",
  "triceps": "posterior",
  "chest": "anterior",
  "lower-back": "posterior",
  "trapezius": "posterior",
  "upper-back": "posterior",
  "neck": ["anterior", "posterior"] // Assuming neck can be both
};

function getMuscleSide(libraryName) {
  return muscleSide[libraryName] || null;
}


const ExerciseDetail = ({ exercise }) => {
  // const exercise = {
  //   id: 1481,
  //   name: "Romanian Deadlift",
  //   force: "pull",
  //   level: "intermediate",
  //   mechanic: "compound",
  //   equipment: "barbell",
  //   primaryMuscles: ["hamstrings"],
  //   secondaryMuscles: ["calves", "glutes", "lower back"],
  //   instructions: [
  //     "Put a barbell in front of you on the ground and grab it using a pronated (palms facing down) grip that a little wider than shoulder width. Tip: Depending on the weight used, you may need wrist wraps to perform the exercise and also a raised platform in order to allow for better range of motion.",
  //     "Bend the knees slightly and keep the shins vertical, hips back and back straight. This will be your starting position.",
  //     "Keeping your back and arms completely straight at all times, use your hips to lift the bar as you exhale. Tip: The movement should not be fast but steady and under control.",
  //     "Once you are standing completely straight up, lower the bar by pushing the hips back, only slightly bending the knees, unlike when squatting. Tip: Take a deep breath at the start of the movement and keep your chest up. Hold your breath as you lower and exhale as you complete the movement.",
  //     "Repeat for the recommended amount of repetitions."
  //   ],
  //   category: "strength"
  // };

  return (
    <>

      <Typography color={'primary'} gutterBottom variant="h4" component="div" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        {exercise.name}
      </Typography>
      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          Primary Muscles
        </Typography>
      </Box>



      <Box sx={{ display: 'flex', flexWrap: 'wrap', }}>
        <Chip sx={{ m: 1 }} label={`Category: ${exercise.category}`} color="primary" variant="outlined" />
        <Chip sx={{ m: 1 }} label={`Force: ${exercise.force}`} color="secondary" variant="outlined" />
        <Chip sx={{ m: 1 }} label={`Level: ${exercise.level}`} color="success" variant="outlined" />
        <Chip sx={{ m: 1 }} label={`Mechanic: ${exercise.mechanic}`} color="info" variant="outlined" />
        <Chip sx={{ m: 1 }} label={`Equipment: ${exercise.equipment}`} color="warning" variant="outlined" />
      </Box>

      <Divider sx={{ my: 3 }} />


      {<Model
        style={{ width: '100px', height: '50%', margin: 'auto' }}
        type="anterior" //posterior
        highlightedColors={["#e65a5a", "#db2f2f"]}
        data={{
          name: exercise?.title,
          muscles: exercise.primaryMuscles?.map((muscle) => muscleMapping[muscle] || muscle)

        }}
      />}

      <Box mt={2}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          Secondary Muscles
        </Typography>
      </Box>


      <Model
        style={{ width: '100px', height: '50%', margin: 'auto' }}
        type="posterior"
        highlightedColors={["#e65a5a", "#db2f2f"]}
        data={{
          name: exercise?.title,
          muscles: exercise.secondaryMuscles
            ?.map((muscle) => muscleMapping[muscle] || muscle)

        }}
      />


      <Box>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          Instructions
        </Typography>
        <List>
          {exercise.instructions.map((instruction, index) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemText primary={`${index + 1}. ${instruction}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </>

  );
}

export default ExerciseDetail;

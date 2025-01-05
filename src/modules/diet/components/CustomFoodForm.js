import React, { useEffect, useState } from 'react';
import { Box, TextField, Alert } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

const CustomFoodForm = ({ customFood, setCustomFood, onSubmit, isLoading }) => {
  const [calorieWarning, setCalorieWarning] = useState('');

  useEffect(() => {
    // Calculate calories from macros
    const proteinCals = Number(customFood.protein || 0) * 4;
    const carbsCals = Number(customFood.carbs || 0) * 4;
    const fatCals = Number(customFood.fat || 0) * 9;
    const totalFromMacros = proteinCals + carbsCals + fatCals;
    const declaredCals = Number(customFood.calories || 0);

    // Check if there's a significant difference (allowing for small rounding differences)
    if (declaredCals && Math.abs(totalFromMacros - declaredCals) > 5) {
      setCalorieWarning(
        `Warning: Your declared calories (${declaredCals}) don't match the calculated calories from macros (${Math.round(totalFromMacros)}). 
        \nProtein: ${proteinCals}cal, Carbs: ${carbsCals}cal, Fat: ${fatCals}cal`
      );
    } else {
      setCalorieWarning('');
    }
  }, [customFood.protein, customFood.carbs, customFood.fat, customFood.calories]);

  return (
    <Box component="form">
      <TextField
        label="Food Name"
        value={customFood.name}
        onChange={(e) => setCustomFood(prev => ({...prev, name: e.target.value}))}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Calories"
        type="number"
        value={customFood.calories}
        onChange={(e) => setCustomFood(prev => ({...prev, calories: e.target.value}))}
        fullWidth
        margin="normal"
        required
        helperText="Total calories"
      />
      
      {calorieWarning && (
        <Alert severity="warning" sx={{ my: 1 }}>
          {calorieWarning}
        </Alert>
      )}

      <TextField
        label="Protein (g)"
        type="number"
        value={customFood.protein}
        onChange={(e) => setCustomFood(prev => ({...prev, protein: e.target.value}))}
        fullWidth
        margin="normal"
        required
        helperText="1g protein = 4 calories"
      />
      <TextField
        label="Carbohydrates (g)"
        type="number"
        value={customFood.carbs}
        onChange={(e) => setCustomFood(prev => ({...prev, carbs: e.target.value}))}
        fullWidth
        margin="normal"
        required
        helperText="1g carbs = 4 calories"
      />
      <TextField
        label="Fat (g)"
        type="number"
        value={customFood.fat}
        onChange={(e) => setCustomFood(prev => ({...prev, fat: e.target.value}))}
        fullWidth
        margin="normal"
        required
        helperText="1g fat = 9 calories"
      />
      <TextField
        label="Serving Size"
        value={customFood.servingSize}
        onChange={(e) => setCustomFood(prev => ({...prev, servingSize: e.target.value}))}
        fullWidth
        margin="normal"
        required
        helperText="e.g., '1 cup' or '100g'"
      />
      <LoadingButton 
        variant="contained" 
        fullWidth 
        sx={{ mt: 2 }}
        onClick={onSubmit}
        loading={isLoading}
        disabled={!customFood.name || !customFood.calories || !!calorieWarning}
      >
        Create Custom Food
      </LoadingButton>
    </Box>
  );
};

export default CustomFoodForm;
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Grid,
  MenuItem,
  Tabs,
  Tab,
  Switch,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const UserTools = () => {
  const [activeCalculator, setActiveCalculator] = useState(0);
  const [useMetric, setUseMetric] = useState(true);
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activityLevel: 'sedentary',
    bodyFat: '',
    weight1RM: '',
    reps1RM: '',
    proteinPercentage: 30,
    carbPercentage: 40,
    fatPercentage: 30,
    goal: 'maintain',
    deficit: 500,
  });

  const [results, setResults] = useState({
    bmr: null,
    tdee: null,
    bmi: null,
    macros: null,
    bodyFat: null,
    oneRM: null,
  });

  const [macroPreset, setMacroPreset] = useState('moderate');

  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [advancedFormData, setAdvancedFormData] = useState({
    doesWorkout: 'no',
    workoutFrequency: '1-2',
    trainingIntensity: 'light',
    includesCardio: 'no',
    cardioMinutes: '',
  });

  const activityLevels = {
    sedentary: { factor: 1.2, label: 'Sedentary (little or no exercise)' },
    light: { factor: 1.375, label: 'Light (exercise 1-3 times/week)' },
    moderate: { factor: 1.55, label: 'Moderate (exercise 3-5 times/week)' },
    active: { factor: 1.725, label: 'Active (exercise 6-7 times/week)' },
    veryActive: { factor: 1.9, label: 'Very Active (hard exercise daily)' },
  };

  const macroPresets = {
    highCarb: { name: 'High Carb', carbs: 60, protein: 25, fats: 15 },
    moderate: { name: 'Moderate Carb', carbs: 50, protein: 30, fats: 20 },
    zone: { name: 'Zone Diet', carbs: 40, protein: 30, fats: 30 },
    lowCarb: { name: 'Low Carb', carbs: 25, protein: 35, fats: 40 },
    keto: { name: 'Keto', carbs: 5, protein: 35, fats: 60 },
    custom: { name: 'Custom', carbs: 40, protein: 30, fats: 30 },
  };

  // Unit conversion functions
  const convertWeight = (value) => {
    if (!value) return 0;
    return useMetric ? value : value * 0.453592; // lbs to kg
  };

  const convertHeight = (value) => {
    return useMetric ? value : value * 2.54; // inches to cm
  };

  const convertFeetInchesToCm = (feet, inches) => {
    const totalInches = (feet * 12) + parseFloat(inches);
    return Math.round(totalInches * 2.54);
  };

  const convertCmToFeetInches = (cm) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12 * 100) / 100;
    return { feet, inches };
  };

  const handleUnitToggle = () => {
    // Convert weight and height based on the CURRENT unit system before toggling
    const isCurrentlyMetric = useMetric;

    // Convert weight when switching units
    if (formData.weight) {
      const currentWeight = Number(formData.weight);
      const newWeight = isCurrentlyMetric 
        ? Math.round(currentWeight * 2.20462) // Converting FROM kg TO lbs
        : Math.round(currentWeight / 2.20462); // Converting FROM lbs TO kg

      setFormData(prev => ({
        ...prev,
        weight: newWeight.toString()
      }));
    }

    // Convert height when switching units
    if (isCurrentlyMetric) {
      // Converting FROM cm TO feet/inches
      if (formData.height) {
        const { feet, inches } = convertCmToFeetInches(formData.height);
        setHeightFeet(feet.toString());
        setHeightInches(inches.toString());
        setFormData(prev => ({ ...prev, height: '' }));
      }
    } else {
      // Converting FROM feet/inches TO cm
      if (heightFeet || heightInches) {
        const cm = convertFeetInchesToCm(
          parseFloat(heightFeet) || 0,
          parseFloat(heightInches) || 0
        );
        setHeightFeet('');
        setHeightInches('');
        setFormData(prev => ({ ...prev, height: cm.toString() }));
      }
    }
    
    // Toggle the unit system after all conversions
    setUseMetric(!isCurrentlyMetric);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleHeightConvert = () => {
    // Convert height
    if (useMetric) {
      // Converting from cm to feet/inches
      if (formData.height) {
        const { feet, inches } = convertCmToFeetInches(formData.height);
        setHeightFeet(feet.toString());
        setHeightInches(inches.toString());
        setFormData(prev => ({ ...prev, height: '' }));
      }
    } else {
      // Converting from feet/inches to cm
      if (heightFeet || heightInches) {
        const cm = convertFeetInchesToCm(
          parseFloat(heightFeet) || 0,
          parseFloat(heightInches) || 0
        );
        setHeightFeet('');
        setHeightInches('');
        setFormData(prev => ({ ...prev, height: cm.toString() }));
      }
    }

    // Convert weight
    if (formData.weight) {
      const currentWeight = Number(formData.weight);
      const newWeight = useMetric 
        ? Math.round(currentWeight * 2.20462) // Converting FROM kg TO lbs
        : Math.round(currentWeight / 2.20462); // Converting FROM lbs TO kg

      setFormData(prev => ({
        ...prev,
        weight: newWeight.toString()
      }));
    }
    
    setUseMetric(!useMetric);
  };

  // Calculation functions
  const calculateBMR = () => {
    // Get weight - if imperial, use raw value without conversion
    const weight = useMetric ? Number(formData.weight) : Number(formData.weight);
    
    // Get height in cm regardless of unit system
    let heightInCm;
    if (useMetric) {
      heightInCm = Number(formData.height);
    } else {
      const feet = parseFloat(heightFeet) || 0;
      const inches = parseFloat(heightInches) || 0;
      heightInCm = convertFeetInchesToCm(feet, inches);
    }
    
    const age = Number(formData.age);
    
    let bmr;
    if (formData.gender === 'male') {
      bmr = 88.362 + (13.397 * (useMetric ? weight : weight * 0.453592)) + (4.799 * heightInCm) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * (useMetric ? weight : weight * 0.453592)) + (3.098 * heightInCm) - (4.330 * age);
    }
    
    return Math.round(bmr);
  };

  const calculateTDEE = (bmr) => {
    return Math.round(bmr * activityLevels[formData.activityLevel].factor);
  };

  const calculateMacros = (tdee) => {
    // Adjust TDEE based on goal
    let adjustedTDEE = tdee;
    if (formData.goal === 'lose') {
      adjustedTDEE -= formData.deficit;
    } else if (formData.goal === 'gain') {
      adjustedTDEE += formData.deficit;
    }

    const protein = Math.round((adjustedTDEE * (formData.proteinPercentage / 100)) / 4);
    const carbs = Math.round((adjustedTDEE * (formData.carbPercentage / 100)) / 4);
    const fats = Math.round((adjustedTDEE * (formData.fatPercentage / 100)) / 9);
    
    return { protein, carbs, fats, adjustedTDEE };
  };

  const calculate1RM = () => {
    const weight = Number(formData.weight1RM);
    const reps = Number(formData.reps1RM);
    return Math.round(weight * (1 + (reps / 30)));
  };

  const calculateBodyFat = () => {
    const bmi = calculateBMI();
    const age = Number(formData.age);
    const gender = formData.gender;
    
    let bodyFat;
    if (gender === 'male') {
      bodyFat = (1.20 * bmi) + (0.23 * age) - 16.2;
    } else {
      bodyFat = (1.20 * bmi) + (0.23 * age) - 5.4;
    }

    // Apply adjustments based on advanced options
    if (showAdvancedOptions && advancedFormData.doesWorkout === 'yes') {
      // Workout frequency adjustment
      const frequencyAdjustment = {
        '1-2': -0.5,
        '3-4': -1.0,
        '5+': -1.5,
      }[advancedFormData.workoutFrequency];

      // Training intensity adjustment
      const intensityAdjustment = {
        'light': -0.3,
        'moderate': -0.6,
        'heavy': -1.0,
      }[advancedFormData.trainingIntensity];

      // Cardio adjustment based on minutes
      let cardioAdjustment = 0;
      if (advancedFormData.includesCardio === 'yes') {
        const minutes = Number(advancedFormData.cardioMinutes);
        if (minutes >= 300) {
          cardioAdjustment = -2.0;
        } else if (minutes >= 150) {
          cardioAdjustment = -1.5;
        } else if (minutes >= 75) {
          cardioAdjustment = -1.0;
        } else {
          cardioAdjustment = -0.5;
        }
      }

      bodyFat += frequencyAdjustment + intensityAdjustment + cardioAdjustment;
    }
    
    return Math.max(Math.round(bodyFat * 100) / 100, 3); // Ensure body fat doesn't go below 3%
  };

  const calculateBMI = () => {
    const weight = useMetric ? Number(formData.weight) : Number(formData.weight) * 0.453592;
    
    let heightInCm;
    if (useMetric) {
      heightInCm = Number(formData.height);
    } else {
      heightInCm = convertFeetInchesToCm(
        parseFloat(heightFeet) || 0,
        parseFloat(heightInches) || 0
      );
    }
    
    const heightInMeters = heightInCm / 100;
    
    if (!weight || !heightInMeters) return 0;
    
    return Math.round((weight / (heightInMeters * heightInMeters)) * 100) / 100;
  };

  const handleCalculate = () => {
    const bmr = calculateBMR();
    const tdee = calculateTDEE(bmr);
    const bmi = calculateBMI();
    const macros = calculateMacros(tdee);
    const bodyFat = calculateBodyFat();
    const oneRM = calculate1RM();

    setResults({ bmr, tdee, bmi, macros, bodyFat, oneRM });
  };

  const handlePresetChange = (e) => {
    const preset = e.target.value;
    setMacroPreset(preset);
    if (preset !== 'custom') {
      setFormData(prev => ({
        ...prev,
        carbPercentage: macroPresets[preset].carbs,
        proteinPercentage: macroPresets[preset].protein,
        fatPercentage: macroPresets[preset].fats,
      }));
    }
  };

  const handleAdvancedInputChange = (e) => {
    setAdvancedFormData({
      ...advancedFormData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid = () => {
    // Common required fields for all calculators
    const commonFields = {
      age: formData.age,
      weight: formData.weight,
      gender: formData.gender,
    };

    // Height validation (either metric or imperial)
    const isHeightValid = useMetric 
      ? Boolean(formData.height)
      : (Boolean(heightFeet) || Boolean(heightInches));

    // Basic validation - check if required fields are filled
    const isCommonValid = Object.values(commonFields).every(field => Boolean(field)) && isHeightValid;

    // Specific validation for each calculator
    switch(activeCalculator) {
      case 0: // BMR & TDEE
      case 1: // Macros
        return isCommonValid && Boolean(formData.activityLevel);
      case 2: // Body Fat
        return isCommonValid;
      case 3: // 1RM
        return Boolean(formData.weight1RM) && Boolean(formData.reps1RM);
      default:
        return false;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      {/* <Typography variant="h4" gutterBottom align="center">
        Fitness Calculators
      </Typography> */}
      <Box sx={{ 
        mb: 3,
        borderBottom: 1, 
        borderColor: 'divider',
        width: '100%',
        overflow: 'auto',
        '::-webkit-scrollbar': {
          display: 'none'
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}>
        <Tabs 
          value={activeCalculator} 
          onChange={(e, v) => setActiveCalculator(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ 
            minHeight: { xs: '48px', sm: '64px' },
            '& .MuiTab-root': {
              minHeight: { xs: '48px', sm: '64px' },
              minWidth: { xs: '120px', sm: '160px' },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }
          }}
        >
          <Tab label="BMR & TDEE" />
          <Tab label="Macros" />
          <Tab label="Body Fat" />
          <Tab label="1RM" />
        </Tabs>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Typography>Imperial</Typography>
            <Switch checked={useMetric} onChange={handleUnitToggle} />
            <Typography>Metric</Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Common inputs for all calculators */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  row
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={`Weight (${useMetric ? 'kg' : 'lbs'})`}
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              {useMetric ? (
                <TextField
                  fullWidth
                  label="Height (cm)"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
                  InputProps={{
                    inputProps: { step: "0.01" }
                  }}
                />
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    sx={{ flex: 1 }}
                    label="Feet"
                    type="number"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    InputProps={{
                      inputProps: { step: "0.01" }
                    }}
                  />
                  <TextField
                    sx={{ flex: 1 }}
                    label="Inches"
                    type="number"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    InputProps={{
                      inputProps: { min: 0, max: 11.99, step: "0.01" }
                    }}
                  />
                </Box>
              )}
              <Button
                variant="outlined"
                size="small"
                onClick={handleHeightConvert}
                sx={{ mt: 1 }}
              >
                Convert to {useMetric ? 'ft/in' : 'cm'}
              </Button>
            </Grid>

            {/* Conditional inputs based on active calculator */}
            {activeCalculator <= 1 && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Activity Level"
                  name="activityLevel"
                  value={formData.activityLevel}
                  onChange={handleInputChange}
                >
                  {Object.entries(activityLevels).map(([key, { label }]) => (
                    <MenuItem key={key} value={key}>{label}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            {activeCalculator === 1 && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="lose">Weight Loss</MenuItem>
                    <MenuItem value="maintain">Maintain</MenuItem>
                    <MenuItem value="gain">Weight Gain</MenuItem>
                  </TextField>
                </Grid>
                {formData.goal !== 'maintain' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Daily Calorie Adjustment"
                      name="deficit"
                      type="number"
                      value={formData.deficit}
                      onChange={handleInputChange}
                      helperText={`Calories to ${formData.goal === 'lose' ? 'reduce' : 'add'} per day`}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Macro Split Preset"
                    value={macroPreset}
                    onChange={handlePresetChange}
                  >
                    {Object.entries(macroPresets).map(([key, { name }]) => (
                      <MenuItem key={key} value={key}>{name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                {macroPreset === 'custom' && (
                  <>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Protein %"
                        name="proteinPercentage"
                        type="number"
                        value={formData.proteinPercentage}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Carbs %"
                        name="carbPercentage"
                        type="number"
                        value={formData.carbPercentage}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Fats %"
                        name="fatPercentage"
                        type="number"
                        value={formData.fatPercentage}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </>
                )}
              </>
            )}

            {activeCalculator === 3 && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`Weight (${useMetric ? 'kg' : 'lbs'})`}
                    name="weight1RM"
                    type="number"
                    value={formData.weight1RM}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Reps"
                    name="reps1RM"
                    type="number"
                    value={formData.reps1RM}
                    onChange={handleInputChange}
                  />
                </Grid>
              </>
            )}


            {activeCalculator === 2 && (
              <Grid item xs={12}>
                <Button
                  variant="text"
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  endIcon={showAdvancedOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                  Advanced Options
                </Button>

                {showAdvancedOptions && (
                  <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        select
                        label="Do you workout?"
                        name="doesWorkout"
                        value={advancedFormData.doesWorkout}
                        onChange={handleAdvancedInputChange}
                        sx={{ backgroundColor: 'background.paper' }}
                      >
                        <MenuItem value="no">No</MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                      </TextField>
                    </Grid>

                    {advancedFormData.doesWorkout === 'yes' && (
                      <>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            select
                            label="Workouts per week"
                            name="workoutFrequency"
                            value={advancedFormData.workoutFrequency}
                            onChange={handleAdvancedInputChange}
                            sx={{ backgroundColor: 'background.paper' }}
                          >
                            <MenuItem value="1-2">1-2 times</MenuItem>
                            <MenuItem value="3-4">3-4 times</MenuItem>
                            <MenuItem value="5+">5+ times</MenuItem>
                          </TextField>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            select
                            label="Training Intensity"
                            name="trainingIntensity"
                            value={advancedFormData.trainingIntensity}
                            onChange={handleAdvancedInputChange}
                            sx={{ backgroundColor: 'background.paper' }}
                          >
                            <MenuItem value="light">Light</MenuItem>
                            <MenuItem value="moderate">Moderate</MenuItem>
                            <MenuItem value="heavy">Heavy</MenuItem>
                          </TextField>
                        </Grid>

                        <Grid item xs={12} md={advancedFormData.includesCardio === 'yes' ? 6 : 12}>
                          <TextField
                            fullWidth
                            select
                            label="Includes Cardio?"
                            name="includesCardio"
                            value={advancedFormData.includesCardio}
                            onChange={handleAdvancedInputChange}
                            sx={{ backgroundColor: 'background.paper' }}
                          >
                            <MenuItem value="no">No</MenuItem>
                            <MenuItem value="yes">Yes</MenuItem>
                          </TextField>
                        </Grid>

                        {advancedFormData.includesCardio === 'yes' && (
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Minutes of Cardio per Week"
                              name="cardioMinutes"
                              type="number"
                              value={advancedFormData.cardioMinutes}
                              onChange={handleAdvancedInputChange}
                              sx={{ backgroundColor: 'background.paper' }}
                              InputProps={{
                                inputProps: { min: 0 }
                              }}
                            />
                          </Grid>
                        )}
                      </>
                    )}
                  </Grid>
                )}
              </Grid>
            )}

{activeCalculator === 2 && (
              <>
                <Grid item xs={12}>
                  <Card elevation={3}>
                    <CardContent>
                      <Typography variant="h6">Estimated Body Fat</Typography>
                      <Typography variant="h4">{results.bodyFat}%</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleCalculate}
                disabled={!isFormValid()}
              >
                Calculate
              </Button>
              {!isFormValid() && (
                <Typography 
                  color="error" 
                  variant="caption" 
                  sx={{ mt: 1, display: 'block', textAlign: 'center' }}
                >
                  Please fill in all required fields
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results Section */}
      {results.bmr && (
       
            <Grid container spacing={3}>
              {activeCalculator === 0 && (
                <>
                  <Grid item xs={12} md={4}>
                    <Card elevation={3}>
                      <CardContent>
                        <Typography variant="h6">BMR</Typography>
                        <Typography variant="h4">{results.bmr}</Typography>
                        <Typography color="textSecondary">calories/day</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card elevation={3}>
                      <CardContent>
                        <Typography variant="h6">TDEE</Typography>
                        <Typography variant="h4">{results.tdee}</Typography>
                        <Typography color="textSecondary">calories/day</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card elevation={3}>
                      <CardContent>
                        <Typography variant="h6">BMI</Typography>
                        <Typography variant="h4">{results.bmi}</Typography>
                        <Typography color="textSecondary">kg/m²</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </>
              )}

              {activeCalculator === 1 && results.macros && (
                <>
                  <Grid item xs={12}>
                    <Card elevation={3}>
                      <CardContent>
                        <Typography variant="h6">Adjusted Daily Calories</Typography>
                        <Typography variant="h4">{results.macros.adjustedTDEE}</Typography>
                        <Typography color="textSecondary">calories/day</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card elevation={3}>
                      <CardContent>
                        <Typography variant="h6">Protein</Typography>
                        <Typography variant="h4">{results.macros.protein}g</Typography>
                        <Typography color="textSecondary">
                          {results.macros.protein * 4} calories
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card elevation={3}>
                      <CardContent>
                        <Typography variant="h6">Carbs</Typography>
                        <Typography variant="h4">{results.macros.carbs}g</Typography>
                        <Typography color="textSecondary">
                          {results.macros.carbs * 4} calories
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Card elevation={3}>
                      <CardContent>
                        <Typography variant="h6">Fats</Typography>
                        <Typography variant="h4">{results.macros.fats}g</Typography>
                        <Typography color="textSecondary">
                          {results.macros.fats * 9} calories
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </>
              )}
{/* 
              {activeCalculator === 3 && (
                <>
                  <Grid item xs={12}>
                    <Card elevation={3}>
                      <CardContent>
                        <Typography variant="h6">Estimated Body Fat</Typography>
                        <Typography variant="h4">{results.bodyFat}%</Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="text"
                      onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                      endIcon={showAdvancedOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    >
                      Advanced Options
                    </Button>
                  </Grid>

                  {showAdvancedOptions && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          select
                          label="Do you workout?"
                          name="doesWorkout"
                          value={advancedFormData.doesWorkout}
                          onChange={handleAdvancedInputChange}
                        >
                          <MenuItem value="no">No</MenuItem>
                          <MenuItem value="yes">Yes</MenuItem>
                        </TextField>
                      </Grid>

                      {advancedFormData.doesWorkout === 'yes' && (
                        <>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              select
                              label="Workouts per week"
                              name="workoutFrequency"
                              value={advancedFormData.workoutFrequency}
                              onChange={handleAdvancedInputChange}
                            >
                              <MenuItem value="1-2">1-2 times</MenuItem>
                              <MenuItem value="3-4">3-4 times</MenuItem>
                              <MenuItem value="5+">5+ times</MenuItem>
                            </TextField>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              select
                              label="Training Intensity"
                              name="trainingIntensity"
                              value={advancedFormData.trainingIntensity}
                              onChange={handleAdvancedInputChange}
                            >
                              <MenuItem value="light">Light</MenuItem>
                              <MenuItem value="moderate">Moderate</MenuItem>
                              <MenuItem value="heavy">Heavy</MenuItem>
                            </TextField>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              select
                              label="Includes Cardio?"
                              name="includesCardio"
                              value={advancedFormData.includesCardio}
                              onChange={handleAdvancedInputChange}
                            >
                              <MenuItem value="no">No</MenuItem>
                              <MenuItem value="yes">Yes</MenuItem>
                            </TextField>
                          </Grid>

                          {advancedFormData.includesCardio === 'yes' && (
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Minutes of Cardio per Week"
                                name="cardioMinutes"
                                type="number"
                                value={advancedFormData.cardioMinutes}
                                onChange={handleAdvancedInputChange}
                              />
                            </Grid>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )} */}

              {activeCalculator === 3 && (
                <Grid item xs={12}>
                  <Card elevation={3}>
                    <CardContent>
                      <Typography variant="h6">Estimated 1RM</Typography>
                      <Typography variant="h4">
                        {results.oneRM} {useMetric ? 'kg' : 'lbs'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
         
      )}

      {activeCalculator === 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Understanding Your Results
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Basal Metabolic Rate (BMR)
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    The calories your body burns at complete rest
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" gutterBottom>
                    Your body uses this energy for essential functions:
                  </Typography>
                  <Typography component="div" variant="body2">
                    <ul>
                      <li>Breathing and circulation</li>
                      <li>Cell production and repair</li>
                      <li>Hormone regulation</li>
                      <li>Brain function</li>
                      <li>Temperature maintenance</li>
                    </ul>
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Think of BMR as your body's minimum energy requirement for survival.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Total Daily Energy Expenditure (TDEE)
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Your total daily calorie burn
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" gutterBottom>
                    TDEE combines several factors:
                  </Typography>
                  <Typography component="div" variant="body2">
                    <ul>
                      <li>Base metabolism (BMR)</li>
                      <li>Daily activities</li>
                      <li>Exercise</li>
                      <li>Food digestion</li>
                      <li>Non-exercise movement</li>
                    </ul>
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Use TDEE to plan your nutrition goals for weight management.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Body Mass Index (BMI)
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    A general weight-to-height ratio indicator
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" gutterBottom>
                    BMI Categories:
                  </Typography>
                  <Typography component="div" variant="body2">
                    <ul>
                      <li>Under 18.5: Underweight</li>
                      <li>18.5 - 24.9: Normal</li>
                      <li>25 - 29.9: Overweight</li>
                      <li>30+: Obese</li>
                    </ul>
                  </Typography>
                  <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
                    Note: BMI is a general guide and doesn't account for muscle mass, age, or body composition.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Applying These Numbers
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Weight Loss Goals
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography component="div" variant="body2">
                          <ul>
                            <li>Small deficit: TDEE - 250 calories (0.25kg/week)</li>
                            <li>Medium deficit: TDEE - 500 calories (0.5kg/week)</li>
                            <li>Large deficit: TDEE - 750 calories (0.75kg/week)</li>
                            <li>Maximum deficit: TDEE - 1000 calories (1kg/week)</li>
                          </ul>
                        </Typography>
                        <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
                          Never eat below your BMR for extended periods.
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          Muscle Gain Goals
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography component="div" variant="body2">
                          <ul>
                            <li>Lean bulk: TDEE + 200-300 calories</li>
                            <li>Standard bulk: TDEE + 400-500 calories</li>
                            <li>Protein: 1.6-2.2g per kg bodyweight</li>
                            <li>Focus on progressive overload training</li>
                          </ul>
                        </Typography>
                        <Typography variant="body2" color="info.main" sx={{ mt: 2 }}>
                          Adjust calories based on weekly progress.
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default UserTools;
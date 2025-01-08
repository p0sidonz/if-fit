import React, { useState } from 'react';
import { Box, Typography, Divider, Slider, Button, Select, MenuItem } from '@mui/material';
import FoodDetails from './FoodDetails';
// Utility function to calculate the percentage of the daily value
const calculateDailyValue = (value, dailyValue) => {
  return ((value / dailyValue) * 100).toFixed(0);
};

// Mapping of nutrient keys to their display names and daily values
const nutrientInfo = {
  fat: { name: 'Total Fat', unit: 'g', dailyValue: 78 },
  "Total Fat": { name: 'Total Fat', unit: 'g', dailyValue: 78 },
  saturated_fat: { name: 'Saturated Fat', unit: 'g', dailyValue: 20 },
  cholesterol: { name: 'Cholesterol', unit: 'mg', dailyValue: 300 },
  sodium: { name: 'Sodium', unit: 'mg', dailyValue: 2300 },
  carbohydrate: { name: 'Total Carbohydrate', unit: 'g', dailyValue: 275 },
  fiber: { name: 'Dietary Fiber', unit: 'g', dailyValue: 28 },
  sugar: { name: 'Total Sugars', unit: 'g', dailyValue: 50 },
  protein: { name: 'Protein', unit: 'g', dailyValue: 50 },
  vitamin_a: { name: 'Vitamin A', unit: 'µg', dailyValue: 900 },
  vitamin_c: { name: 'Vitamin C', unit: 'mg', dailyValue: 90 },
  calcium: { name: 'Calcium', unit: 'mg', dailyValue: 1300 },
  iron: { name: 'Iron', unit: 'mg', dailyValue: 18 },
  potassium: { name: 'Potassium', unit: 'mg', dailyValue: 4700 },
};

// Add these conversion utilities at the top with other constants
const unitConversions = {
  g: {
    ml: 1,      // Assuming density of 1g/ml for simplicity
    oz: 0.03527396,
  },
  ml: {
    g: 1,       // Assuming density of 1g/ml for simplicity
    oz: 0.033814,
  },
  oz: {
    g: 28.3495,
    ml: 29.5735,
  }
};

// Add this function before the component
const convertUnit = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;
  if (!unitConversions[fromUnit] || !unitConversions[fromUnit][toUnit]) {
    console.warn(`Conversion from ${fromUnit} to ${toUnit} not supported`);
    return value;
  }
  return value * unitConversions[fromUnit][toUnit];
};

const NutritionValueDisplay = ({ data, otherData, showOtherData = false, changeServing, hideSlider = false  , closeModal = null, title = null}) => {
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(data?.metric_serving_unit || 'g');

  // Calculate adjusted values based on serving multiplier (convert from grams to multiplier)
  const getAdjustedValue = (value) => {
    const baseServingSize = data?.metric_serving_amount || 100;
    const baseUnit = data?.metric_serving_unit || 'g';
    
    // Convert current serving size to base unit if needed
    const convertedServingSize = convertUnit(servingMultiplier, selectedUnit, baseUnit);
    const multiplier = convertedServingSize / baseServingSize;
    return (parseFloat(value) * multiplier).toFixed(1);
  };

  // Update the serving change handler to use the actual gram value
  const handleServingChange = (event, newValue) => {
    setServingMultiplier(newValue);
  };

  const handleUnitChange = (event) => {
    const newUnit = event.target.value;
    // Convert current serving size to new unit
    const newServingSize = convertUnit(servingMultiplier, selectedUnit, newUnit);
    setSelectedUnit(newUnit);
    setServingMultiplier(parseFloat(newServingSize.toFixed(1)));
  };

  console.log("NutritionValueDisplay", otherData);




  return (
    <>
      <Box sx={{ border: '1px solid black', padding: 5, margin: 5 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', marginBottom: 5, borderColor: 'black' }}>
          Nutrition Facts
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <Typography>{data?.number_of_units} servings</Typography>
        </Box>
      {!hideSlider && <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography>Serving size</Typography>
          <Typography>{servingMultiplier}</Typography>
          <Select
            value={selectedUnit}
            onChange={handleUnitChange}
            size="small"
          >
            <MenuItem value="g">g</MenuItem>
            <MenuItem value="ml">ml</MenuItem>
            <MenuItem value="oz">oz</MenuItem>
          </Select>
        </Box>
        <Box sx={{ my: 2 }}>
          <Typography gutterBottom>Adjust Serving Size ({selectedUnit})</Typography>
          <Slider
            value={servingMultiplier}
            onChange={handleServingChange}
            min={0}
            max={selectedUnit === 'oz' ? 18 : 500} // Adjust max based on unit
            step={selectedUnit === 'oz' ? 0.5 : 10} // Adjust step based on unit
            marks={[
              { value: 0, label: `0${selectedUnit}` },
              { value: selectedUnit === 'oz' ? 4 : 100, label: `${selectedUnit === 'oz' ? 4 : 100}${selectedUnit}` },
              { value: selectedUnit === 'oz' ? 8 : 250, label: `${selectedUnit === 'oz' ? 8 : 250}${selectedUnit}` },
              { value: selectedUnit === 'oz' ? 16 : 500, label: `${selectedUnit === 'oz' ? 16 : 500}${selectedUnit}` }
            ]}
            valueLabelDisplay="auto"
            aria-label={`Serving size in ${selectedUnit}`}
          />
          <Button 
            variant="contained"
            fullWidth
            onClick={() => {
              const baseUnit = data?.metric_serving_unit || 'g';
              const convertedValue = convertUnit(servingMultiplier, selectedUnit, baseUnit);
              
              // Create a copy of the original data structure with updated values
              const updatedData = {
                ...data,  // Keep all original properties
                fat: parseFloat(getAdjustedValue(data.fat)),
                iron: parseFloat(getAdjustedValue(data.iron)),
                fiber: parseFloat(getAdjustedValue(data.fiber)),
                sugar: parseFloat(getAdjustedValue(data.sugar)),
                sodium: parseFloat(getAdjustedValue(data.sodium)),
                calcium: parseFloat(getAdjustedValue(data.calcium)),
                protein: parseFloat(getAdjustedValue(data.protein)),
                calories: parseFloat(getAdjustedValue(data.calories)),
                potassium: parseFloat(getAdjustedValue(data.potassium)),
                vitamin_a: parseFloat(getAdjustedValue(data.vitamin_a)),
                vitamin_c: parseFloat(getAdjustedValue(data.vitamin_c)),
                cholesterol: parseFloat(getAdjustedValue(data.cholesterol)),
                carbohydrate: parseFloat(getAdjustedValue(data.carbohydrate)),
                saturated_fat: parseFloat(getAdjustedValue(data.saturated_fat)),
                monounsaturated_fat: parseFloat(getAdjustedValue(data.monounsaturated_fat)),
                polyunsaturated_fat: parseFloat(getAdjustedValue(data.polyunsaturated_fat)),
                // Update serving-related fields
                number_of_units: (convertedValue / (data?.metric_serving_amount || 100) * data.number_of_units).toFixed(3),
                metric_serving_amount: convertedValue,
                serving_description: `${convertedValue} ${baseUnit}`
              };

              changeServing(updatedData);
              closeModal && closeModal()
            }}
            sx={{ mt: 2 }}
          >
            {title || "Add to Meal"}
          </Button>
        </Box>
      </>}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, fontWeight: 'bold', marginY: 2 }}>
          <Typography>Calories</Typography>
          <Typography>{getAdjustedValue(data?.calories)}</Typography>
        </Box>
        <Divider />
        {Object.keys(nutrientInfo).map((key) => {

          if (data[key] !== undefined) {
            const { name, unit, dailyValue } = nutrientInfo[key]; const value = parseFloat(data[key]);
            const adjustedValue = getAdjustedValue(data[key]);
            const dailyPercentage = calculateDailyValue(adjustedValue, dailyValue);
            return (
              <React.Fragment key={key}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginY: 1 }}>
                  <Typography>{name} {adjustedValue}{unit}</Typography>
                  {dailyValue && <Typography>{dailyPercentage}%</Typography>}
                </Box>
                <Divider />
              </React.Fragment>
            );
          }
          return null;
        })}
        <Typography sx={{ fontSize: 12, marginTop: 2 }}>
          * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
        </Typography>
      </Box>
      {showOtherData &&  <FoodDetails data={otherData} showOtherData={showOtherData} /> }
     

    </>
  );
};

export default NutritionValueDisplay;
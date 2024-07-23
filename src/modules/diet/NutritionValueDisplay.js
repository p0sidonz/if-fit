import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
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

const NutritionValueDisplay = ({ data, otherData, showOtherData = false }) => {
  console.log("NutritionValueDisplay", otherData);


  return (
    <>
      <Box sx={{ border: '1px solid black', padding: 5, margin: 5 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', marginBottom: 5, borderColor: 'black' }}>
          Nutrition Facts
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <Typography>{data?.number_of_units} servings per container</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
          <Typography>Serving size</Typography>
          <Typography>{data?.serving_description}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, fontWeight: 'bold', marginY: 2 }}>
          <Typography>Calories</Typography>
          <Typography>{data?.calories}</Typography>
        </Box>
        <Divider />
        {Object.keys(nutrientInfo).map((key) => {

          if (data[key] !== undefined) {
            const { name, unit, dailyValue } = nutrientInfo[key]; const value = parseFloat(data[key]);
            const dailyPercentage = calculateDailyValue(value, dailyValue);
            return (
              <React.Fragment key={key}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginY: 1 }}>
                  <Typography>{name} {value}{unit}</Typography>
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
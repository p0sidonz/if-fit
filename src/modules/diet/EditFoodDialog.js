import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Slider, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import NutritionValueDisplay from './NutritionValueDisplay';

const EditFoodDialog = ({ openFoodEdit, setOpenFoodEdit, selectedFood, setSelectedFood, selectedServing, setselectedServingdForEdit, handleSaveEditServing }) => {
  const [localServing, setLocalServing] = useState(selectedServing);
  
  useEffect(() => {
    setLocalServing(selectedServing);
  }, [selectedServing]);

  const handleSliderChange = (field) => (event, newValue) => {
    setLocalServing((prevServing) => {
      const newLocalServing = { ...prevServing, [field]: newValue };
  
      if (field === 'metric_serving_amount') {
        const factor = newValue / selectedServing.metric_serving_amount;
        
        const recalculateValue = (key, value) => {
          if (typeof value === 'number') {
            return Number((value * factor).toFixed(2));
          } else if (key !== 'serving_description' && key !== 'measurement_description' && 
                     key !== 'metric_serving_unit' && key !== 'serving_url' && 
                     key !== 'serving_id' && !isNaN(parseFloat(value))) {
            return Number((parseFloat(value) * factor).toFixed(2));
          }
          return value;
        };
  
        Object.keys(selectedServing).forEach(key => {
          if (key !== 'metric_serving_amount' && key !== 'number_of_units') {
            newLocalServing[key] = recalculateValue(key, selectedServing[key]);
          }
        });
  
        // Update number_of_units separately
        newLocalServing.number_of_units = (newValue / selectedServing.metric_serving_amount * 100).toFixed(3);
        
        // Update serving_description
        newLocalServing.serving_description = `${newValue} ${selectedServing.metric_serving_unit}`;
      }
  
      return newLocalServing;
    });
  };
  const handleSave = (data) => {
    setselectedServingdForEdit(data);
    handleSaveEditServing(data);
    setOpenFoodEdit(false);
  };

  return (
    <Dialog maxWidth="sm" open={openFoodEdit} onClose={() => setOpenFoodEdit(false)}>
      <DialogTitle>Edit {selectedFood?.foodInfo?.food_name} Nutrition value</DialogTitle>
      <DialogContent>
        <NutritionValueDisplay title={"Update Serving"} closeModal={()=>setOpenFoodEdit(false)} data={localServing} hideSlider={false} changeServing={(data)=>{
          console.log(data)
          setLocalServing(data)
          handleSave(data)
        }} />
        {/* <div key="metric_serving_amount" style={{ margin: '20px 0' }}>
          <Typography id="metric_serving_amount-slider" gutterBottom>
            Serving Amount
          </Typography>
          <Slider
            value={localServing?.metric_serving_amount}
            onChange={handleSliderChange('metric_serving_amount')}
            aria-labelledby="metric_serving_amount-slider"
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={500}
          />
          <h2 >Quantity: {localServing?.metric_serving_amount} ({localServing?.metric_serving_unit})</h2>
        </div> */}
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={() => setOpenFoodEdit(false)} color="secondary">
          Cancel
        </Button>
        <LoadingButton color="primary" onClick={handleSave}>
          Save
        </LoadingButton>
      </DialogActions> */}
    </Dialog>
  );
};

export default EditFoodDialog;
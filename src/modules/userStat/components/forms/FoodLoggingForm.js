import { useState, useCallback, useEffect } from 'react';
import { 
  Grid, 
  Button, 
  Typography, 
  Autocomplete, 
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Restaurant as FoodIcon, Add as AddIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { FormCard, FormField, DateRangeSelector, DataTable } from '../index';
import { 
  useCreateUserStat, 
  useUserStatsByType,
  fetchFood,
  fetchFoodById 
} from '../../hooks/useUserStat';
import { startOfDay, endOfDay } from 'date-fns';
import { debounce } from 'lodash';

const FoodLoggingForm = () => {
  const { mutate: createStat, isLoading } = useCreateUserStat();
  const [dateRange, setDateRange] = useState([startOfDay(new Date()), endOfDay(new Date())]);
  const { data: foodStats } = useUserStatsByType(
    dateRange[0].toISOString(),
    dateRange[1].toISOString(),
    'food'
  );

  const [searchMode, setSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Store the base values (for 1 serving)
  const [baseValues, setBaseValues] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    calories: 0
  });

  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      date: new Date(),
      dietJson: {
        title: '',
        description: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
        fiber: 0,
        servingSize: 1,
        unit: 'g'
      }
    }
  });

  const protein = watch('dietJson.protein');
  const carbs = watch('dietJson.carbs');
  const fat = watch('dietJson.fat');
  const fiber = watch('dietJson.fiber');
  const servingSize = watch('dietJson.servingSize');
  const currentUnit = watch('dietJson.unit');

  // Update base values when macros change (but not when serving size changes)
  useEffect(() => {
    if (servingSize && servingSize !== 0) {
      setBaseValues({
        protein: protein / servingSize,
        carbs: carbs / servingSize,
        fat: fat / servingSize,
        fiber: fiber / servingSize
      });
    }
  }, [protein, carbs, fat, fiber]);

  // Update all values when serving size changes
  useEffect(() => {
    if (servingSize) {
      setValue('dietJson.protein', Number((baseValues.protein * servingSize).toFixed(1)));
      setValue('dietJson.carbs', Number((baseValues.carbs * servingSize).toFixed(1)));
      setValue('dietJson.fat', Number((baseValues.fat * servingSize).toFixed(1)));
      setValue('dietJson.fiber', Number((baseValues.fiber * servingSize).toFixed(1)));
    }
  }, [servingSize, baseValues, setValue]);

  // Calculate calories based on updated macronutrients
  useEffect(() => {
    const calculateCalories = () => {
      let multiplier = 1;
      if (currentUnit === 'oz') {
        multiplier = 28.3495;
      }

      const proteinCals = (protein * multiplier * 4);
      const carbsCals = (carbs * multiplier * 4);
      const fatCals = (fat * multiplier * 9);
      
      const totalCals = (proteinCals + carbsCals + fatCals);
      
      setValue('dietJson.calories', Math.round(totalCals));
    };

    calculateCalories();
  }, [protein, carbs, fat, currentUnit, setValue]);

  // Create a debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (!searchTerm) {
        setSearchResults([]);
        return;
      }

      setSearchLoading(true);
      try {
        const results = await fetchFood(searchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setSearchLoading(false);
      }
    }, 500),
    []
  );

  // Clean up the debounced function on component unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleFoodSelect = async (event, selectedFood) => {
    if (!selectedFood) return;

    try {
      const foodDetails = await fetchFoodById(selectedFood.food_id);
      const serving = foodDetails.data.servings.serving[0];

      setBaseValues({
        protein: parseFloat(serving.protein),
        carbs: parseFloat(serving.carbohydrate),
        fat: parseFloat(serving.fat),
        fiber: parseFloat(serving.fiber)
      });

      setValue('dietJson.title', foodDetails.data.food_name);
      setValue('dietJson.protein', parseFloat(serving.protein));
      setValue('dietJson.carbs', parseFloat(serving.carbohydrate));
      setValue('dietJson.fat', parseFloat(serving.fat));
      setValue('dietJson.fiber', parseFloat(serving.fiber));
      setValue('dietJson.servingSize', 1);
    } catch (error) {
      console.error('Error fetching food details:', error);
    }
  };

  const onSubmit = (data) => {
    createStat({
      stat_type: 'food',
      date: data.date,
      dietJson: JSON.stringify(data.dietJson)
    });
    reset();
  };

  return (
    <>
      <FormCard icon={FoodIcon} title="Food Logging">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <Controller
                  name="searchMode"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      value={searchMode}
                      onChange={(e) => setSearchMode(e.target.value)}
                    >
                      <MenuItem value={false}>Manual Entry</MenuItem>
                      <MenuItem value={true}>Search Food</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <FormField
              name="date"
              control={control}
              label="Date and Time"
              type="datetime-local"
            />

            {searchMode ? (
              <Grid item xs={12}>
                <Autocomplete
                  options={searchResults}
                  getOptionLabel={(option) => option.food_name}
                  onChange={handleFoodSelect}
                  loading={searchLoading}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Search Food" 
                      variant="outlined" 
                      fullWidth 
                      onChange={(e) => debouncedSearch(e.target.value)}
                    />
                  )}
                />
              </Grid>
            ) : null}

            <FormField
              name="dietJson.title"
              control={control}
              label="Food Name"
              placeholder="Enter food name"
            />

            <FormField
              name="dietJson.description"
              control={control}
              label="Meal Description"
              multiline
              rows={2}
              gridProps={{ xs: 12 }}
            />

            <Grid item xs={12} md={6}>
              <Controller
                name="dietJson.unit"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Unit</InputLabel>
                    <Select {...field} label="Unit">
                      <MenuItem value="g">Grams (g)</MenuItem>
                      <MenuItem value="oz">Ounces (oz)</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <FormField
              name="dietJson.servingSize"
              control={control}
              label="Serving Size"
              type="number"
              InputProps={{ inputProps: { min: 0.1, step: 0.1 } }}
            />

            {['protein', 'carbs', 'fat', 'fiber'].map((nutrient) => (
              <FormField
                key={nutrient}
                name={`dietJson.${nutrient}`}
                control={control}
                label={nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
                type="number"
                endAdornment={<Typography variant="body2">{currentUnit}</Typography>}
              />
            ))}

            <FormField
              name="dietJson.calories"
              control={control}
              label="Calories"
              type="number"
              InputProps={{ readOnly: true }}
              endAdornment={<Typography variant="body2">kcal</Typography>}
            />

            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                startIcon={<AddIcon />}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Log Food'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormCard>

      <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
      <DataTable type="food" data={foodStats || []} />
    </>
  );
};

export default FoodLoggingForm;
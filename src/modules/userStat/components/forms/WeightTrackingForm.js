import { useState } from 'react';
import { Grid, Button, Typography, Select, MenuItem, FormControl, InputLabel , TextField} from '@mui/material';
import { Monitor as WeightIcon, Add as AddIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { FormCard, FormField, DateRangeSelector, DataTable } from '../';
import { useCreateUserStat, useUserStatsByType } from '../../hooks/useUserStat';
import { startOfDay, endOfDay } from 'date-fns';

const WeightTrackingForm = () => {
  const { mutate: createStat } = useCreateUserStat();
  const [dateRange, setDateRange] = useState([startOfDay(new Date()), endOfDay(new Date())]);
  const { data: weightStats } = useUserStatsByType(
    dateRange[0].toISOString(),
    dateRange[1].toISOString(),
    'weight'
  );

  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      date: new Date(),
      weightJson: {
        weight: '',
        unit: 'lbs',
        bodyFatPercentage: '',
        measurementLocation: '',
        notes: ''
      }
    }
  });

  const onSubmit = (data) => {
    createStat({
      stat_type: 'weight',
      date: data.date,
      weightJson: JSON.stringify(data.weightJson)
    });
    reset();
  };

  return (
    <>
      <FormCard icon={WeightIcon} title="Weight Tracking">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <FormField
              name="date"
              control={control}
              label="Date and Time"
              type="datetime-local"
            />
            
            <Grid item xs={12} md={6}>
              <Controller
                name="weightJson.weight"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Weight"
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <Controller
                          name="weightJson.unit"
                          control={control}
                          render={({ field: unitField }) => (
                            <Select
                              {...unitField}
                              variant="standard"
                              sx={{ width: 70 }}
                            >
                              <MenuItem value="lbs">lbs</MenuItem>
                              <MenuItem value="kg">kg</MenuItem>
                            </Select>
                          )}
                        />
                      )
                    }}
                  />
                )}
              />
            </Grid>

            <FormField
              name="weightJson.bodyFatPercentage"
              control={control}
              label="Body Fat %"
              type="number"
              endAdornment={<Typography variant="body2">%</Typography>}
            />

            <FormField
              name="weightJson.measurementLocation"
              control={control}
              label="Measurement Location"
              placeholder="Home, Gym, etc."
            />

            <FormField
              name="weightJson.notes"
              control={control}
              label="Additional Notes"
              multiline
              rows={2}
              gridProps={{ xs: 12 }}
            />

            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                startIcon={<AddIcon />}
              >
                Log Weight
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormCard>

      <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
      <DataTable type="weight" data={weightStats || []} />
    </>
  );
};

export default WeightTrackingForm;
import { FormField, DateRangeSelector, FormCard } from '../index';
import { useForm } from 'react-hook-form';
import { Grid, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import { useCreateUserStat, useUserStatsByType } from '../../hooks/useUserStat';
import { startOfDay, endOfDay } from 'date-fns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useState } from 'react';
import { DataTable } from '../index';

const WaterIntakeForm = () => {
  const { mutate: createStat } = useCreateUserStat();
  const [dateRange, setDateRange] = useState([startOfDay(new Date()), endOfDay(new Date())]);
  const { data: waterStats } = useUserStatsByType(
    dateRange[0].toISOString(),
    dateRange[1].toISOString(),
    'water'
  );

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      date: new Date(),
      waterJson: {
        glasses: 1,
        glassSize: 8,
        location: '',
        notes: ''
      }
    }
  });

  const onSubmit = (data) => {
    createStat({
      stat_type: 'water',
      date: data.date,
      waterJson: JSON.stringify(data.waterJson)
    });
    reset();
  };

  return (
    <FormCard title="Water Intake">
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <FormField
            name="date"
            control={control}
            label="Date and Time"
            component={DateTimePicker}
          />
          <FormField
            name="waterJson.glasses"
            control={control}
            label="Number of Glasses"
            type="number"
            endAdornment={<Typography variant="body2">glasses</Typography>}
          />
          {/* ... other fields ... */}
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
              startIcon={<AddIcon />}
            >
              Log Water Intake
            </Button>
          </Grid>
        </Grid>
      </form>

      <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
      <DataTable type="water" data={waterStats || []} />
    </LocalizationProvider>
    </FormCard>
  );
};

export default WaterIntakeForm; 
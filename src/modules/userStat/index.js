import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Grid, 
  Paper, 
  Tabs, 
  Tab, 
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Autocomplete,
  Container,
  Card,
  CardContent,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Collapse,
  CardHeader,
  Stack
} from '@mui/material';
import { 
  Add as AddIcon, 
  LocalDrink as WaterIcon,
  Monitor as WeightIcon,
  Restaurant as FoodIcon,
  Delete as DeleteIcon,
  ShowChart as StatsIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useForm, Controller } from 'react-hook-form';
import {
  fetchFood,
  fetchFoodById,
  useCreateUserStat,
  useUserStats,
  useUserStatsByType,
  useDeleteUserStat
} from "./hooks/useUserStat";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CustomInput from './PickersCustomInput'

import { debounce } from 'lodash';
import HealthStats from './components/HealthStats.js';
import { format, startOfDay, endOfDay } from 'date-fns';
import TableSortLabel from '@mui/material/TableSortLabel';

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const descendingComparator = (a, b, property) => {
  if (property === 'date') {
    return new Date(b.date) - new Date(a.date);
  }
  
  // Handle nested JSON properties
  if (property.includes('.')) {
    const [jsonField, nestedProp] = property.split('.');
    const aValue = JSON.parse(a[jsonField])[nestedProp];
    const bValue = JSON.parse(b[jsonField])[nestedProp];
    if (bValue < aValue) return -1;
    if (bValue > aValue) return 1;
    return 0;
  }

  if (b[property] < a[property]) return -1;
  if (b[property] > a[property]) return 1;
  return 0;
};

// Add this new component for the data table
const DataTable = ({ type, data, onDelete }) => {
  const { mutate: deleteStat } = useDeleteUserStat();
  const [expandedRows, setExpandedRows] = useState({});
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('date');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      deleteStat(id);
    }
  };

  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getTableTitle = () => {
    switch(type) {
      case 'water':
        return 'Water Intake History';
      case 'weight':
        return 'Weight Tracking History';
      case 'food':
        return 'Food Log History';
      default:
        return 'History';
    }
  };

  const getSortableHeaders = () => {
    switch(type) {
      case 'water':
        return [
          { id: 'date', label: 'Date' },
          { id: 'waterJson.glasses', label: 'Glasses' },
          { id: 'waterJson.glassSize', label: 'Size (oz)' },
        ];
      case 'weight':
        return [
          { id: 'date', label: 'Date' },
          { id: 'weightJson.weight', label: 'Weight' },
          { id: 'weightJson.bodyFatPercentage', label: 'Body Fat %' },
        ];
      case 'food':
        return [
          { id: 'date', label: 'Date' },
          { id: 'dietJson.title', label: 'Food' },
          { id: 'dietJson.calories', label: 'Calories' },
        ];
      default:
        return [];
    }
  };

  const sortedData = React.useMemo(() => {
    return [...data].sort(getComparator(order, orderBy));
  }, [data, order, orderBy]);

  // Group data by date
  const groupedData = React.useMemo(() => {
    return data.reduce((acc, entry) => {
      const dateKey = format(new Date(entry.date), 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(entry);
      return acc;
    }, {});
  }, [data]);

  // Calculate daily totals
  const getDailyTotals = (entries, type) => {
    switch(type) {
      case 'water':
        return entries.reduce((total, entry) => {
          const waterData = JSON.parse(entry.waterJson);
          return total + (waterData.glasses * waterData.glassSize);
        }, 0);
      case 'food':
        return entries.reduce((totals, entry) => {
          const dietData = JSON.parse(entry.dietJson);
          return {
            calories: (totals.calories || 0) + Number(dietData.calories),
            protein: (totals.protein || 0) + Number(dietData.protein),
            carbs: (totals.carbs || 0) + Number(dietData.carbs),
            fat: (totals.fat || 0) + Number(dietData.fat)
          };
        }, {});
      default:
        return null;
    }
  };

  const renderTableContent = () => {
    switch(type) {
      case 'water':
        return (
          <>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Details</TableCell>
                <TableCell align="right">Daily Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(groupedData)
                .sort(([a], [b]) => new Date(b) - new Date(a))
                .map(([date, entries]) => {
                  const dailyTotal = entries.reduce((total, entry) => {
                    const waterData = JSON.parse(entry.waterJson);
                    return total + (waterData.glasses * waterData.glassSize);
                  }, 0);

                  return (
                    <TableRow key={date} sx={{ '& > *': { borderBottom: 'unset' } }}>
                      <TableCell component="th" scope="row">
                        <Typography variant="subtitle1" fontWeight="medium">
                          {format(new Date(date), 'EEE, MMM d')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {entries.map((entry) => {
                            const waterData = JSON.parse(entry.waterJson);
                            return (
                              <Box 
                                key={entry.id} 
                                sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor: 'background.paper',
                                  '&:hover': { bgcolor: 'action.hover' }
                                }}
                              >
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {format(new Date(entry.date), 'h:mm a')}
                                  </Typography>
                                  <Typography variant="body2">
                                    {waterData.glasses} glasses × {waterData.glassSize}oz
                                  </Typography>
                                </Box>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(entry.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            );
                          })}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" color="primary">
                          {dailyTotal}oz
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </>
        );

      case 'food':
        return (
          <>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Meals</TableCell>
                <TableCell align="right">Daily Totals</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(groupedData)
                .sort(([a], [b]) => new Date(b) - new Date(a))
                .map(([date, entries]) => {
                  const dailyTotals = entries.reduce((totals, entry) => {
                    const dietData = JSON.parse(entry.dietJson);
                    return {
                      calories: (totals.calories || 0) + Number(dietData.calories),
                      protein: (totals.protein || 0) + Number(dietData.protein),
                      carbs: (totals.carbs || 0) + Number(dietData.carbs),
                      fat: (totals.fat || 0) + Number(dietData.fat)
                    };
                  }, {});

                  return (
                    <TableRow key={date} sx={{ '& > *': { borderBottom: 'unset' } }}>
                      <TableCell component="th" scope="row">
                        <Typography variant="subtitle1" fontWeight="medium">
                          {format(new Date(date), 'EEE, MMM d')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {entries.map((entry) => {
                            const dietData = JSON.parse(entry.dietJson);
                            return (
                              <Box 
                                key={entry.id} 
                                sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor: 'background.paper',
                                  '&:hover': { bgcolor: 'action.hover' }
                                }}
                              >
                                <Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {format(new Date(entry.date), 'h:mm a')}
                                  </Typography>
                                  <Typography variant="body2">
                                    {dietData.title} - {dietData.calories}kcal
                                  </Typography>
                                </Box>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDelete(entry.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            );
                          })}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" color="primary">
                            {dailyTotals.calories}kcal
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            P: {dailyTotals.protein}g | C: {dailyTotals.carbs}g | F: {dailyTotals.fat}g
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </>
        );

      case 'weight':
        return (
          <>
            <TableHead>
              <TableRow>
                <TableCell />
                {getSortableHeaders().map((header) => (
                  <TableCell key={header.id}>
                    <TableSortLabel
                      active={orderBy === header.id}
                      direction={orderBy === header.id ? order : 'asc'}
                      onClick={() => handleRequestSort(header.id)}
                    >
                      {header.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData.map((entry) => {
                const weightData = JSON.parse(entry.weightJson);
                return (
                  <React.Fragment key={entry.id}>
                    <TableRow>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => toggleRow(entry.id)}
                        >
                          {expandedRows[entry.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>{format(new Date(entry.date), 'MMM d, yyyy h:mm a')}</TableCell>
                      <TableCell>{weightData.weight} {weightData.unit}</TableCell>
                      <TableCell>{weightData.bodyFatPercentage}%</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                        <Collapse in={expandedRows[entry.id]} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                              Additional Details
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Typography variant="subtitle2">Location: {weightData.measurementLocation || 'Not specified'}</Typography>
                                <Typography variant="subtitle2">Notes: {weightData.notes || 'No notes'}</Typography>
                              </Grid>
                              {weightData.measurements && (
                                <Grid item xs={12}>
                                  <Typography variant="h6" gutterBottom>Body Measurements</Typography>
                                  <Table size="small">
                                    <TableBody>
                                      {Object.entries(weightData.measurements).map(([key, value]) => (
                                        value && (
                                          <TableRow key={key}>
                                            <TableCell component="th" scope="row">
                                              {key.replace(/([A-Z])/g, ' $1').trim()}
                                            </TableCell>
                                            <TableCell>
                                              {value} {weightData.unit === 'lbs' ? 'in' : 'cm'}
                                            </TableCell>
                                          </TableRow>
                                        )
                                      ))}
                                    </TableBody>
                                  </Table>
                                </Grid>
                              )}
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </>
        );
    }
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardHeader 
        title={getTableTitle()}
        sx={{
          backgroundColor: (theme) => theme.palette.background.default,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          '& .MuiCardHeader-title': {
            fontSize: '1.2rem',
            fontWeight: 500,
          },
        }}
      />
      <CardContent>
        <TableContainer>
          <Table size="small">
            {renderTableContent()}
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

// Water Intake Component
const WaterIntakeForm = () => {
  const { mutate: createStat } = useCreateUserStat();
  const { control, handleSubmit, reset, setValue } = useForm({
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

  const [dateRange, setDateRange] = useState([startOfDay(new Date()), endOfDay(new Date())]);
  const { data: waterStats } = useUserStatsByType(
    dateRange[0].toISOString(),
    dateRange[1].toISOString(),
    'water'
  );

  const onSubmit = (data) => {
    createStat({
      stat_type: 'water',
      date: data.date,
      waterJson: JSON.stringify(data.waterJson)
    });
    reset();
  };

  return (
    <> 
    <Card sx={{ mb: 2 }}>
      <CardContent>
       
        <Typography 
          variant="h6" 
          color="primary" 
          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
        >
          <WaterIcon sx={{ mr: 1 }} /> Water Intake
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  mb: 2, 
                  p: 2,
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center', 
                  gap: 2,
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 1
                }}
              >
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2} 
                  sx={{ flex: 1 }}
                >
                  <Controller
                    name="date"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        selected={value}
                        onChange={onChange}
                        showTimeSelect
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        customInput={<CustomInput label="Date and Time" />}
                        popperPlacement="bottom-start"
                      />
                    )}
                  />
                </Stack>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setValue('date', new Date())}
                >
                  Now
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="waterJson.glasses"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Number of Glasses"
                    variant="outlined"
                    InputProps={{
                      endAdornment: <Typography variant="body2">glasses</Typography>
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="waterJson.glassSize"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Glass Size"
                    variant="outlined"
                    InputProps={{
                      endAdornment: <Typography variant="body2">oz</Typography>
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="waterJson.location"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Location"
                    variant="outlined"
                    placeholder="Where did you drink water?"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="waterJson.notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Additional Notes"
                    variant="outlined"
                    multiline
                    rows={2}
                    placeholder="Any additional details about your water intake"
                  />
                )}
              />
            </Grid>
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
      </CardContent>
      
    </Card>

    <Divider sx={{ my: 4 }} />
    <Box 
  sx={{ 
    mb: 2, 
    p: 2,
    display: 'flex', 
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: 'center', 
    gap: 2,
    backgroundColor: 'background.paper',
    borderRadius: 1,
    boxShadow: 1
  }}
>
  <Typography variant="subtitle1" sx={{ mr: 2 }}>Date Range:</Typography>
  <Stack 
    direction={{ xs: 'column', sm: 'row' }} 
    spacing={2} 
    sx={{ flex: 1 }}
  >
    <DatePicker
      selected={dateRange[0]}
      onChange={(date) => setDateRange([date || startOfDay(new Date()), dateRange[1]])}
      showTimeSelect
      timeIntervals={15}
      dateFormat="MMMM d, yyyy h:mm aa"
      customInput={<CustomInput label="From" />}
      popperPlacement="bottom-start"
    />
    <DatePicker
      selected={dateRange[1]}
      onChange={(date) => setDateRange([dateRange[0], date || endOfDay(new Date())])}
      showTimeSelect
      timeIntervals={15}
      dateFormat="MMMM d, yyyy h:mm aa"
      customInput={<CustomInput label="To" />}
      popperPlacement="bottom-start"
    />
  </Stack>
  <Button
    variant="outlined"
    size="small"
    onClick={() => setDateRange([startOfDay(new Date()), endOfDay(new Date())])}
  >
    Today
  </Button>
</Box>

    <DataTable type="water" data={waterStats || []} />

    <Box sx={{ mb: 3, p: 2, bgcolor: 'warning', borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Daily Water Intake Guidelines
          </Typography>
          <Typography variant="body2" paragraph>
            • General recommendation: 8 glasses (64 oz) of water per day
            • Active individuals: 0.5-1 oz of water per pound of body weight
            • Additional intake needed during exercise or hot weather
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ⚠️ These are general guidelines. Individual needs vary based on activity level, climate, health conditions, and other factors. Please consult your healthcare provider for personalized recommendations.
          </Typography>
        </Box>
        
    </>
  );
};

// Weight Tracking Component
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
        notes: '',
        measurements: {
          neck: '',
          shoulders: '',
          chest: '',
          leftArm: '',
          rightArm: '',
          leftForearm: '',
          rightForearm: '',
          waist: '',
          hips: '',
          leftThigh: '',
          rightThigh: '',
          leftCalf: '',
          rightCalf: ''
        }
      }
    }
  });

  const unit = watch('weightJson.unit');

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
    <Card sx={{ mb: 2 }}>
      <CardContent>
       
        <Typography 
          variant="h6" 
          color="primary" 
          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
        >
          <WeightIcon sx={{ mr: 1 }} /> Weight Tracking
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box 
                sx={{ 
                  mb: 2, 
                  p: 2,
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center', 
                  gap: 2,
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 1
                }}
              >
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2} 
                  sx={{ flex: 1 }}
                >
                  <Controller
                    name="date"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <DatePicker
                        selected={value}
                        onChange={onChange}
                        showTimeSelect
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        customInput={<CustomInput label="Date and Time" />}
                        popperPlacement="bottom-start"
                      />
                    )}
                  />
                </Stack>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setValue('date', new Date())}
                >
                  Now
                </Button>
              </Box>
            </Grid>
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
            <Grid item xs={12} md={6}>
              <Controller
                name="weightJson.bodyFatPercentage"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Body Fat %"
                    variant="outlined"
                    InputProps={{
                      endAdornment: <Typography variant="body2">%</Typography>
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="weightJson.measurementLocation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Measurement Location"
                    variant="outlined"
                    placeholder="Home, Gym, etc."
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="weightJson.notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Additional Notes"
                    variant="outlined"
                    multiline
                    rows={2}
                    placeholder="How are you feeling? Any observations?"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Body Measurements Section */}
            {[
              { id: 'neck', label: 'Neck' },
              { id: 'shoulders', label: 'Shoulders' },
              { id: 'chest', label: 'Chest' },
              { id: 'leftArm', label: 'Left Arm' },
              { id: 'rightArm', label: 'Right Arm' },
              { id: 'leftForearm', label: 'Left Forearm' },
              { id: 'rightForearm', label: 'Right Forearm' },
              { id: 'waist', label: 'Waist' },
              { id: 'hips', label: 'Hips' },
              { id: 'leftThigh', label: 'Left Thigh' },
              { id: 'rightThigh', label: 'Right Thigh' },
              { id: 'leftCalf', label: 'Left Calf' },
              { id: 'rightCalf', label: 'Right Calf' }
            ].map(({ id, label }) => (
              <Grid item xs={12} sm={6} md={4} key={id}>
                <Controller
                  name={`weightJson.measurements.${id}`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label={label}
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2">
                            {field.value ? (unit === 'lbs' ? 'in' : 'cm') : ''}
                          </Typography>
                        )
                      }}
                      placeholder="0.0"
                    />
                  )}
                />
              </Grid>
            ))}

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
      </CardContent>
    </Card>
    <Divider sx={{ my: 4 }} />
    <Box 
  sx={{ 
    mb: 2, 
    p: 2,
    display: 'flex', 
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: 'center', 
    gap: 2,
    backgroundColor: 'background.paper',
    borderRadius: 1,
    boxShadow: 1
  }}
>
  <Typography variant="subtitle1" sx={{ mr: 2 }}>Date Range:</Typography>
  <Stack 
    direction={{ xs: 'column', sm: 'row' }} 
    spacing={2} 
    sx={{ flex: 1 }}
  >
    <DatePicker
      selected={dateRange[0]}
      onChange={(date) => setDateRange([date || startOfDay(new Date()), dateRange[1]])}
      showTimeSelect
      timeIntervals={15}
      dateFormat="MMMM d, yyyy h:mm aa"
      customInput={<CustomInput label="From" />}
      popperPlacement="bottom-start"
    />
    <DatePicker
      selected={dateRange[1]}
      onChange={(date) => setDateRange([dateRange[0], date || endOfDay(new Date())])}
      showTimeSelect
      timeIntervals={15}
      dateFormat="MMMM d, yyyy h:mm aa"
      customInput={<CustomInput label="To" />}
      popperPlacement="bottom-start"
    />
  </Stack>
  <Button
    variant="outlined"
    size="small"
    onClick={() => setDateRange([startOfDay(new Date()), endOfDay(new Date())])}
  >
    Today
  </Button>
</Box>


    <DataTable type="weight" data={weightStats || []} />
    {/* <Box sx={{ mb: 3, p: 2,  borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Weight Tracking Guidelines
          </Typography>
          <Typography variant="body2" paragraph>
            • Weigh yourself consistently (same time, same conditions)
            • Healthy weight loss: 1-2 pounds (0.5-1 kg) per week
            • Body measurements provide additional context to weight changes
            • Body fat percentage ranges:
              - Men: 10-20% (athletic), 20-30% (average)
              - Women: 18-28% (athletic), 28-38% (average)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ⚠️ These ranges are general guidelines. Healthy weight varies by age, height, body composition, and other factors. Consult with healthcare providers or fitness professionals for personalized goals and advice.
          </Typography>
        </Box> */}

    </>
  );
};

// Food Logging Component
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
  const [unit, setUnit] = useState('g');

  // Store the base values (for 1 serving)
  const [baseValues, setBaseValues] = React.useState({
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
  React.useEffect(() => {
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
  React.useEffect(() => {
    if (servingSize) {
      setValue('dietJson.protein', Number((baseValues.protein * servingSize).toFixed(1)));
      setValue('dietJson.carbs', Number((baseValues.carbs * servingSize).toFixed(1)));
      setValue('dietJson.fat', Number((baseValues.fat * servingSize).toFixed(1)));
      setValue('dietJson.fiber', Number((baseValues.fiber * servingSize).toFixed(1)));
    }
  }, [servingSize, baseValues, setValue]);

  // Calculate calories based on updated macronutrients
  React.useEffect(() => {
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
  const debouncedSearch = React.useCallback(
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
    }, 500), // 500ms delay
    []
  );

  // Clean up the debounced function on component unmount
  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // When selecting food from search, store the base values
  const handleFoodSelect = async (event, selectedFood) => {
    if (!selectedFood) return;

    try {
      const foodDetails = await fetchFoodById(selectedFood.food_id);
      const serving = foodDetails.data.servings.serving[0];

      // Store base values for 1 serving
      setBaseValues({
        protein: parseFloat(serving.protein),
        carbs: parseFloat(serving.carbohydrate),
        fat: parseFloat(serving.fat),
        fiber: parseFloat(serving.fiber)
      });

      // Set initial values
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
      <Card sx={{ mb: 2 }}>
        <CardContent>
          {/* <Box sx={{ mb: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Nutrition Guidelines
            </Typography>
            <Typography variant="body2" paragraph>
              • General macro distribution:
                - Protein: 10-35% of daily calories (0.8-2.2g/kg body weight)
                - Carbohydrates: 45-65% of daily calories
                - Fats: 20-35% of daily calories
              • Fiber: 25-30g daily for adults
              • Daily calorie needs vary based on age, gender, activity level, and goals
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ⚠️ These are general guidelines only. Individual nutritional needs vary significantly. Consult with a registered dietitian or healthcare provider for personalized nutrition advice, especially if you have specific health conditions or fitness goals.
            </Typography>
          </Box> */}

          <Typography 
            variant="h6" 
            color="primary" 
            sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
          >
            <FoodIcon sx={{ mr: 1 }} /> Food Logging
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Tabs 
                  value={searchMode ? 1 : 0} 
                  onChange={(_, newValue) => setSearchMode(newValue === 1)}
                  variant="fullWidth"
                >
                  <Tab label="Manual Entry" />
                  <Tab label="Search Food" />
                </Tabs>
              </Grid>

              <Grid item xs={12}>
                <Box 
                  sx={{ 
                    mb: 2, 
                    p: 2,
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center', 
                    gap: 2,
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 1
                  }}
                >
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={2} 
                    sx={{ flex: 1 }}
                  >
                    <Controller
                      name="date"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <DatePicker
                          selected={value}
                          onChange={onChange}
                          showTimeSelect
                          timeIntervals={15}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          customInput={<CustomInput label="Date and Time" />}
                          popperPlacement="bottom-start"
                        />
                      )}
                    />
                  </Stack>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setValue('date', new Date())}
                  >
                    Now
                  </Button>
                </Box>
              </Grid>

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
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Box>
                          <Typography variant="body1">{option.food_name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {option.food_description}
                          </Typography>
                        </Box>
                      </li>
                    )}
                  />
                </Grid>
              ) : null}

              <Grid item xs={12}>
                <Controller
                  name="dietJson.title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Food Name"
                      variant="outlined"
                      placeholder="Enter food name"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="dietJson.description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Meal Description"
                      variant="outlined"
                      multiline
                      rows={2}
                      placeholder="Additional details about the meal"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="dietJson.unit"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Unit</InputLabel>
                      <Select {...field} label="Unit">
                        <MenuItem value="g">Grams (g)</MenuItem>
                        <MenuItem value="oz">Ounces (oz)</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="dietJson.servingSize"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Serving Size"
                      variant="outlined"
                      InputProps={{
                        inputProps: { min: 0.1, step: 0.1 }
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Nutrition Details with units */}
              {['protein', 'carbs', 'fat', 'fiber'].map((nutrient) => (
                <Grid item xs={12} md={4} key={nutrient}>
                  <Controller
                    name={`dietJson.${nutrient}`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type="number"
                        label={nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}
                        variant="outlined"
                        InputProps={{
                          inputProps: { min: 0, step: 0.1 },
                          endAdornment: (
                            <Typography variant="body2">
                              {currentUnit}
                            </Typography>
                          )
                        }}
                      />
                    )}
                  />
                </Grid>
              ))}

              <Grid item xs={12} md={4}>
                <Controller
                  name="dietJson.calories"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Calories"
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                        endAdornment: <Typography variant="body2">kcal</Typography>
                      }}
                    />
                  )}
                />
              </Grid>

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
        </CardContent>
      </Card>

      {/* Add date range selection */}
      <Divider sx={{ my: 4 }} />
      <Box 
  sx={{ 
    mb: 2, 
    p: 2,
    display: 'flex', 
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: 'center', 
    gap: 2,
    backgroundColor: 'background.paper',
    borderRadius: 1,
    boxShadow: 1
  }}
>
  <Typography variant="subtitle1" sx={{ mr: 2 }}>Date Range:</Typography>
  <Stack 
    direction={{ xs: 'column', sm: 'row' }} 
    spacing={2} 
    sx={{ flex: 1 }}
  >
    <DatePicker
      selected={dateRange[0]}
      onChange={(date) => setDateRange([date || startOfDay(new Date()), dateRange[1]])}
      showTimeSelect
      timeIntervals={15}
      dateFormat="MMMM d, yyyy h:mm aa"
      customInput={<CustomInput label="From" />}
      popperPlacement="bottom-start"
    />
    <DatePicker
      selected={dateRange[1]}
      onChange={(date) => setDateRange([dateRange[0], date || endOfDay(new Date())])}
      showTimeSelect
      timeIntervals={15}
      dateFormat="MMMM d, yyyy h:mm aa"
      customInput={<CustomInput label="To" />}
      popperPlacement="bottom-start"
    />
  </Stack>
  <Button
    variant="outlined"
    size="small"
    onClick={() => setDateRange([startOfDay(new Date()), endOfDay(new Date())])}
  >
    Today
  </Button>
</Box>

      <DataTable type="food" data={foodStats || []} />
    </>
  );
};

// Main Health Tracking Page
const HealthTrackingPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = [
    { icon: <WaterIcon />, label: "Water", component: WaterIntakeForm },
    { icon: <WeightIcon />, label: "Weight", component: WeightTrackingForm },
    { icon: <FoodIcon />, label: "Food", component: FoodLoggingForm },
    { icon: <StatsIcon />, label: "Statistics", component: HealthStats }
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Tabs 
        value={activeTab} 
        onChange={(_, newValue) => setActiveTab(newValue)}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        {tabs.map(({ icon, label }) => (
          <Tab key={label} icon={icon} label={label} />
        ))}
      </Tabs>

      {React.createElement(tabs[activeTab].component)}
    </Container>
  );
};

export default HealthTrackingPage;
// src/modules/userStat/components/HealthStats.jsx
import React, { useState, useMemo } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Tabs,
  Tab,
  ButtonGroup,
  Button,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays, subMonths, startOfDay, endOfDay } from 'date-fns';
import { useUserStatsByType } from '../hooks/useUserStat';

const timeRanges = [
  { label: 'Week', value: 7 },
  { label: 'Month', value: 30 },
  { label: '3 Months', value: 90 },
  { label: '6 Months', value: 180 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Water Stats Component
const WaterStats = ({ timeRange }) => {
  const baseDate = new Date('2024-12-15');
  const startDate = format(subDays(baseDate, timeRange), 'yyyy-MM-dd');
  const endDate = format(baseDate, 'yyyy-MM-dd');

  const { data: waterStats } = useUserStatsByType(
    startDate,
    endDate,
    'water'
  );

  const processedData = useMemo(() => {
    if (!Array.isArray(waterStats) || !waterStats?.length) {
      return [];
    }
    
    return waterStats
      .filter(stat => stat.waterJson && typeof stat.waterJson === 'string')
      .map(stat => {
        try {
          const waterData = JSON.parse(stat.waterJson);
          return {
            date: format(new Date(stat.date), 'MM/dd'),
            amount: waterData.glasses * waterData.glassSize,
            rawDate: new Date(stat.date)
          };
        } catch (e) {
          console.error('Error parsing water data:', e);
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.rawDate - b.rawDate);
  }, [waterStats]);

  const totalWater = useMemo(() => {
    return processedData.reduce((sum, item) => sum + item.amount, 0);
  }, [processedData]);

  const averageWater = useMemo(() => {
    return processedData.length ? (totalWater / processedData.length).toFixed(1) : 0;
  }, [processedData, totalWater]);

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Water Intake Statistics</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="subtitle1">Total Water Intake</Typography>
              <Typography variant="h4">{totalWater} oz</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle1">Daily Average</Typography>
              <Typography variant="h4">{averageWater} oz</Typography>
            </Box>
          </Grid>
         
        </Grid>
        <Grid item xs={12} md={8}>
        <Grid item xs={12} md={8}>
        <ResponsiveContainer 
            width='100%' 
            aspect={4.0/3.0}
            >
            <LineChart width={1300} height={300} data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
               type="monotone" dataKey="amount" stroke="#8884d8" name="Water (oz)" />
            </LineChart>
            </ResponsiveContainer>
          </Grid>

        </Grid>
      </CardContent>
    </Card>
  );
};

// Weight Stats Component
const WeightStats = ({ timeRange }) => {
  const baseDate = new Date('2024-12-15');
  const startDate = format(subDays(baseDate, timeRange), 'yyyy-MM-dd');
  const endDate = format(baseDate, 'yyyy-MM-dd');

  const { data: weightStats } = useUserStatsByType(
    startDate,
    endDate,
    'weight'
  );

  const processedData = useMemo(() => {
    if (!Array.isArray(weightStats) || !weightStats?.length) {
      return [];
    }
  
    return weightStats
      .filter(stat => stat.weightJson && typeof stat.weightJson === 'string')
      .map(stat => {
        try {
          const weightJson = JSON.parse(stat.weightJson);
          return {
            date: format(new Date(stat.date), 'MM/dd'),
            weight: parseFloat(weightJson.weight) || 0,
            bodyFat: parseFloat(weightJson.bodyFatPercentage) || 0,
            rawDate: new Date(stat.date)
          };
        } catch (e) {
          console.error('Error parsing weight data:', e);
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.rawDate - b.rawDate);
  }, [weightStats]);

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Weight Statistics</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ResponsiveContainer 
            width='100%' 
            aspect={4.0/3.0}
            >
            <LineChart  width={1300} height={300}  data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="weight" 
                stroke="#8884d8" 
                name="Weight (lbs)" 
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="bodyFat" 
                stroke="#82ca9d" 
                name="Body Fat %" 
              />
            </LineChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Food Stats Component
const FoodStats = ({ timeRange }) => {
  const baseDate = new Date('2024-12-15');
  const startDate = format(subDays(baseDate, timeRange), 'yyyy-MM-dd');
  const endDate = format(baseDate, 'yyyy-MM-dd');

  const { data: foodStats } = useUserStatsByType(
    startDate,
    endDate,
    'food'
  );

  const processedData = useMemo(() => {
    if (!Array.isArray(foodStats) || !foodStats?.length) {
      return [];
    }
    console.log("foodStats", foodStats);
    return foodStats
      .filter(stat => stat.dietJson && typeof stat.dietJson === 'string')
      .map(stat => {
        try {
          const dietJson = JSON.parse(stat.dietJson);
          return {
            date: format(new Date(stat.date), 'MM/dd'),
            calories: parseFloat(dietJson.calories) || 0,
            protein: parseFloat(dietJson.protein) || 0,
            carbs: parseFloat(dietJson.carbs) || 0,
            fat: parseFloat(dietJson.fat) || 0,
            rawDate: new Date(stat.date)
          };
        } catch (e) {
          console.error('Error parsing food data:', e);
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.rawDate - b.rawDate);
  }, [foodStats]);

  const macroDistribution = useMemo(() => {
    const totals = processedData.reduce((acc, curr) => ({
      protein: acc.protein + curr.protein,
      carbs: acc.carbs + curr.carbs,
      fat: acc.fat + curr.fat,
    }), { protein: 0, carbs: 0, fat: 0 });

    return [
      { name: 'Protein', value: totals.protein },
      { name: 'Carbs', value: totals.carbs },
      { name: 'Fat', value: totals.fat },
    ];
  }, [processedData]);

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Nutrition Statistics</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <ResponsiveContainer 
            width='100%' 
            aspect={4.0/3.0}
            >
            <BarChart width={600} height={300} data={processedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="calories" fill="#8884d8" name="Calories" />
            </BarChart>
            </ResponsiveContainer>
          </Grid>
          
        </Grid>
        <Grid item xs={12} md={4}>
            <ResponsiveContainer 
            width='100%' 
            aspect={4.0/3.0}
            >
            <PieChart width={300} height={300}>
              <Pie
                data={macroDistribution}
                cx={150}
                cy={150}
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {macroDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
            </ResponsiveContainer>
          </Grid>
      </CardContent>
    </Card>
  );
};

// Main HealthStats Component
const HealthStats = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState(7); // Default to week view

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Health Statistics</Typography>
      
      <Box sx={{ mb: 3 }}>
        <ButtonGroup variant="outlined">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              onClick={() => setTimeRange(range.value)}
              variant={timeRange === range.value ? 'contained' : 'outlined'}
            >
              {range.label}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      <Tabs 
        value={activeTab} 
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Water" />
        <Tab label="Weight" />
        <Tab label="Food" />
      </Tabs>

      {activeTab === 0 && <WaterStats timeRange={timeRange} />}
      {activeTab === 1 && <WeightStats timeRange={timeRange} />}
      {activeTab === 2 && <FoodStats timeRange={timeRange} />}
    </Container>
  );
};

export default HealthStats;
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Collapse,
  CardHeader,
  useTheme
} from '@mui/material';
import {
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  RestaurantMenu as DietIcon,
  FitnessCenter as ProgramIcon
} from '@mui/icons-material';
import { getAllUserAndTrainerList } from 'src/modules/diet/hooks/useDiet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



const UserAssignmentsChart = ({ data }) => {
    console.log(data)
    const theme = useTheme();
  
    // Process data
    const chartData = data.map(item => ({
      name: `${item?.userInfo?.first_name} ${item?.userInfo?.last_name}`,
      'Assigned Diets': item?.Assigned_Diet?.length,
      'Assigned Programs': item?.Assigned_Program?.length
    }));
    console.log('chartData', chartData)
    return (
      <Card sx={{mt: 2, mb: 2}}>
        <CardHeader title="User Assignments Overview" />
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Assigned Diets" fill={theme.palette.primary.main} />
              <Bar dataKey="Assigned Programs" fill={theme.palette.secondary.main} />
            </BarChart>
          </ResponsiveContainer>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            This chart shows the number of assigned diets and programs for each user.
          </Typography>
        </CardContent>
      </Card>
    );
  };
  
  export default UserAssignmentsChart;
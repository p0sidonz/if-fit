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
} from '@mui/material';
import {
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  RestaurantMenu as DietIcon,
  FitnessCenter as ProgramIcon,
  

} from '@mui/icons-material';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import TrainersStats from './TrainersStats';
import { getAllUserAndTrainerList } from 'src/modules/diet/hooks/useDiet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import UserAssignmentsChart from './Stats';

const UserTrainerDashboard = () => {
  const { data: relationships, isLoading } = getAllUserAndTrainerList();
  // const [relationships, setRelationships] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  if (isLoading) return <p>Loading...</p>

  // Sample data preparation
  const data = relationships.map((rel) => ({
    username: rel?.userInfo?.username,
    assignedDiets: rel?.Assigned_Diet?.length,
    assignedPrograms: rel?.Assigned_Program?.length,
  }));

  

  // useEffect(() => {
  //   // Replace this with your actual API call
  //   const fetchData = async () => {
  //     const response = await fetch('/api/user-trainer-relationships');
  //     const data = await response.json();
  //     setRelationships(data);
  //   };
  //   fetchData();
  // }, []);

  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderExpandedRow = (relationship) => (
    <TableRow>
      <TableCell colSpan={6}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Assigned Diets</Typography>
              {relationship.Assigned_Diet.length > 0 ? (
                relationship.Assigned_Diet.map((diet) => (
                  <Chip
                    key={diet.id}
                    icon={<DietIcon />}
                    label={diet.dietInfo.title}
                    variant="outlined"
                    sx={{ m: 0.5 }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No diets assigned</Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Assigned Programs</Typography>
              {relationship.Assigned_Program.length > 0 ? (
                relationship.Assigned_Program.map((program) => (
                  <Chip
                    key={program.id}
                    icon={<ProgramIcon />}
                    label={program.programInfo.title}
                    variant="outlined"
                    sx={{ m: 0.5 }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No programs assigned</Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Assigned Forms</Typography>
              {relationship?.userInfo?.AssignedForms?.length > 0 ? (
                relationship?.userInfo?.AssignedForms?.map((form) => (
                  <Chip
                    key={form.id}
                    icon={<NoteAltIcon />}
                    label={form.formInfo.form_name}
                    variant="outlined"
                    sx={{ m: 0.5 }}
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">No Forms assigned</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TableCell>
    </TableRow>
  );


  return (
    <> 
    {/* <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}> */}
      <Typography variant="h4" gutterBottom>
       Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h5">
                {relationships.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Users with Assigned Diets
              </Typography>
              <Typography variant="h5">
                {relationships.filter(r => r.Assigned_Diet.length > 0).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Users with Assigned Programs
              </Typography>
              <Typography variant="h5">
                {relationships.filter(r => r.Assigned_Program.length > 0).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* <BarChart width={800} height={300} data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="username" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="assignedDiets" fill="#8884d8" name="Assigned Diets" />
          <Bar dataKey="assignedPrograms" fill="#82ca9d" name="Assigned Programs" />
        </BarChart> */}
          {/* <UserAssignmentsChart data={relationships} /> */}

        <Grid item xs={12}>
        <Card>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Subscription</TableCell>
                  <TableCell>Assigned Diets</TableCell>
                  <TableCell>Assigned Programs</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {relationships.map((relationship) => (
                  <React.Fragment key={relationship.id}>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src={relationship.userInfo.avatar} sx={{ mr: 2 }}>
                            <PersonIcon />
                          </Avatar>
                          {`${relationship.userInfo.first_name} ${relationship.userInfo.last_name}`}
                        </Box>
                      </TableCell>
                      <TableCell>{relationship.userInfo.email}</TableCell>
                      <TableCell>
                        {relationship.userInfo.UserAndTrainerSubscription.length > 0 ? (
                          <Chip
                            label={relationship.userInfo.UserAndTrainerSubscription[0].packageInfo.title}
                            color="primary"
                            variant="outlined"
                          />
                        ) : (
                          <Chip label="No Subscription" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell>{relationship.Assigned_Diet.length}</TableCell>
                      <TableCell>{relationship.Assigned_Program.length}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => toggleRowExpansion(relationship.id)}>
                          {expandedRows[relationship.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    {expandedRows[relationship.id] && renderExpandedRow(relationship)}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </Card>
        </Grid>
      </Grid>
    {/* </Container> */}
    {/* <TrainersStats data={relationships} /> */}

    </>
  );
};

export default UserTrainerDashboard;
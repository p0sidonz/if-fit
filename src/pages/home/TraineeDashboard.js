import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  Button,
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
  Link,
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  RestaurantMenu as DietIcon,
  FitnessCenter as ProgramIcon,


} from '@mui/icons-material';
import useNavigateTo from "src/modules/components/useRouterPush";
import RenderFormTrainee from './RenderFormTrainee';
import NoteAltIcon from '@mui/icons-material/NoteAlt';

import { getAllTrainers } from 'src/modules/diet/hooks/useDiet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
// import TrainersStats from './TrainersStats';

const TraineeDashboard = () => {
  const navigateTo = useNavigateTo();
  const { data: relationships, isLoading } = getAllTrainers();
  // const [relationships, setRelationships] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  if (isLoading) return <p>Loading...</p>

  // Sample data preparation
  const data = relationships.map((rel) => ({
    username: rel?.trainerInfo?.username,
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
                    onClick={() => navigateTo(`/diet/${diet.dietInfo.id}/${relationship.id}`)}
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
                    onClick={() => navigateTo(`/program/${program.programInfo.id}/${relationship.id}`)}
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
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
                Assigned Forms
              </Typography>
              {relationship.Assigned_Forms.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {relationship.Assigned_Forms.map((form) => (
                    <Card key={form.id} variant="outlined" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <ProgramIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          {form.formInfo.form_name}
                        </Typography>
                      </Box>
                     <RenderFormTrainee form={form} />
                      
                    </Card>
                  ))}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 100,
                    bgcolor: 'grey.100',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No forms assigned
                  </Typography>
                </Box>
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
        Training Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Trainers
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
                Assigned Diets
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
                Assigned Programs
              </Typography>
              <Typography variant="h5">
                {relationships.filter(r => r.Assigned_Program.length > 0).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Trainer</TableCell>
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
                            <Avatar src={relationship.trainerInfo.avatar} sx={{ mr: 2 }}>
                              <PersonIcon />
                            </Avatar>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <div>{`${relationship.trainerInfo.first_name} ${relationship.trainerInfo.last_name}`}</div>
                              <Tooltip title="View Profile">
                                <Chip onClick={() => navigateTo(`/${relationship.trainerInfo?.username}/view`)} size='small' label={`@${relationship.trainerInfo.username}`} color="secondary" variant="outlined" />
                              </Tooltip>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{relationship.trainerInfo.email}</TableCell>
                        <TableCell>
                          {relationship.trainerInfo.UserAndTrainerSubscription.length > 0 ? (
                            <Chip
                              label={relationship.trainerInfo.UserAndTrainerSubscription[0].packageInfo.title}
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
      {/* <TrainersStats data={relationships} /> */}
      {/* </Container> */}
    </>
  );
};

export default TraineeDashboard;
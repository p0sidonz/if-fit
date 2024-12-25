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
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
  useTheme,
  Drawer,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  RestaurantMenu as DietIcon,
  FitnessCenter as ProgramIcon,
  ViewList as ListIcon,
  ViewModule as GridIcon,
  Add as AddIcon, 
  Close as CloseIcon,
  TimerOff as TimerOffIcon,
} from '@mui/icons-material';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import useNavigateTo from "src/modules/components/useRouterPush";

import TrainersStats from './TrainersStats';
import { getAllUserAndTrainerList } from 'src/modules/diet/hooks/useDiet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// import UserAssignmentsChart from './Stats';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../utils/axios';
import { toast } from 'react-hot-toast';

const UserTrainerDashboard = () => {
  const navigateTo = useNavigateTo();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [viewMode, setViewMode] = useState(isMobile ? 'card' : 'table');

  const { data: relationships, isLoading } = getAllUserAndTrainerList();
  // const [relationships, setRelationships] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const queryClient = useQueryClient();

  // Add offline client mutation
  const addOfflineClientMutation = useMutation({
    mutationFn: (userData) => {
      return axios.post('/userandtrainer/addofflineclient', userData);
    },
    onSuccess: () => {
      toast.success('Client added successfully');
      queryClient.invalidateQueries(['clients']); // Refresh clients list
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add client');
    },
  });

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
      <TableCell colSpan={7} sx={{ py: 0 }}>
        <Collapse in={expandedRows[relationship.id]} timeout="auto" unmountOnExit>
          <Box sx={{ py: 3, px: 1 }}>
            <Grid container spacing={3}>
              {/* Diets Section */}
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={0} 
                  variant="outlined"
                  sx={{ 
                    p: 2,
                    height: '100%',
                    backgroundColor: 'background.default',
                    borderRadius: 1
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <DietIcon fontSize="small" color="primary" />
                    Assigned Diets
                  </Typography>
                  
                  {relationship.Assigned_Diet.length > 0 ? (
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 1 
                    }}>
                      {relationship.Assigned_Diet.map((diet) => (
                        <Chip
                          key={diet.id}
                          label={diet.dietInfo.title}
                          onClick={() => navigateTo(`/diet/${diet.dietInfo.id}`)}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: 'primary.light',
                              cursor: 'pointer'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No diets assigned
                    </Typography>
                  )}
                </Paper>
              </Grid>

              {/* Programs Section */}
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={0} 
                  variant="outlined"
                  sx={{ 
                    p: 2,
                    height: '100%',
                    backgroundColor: 'background.default',
                    borderRadius: 1
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <ProgramIcon fontSize="small" color="primary" />
                    Assigned Programs
                  </Typography>
                  
                  {relationship.Assigned_Program.length > 0 ? (
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 1 
                    }}>
                      {relationship.Assigned_Program.map((program) => (
                        <Chip
                          key={program.id}
                          label={program.programInfo.title}
                          onClick={() => navigateTo(`/program/${program.programInfo.id}`)}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: 'primary.light',
                              cursor: 'pointer'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No programs assigned
                    </Typography>
                  )}
                </Paper>
              </Grid>

              {/* Forms Section */}
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={0} 
                  variant="outlined"
                  sx={{ 
                    p: 2,
                    height: '100%',
                    backgroundColor: 'background.default',
                    borderRadius: 1
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <NoteAltIcon fontSize="small" color="primary" />
                    Assigned Forms
                  </Typography>
                  
                  {relationship?.Assigned_Forms?.length > 0 ? (
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 1 
                    }}>
                      {relationship.Assigned_Forms.map((form) => (
                        <Chip
                          key={form.id}
                          label={form.formInfo.form_name}
                          onClick={() => navigateTo(`/forms/${form.formInfo.id}`)}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: 'primary.light',
                              cursor: 'pointer'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No forms assigned
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const renderCardExpandedContent = (relationship) => (
    <Box sx={{ mt: 2 }}>
      {/* Diets Section */}
      <Paper 
        elevation={0} 
        variant="outlined"
        sx={{ 
          p: 2,
          mb: 2,
          backgroundColor: 'background.default',
          borderRadius: 1
        }}
      >
        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <DietIcon fontSize="small" color="primary" />
          Assigned Diets
        </Typography>
        
        {relationship.Assigned_Diet.length > 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 1 
          }}>
            {relationship.Assigned_Diet.map((diet) => (
              <Chip
                key={diet.id}
                label={diet.dietInfo.title}
                onClick={() => navigateTo(`/diet/${diet.dietInfo.id}`)}
                size="small"
                variant="outlined"
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'primary.light',
                    cursor: 'pointer'
                  }
                }}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No diets assigned
          </Typography>
        )}
      </Paper>

      {/* Programs Section */}
      <Paper 
        elevation={0} 
        variant="outlined"
        sx={{ 
          p: 2,
          mb: 2,
          backgroundColor: 'background.default',
          borderRadius: 1
        }}
      >
        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <ProgramIcon fontSize="small" color="primary" />
          Assigned Programs
        </Typography>
        
        {relationship.Assigned_Program.length > 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 1 
          }}>
            {relationship.Assigned_Program.map((program) => (
              <Chip
                key={program.id}
                label={program.programInfo.title}
                onClick={() => navigateTo(`/program/${program.programInfo.id}`)}
                size="small"
                variant="outlined"
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'primary.light',
                    cursor: 'pointer'
                  }
                }}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No programs assigned
          </Typography>
        )}
      </Paper>

      {/* Forms Section */}
      <Paper 
        elevation={0} 
        variant="outlined"
        sx={{ 
          p: 2,
          backgroundColor: 'background.default',
          borderRadius: 1
        }}
      >
        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <NoteAltIcon fontSize="small" color="primary" />
          Assigned Forms
        </Typography>
        
        {relationship?.Assigned_Forms?.length > 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 1 
          }}>
            {relationship.Assigned_Forms.map((form) => (
              <Chip
                key={form.id}
                label={form.formInfo.form_name}
                onClick={() => navigateTo(`/forms/${form.formInfo.id}`)}
                size="small"
                variant="outlined"
                sx={{ 
                  '&:hover': { 
                    backgroundColor: 'primary.light',
                    cursor: 'pointer'
                  }
                }}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No forms assigned
          </Typography>
        )}
      </Paper>
    </Box>
  );

  const renderCardView = (relationship) => (
    <Grid item xs={12} sm={6} md={4} key={relationship.id}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={relationship.userInfo.avatar} sx={{ mr: 2 }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">
                {`${relationship.userInfo.first_name} ${relationship.userInfo.last_name}`}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {relationship.userInfo.email}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            {relationship.userInfo.UserAndTrainerSubscription.length > 0 ? (
              <>
                <Chip
                  label={relationship.userInfo.UserAndTrainerSubscription[0].packageInfo.title}
                  color="primary"
                  variant="outlined"
                  sx={{ width: '100%', mb: 1 }}
                />
                <Typography 
                  variant="body2" 
                  align="center"
                  sx={{ 
                    mt: 1,
                    color: new Date(relationship.userInfo.UserAndTrainerSubscription[0].end_date) < new Date() 
                      ? 'error.main' 
                      : 'success.main'
                  }}
                >
                  Expires: {new Date(relationship.userInfo.UserAndTrainerSubscription[0].end_date).toLocaleDateString()}
                </Typography>
              </>
            ) : (
              <Chip label="No Subscription" variant="outlined" sx={{ width: '100%' }} />
            )}
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">Assigned Diets</Typography>
              <Typography variant="h6">{relationship.Assigned_Diet.length}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="textSecondary">Assigned Programs</Typography>
              <Typography variant="h6">{relationship.Assigned_Program.length}</Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <IconButton onClick={() => toggleRowExpansion(relationship.id)}>
              {expandedRows[relationship.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          <Collapse in={expandedRows[relationship.id]}>
            {expandedRows[relationship.id] && renderCardExpandedContent(relationship)}
          </Collapse>
        </CardContent>
      </Card>
    </Grid>
  );

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewUser({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',

    });
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: name === 'no_expiry' ? checked : value
    }));
  };

  const handleSubmit = () => {
    // Validate passwords match
    if (newUser.password !== newUser.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }

    // Prepare data for API
    const userData = {
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      password: newUser.password,

    };

    addOfflineClientMutation.mutate(userData);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          {
            title: 'Total Users',
            value: relationships.length,
            icon: <PersonIcon sx={{ color: 'primary.main' }} />,
          },
          {
            title: 'Active Diets',
            value: relationships.filter(r => r.Assigned_Diet.length > 0).length,
            icon: <DietIcon sx={{ color: 'primary.main' }} />,
          },
          {
            title: 'Active Programs',
            value: relationships.filter(r => r.Assigned_Program.length > 0).length,
            icon: <ProgramIcon sx={{ color: 'primary.main' }} />,
          },
          {
            title: 'Expired Subscriptions',
            value: relationships.filter(r => 
              r.userInfo.UserAndTrainerSubscription.length > 0 && 
              new Date(r.userInfo.UserAndTrainerSubscription[0].end_date) < new Date()
            ).length,
            icon: <TimerOffIcon sx={{ color: 'error.main' }} />,
          },
        ].map((stat, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {stat.icon}
                  <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    sx={{ ml: 1 }}
                  >
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 500 }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* View Toggle */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
         {/* Add User Button */}
         <Button
          sx={{ mr: 1}}
          size='small'
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Offline User
        </Button>

        <ToggleButtonGroup
          size='small'
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="view mode"
        >
          <ToggleButton value="table" aria-label="table view">
            <ListIcon />
          </ToggleButton>
          <ToggleButton value="card" aria-label="card view">
            <GridIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Table/Card View */}
      {viewMode === 'table' ? (
        <Card>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Subscription</TableCell>
                  <TableCell>Expiry</TableCell>
                  <TableCell>Assigned Diets</TableCell>
                  <TableCell>Assigned Programs</TableCell>
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
                          <Typography sx={{ 
                            color: new Date(relationship.userInfo.UserAndTrainerSubscription[0].end_date) < new Date() 
                              ? 'error.main' 
                              : 'success.main'
                          }}>
                            {new Date(relationship.userInfo.UserAndTrainerSubscription[0].end_date).toLocaleDateString()}
                          </Typography>
                        ) : (
                          <Typography color="text.secondary">{relationship.type === 'offline' ? <Chip label="Offline Client" variant="outlined" size="small" /> : '-'}</Typography>
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
      ) : (
        <Grid container spacing={3}>
          {relationships.map(relationship => renderCardView(relationship))}
        </Grid>
      )}

     
      {/* Add User Dialog */}
      <Drawer
        anchor="right"
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{
          '& .MuiDrawer-paper': { 
            width: { xs: '100%', sm: 400 },
            padding: 3
          }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Add New Offline User</Typography>
            <IconButton onClick={handleCloseDialog} edge="end">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Form Content */}
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            overflowY: 'auto',
            px: 1,
            position: 'relative'
          }}>
            {addOfflineClientMutation.isLoading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  zIndex: 1,
                }}
              >
                <CircularProgress />
              </Box>
            )}
            
            <TextField
              name="first_name"
              label="First Name"
              value={newUser.first_name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="last_name"
              label="Last Name"
              value={newUser.last_name}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={newUser.email}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              value={newUser.password}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="confirm_password"
              label="Confirm Password"
              type="password"
              value={newUser.confirm_password}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Box>

          {/* Footer Actions */}
          <Box sx={{ 
            mt: 3, 
            pt: 2,
            borderTop: 1, 
            borderColor: 'divider',
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: 1 
          }}>
            <Button onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={
                addOfflineClientMutation.isLoading ||
                !newUser.first_name ||
                !newUser.last_name ||
                !newUser.email ||
                !newUser.password ||
                newUser.password !== newUser.confirm_password
              }
            >
              {addOfflineClientMutation.isLoading ? 'Adding...' : 'Add User'}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default UserTrainerDashboard;
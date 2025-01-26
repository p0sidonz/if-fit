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
  Alert,
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
import { useCurrentUserPackages } from 'src/modules/user/hooks/usePackages'
import { GET_AVATAR_COMPRESSED_URL } from 'src/utils/utils';
import TrainersStats from './TrainersStats';
import { getAllUserAndTrainerList } from 'src/modules/diet/hooks/useDiet';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format, startOfWeek, startOfMonth, startOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, subMonths, subYears } from 'date-fns';
// import UserAssignmentsChart from './Stats';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../utils/axios';
import { toast } from 'react-hot-toast';
import {
  Person,
  Email,
  ExpandMore,
  ExpandLess,
  CalendarToday,
  LocalDining,
  FitnessCenter,
  MoreVert
} from '@mui/icons-material';



const TrainerRelationshipCard = ({ relationship }) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubscription = relationship.userInfo.UserAndTrainerSubscription.length > 0;
  const subscription = hasSubscription ? relationship.userInfo.UserAndTrainerSubscription[0] : null;
  const isSubscriptionExpired = subscription && new Date(subscription.end_date) < new Date();
  const navigateTo = useNavigateTo();

  const avatarUrl = GET_AVATAR_COMPRESSED_URL(relationship.userInfo?.avatar?.avatar_compressed ?? null);

  const onToggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  const renderCardExpandedContent = () => (
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
              <Box key={form.id}>
                <Chip
                  label={form.formInfo.form_name}
                  size="small"
                  variant="outlined"
                  sx={{ mb: 1 }}
                  onClick={() => navigateTo(`/forms/${form.id}`)}
                />
               
              </Box>
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

  return (
    <Card sx={{ 
      width: '100%', 
      bgcolor: 'background.paper',
      transition: 'box-shadow 0.3s',
      '&:hover': {
        boxShadow: 6
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header with User Info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 2, 
              flex: 1,
              '&:hover': { cursor: 'pointer' },
            }}
            onClick={() => navigateTo(`/${relationship.userInfo.username}/view`)}
          >
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={avatarUrl}
                sx={{
                  width: { xs: 40, sm: 64 },
                  height: { xs: 40, sm: 64 },
                  bgcolor: theme.palette.primary.main,
                  color: '#fff',
                  border: 1,
                  borderColor: 'divider'
                }}
              >
                {relationship.userInfo.first_name[0]}{relationship.userInfo.last_name[0]}
              </Avatar>
            </Box>
            
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {`${relationship.userInfo.first_name} ${relationship.userInfo.last_name}`}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <Email sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {relationship.userInfo.email}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Subscription Section */}
        <Box sx={{ my: 3 }}>
          {hasSubscription ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Chip
                label={subscription.packageInfo.title}
                color={isSubscriptionExpired ? "error" : "primary"}
                variant="outlined"
                sx={{ width: '100%' }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography 
                  variant="body2"
                  color={isSubscriptionExpired ? "error" : "success.main"}
                >
                  Expires: {new Date(subscription.end_date).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Chip
              label={relationship.type === 'offline' ? "Offline Client" : "No Subscription"}
              variant="outlined"
              sx={{ width: '100%' }}
            />
          )}
        </Box>

        {/* Stats Section */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <Paper 
              elevation={0} 
              sx={{ 
                bgcolor: (theme) => theme.palette.mode === 'dark' 
                  ? 'background.paper' 
                  : 'grey.50',
                p: 1.5, 
                textAlign: 'center',
                borderRadius: 2,
                border: (theme) => `1px solid ${
                  theme.palette.mode === 'dark' 
                    ? theme.palette.divider 
                    : 'transparent'
                }`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                <LocalDining sx={{ 
                  fontSize: 20, 
                  mr: 0.5, 
                  color: 'primary.main' 
                }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: (theme) => theme.palette.mode === 'dark' 
                      ? 'text.primary' 
                      : 'text.secondary'
                  }}
                >
                  Assigned Diets
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {relationship.Assigned_Diet.length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper 
              elevation={0}
              sx={{ 
                bgcolor: (theme) => theme.palette.mode === 'dark' 
                  ? 'background.paper' 
                  : 'grey.50',
                p: 1.5, 
                textAlign: 'center',
                borderRadius: 2,
                border: (theme) => `1px solid ${
                  theme.palette.mode === 'dark' 
                    ? theme.palette.divider 
                    : 'transparent'
                }`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                <FitnessCenter sx={{ fontSize: 20, mr: 0.5, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Assigned Programs
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {relationship.Assigned_Program.length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Expand Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton 
            onClick={onToggleExpand}
            size="small"
            variant="outlined"
          >
            {isExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>

        {/* Expanded Content */}
        <Collapse in={isExpanded}>
          <Box sx={{ mt: 2, pt: 2, borderColor: 'grey.200' }}>
            {isExpanded && renderCardExpandedContent()}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};


const ClientAcquisitionChart = ({ relationships }) => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('all'); // week, month, year, all

  const prepareChartData = () => {
    // Sort relationships by created_at date
    const sortedRelationships = [...relationships].sort((a, b) => 
      new Date(a.created_at) - new Date(b.created_at)
    );

    let intervals;
    let formatDate;
    const now = new Date();

    switch (timeRange) {
      case 'week':
        intervals = eachDayOfInterval({
          start: startOfWeek(now),
          end: now
        });
        formatDate = (date) => format(date, 'EEE');
        break;
      
      case 'month':
        intervals = eachWeekOfInterval({
          start: startOfMonth(subMonths(now, 1)),
          end: now
        });
        formatDate = (date) => `Week ${format(date, 'w')}`;
        break;
      
      case 'year':
        intervals = eachMonthOfInterval({
          start: startOfYear(now),
          end: now
        });
        formatDate = (date) => format(date, 'MMM');
        break;
      
      case 'all':
        intervals = eachMonthOfInterval({
          start: startOfYear(subYears(now, 2)),
          end: now
        });
        formatDate = (date) => format(date, 'MMM yyyy');
        break;
      
      default:
        return [];
    }

    return intervals.map(interval => {
      const count = sortedRelationships.filter(rel => 
        new Date(rel.created_at) <= interval
      ).length;

      return {
        date: formatDate(interval),
        clients: count
      };
    });
  };

  return (
    <Card sx={{ p: 2, mb: 3 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Client Acquisition Trend</Typography>
        <ToggleButtonGroup
          size="small"
          value={timeRange}
          exclusive
          onChange={(e, newValue) => newValue && setTimeRange(newValue)}
        >
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="month">Month</ToggleButton>
          <ToggleButton value="year">Year</ToggleButton>
          <ToggleButton value="all">All Time</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={prepareChartData()}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="clients"
            name="Total Clients"
            stroke={theme.palette.primary.main}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};


const UserTrainerDashboard = () => {
  const { data: currentUserPackages, isLoading: isLoadingCurrentUserPackages } = useCurrentUserPackages()
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
    username: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    confirm_password: '',
  });
  const [hideExpiredClients, setHideExpiredClients] = useState(true);

  const queryClient = useQueryClient();

  // Add offline client mutation
  const addOfflineClientMutation = useMutation({
    mutationFn: (userData) => {
      return axios.post('/userandtrainer/addofflineclient', userData);
    },
    onSuccess: (res) => {
      // Check the ok flag from the API response
      if (!res.data.ok) {
        setErrors({ ...errors, general: res.data.message });
        return;
      }
      
      toast.success(res.data.message || 'Client added successfully');
      queryClient.invalidateQueries(['clients']);
      handleCloseDialog();
      setNewUser({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
        confirm_password: '',
      });
      setErrors({}); // Clear errors on success
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to add client';
      setErrors({ ...errors, general: errorMessage });
    },
  });

  if (isLoading) return <p>Loading...</p>

  // Sample data preparation
  const data = relationships?.map((rel) => ({
    username: rel?.userInfo?.username,
    assignedDiets: rel?.Assigned_Diet?.length,
    assignedPrograms: rel?.Assigned_Program?.length,
  }));

  // Modify the filter function to hide expired clients
  const filteredRelationships = relationships?.filter(relationship => {
    if (!hideExpiredClients) return true;
    
    const subscription = relationship?.userInfo?.UserAndTrainerSubscription[0];
    return !subscription || new Date(subscription?.end_date) >= new Date();
  });

  // Add this helper function
  const hasExpiredClients = relationships?.some(r => 
    r?.userInfo?.UserAndTrainerSubscription[0] && 
    new Date(r?.userInfo?.UserAndTrainerSubscription[0]?.end_date) < new Date()
  );

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
            <Avatar 
              src={GET_AVATAR_COMPRESSED_URL(relationship.userInfo?.avatar?.avatar_compressed ?? null)}
              sx={{
                bgcolor: theme.palette.primary.main,
                color: '#fff',
                width: { xs: 40, sm: 50 },
                height: { xs: 40, sm: 50 },
                mr: 2
              }}
            >
              {relationship.userInfo.first_name[0]}{relationship.userInfo.last_name[0]}
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
      username: '',
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: name === 'no_expiry' ? checked : value
    }));
  };

  // Update isTrialPackage function with actual implementation
  const isTrialPackage = () => {
    if (!currentUserPackages?.history?.length) return true; // If no package history, consider as trial

    // Get the latest package from history
    const latestPackage = currentUserPackages.history[0];
    
    // Check if the package is a trial based on planBenefits
    // Trial packages typically have limited clients (e.g., less than 5)
    return latestPackage?.packageInfo?.planBenefits?.clients <= 2;
  };

  // Add this function to count existing offline clients
  const getOfflineClientsCount = () => {
    if (!relationships) return 0;
    return relationships.filter(rel => rel.type === 'offline').length;
  };

  // Modify the handleSubmit function
  const handleSubmit = () => {
    // Reset errors
    setErrors({});
    
    // Check trial package limitation
    if (isTrialPackage() && getOfflineClientsCount() >= 2) {
      setErrors({
        general: 'Trial package users can only add up to 2 offline clients. Please upgrade your package to add more clients.'
      });
      return;
    }

    // Validate fields
    const newErrors = {};
    
    if (!newUser.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!newUser.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (!newUser.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!newUser.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!newUser.password) {
      newErrors.password = 'Password is required';
    } else if (newUser.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (newUser.password !== newUser.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Proceed with submission if no errors
    const userData = {
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      password: newUser.password,
      username: newUser.username,
    };

    addOfflineClientMutation.mutate(userData);
  };

  // Modify the Add Offline User button to be disabled for trial users who reached the limit
  const isAddButtonDisabled = isTrialPackage() && getOfflineClientsCount() >= 2;

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
            value: relationships?.length,
            icon: <PersonIcon sx={{ color: 'primary.main' }} />,
          },
          {
            title: 'Active Diets',
            value: relationships?.filter(r => r?.Assigned_Diet?.length > 0)?.length,
            icon: <DietIcon sx={{ color: 'primary.main' }} />,
          },
          {
            title: 'Active Programs',
            value: relationships?.filter(r => r?.Assigned_Program?.length > 0)?.length,
            icon: <ProgramIcon sx={{ color: 'primary.main' }} />,
          },
          {
            title: 'Expired Subscriptions',
            value: relationships?.filter(r => 
              r?.userInfo?.UserAndTrainerSubscription?.length > 0 && 
              new Date(r?.userInfo?.UserAndTrainerSubscription[0]?.end_date) < new Date()
            )?.length,
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

      {/* Add the new chart component here */}
      <ClientAcquisitionChart relationships={relationships} />

      {/* View Toggle */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {hasExpiredClients && (
            <FormControlLabel
              control={
                <Switch
                  checked={hideExpiredClients}
                  onChange={(e) => setHideExpiredClients(e.target.checked)}
                  size="small"
                />
              }
              label={
                <Typography variant="body2" color="text.secondary">
                  Hide Expired Clients
                </Typography>
              }
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            disabled={isAddButtonDisabled}
            title={isAddButtonDisabled ? "Trial package users can only add up to 2 offline clients" : ""}
          >
            Add Offline User
          </Button>

          <ToggleButtonGroup
            size="small"
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
      </Box>

      {/* Add alert when no users exist */}
     
      {/* Table/Card View */}
      {viewMode === 'table' ? (
        filteredRelationships?.length > 0 ? (
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
                  {filteredRelationships.map((relationship) => (
                    <React.Fragment key={relationship.id}>
                      <TableRow>
                        <TableCell>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              '&:hover': { 
                                cursor: 'pointer',
                                '& .username': { color: 'primary.main' }
                              }
                            }}
                            onClick={() => navigateTo(`/${relationship.userInfo.username}/view`)}
                          >
                            <Avatar 
                              src={GET_AVATAR_COMPRESSED_URL(relationship.userInfo?.avatar?.avatar_compressed ?? null)}
                              sx={{
                                bgcolor: theme.palette.primary.main,
                                color: '#fff',
                                width: { xs: 40, sm: 50 },
                                height: { xs: 40, sm: 50 },
                                mr: 2
                              }}
                            >
                              {relationship.userInfo.first_name[0]}{relationship.userInfo.last_name[0]}
                            </Avatar>
                            <Typography className="username">
                              {`${relationship?.userInfo?.first_name} ${relationship?.userInfo?.last_name}`}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{relationship?.userInfo?.email}</TableCell>
                        <TableCell>
                          {relationship?.userInfo?.UserAndTrainerSubscription?.length > 0 ? (
                            <Typography sx={{ 
                              color: new Date(relationship?.userInfo?.UserAndTrainerSubscription[0]?.end_date) < new Date() 
                                ? 'error.main' 
                                : 'success.main'
                            }}>
                              {new Date(relationship?.userInfo?.UserAndTrainerSubscription[0]?.end_date)?.toLocaleDateString()}
                            </Typography>
                          ) : (
                            <Typography color="text.secondary">{relationship?.type === 'offline' ? <Chip label="Offline Client" variant="outlined" size="small" /> : '-'}</Typography>
                          )}
                        </TableCell>
                        <TableCell>{relationship?.Assigned_Diet?.length}</TableCell>
                        <TableCell>{relationship?.Assigned_Program?.length}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => toggleRowExpansion(relationship?.id)}>
                            {expandedRows[relationship?.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      {expandedRows[relationship?.id] && renderExpandedRow(relationship)}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        ) : null
      ) : (
        <Grid container spacing={3}>
          {filteredRelationships?.map(relationship => (
              <Grid item xs={12} sm={6} md={4} key={relationship?.id}>
              <TrainerRelationshipCard relationship={relationship} />
            </Grid>
          ))}
        </Grid>
      )}

      {filteredRelationships?.length === 0 && (
        <Alert 
          severity="info" 
          sx={{ mb: 3, mt: 3 }}
        >
          {hideExpiredClients && hasExpiredClients 
            ? "No active clients found. Try unchecking 'Hide Expired Clients' to view all clients."
            : "No clients found. Click 'Add Offline User' to add your first client."}
        </Alert>
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
            {/* Show general error if exists */}
            {errors.general && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {errors.general}
              </Typography>
            )}
            
            <TextField
              name="first_name"
              label="First Name"
              value={newUser.first_name}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!errors.first_name}
              helperText={errors.first_name}
            />
            <TextField
              name="last_name"
              label="Last Name"
              value={newUser.last_name}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!errors.last_name}
              helperText={errors.last_name}
            />
            <TextField
              name="username"
              label="Username"
              value={newUser.username}
              onChange={handleInputChange}
              type='text'
              fullWidth
              required
              error={!!errors.username}
              helperText={errors.username}
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={newUser.email}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              value={newUser.password}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              name="confirm_password"
              label="Confirm Password"
              type="password"
              value={newUser.confirm_password}
              onChange={handleInputChange}
              fullWidth
              required
              error={!!errors.confirm_password}
              helperText={errors.confirm_password}
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
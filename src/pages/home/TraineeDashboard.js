import React, { useState } from 'react';
import {
  Box,
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
} from '@mui/material';
import {
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  RestaurantMenu as DietIcon,
  FitnessCenter as ProgramIcon,
  ViewList as ListIcon,
  ViewModule as GridIcon,
} from '@mui/icons-material';

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



import NoteAltIcon from '@mui/icons-material/NoteAlt';
import useNavigateTo from "src/modules/components/useRouterPush";
import { getAllTrainers } from 'src/modules/diet/hooks/useDiet';
import RenderFormTrainee from './RenderFormTrainee';
import { GET_AVATAR_COMPRESSED_URL } from 'src/utils/utils';



const TrainerRelationshipCard = ({ relationship }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubscription = relationship.trainerInfo.UserAndTrainerSubscription.length > 0;
  const subscription = hasSubscription ? relationship.trainerInfo.UserAndTrainerSubscription[0] : null;
  const isSubscriptionExpired = subscription && new Date(subscription.end_date) < new Date();
  const navigateTo = useNavigateTo();

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
          <Box >
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
            gap: 2
          }}>
            {relationship.Assigned_Forms.map((form) => (
              <Box key={form.id}>
                <Chip
                  label={form.formInfo.form_name}
                  size="small"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                <RenderFormTrainee 
                  form={form}
                  userId={14}
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
        {/* Header with Trainer Info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 2, 
              flex: 1,
              '&:hover': { cursor: 'pointer' },
            }}
            onClick={() => navigateTo(`/${relationship.trainerInfo.username}/view`)}
          >
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={GET_AVATAR_COMPRESSED_URL(relationship.trainerInfo?.avatar?.avatar_compressed)}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: '#fff',
                  width: { xs: 40, sm: 50 },
                  height: { xs: 40, sm: 50 },
                }}
              >
                {relationship.trainerInfo.first_name[0]}{relationship.trainerInfo.last_name[0]}
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
                {`${relationship.trainerInfo.first_name} ${relationship.trainerInfo.last_name}`}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <Email sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {relationship.trainerInfo.email}
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
              label="No Subscription"
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
          <Box sx={{ mt: 2, pt: 2,  borderColor: 'grey.200' }}>
            {isExpanded && renderCardExpandedContent()}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};



const TraineeDashboard = () => {
  const navigateTo = useNavigateTo();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [viewMode, setViewMode] = useState(isMobile ? 'card' : 'table');
  const { data: relationships, isLoading } = getAllTrainers();
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedForm, setSelectedForm] = useState(null);
  if (isLoading) return <p>Loading...</p>;

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Render functions from UserTrainerDashboard (same structure, different data paths)
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
                          onClick={() => navigateTo(`/diet/${diet.dietInfo.id}/${relationship.id}`)}
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
                          onClick={() => navigateTo(`/program/${program.programInfo.id}/${relationship.id}`)}
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
                      gap: 2
                    }}>
                      {relationship.Assigned_Forms.map((form) => (
                        <Box key={form.id}>
                          <Chip
                            label={form.formInfo.form_name}
                            size="small"
                            variant="outlined"
                            sx={{ mb: 1 }}
                          />
                          <RenderFormTrainee 
                            form={form}
                            userId={14}
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
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );

  const renderCardView = (relationship) => {
    return (
      <Grid item xs={12} sm={6} lg={4} xl={4}>
        <TrainerRelationshipCard 
          relationship={relationship}
        />
      </Grid>
    )
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Training Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Trainers
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
                Active Diets
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
                Active Programs
              </Typography>
              <Typography variant="h5">
                {relationships.filter(r => r.Assigned_Program.length > 0).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* View Toggle */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <ToggleButtonGroup
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
                  <TableCell>Trainer</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Subscription</TableCell>
                  <TableCell>Expiry</TableCell>
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
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2,
                            '&:hover': { 
                              cursor: 'pointer',
                              '& .username': { color: 'primary.main' }
                            }
                          }}
                          onClick={() => navigateTo(`/${relationship.trainerInfo.username}/view`)}
                        >
                          <Avatar
                            src={GET_AVATAR_COMPRESSED_URL(relationship.trainerInfo?.avatar?.avatar_compressed)}
                            sx={{
                              bgcolor: theme.palette.primary.main,
                              color: '#fff',
                              width: { xs: 40, sm: 50 },
                              height: { xs: 40, sm: 50 },
                            }}
                          >
                            {relationship.trainerInfo.first_name[0]}{relationship.trainerInfo.last_name[0]}
                          </Avatar>
                          <Typography className="username">
                            {`${relationship.trainerInfo.first_name} ${relationship.trainerInfo.last_name}`}
                          </Typography>
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
                      <TableCell>
                        {relationship.trainerInfo.UserAndTrainerSubscription.length > 0 ? (
                          <Typography sx={{ 
                            color: new Date(relationship.trainerInfo.UserAndTrainerSubscription[0].end_date) < new Date() 
                              ? 'error.main' 
                              : 'success.main'
                          }}>
                            {new Date(relationship.trainerInfo.UserAndTrainerSubscription[0].end_date).toLocaleDateString()}
                          </Typography>
                        ) : (
                          <Typography color="text.secondary">-</Typography>
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
        <Grid 
          container 
          spacing={3}
          sx={{
            width: '100%',
            margin: '0 auto'
          }}
        >
          {relationships.map(relationship => renderCardView(relationship))}
        </Grid>
      )}


    </>
  );
};

export default TraineeDashboard;
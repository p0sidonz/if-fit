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
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import useNavigateTo from "src/modules/components/useRouterPush";
import { getAllTrainers } from 'src/modules/diet/hooks/useDiet';

const TraineeDashboard = () => {
  const navigateTo = useNavigateTo();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [viewMode, setViewMode] = useState(isMobile ? 'card' : 'table');
  const { data: relationships, isLoading } = getAllTrainers();
  const [expandedRows, setExpandedRows] = useState({});

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
            <Avatar src={relationship.trainerInfo.avatar} sx={{ mr: 2 }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6">
                {`${relationship.trainerInfo.first_name} ${relationship.trainerInfo.last_name}`}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {relationship.trainerInfo.email}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            {relationship.trainerInfo.UserAndTrainerSubscription.length > 0 ? (
              <>
                <Chip
                  label={relationship.trainerInfo.UserAndTrainerSubscription[0].packageInfo.title}
                  color="primary"
                  variant="outlined"
                  sx={{ width: '100%', mb: 1 }}
                />
                <Typography 
                  variant="body2" 
                  align="center"
                  sx={{ 
                    mt: 1,
                    color: new Date(relationship.trainerInfo.UserAndTrainerSubscription[0].end_date) < new Date() 
                      ? 'error.main' 
                      : 'success.main'
                  }}
                >
                  Expires: {new Date(relationship.trainerInfo.UserAndTrainerSubscription[0].end_date).toLocaleDateString()}
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
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src={relationship.trainerInfo.avatar} sx={{ mr: 2 }}>
                            <PersonIcon />
                          </Avatar>
                          {`${relationship.trainerInfo.first_name} ${relationship.trainerInfo.last_name}`}
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
        <Grid container spacing={3}>
          {relationships.map(relationship => renderCardView(relationship))}
        </Grid>
      )}
    </>
  );
};

export default TraineeDashboard;
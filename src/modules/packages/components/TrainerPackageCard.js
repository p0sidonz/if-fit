import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip, Rating, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';


const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    marginBottom: theme.spacing(2),
    width: '100%',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[4],
    },
  }));

  
  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'INR': return '₹';
      default: return '';
    }
  };
  
  const TrainerPackageCard = ({ trainerPackage, handleOpenDialog }) => {
    return (
      <StyledCard >
        <CardContent sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8} md={9}>
              <Typography variant="h6" component="div" gutterBottom>
                {trainerPackage.title}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={2}>
                <Box display="flex" alignItems="center">
                  <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    Validity: {trainerPackage.validity} days
                  </Typography>
                </Box>
                {trainerPackage.session_count && (
                  <Box display="flex" alignItems="center">
                    <EventIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Sessions: {trainerPackage.session_count}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <Box display="flex" flexDirection="column" alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
                <Typography variant="h6" component="div" gutterBottom>
                  {getCurrencySymbol(trainerPackage.currency)}{trainerPackage.amount}
                </Typography>
                {trainerPackage.discount > 0 && (
                  <Chip
                    label={`${trainerPackage.discount}% OFF`}
                    color="secondary"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                )}
                <Rating value={trainerPackage.rating || 0} readOnly size="small" />
              </Box>
            </Grid>
          </Grid>
          <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              {trainerPackage.category && (
                <Chip label={trainerPackage.category} size="small" />
              )}
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDialog(trainerPackage);
              }}
            >
              View Details
            </Button>
          </Box>
        </CardContent>
      </StyledCard>
    );
  };


export default TrainerPackageCard;
// ** React Imports
import React, { useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useGetUpgradePackages } from 'src/modules/user/hooks/usePackages'

import {
  Check as CheckIcon,
  AccountCircle as AccountIcon,
  CreditCard as PaymentIcon,
  Done as DoneIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';

const steps = ['Select Plan', 'Account Details', 'Payment', 'Confirmation'];

const CheckoutStepper = ({}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const {data: pricingPlans, isLoading, isFetched} = useGetUpgradePackages()
  if(!isFetched) return <p>Loading...</p>
  if(isLoading) return <p>Loading...</p>

  const plans =pricingPlans?.result || []
  console.log("plans",plans)
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ width: '100%' }}>
            <Grid container spacing={3}>
              {plans.map((plan) => (
                <Grid item xs={12} md={4} key={plan.title}>
                  <Card 
                    raised={plan.popular}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      border: selectedPlan?.title === plan.title ? 2 : 0,
                      borderColor: 'primary.main'
                    }}
                  >
                    {plan.popular && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          px: 2,
                          py: 0.5,
                          borderRadius: 16
                        }}
                      >
                        Popular
                      </Box>
                    )}
                    <CardContent>
                      <Typography variant="h5" component="h2">
                        {plan.title}
                      </Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {plan.subtitle}
                      </Typography>
                      <Typography variant="h4" component="p" sx={{ my: 2 }}>
                        ${plan.isYearlyPlan ? (plan.yearlyPrice / 12).toFixed(2) : plan.monthly_price}
                        <Typography variant="subtitle1" component="span">/month</Typography>
                      </Typography>
                      <List>
                        {Object.entries(plan.planBenefits).map(([key, value]) => (
                          <ListItem key={key} dense>
                            <ListItemIcon>
                              <CheckIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText 
                              primary={`${key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${
                                key === 'clients' 
                                  ? (value > 50 ? 'Unlimited' : value)
                                  : typeof value === 'boolean' 
                                    ? (value ? 'Yes' : 'No') 
                                    : value
                              }`} 
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                    <CardActions sx={{ mt: 'auto', p: 2 }}>
                      <Button
                        fullWidth
                        variant={selectedPlan?.title === plan.title ? "contained" : "outlined"}
                        onClick={() => setSelectedPlan(plan)}
                      >
                        {selectedPlan?.title === plan.title ? 'Selected' : 'Select Plan'}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ maxWidth: 400, mx: 'auto' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ maxWidth: 400, mx: 'auto' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Card Number"
                  variant="outlined"
                  placeholder="1234 1234 1234 1234"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="Expiry Date"
                  variant="outlined"
                  placeholder="MM/YY"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="CVC"
                  variant="outlined"
                  placeholder="123"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 3:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'success.light',
                width: 64,
                height: 64,
                borderRadius: '50%',
                mx: 'auto',
                mb: 2
              }}
            >
              <DoneIcon sx={{ color: 'success.contrastText', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" gutterBottom>
              Thank you for your order!
            </Typography>
            <Typography color="textSecondary">
              We've sent you an email with all the details of your order.
            </Typography>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {getStepContent(activeStep)}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={activeStep === 0 && !selectedPlan}
        >
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Paper>
  );
};



export default CheckoutStepper;

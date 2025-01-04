import React, { useState, useRef } from 'react';
import useRazorpay from "react-razorpay";
import { useCreateOrder, useCreateSubscription } from "../../../payments/razorpay/useRazorPay";
import PackageBilling from './PackageBilling';
import { useUpdateUser } from '../../../user/hooks/useUserData'
import { useAuth } from '../../../../hooks/useAuth';
import { Alert } from '@mui/material';

import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Stack,

} from '@mui/material';
import {
  Check as CheckIcon,
  AccessTime as AccessTimeIcon,
  Event as EventIcon,
  Close as CloseIcon,
  Watch as WatchIcon,
} from '@mui/icons-material';



const getCurrencySymbol = (curr) => {
  switch (curr) {
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'INR': return '₹';
    default: return curr;
  }
};

const PackageCard = ({ packageData, onSelect, isOwnProfile }) => {
  const { title, amount, currency, category, validity, discount, session_count } = packageData;

  const displayPrice = discount > 0
    ? (amount * (100 - discount) / 100).toFixed(2)
    : amount;


  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 3,
      '&:hover': {
        boxShadow: 6,
      },
      transition: 'box-shadow 0.3s ease-in-out',
    }}>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>

        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Box sx={{
            display: 'flex',
            alignItems: 'baseline'
          }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
              {getCurrencySymbol(currency)}{displayPrice}
            </Typography>
            {discount > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1, textDecoration: 'line-through' }}>
                {getCurrencySymbol(currency)}{amount}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Chip label={category} color="primary" size="small" />
        </Box>
        {discount > 0 && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {discount}% Discount Applied!
          </Typography>
        )}
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Valid for {validity} days
            </Typography>
          </Box>
          {session_count > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <WatchIcon fontSize="small" color="action" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {session_count} sessions included
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button
          size="small"
          variant="contained"
          onClick={() => onSelect(packageData)}
          sx={{
            borderRadius: 20,
            textTransform: 'none',
          }}
        >
          {isOwnProfile ? 'View Details' : 'Learn More'}
        </Button>
      </CardActions>
    </Card>
  );
};
const PackageDialog = ({ open, handleClose, packageData, isOwnProfile, isTrainerProfile }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [billingData, setBillingData] = useState(null);
  const [isBillingValid, setIsBillingValid] = useState(false);
  const [Razorpay] = useRazorpay();
  const createOrder = useCreateOrder();
  const updateUser = useUpdateUser();
  const createSubscription = useCreateSubscription();
  const billingRef = useRef(null);
  if (!packageData) return null;




  const {
    title,
    description,
    validity,
    amount,
    currency,
    category,
    session_count,
    features,
    discount,
  } = packageData;

  const featureList = features.split('\n').filter(feature => feature.trim() !== '');

  const steps = ['Package Details', 'Billing Address', 'Payment'];

  const handleNext = () => {
    if (activeStep === 1 && isBillingValid) {
      if (!billingRef.current) return; // Ensure the ref exists
      billingRef.current.requestSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };;

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

const handleBillingSubmit = (data) => {
  updateUser.mutate(data, {
    onSuccess: () => {
      console.log('User data updated successfully');
      setBillingData(data);
      if (activeStep === 1) {
        // Move to the next step after a successful update
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
  });
};

  const handleBillingValidation = (isValid) => {
    setIsBillingValid(isValid);
  };

  const handlePurchase = async () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    try {
      const order = await createOrder.mutateAsync({
        packageId: packageData.id,
        amount: discount > 0 ? (amount - (amount * discount / 100)) : amount,
        currency: currency
      });

      const options = {
        key: 'rzp_test_XzVgCoZd6ruTtE',
        amount: discount > 0 ? (amount - (amount * discount / 100)) : amount,
        currency: order.currency,
        name: title,
        description: `Purchase of ${title}`,
        order_id: order.id,
        notes: {
          isUpgradePlan : false, // upgrade or personal
          userId: userData.id,
          packageId: packageData.id,
        },
        prefill: {
          
          name: billingData.companyName,
          email: billingData.billingEmail,
          contact: billingData.billingPhone,
        },
        theme: {
          color: '#666CFF'
        }
      };
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error creating order:', error);
      // Handle error
    }
  };






  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in={activeStep === 0}>
            <Box>
              {(isOwnProfile || isTrainerProfile) && (
                <Typography 
                  variant="subtitle1" 
                  color="error" 
                  sx={{ mb: 2, textAlign: 'center' }}
                >
                  Note: You cannot purchase packages from your own profile. Please visit other profiles to make purchases.
                </Typography>
              )}
              <Typography variant="body1" color="text.secondary" paragraph dangerouslySetInnerHTML={{ __html: JSON.parse(description).blocks[0].text }} />
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2 }}>
                <Typography component="h2" variant="h3" color="text.primary">
                  {getCurrencySymbol(currency)}
                  {discount > 0 
                    ? (amount - (amount * discount / 100))
                    : amount
                  }
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  /{validity} days
                </Typography>
              </Box>
              {discount > 0 && (
                <Typography variant="subtitle1" align="center" color="error" gutterBottom>
                  {discount}% Discount Applied!
                </Typography>
              )}
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <AccessTimeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={`Valid for ${validity} days`} />
                </ListItem>
                {session_count > 0 && (
                  <ListItem>
                    <ListItemIcon>
                      <EventIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={`${session_count} sessions included`} />
                  </ListItem>
                )}
                {featureList.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Fade>
        );
      case 1:
        return (
          <Fade in={activeStep === 1}>
            <PackageBilling
              ref={billingRef}
              onSubmit={handleBillingSubmit}
              onValidation={handleBillingValidation}
            />
          </Fade>
        );
      case 2:
        return (
          <Fade in={activeStep === 2}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Review and Pay
              </Typography>
              {/* Add a summary of the package and billing details here */}
              <Typography variant="body1">Package: {title}</Typography>
              <Typography variant="body1">
                Price: {getCurrencySymbol(currency)}
                {discount > 0 
                  ? (amount - (amount * discount / 100))
                  : amount
                }
              </Typography>
              <Typography variant="body1">Billing Name: {billingData?.companyName}</Typography>
              <Typography variant="body1">Billing Email: {billingData?.billingEmail}</Typography>
              {/* Add more billing details as needed */}
            </Box>
          </Fade>
        );
      default:
        return null;
    }
  };


  return (
    <>
      {/* {openBilling && <BillingAddressCard />} */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {title}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {renderStepContent(activeStep)}
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          {!isOwnProfile && (
            activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={isOwnProfile || isTrainerProfile || (activeStep === 1 && !isBillingValid)}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handlePurchase}
              >
                Purchase
              </Button>
            )
          )}
        </Box>
      </Dialog>
    </>

  );
};

const PackageManager = ({ packages, profileUserId }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userData'));
  // Check if the current user is viewing their own profile
  const isOwnProfile =  userData?.id === profileUserId;
  const isTrainerProfile = userData?.role === 'trainer';

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {packages.length === 0 ? (
       
          <Alert 
            severity="info"
            sx={{ 
              width: '100%'
            }}
          >
            No packages available at the moment.
          </Alert>
      ) : (
        <Grid container spacing={3}>
          {packages.map((pkg) => (
            <Grid item xs={12} sm={6} md={4} key={pkg.id}>
              <PackageCard 
                packageData={pkg} 
                onSelect={handlePackageSelect}
                isOwnProfile={isOwnProfile}
              />
            </Grid>
          ))}
        </Grid>
      )}
      <PackageDialog
        isTrainerProfile={isTrainerProfile}
        open={dialogOpen}
        handleClose={handleDialogClose}
        packageData={selectedPackage}
        isOwnProfile={isOwnProfile}
      />
    </Box>
  );
};

export default PackageManager;
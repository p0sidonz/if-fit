import React, { useState } from 'react';
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
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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

const PackageCard = ({ packageData, onSelect }) => {
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
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};
const PackageDialog = ({ open, handleClose, packageData }) => {
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

  return (
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
        <Chip label={category} color="primary" size="small" sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary" paragraph dangerouslySetInnerHTML={{ __html: JSON.parse(description).blocks[0].text }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2 }}>
          <Typography component="h2" variant="h3" color="text.primary">
            {getCurrencySymbol(currency)}{amount}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="primary">
          Purchase Package
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PackageManager = ({ packages }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {packages.map((pkg) => (
          <Grid item xs={12} sm={6} md={4} key={pkg.id}>
            <PackageCard packageData={pkg} onSelect={handlePackageSelect} />
          </Grid>
        ))}
      </Grid>
      <PackageDialog
        
        open={dialogOpen}
        handleClose={handleDialogClose}
        packageData={selectedPackage}
      />
    </Box>
  );
};

export default PackageManager;
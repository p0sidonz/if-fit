import React, { useEffect, useState } from 'react';
import {
  Grid,
  Stack,
  Button,
  Box,
  Typography,
  Hidden,
  Tooltip,
  Alert,
} from '@mui/material';
import TrainerPackageCard from './TrainerPackageCard';
import { useTrainerPackages } from '../hooks/usePackages';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import PackagesDialog from './PackagesDialouge';
import { FloatBarAction } from 'src/modules/components/FloatBarAction';


const TrainerPackageList = () => {
  const { data: packages, isLoading } = useTrainerPackages();
  const [open, setOpen] = useState(false);
  const [trainerPackage, setTrainerPackage] = useState(null);

  const handleOpenDialog = (pkg = null) => {
    setTrainerPackage(pkg);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTrainerPackage(null);
  };

  const onNewPackage = () => {
    handleOpenDialog(); // This will open the dialog with null trainerPackage
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Typography variant="h4" gutterBottom>
            Packages
          </Typography>
        </div>
        <div>
          <Hidden smDown>
            <Tooltip title={`Add New Package`} aria-label="add">
              <Button
                variant='contained'
                color="primary"
                startIcon={<AddIcon />}
                onClick={onNewPackage}
              >
                New Package
              </Button>
            </Tooltip>
          </Hidden>
        </div>
      </div>

      {packages?.length === 0 && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="info">
            No packages created yet. Click the "New Package" button to create one.
          </Alert>
        </Box>
      )}

      <Stack spacing={3} sx={{ mt: 5 }}>
        {packages?.map(pkg => (
          <TrainerPackageCard
            key={pkg.id}
            trainerPackage={pkg}
            handleOpenDialog={() => handleOpenDialog(pkg)}
          />
        ))}
      </Stack>
      <PackagesDialog
        handleClose={handleClose}
        open={open}
        trainerPackage={trainerPackage}
      />
            <Hidden mdUp>
        <FloatBarAction
          name={"Package"}
          handleClick={() => setOpen(true)}
        />
      </Hidden>
      <Typography sx={{mt: 4}} variant='subtitle2'  gutterBottom>
                    {"Note: Only Active packages will be displayed in your profile page."}
                </Typography>
    </div>
  );
};


export default TrainerPackageList;
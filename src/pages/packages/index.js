import React from 'react';
import { Container, Typography } from '@mui/material';
import TrainerPackageList from '../../modules/packages/components/TrainerPackageList';

const PackagesList = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Trainer Packages
      </Typography>
      <TrainerPackageList />
    </Container>
  );
};

export default PackagesList;
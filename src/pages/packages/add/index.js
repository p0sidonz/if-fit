import React from 'react';
import { Container } from '@mui/material';
import TrainerPackageForm from '../../../modules/packages/components/TrainerPackageForm';

const PackagePage = () => {
  const handleSuccess = (data) => {
  };

  return (
    <Container>
      <TrainerPackageForm onSuccess={handleSuccess} />
    </Container>
  );
};

export default PackagePage;
import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import TrainerPackageCard from './TrainerPackageCard';
import { useTrainerPackages } from '../hooks/usePackages';
import Link from 'next/link';
const TrainerPackageList = () => {
  const {data: packages, isLoading} = useTrainerPackages();

  if (isLoading) return <p>Loading...</p>;

  return (
    <Grid container spacing={4}>
      {packages.map(pkg => (
        <Grid item xs={12} sm={6} md={4} key={pkg.id}>
          <TrainerPackageCard trainerPackage={pkg} />
        </Grid>
      ))}
    </Grid>
  );
};

export default TrainerPackageList;
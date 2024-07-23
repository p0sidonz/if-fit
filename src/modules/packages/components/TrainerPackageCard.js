import React from 'react';
import { Card, CardContent, CardMedia, Typography, Rating } from '@mui/material';
import { useRouter } from 'next/router';
import PackagesDialouge from './PackagesDialouge';

const TrainerPackageCard = ({ trainerPackage }) => {
  const [open, setOpen] = React.useState(false);


  const handlePackageId = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <>
      <Card onClick={handlePackageId} sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          height="140"
          image={trainerPackage.image || "/default-image.jpg"}
          alt={trainerPackage.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {trainerPackage.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {trainerPackage.description}
          </Typography>
          <Rating name="read-only" value={trainerPackage.rating} readOnly />
          <Typography variant="h6" component="div">
            {trainerPackage.amount} {trainerPackage.currency}
          </Typography>
        </CardContent>
      </Card>

      <PackagesDialouge
        handleClose={handleClose}
        packageData={trainerPackage}
        open={open}
      />
    </>
  );
};

export default TrainerPackageCard;
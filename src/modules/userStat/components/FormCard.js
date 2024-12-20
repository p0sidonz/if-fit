import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const FormCard = ({ icon, title, children }) => {
  const IconComponent = icon;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography 
          variant="h6" 
          color="primary" 
          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
        >
          {icon && <IconComponent sx={{ mr: 1 }} />} {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
};

export default FormCard; 
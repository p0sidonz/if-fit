import React from 'react';
import { Box, Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export const FloatBarAction = ({ name, handleClick }) => {
    return (
      
      <Tooltip title={`Add New ${name}`} aria-label="add">
        <Box
          sx={{
            position: 'fixed',
            bottom: '3%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 99,
          }}
        >
          <Fab onClick={handleClick} size="medium" color="primary" aria-label="add">
            <AddIcon />
          </Fab>
        </Box>
      </Tooltip>
    );
  };
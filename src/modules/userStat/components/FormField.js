import { Grid, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

const FormField = ({ 
  name, 
  control, 
  label, 
  type = 'text',
  multiline = false,
  rows = 1,
  endAdornment,
  gridProps = { xs: 12, md: 6 },
  ...props 
}) => (
  <Grid item {...gridProps}>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          {...props}
          fullWidth
          type={type}
          label={label}
          variant="outlined"
          multiline={multiline}
          rows={rows}
          InputProps={endAdornment ? { endAdornment } : undefined}
        />
      )}
    />
  </Grid>
);

export default FormField; 
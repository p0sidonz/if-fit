import { Box, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const DateRangeSelector = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      gap: { xs: 1, sm: 2 },
      mb: 2,
      width: '100%',
      '& .MuiFormControl-root': {
        minWidth: { xs: '100%', sm: '200px' }
      },
      '& .MuiInputBase-root': {
        height: { xs: '45px', sm: 'auto' }
      },
      '& .MuiInputLabel-root': {
        fontSize: { xs: '0.875rem', sm: '1rem' },
        transform: { xs: 'translate(14px, 12px)', sm: 'translate(14px, 14px)' }
      },
      '& .MuiInputBase-input': {
        padding: { xs: '8px 14px', sm: '16.5px 14px' },
        fontSize: { xs: '0.875rem', sm: '1rem' }
      }
    }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={onStartDateChange}
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              sx: {
                backgroundColor: 'background.paper',
              }
            }
          }}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={onEndDateChange}
          slotProps={{
            textField: {
              size: "small",
              fullWidth: true,
              sx: {
                backgroundColor: 'background.paper',
              }
            }
          }}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default DateRangeSelector;
import { Box, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const DateRangeSelector = ({ dateRange, setDateRange }) => (
  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label="From"
        value={dateRange[0]}
        onChange={(newValue) => setDateRange([newValue || startOfDay(new Date()), dateRange[1]])}
        renderInput={(params) => <TextField {...params} />}
      />
      <Box sx={{ mx: 1 }}>to</Box>
      <DateTimePicker
        label="To"
        value={dateRange[1]}
        onChange={(newValue) => setDateRange([dateRange[0], newValue || endOfDay(new Date())])}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  </Box>
);

export default DateRangeSelector; 
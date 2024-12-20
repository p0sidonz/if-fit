import { 
    Table, 
    TableHead, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableRow,
    Paper,
    IconButton,
    Typography 
  } from '@mui/material';
  import { Delete as DeleteIcon } from '@mui/icons-material';
  import { useDeleteUserStat } from '../hooks/useUserStat';
  import { format } from 'date-fns';
  
  const DataTable = ({ type, data, onDelete }) => {
    const { mutate: deleteStat } = useDeleteUserStat();
  
    const handleDelete = (id) => {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        deleteStat(id);
      }
    };
  
    const renderTableContent = () => {
      switch(type) {
        case 'water':
          return (
            <>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Glasses</TableCell>
                  <TableCell>Size (oz)</TableCell>
                  <TableCell>Total (oz)</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((entry) => {
                  const waterData = JSON.parse(entry.waterJson);
                  return (
                    <TableRow key={entry.id}>
                      <TableCell>{format(new Date(entry.date), 'MMM d, yyyy h:mm a')}</TableCell>
                      <TableCell>{waterData.glasses}</TableCell>
                      <TableCell>{waterData.glassSize}</TableCell>
                      <TableCell>{waterData.glasses * waterData.glassSize}</TableCell>
                      <TableCell>{waterData.location}</TableCell>
                      <TableCell>{waterData.notes}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </>
          );
  
        case 'weight':
          return (
            <>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Body Fat %</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((entry) => {
                  const weightData = JSON.parse(entry.weightJson);
                  return (
                    <TableRow key={entry.id}>
                      <TableCell>{format(new Date(entry.date), 'MMM d, yyyy h:mm a')}</TableCell>
                      <TableCell>{weightData.weight} {weightData.unit}</TableCell>
                      <TableCell>{weightData.bodyFatPercentage}%</TableCell>
                      <TableCell>{weightData.measurementLocation}</TableCell>
                      <TableCell>{weightData.notes}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </>
          );
  
        case 'food':
          return (
            <>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Food</TableCell>
                  <TableCell>Calories</TableCell>
                  <TableCell>Protein</TableCell>
                  <TableCell>Carbs</TableCell>
                  <TableCell>Fat</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((entry) => {
                  const dietData = JSON.parse(entry.dietJson);
                  return (
                    <TableRow key={entry.id}>
                      <TableCell>{format(new Date(entry.date), 'MMM d, yyyy h:mm a')}</TableCell>
                      <TableCell>{dietData.title}</TableCell>
                      <TableCell>{dietData.calories} kcal</TableCell>
                      <TableCell>{dietData.protein}{dietData.unit}</TableCell>
                      <TableCell>{dietData.carbs}{dietData.unit}</TableCell>
                      <TableCell>{dietData.fat}{dietData.unit}</TableCell>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </>
          );
        default:
          return null;
      }
    };
  
    return (
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table size="small">
          {renderTableContent()}
        </Table>
      </TableContainer>
    );
  };
  
  export default DataTable;
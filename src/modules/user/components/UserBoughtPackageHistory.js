import React from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Button,
  CardHeader,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { format } from 'date-fns';

const UserBoughtPackageHistory = ({ userHistory, title }) => {
  if(!userHistory) return <p>No payment history found</p>;

  const handleDownloadInvoice = (orderId) => {
    // Implement the download functionality here
    console.log(`Downloading invoice for order ${orderId}`);
  };

  return (
<Card>
  <TableContainer component={Paper}>
    <CardHeader title={title} />
    <Table sx={{ minWidth: 650 }} aria-label="user subscription history table">
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Package</TableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Validity (Days)</TableCell>
          <TableCell>Start Date</TableCell>
          <TableCell>End Date</TableCell>
          <TableCell>User</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {userHistory.map((history) => (
          <TableRow key={history.id}>
            <TableCell component="th" scope="row">
              <Typography variant="body2" color="primary">
              #{history.order_id}
              </Typography>
            </TableCell>
            <TableCell>{history.packageInfo.title}</TableCell>
            <TableCell>${history.packageInfo.amount.toFixed(2)}</TableCell>
            <TableCell>{history.packageInfo.validity}</TableCell>
            <TableCell>{history.startDate}</TableCell>
            <TableCell>{history.endDate}</TableCell>
            <TableCell>
              {`${history.user.firstName} ${history.user.lastName} (${history.user.username})`}
            </TableCell>
            <TableCell>
              <Chip
                label={history.status}
                color={history.status === 'COMPLETED' ? 'success' : 'default'}
                size="small"
              />
            </TableCell>
      
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Card>
  );
};

export default UserBoughtPackageHistory;
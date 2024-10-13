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

const PaymentHistoryList = ({ payments }) => {
  if(!payments) return <p>No payment history found</p>;

  const handleDownloadInvoice = (orderId) => {
    // Implement the download functionality here
    console.log(`Downloading invoice for order ${orderId}`);
  };

  return (
    <Card>

    <TableContainer component={Paper}>
      <CardHeader title="Upgrade Package History" />
      <Table sx={{ minWidth: 650 }} aria-label="Upgrade Package History">
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Package</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell>Payment Method</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Invoice</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell component="th" scope="row">
               <Typography variant="body2" color="primary">
                  #{payment.order_id}
                </Typography>
              </TableCell>
              <TableCell>{payment.packageInfo.title}</TableCell>
              <TableCell align="right">${payment.amountPaid.toFixed(2)}</TableCell>
              <TableCell>{payment.payment_method}</TableCell>
              <TableCell>
                {format(new Date(payment.payment_made_at), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <Chip
                  label={payment.status}
                  color={payment.status === 'COMPLETED' ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownloadInvoice(payment.order_id)}
                >
                  Invoice
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </Card>
  );
};

export default PaymentHistoryList;
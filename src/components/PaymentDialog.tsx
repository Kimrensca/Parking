import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { ParkingSpace } from '../types';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  parkingSpace: ParkingSpace;
  onPaymentComplete: (space: ParkingSpace, response: any) => void;
}

export default function PaymentDialog({
  open,
  onClose,
  parkingSpace,
  onPaymentComplete,
}: PaymentDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [duration, setDuration] = useState(1); // Default 1 hour
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalAmount = parkingSpace.pricePerHour * duration;

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.slice(1);
    }
    if (cleaned.startsWith('7')) {
      return '254' + cleaned;
    }
    return cleaned;
  };

  const handlePayment = () => {
    setLoading(true);
    setError(null);

    // Simulate API call to backend
    setTimeout(() => {
      setLoading(false);
      
      // In a real app, you'd make an actual API call here
      // const response = await fetch('/api/payments', { method: 'POST', body: JSON.stringify(paymentDetails) });
      // const data = await response.json();
      
      // Simulate successful response
      const mockResponse = { status: 200, message: 'Payment successful' };
      onPaymentComplete(parkingSpace, mockResponse);
    }, 2000); // Simulate 2 second processing time
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(cleaned);
    if (error) setError(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Pay for Parking Space {parkingSpace.spaceNumber}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Duration</InputLabel>
            <Select
              value={duration}
              label="Duration"
              onChange={(e) => setDuration(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 6, 8, 12, 24].map((hours) => (
                <MenuItem key={hours} value={hours}>
                  {hours} {hours === 1 ? 'hour' : 'hours'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ my: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="body1" gutterBottom>
              Price per hour: KES {parkingSpace.pricePerHour}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Duration: {duration} {duration === 1 ? 'hour' : 'hours'}
            </Typography>
            <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
              Total Amount: KES {totalAmount}
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Phone Number"
            placeholder="07XXXXXXXX"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            margin="normal"
            helperText={error || "Enter your M-Pesa phone number starting with 07"}
            error={!!error}
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*'
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          variant="contained"
          color="primary"
          disabled={loading || !phoneNumber.match(/^(0?7\d{8})$/)}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Processing...' : `Pay KES ${totalAmount}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
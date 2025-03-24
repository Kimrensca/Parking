import { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Analytics dummy data
const MONTHLY_REVENUE = [
  { month: 'Jan', amount: 15000 },
  { month: 'Feb', amount: 18000 },
  { month: 'Mar', amount: 22000 },
  { month: 'Apr', amount: 20000 },
  { month: 'May', amount: 25000 },
];

const SPACE_USAGE = [
  { name: 'Occupied', value: 15 },
  { name: 'Available', value: 5 },
  { name: 'Reserved', value: 3 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

// Dummy data
const DUMMY_BOOKINGS = [
  {
    id: '1',
    space_number: 'A1',
    phone_number: '0712345678',
    start_time: '2024-02-20T10:00:00',
    end_time: '2024-02-20T12:00:00',
    duration_hours: 2,
    total_amount: 200,
    payment_status: 'completed',
    status: 'completed'
  },
  {
    id: '2',
    space_number: 'B2',
    phone_number: '0723456789',
    start_time: '2024-02-20T14:00:00',
    end_time: '2024-02-20T16:00:00',
    duration_hours: 2,
    total_amount: 200,
    payment_status: 'pending',
    status: 'active'
  },
  {
    id: '3',
    space_number: 'C3',
    phone_number: '0734567890',
    start_time: '2024-02-21T09:00:00',
    end_time: '2024-02-21T11:00:00',
    duration_hours: 2,
    total_amount: 200,
    payment_status: 'completed',
    status: 'active'
  },
  {
    id: '4',
    space_number: 'D4',
    phone_number: '0745678901',
    start_time: '2024-02-21T13:00:00',
    end_time: '2024-02-21T14:00:00',
    duration_hours: 1,
    total_amount: 100,
    payment_status: 'completed',
    status: 'completed'
  },
  {
    id: '5',
    space_number: 'E5',
    phone_number: '0756789012',
    start_time: '2024-02-22T10:00:00',
    end_time: '2024-02-22T13:00:00',
    duration_hours: 3,
    total_amount: 300,
    payment_status: 'pending',
    status: 'cancelled'
  }
];

export default function Admin() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100vh',
      bgcolor: 'background.default',
      pt: 4
    }}>
      <Container maxWidth="xl">
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            textAlign: 'center',
            fontWeight: 'bold',
            mb: 4
          }}
        >
          Parking Management Dashboard
        </Typography>

        {/* Analytics Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Revenue Today
                </Typography>
                <Typography variant="h4">
                  KES 12,500
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Bookings
                </Typography>
                <Typography variant="h4">
                  8
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Available Spaces
                </Typography>
                <Typography variant="h4">
                  5
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Users
                </Typography>
                <Typography variant="h4">
                  150
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Charts */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Monthly Revenue
              </Typography>
              <LineChart
                width={800}
                height={300}
                data={MONTHLY_REVENUE}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Space Usage
              </Typography>
              <PieChart width={400} height={300}>
                <Pie
                  data={SPACE_USAGE}
                  cx={200}
                  cy={150}
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {SPACE_USAGE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Paper>
          </Grid>
        </Grid>

        {/* Existing bookings table */}
        <Paper 
          sx={{ 
            width: '100%', 
            overflow: 'hidden',
            borderRadius: 2,
            boxShadow: 3
          }}
        >
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Space Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Phone Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Start Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>End Time</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Duration (Hours)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Amount (KES)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Payment Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Booking Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {DUMMY_BOOKINGS
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.space_number}</TableCell>
                      <TableCell>{booking.phone_number}</TableCell>
                      <TableCell>{formatDateTime(booking.start_time)}</TableCell>
                      <TableCell>{formatDateTime(booking.end_time)}</TableCell>
                      <TableCell>{booking.duration_hours}</TableCell>
                      <TableCell>{booking.total_amount}</TableCell>
                      <TableCell>
                        <Chip 
                          label={booking.payment_status}
                          color={booking.payment_status === 'completed' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={booking.status}
                          color={getStatusColor(booking.status)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={DUMMY_BOOKINGS.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
    </Box>
  );
} 
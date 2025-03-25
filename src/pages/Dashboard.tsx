import { Box, Typography, Container } from '@mui/material';
import Map from '../components/Map';

export default function Dashboard() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Find Parking
        </Typography>
        <Typography variant="body1" paragraph>
          Select a city and street to find available parking spaces.
        </Typography>
        <Map />
      </Box>
    </Container>
  );
} 
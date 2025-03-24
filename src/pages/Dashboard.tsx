import { Box, Typography, Container } from '@mui/material';

export default function Dashboard() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        {/* Add your dashboard content here */}
      </Box>
    </Container>
  );
} 
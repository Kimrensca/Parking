import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ParkingSpace } from '../types';
import { Waves } from './ui/waves-background';
import { SelectChangeEvent } from '@mui/material';

// City coordinates (same as in Map.tsx)
const cities = {
  Nairobi: { lat: -1.286389, lng: 36.817223 },
  Mombasa: { lat: -4.043477, lng: 39.668205 },
  Kisumu: { lat: -0.102222, lng: 34.761667 },
  Nakuru: { lat: -0.303099, lng: 36.080025 }
};

// Streets by city (same as in Map.tsx)
const streetsByCity = {
  Nairobi: [
    { name: 'CBD', lat: -1.284924, lng: 36.823822 },
    { name: 'Westlands', lat: -1.268952, lng: 36.810143 },
    { name: 'Kilimani', lat: -1.288331, lng: 36.789069 },
    { name: 'Karen', lat: -1.319092, lng: 36.729807 },
    { name: 'Eastleigh', lat: -1.271622, lng: 36.849881 },
    { name: 'Langata', lat: -1.338358, lng: 36.764086 },
    { name: 'Upper Hill', lat: -1.298105, lng: 36.812226 },
    { name: 'Ngara', lat: -1.276351, lng: 36.833135 },
    { name: 'Lavington', lat: -1.276694, lng: 36.766290 },
    { name: 'Parklands', lat: -1.261522, lng: 36.815738 },
    { name: 'South B', lat: -1.312878, lng: 36.847496 },
    { name: 'South C', lat: -1.321741, lng: 36.831403 },
    { name: 'Kileleshwa', lat: -1.278967, lng: 36.777623 },
    { name: 'Huruma', lat: -1.253871, lng: 36.859681 },
    { name: 'Kayole', lat: -1.260467, lng: 36.914442 },
    { name: 'Umoja', lat: -1.268425, lng: 36.895559 },
    { name: 'Donholm', lat: -1.290767, lng: 36.883414 },
    { name: 'Buruburu', lat: -1.279583, lng: 36.876632 },
    { name: 'Dandora', lat: -1.245683, lng: 36.895130 },
    { name: 'Zimmerman', lat: -1.213369, lng: 36.889122 },
    { name: 'Roysambu', lat: -1.221007, lng: 36.876547 },
    { name: 'Kasarani', lat: -1.227636, lng: 36.898262 },
    { name: 'Kariobangi', lat: -1.260234, lng: 36.878649 },
    { name: 'Ruaka', lat: -1.217322, lng: 36.775959 },
    { name: 'Gigiri', lat: -1.231964, lng: 36.815296 },
    { name: 'Runda', lat: -1.218862, lng: 36.807013 },
    { name: 'Kitisuru', lat: -1.236738, lng: 36.764912 },
    { name: 'Loresho', lat: -1.249667, lng: 36.765642 },
    { name: 'Ongata Rongai', lat: -1.396717, lng: 36.749206 },
    { name: 'Githurai', lat: -1.205642, lng: 36.909856 },
    { name: 'Pipeline', lat: -1.311421, lng: 36.896730 },
    { name: 'Embakasi', lat: -1.323694, lng: 36.889564 },
    { name: 'Utawala', lat: -1.285583, lng: 36.956314 },
    { name: 'Syokimau', lat: -1.353531, lng: 36.909039 },
    { name: 'Mlolongo', lat: -1.372442, lng: 36.890113 }
  ],
  Mombasa: [
    { name: 'CBD', lat: -4.043477, lng: 39.668205 },
    { name: 'Nyali', lat: -4.017968, lng: 39.711938 },
    { name: 'Bamburi', lat: -3.990149, lng: 39.724365 },
    { name: 'Shanzu', lat: -3.953467, lng: 39.757258 },
    { name: 'Mtwapa', lat: -3.944775, lng: 39.774256 },
    { name: 'Kizingo', lat: -4.057556, lng: 39.674124 },
    { name: 'Tudor', lat: -4.037532, lng: 39.682532 },
    { name: 'Likoni', lat: -4.077881, lng: 39.658651 },
    { name: 'Changamwe', lat: -4.026901, lng: 39.626591 },
    { name: 'Miritini', lat: -4.001261, lng: 39.601529 },
    { name: 'Port Reitz', lat: -4.031111, lng: 39.643889 },
    { name: 'Mikindani', lat: -4.038889, lng: 39.616944 },
    { name: 'Jomvu', lat: -4.012778, lng: 39.615278 },
    { name: 'Shimanzi', lat: -4.043063, lng: 39.657553 },
    { name: 'Majengo', lat: -4.044167, lng: 39.678056 },
    { name: 'Old Town', lat: -4.063056, lng: 39.671944 },
    { name: 'Tononoka', lat: -4.044444, lng: 39.668889 },
    { name: 'Ganjoni', lat: -4.051389, lng: 39.673611 },
    { name: 'Bondeni', lat: -4.053889, lng: 39.679167 },
    { name: 'Frere Town', lat: -4.024444, lng: 39.685000 },
    { name: 'Kongowea', lat: -4.023889, lng: 39.701111 },
    { name: 'Bombolulu', lat: -4.001389, lng: 39.711667 },
    { name: 'Kisauni', lat: -4.029722, lng: 39.698611 },
    { name: 'Magongo', lat: -4.018333, lng: 39.621389 },
    { name: 'Mtongwe', lat: -4.090278, lng: 39.654444 },
    { name: 'Shelly Beach', lat: -4.081111, lng: 39.707500 },
    { name: 'Utange', lat: -3.977778, lng: 39.743889 },
    { name: 'Mkomani', lat: -4.018611, lng: 39.705000 },
    { name: 'Mishomoroni', lat: -4.008333, lng: 39.698056 },
    { name: 'Mwakirunge', lat: -3.972778, lng: 39.710556 },
    { name: 'Bamburi Beach', lat: -3.994722, lng: 39.733056 }
  ],
  Kisumu: [
    { name: 'CBD', lat: -0.102222, lng: 34.761667 },
    { name: 'Milimani', lat: -0.114722, lng: 34.744167 },
    { name: 'Mamboleo', lat: -0.057778, lng: 34.786667 },
    { name: 'Kondele', lat: -0.082855, lng: 34.778111 },
    { name: 'Nyalenda', lat: -0.109566, lng: 34.772767 },
    { name: 'Manyatta', lat: -0.094294, lng: 34.783179 },
    { name: 'Kibuye', lat: -0.095987, lng: 34.755638 },
    { name: 'Lolwe', lat: -0.087056, lng: 34.751964 },
    { name: 'Nyamasaria', lat: -0.111111, lng: 34.794444 },
    { name: 'Dunga', lat: -0.136111, lng: 34.755833 },
    { name: 'Bandani', lat: -0.068889, lng: 34.729167 },
    { name: 'Otonglo', lat: -0.062500, lng: 34.724444 },
    { name: 'Kanyakwar', lat: -0.077778, lng: 34.760556 },
    { name: 'Nyawita', lat: -0.097500, lng: 34.764444 },
    { name: 'Obunga', lat: -0.084722, lng: 34.773611 },
    { name: 'Polyview', lat: -0.106944, lng: 34.753889 },
    { name: 'Kenya Re', lat: -0.118056, lng: 34.746944 },
    { name: 'Tom Mboya', lat: -0.090000, lng: 34.756667 },
    { name: 'Mfangano', lat: -0.094167, lng: 34.757778 },
    { name: 'Migosi', lat: -0.097778, lng: 34.787222 },
    { name: 'Kanyakwar', lat: -0.078611, lng: 34.759722 },
    { name: 'Kibos', lat: -0.092222, lng: 34.812500 },
    { name: 'Airport', lat: -0.082222, lng: 34.735000 },
    { name: 'Riat Hills', lat: -0.061944, lng: 34.743056 }
  ],
  Nakuru: [
    { name: 'CBD', lat: -0.303099, lng: 36.080025 },
    { name: 'London', lat: -0.289444, lng: 36.066111 },
    { name: 'Milimani', lat: -0.308333, lng: 36.071944 },
    { name: 'Section 58', lat: -0.288611, lng: 36.082500 },
    { name: 'Shabab', lat: -0.294125, lng: 36.088394 },
    { name: 'Racecourse', lat: -0.312194, lng: 36.067194 },
    { name: 'Naka', lat: -0.326044, lng: 36.083333 },
    { name: 'Lanet', lat: -0.315833, lng: 36.142778 },
    { name: 'Free Area', lat: -0.286389, lng: 36.078056 },
    { name: 'Pipeline', lat: -0.317778, lng: 36.092500 },
    { name: 'Barnabas', lat: -0.304722, lng: 36.089167 },
    { name: 'Menengai', lat: -0.270000, lng: 36.071111 },
    { name: 'Ngata', lat: -0.346111, lng: 36.051944 },
    { name: 'Kaptembwa', lat: -0.321111, lng: 36.053333 },
    { name: 'Kiamunyi', lat: -0.270278, lng: 36.023611 },
    { name: 'Langalanga', lat: -0.309167, lng: 36.066389 },
    { name: 'Rhonda', lat: -0.313611, lng: 36.060833 },
    { name: 'Elburgeon', lat: -0.323056, lng: 36.106111 },
    { name: 'Pangani', lat: -0.310556, lng: 36.092778 },
    { name: 'Bahati', lat: -0.251944, lng: 36.106944 },
    { name: 'Nakuru West', lat: -0.323611, lng: 36.058889 },
    { name: 'Mwariki', lat: -0.333056, lng: 36.096944 },
    { name: 'Lake View', lat: -0.301111, lng: 36.055556 }
  ]
};

interface SidebarProps {
  selectedSpace: ParkingSpace | null;
  onCityChange: (event: SelectChangeEvent<string>) => void;
  onStreetChange: (event: SelectChangeEvent<string>) => void;
  onBookingRequest: (space: ParkingSpace) => void;
  selectedCity: string;
  selectedStreet: string;
}

export default function Sidebar({
  selectedSpace,
  onCityChange,
  onStreetChange,
  onBookingRequest,
  selectedCity,
  selectedStreet,
}: SidebarProps) {
  // Get streets for the selected city
  const streets = selectedCity ? streetsByCity[selectedCity as keyof typeof streetsByCity] || [] : [];

  return (
    <Box
      sx={{
        width: 300,
        height: '100vh',
        position: 'relative',
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <Waves
        lineColor="rgba(25, 118, 210, 0.08)"
        backgroundColor="rgba(255, 255, 255, 0.95)"
        waveSpeedX={0.3}
        waveSpeedY={0.2}
        waveAmpX={90}
        waveAmpY={40}
        friction={0.99}
        tension={0.02}
        maxCursorMove={150}
        xGap={24}
        yGap={24}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          overflow: 'auto',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Parking Lot Booker
        </Typography>

        <FormControl fullWidth>
          <InputLabel>Select City</InputLabel>
          <Select
            label="Select City"
            value={selectedCity}
            onChange={onCityChange}
            sx={{ bgcolor: 'background.paper' }}
          >
            <MenuItem value="">
              <em>Select a city</em>
            </MenuItem>
            {Object.keys(cities).map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!selectedCity}>
          <InputLabel>Select Street</InputLabel>
          <Select
            label="Select Street"
            value={selectedStreet}
            onChange={onStreetChange}
            sx={{ 
              bgcolor: 'background.paper',
              maxHeight: 300 
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                  overflow: 'auto'
                }
              }
            }}
          >
            <MenuItem value="">
              <em>All Streets</em>
            </MenuItem>
            {streets.map((street) => (
              <MenuItem key={street.name} value={street.name}>
                {street.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedSpace && (
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Selected Space Details
            </Typography>
            <Typography>
              Space Number: {selectedSpace.spaceNumber}
            </Typography>
            <Typography>
              Status: {selectedSpace.status}
            </Typography>
            <Typography gutterBottom>
              Price: KES {selectedSpace.pricePerHour}/hour
            </Typography>
            {selectedSpace.status === 'available' && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => onBookingRequest(selectedSpace)}
                sx={{ mt: 2 }}
              >
                Book Now
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
} 
import { useCallback, useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, TrafficLayer } from '@react-google-maps/api';
import { ParkingSpace } from '../types';
import { Typography, Box, Button, IconButton, Fab, FormControl, InputLabel, Select, MenuItem, Grid, SelectChangeEvent } from '@mui/material';
import StreetviewIcon from '@mui/icons-material/Streetview';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoadingSpinner from './LoadingSpinner';
import Sidebar from './Sidebar';
import CloseIcon from '@mui/icons-material/Close';
import PaymentDialog from './PaymentDialog';
import ThreeSixtyIcon from '@mui/icons-material/ThreeSixty';
import PanoramaPhotosphereIcon from '@mui/icons-material/PanoramaPhotosphere';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion, AnimatePresence } from 'framer-motion';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// City coordinates
const cities = {
  Nairobi: { lat: -1.286389, lng: 36.817223 },
  Mombasa: { lat: -4.043477, lng: 39.668205 },
  Kisumu: { lat: -0.102222, lng: 34.761667 },
  Nakuru: { lat: -0.303099, lng: 36.080025 }
};

// Expand the streetsByCity with many more streets
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

// Convert street data to parking spaces
const generateParkingSpaces = (city: keyof typeof streetsByCity, streetName?: string): ParkingSpace[] => {
  const streets = streetsByCity[city];
  
  if (streetName) {
    const street = streets.find(s => s.name === streetName);
    if (!street) return [];
    
    // Generate 10 parking spaces near this street (increased from 5)
    return Array(10).fill(0).map((_, i) => ({
      id: `${city}-${streetName}-${i}`,
      location: { 
        lat: street.lat + (Math.random() - 0.5) * 0.002, // Wider spread
        lng: street.lng + (Math.random() - 0.5) * 0.002 
      },
      status: Math.random() > 0.3 ? 'available' : 'occupied',
      pricePerHour: 100 + Math.floor(Math.random() * 100),
      spaceNumber: `${streetName[0]}${i+1}`,
    }));
  }
  
  // Generate more spaces for all streets in the city (increased from 3 to 5 per street)
  return streets.flatMap((street, streetIndex) => 
    Array(5).fill(0).map((_, i) => ({
      id: `${city}-${street.name}-${i}`,
      location: { 
        lat: street.lat + (Math.random() - 0.5) * 0.002,
        lng: street.lng + (Math.random() - 0.5) * 0.002
      },
      status: Math.random() > 0.3 ? 'available' : 'occupied',
      pricePerHour: 100 + Math.floor(Math.random() * 100),
      spaceNumber: `${street.name[0]}${streetIndex}${i+1}`,
    }))
  );
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  mapTypeControlOptions: {
    style: 2, // DROPDOWN_MENU
    position: 1, // TOP_LEFT
    mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain']
  },
  streetViewControl: true,
  clickableIcons: false,
};

export default function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: ['geometry'],
  });

  const [selectedSpace, setSelectedSpace] = useState<ParkingSpace | null>(null);
  const [selectedCity, setSelectedCity] = useState<keyof typeof cities>('Nairobi');
  const [selectedStreet, setSelectedStreet] = useState('');
  const [center, setCenter] = useState(cities.Nairobi);
  const [zoom, setZoom] = useState(12);
  const [visibleSpaces, setVisibleSpaces] = useState<ParkingSpace[]>([]);
  const [showStreetView, setShowStreetView] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<google.maps.LatLng | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [panorama, setPanorama] = useState<google.maps.StreetViewPanorama | null>(null);
  const [marker360, setMarker360] = useState<google.maps.Marker | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [bookedSpace, setBookedSpace] = useState<ParkingSpace | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Initialize with spaces for selected city when component mounts
  useEffect(() => {
    setVisibleSpaces(generateParkingSpaces(selectedCity));
  }, []);

  // Update when city changes
  useEffect(() => {
    console.log(`City changed to: ${selectedCity}`);
    setCenter(cities[selectedCity]);
    setZoom(12);
    setSelectedStreet('');
    setVisibleSpaces(generateParkingSpaces(selectedCity));
  }, [selectedCity]);

  // Update when street changes
  useEffect(() => {
    if (selectedStreet) {
      console.log(`Street changed to: ${selectedStreet}`);
      const street = streetsByCity[selectedCity].find(s => s.name === selectedStreet);
      if (street) {
        setCenter({ lat: street.lat, lng: street.lng });
        setZoom(15);
        setVisibleSpaces(generateParkingSpaces(selectedCity, selectedStreet));
      }
    }
  }, [selectedStreet, selectedCity]);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    
    const clickedLat = e.latLng.lat();
    const clickedLng = e.latLng.lng();

    // Check if clicked near an existing space
    const nearbySpace = visibleSpaces.find(space => {
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(space.location.lat, space.location.lng),
        e.latLng!
      );
      return distance < 20; // Within 20 meters
    });

    if (nearbySpace) {
      setSelectedSpace(nearbySpace);
    } else {
      // Create a new potential parking space
      const newSpace: ParkingSpace = {
        id: `new-${Date.now()}`,
        location: { lat: clickedLat, lng: clickedLng },
        status: 'available',
        pricePerHour: 100,
        spaceNumber: 'New',
      };
      setSelectedSpace(newSpace);
    }
    setClickedLocation(e.latLng);
  }, [visibleSpaces]);

  const handleBooking = (space: ParkingSpace) => {
    setSelectedSpace(space);
    setShowPaymentDialog(true);
  };

  const handlePaymentComplete = useCallback((space: ParkingSpace, response: any) => {
    if (response.status === 200) {
      // Mark the space as booked (occupied)
      const updatedSpace = {
        ...space,
        status: 'occupied',
        bookedBy: 'current-user', // Add this field to identify user's bookings
        bookingTime: new Date().toISOString(),
        bookingDuration: '1 hour', // Or whatever duration was selected
      };
      
      // Update the spaces list with the booked space
      setVisibleSpaces(prevSpaces => 
        prevSpaces.map(s => s.id === space.id ? updatedSpace : s)
      );
      
      // Set success states
      setBookedSpace(updatedSpace);
      setPaymentSuccess(true);
      setShowConfetti(true);
      
      // Hide the payment dialog
      setShowPaymentDialog(false);
      
      // Reset success state after some time
      setTimeout(() => {
        setPaymentSuccess(false);
        setShowConfetti(false);
      }, 8000);
    } else {
      // Handle payment failure
      alert('Payment failed. Please try again.');
      setShowPaymentDialog(false);
    }
  }, [setVisibleSpaces]);

  const handleCityChange = (event: SelectChangeEvent<string>) => {
    const city = event.target.value as keyof typeof cities;
    console.log(`Setting city to: ${city}`);
    setSelectedCity(city);
  };

  const handleStreetChange = (event: SelectChangeEvent<string>) => {
    const street = event.target.value;
    console.log(`Setting street to: ${street}`);
    setSelectedStreet(street);
  };

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);
  }, []);

  const handleStreetViewClick = useCallback((event: { latLng?: google.maps.LatLng; preventDefault: () => void }) => {
    // Prevent default right-click menu
    event.preventDefault();
    if (!event.latLng) return;
    
    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();

    // Create a new parking space at the clicked location
    const newSpace: ParkingSpace = {
      id: `new-${Date.now()}`,
      location: { lat: clickedLat, lng: clickedLng },
      status: 'available',
      pricePerHour: 100,
      spaceNumber: 'New',
    };
    setSelectedSpace(newSpace);
    setClickedLocation(event.latLng);
  }, []);

  useEffect(() => {
    if (mapRef && showStreetView && clickedLocation) {
      const panorama = new google.maps.StreetViewPanorama(mapRef.getDiv(), {
        position: clickedLocation,
        pov: { heading: 0, pitch: 0 },
        zoom: 1,
        visible: true,
        addressControl: false,
      });

      // Add both left and right click listeners
      panorama.addListener('click', handleStreetViewClick);
      panorama.addListener('rightclick', handleStreetViewClick);

      // Prevent context menu in street view
      const element = mapRef.getDiv();
      element.addEventListener('contextmenu', (e) => e.preventDefault());

      mapRef.setStreetView(panorama);

      return () => {
        google.maps.event.clearListeners(panorama, 'click');
        google.maps.event.clearListeners(panorama, 'rightclick');
        element.removeEventListener('contextmenu', (e) => e.preventDefault());
        if (mapRef) {
          mapRef.setStreetView(null);
        }
      };
    }
  }, [mapRef, showStreetView, clickedLocation, handleStreetViewClick]);

  const handleMapTypeChange = (event: SelectChangeEvent<string>) => {
    setMapType(event.target.value as 'roadmap' | 'satellite' | 'hybrid' | 'terrain');
    if (mapRef) {
      mapRef.setMapTypeId(event.target.value);
    }
  };

  const handleStreetViewOpen = useCallback((location: google.maps.LatLng, space: ParkingSpace) => {
    if (!mapRef) return;
    
    // First switch to satellite view
    setMapType('satellite');
    mapRef.setMapTypeId('satellite');
    
    // Set clicked location for reference
    setClickedLocation(location);
    
    // Create street view panorama with enhanced options
    const newPanorama = new google.maps.StreetViewPanorama(mapRef.getDiv(), {
      position: location,
      pov: { heading: 0, pitch: 0 },
      zoom: 1,
      visible: true,
      addressControl: true,
      linksControl: true,
      panControl: true,
      enableCloseButton: true,
      fullscreenControl: true
    });
    
    setPanorama(newPanorama);
    mapRef.setStreetView(newPanorama);
    setShowStreetView(true);
    
    // Find the closest street view position to the parking spot
    const streetViewService = new google.maps.StreetViewService();
    streetViewService.getPanorama({ 
      location: space.location,
      radius: 50,
      preference: google.maps.StreetViewPreference.NEAREST
    }, (data, status) => {
      if (status === google.maps.StreetViewStatus.OK && data && data.location) {
        // Calculate heading toward the parking spot from the street view position
        const parkingSpotLocation = new google.maps.LatLng(
          space.location.lat, 
          space.location.lng
        );
        
        const heading = google.maps.geometry.spherical.computeHeading(
          data.location.latLng!, 
          parkingSpotLocation
        );
        
        // Set the POV to look at the parking spot
        newPanorama.setPov({
          heading: heading,
          pitch: 0
        });
        
        // Add a highlight marker for the parking spot
        // This marker will be visible in StreetView
        if (marker360) marker360.setMap(null);
        
        const highlightMarker = new google.maps.Marker({
          position: space.location,
          map: mapRef,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: space.status === 'available' ? '#4CAF50' : '#F44336',
            fillOpacity: 0.7,
            strokeColor: 'white',
            strokeWeight: 2,
          },
          title: `Parking Space ${space.spaceNumber}`,
          animation: google.maps.Animation.BOUNCE,
          optimized: false,
          zIndex: 100
        });
        
        setMarker360(highlightMarker);
        
        // Show guidance tooltip
        const parkingSpotDiv = document.createElement('div');
        parkingSpotDiv.className = 'parking-spot-indicator';
        parkingSpotDiv.innerHTML = `
          <div style="
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          ">
            <span style="color: ${space.status === 'available' ? '#4CAF50' : '#F44336'};">●</span>
            Your selected parking spot ${space.spaceNumber}
          </div>
        `;
        
        // Add the indicator after a small delay to ensure panorama is loaded
        setTimeout(() => {
          const panoramaContainer = mapRef.getDiv().querySelector('.gm-style-cc');
          if (panoramaContainer) {
            panoramaContainer.parentNode?.insertBefore(parkingSpotDiv, panoramaContainer);
          }
        }, 500);
      }
    });
  }, [mapRef]);

  if (loadError) return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
    >
      <Typography color="error" variant="h5">
        Error loading maps. Please try again later.
      </Typography>
    </Box>
  );
  
  if (!isLoaded) return <LoadingSpinner />;

  return (
    <Box 
      display="flex" 
      height="100vh" 
      width="100%" 
      overflow="hidden"
      sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <Sidebar
        selectedSpace={selectedSpace}
        onCityChange={handleCityChange}
        onStreetChange={handleStreetChange}
        onBookingRequest={handleBooking}
        selectedCity={selectedCity}
        selectedStreet={selectedStreet}
        sx={{ flex: '0 0 300px' }}
      />
      <Box 
        flexGrow={1} 
        position="relative" 
        height="100vh" 
        sx={{ 
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Mobile controls */}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            p: 2,
            borderRadius: 1,
            display: { xs: 'block', md: 'none' },
            width: 'calc(100% - 20px)',
            maxWidth: 300
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>City</InputLabel>
                <Select
                  value={selectedCity}
                  label="City"
                  onChange={handleCityChange}
                >
                  {Object.keys(cities).map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small" disabled={!selectedCity}>
                <InputLabel>Street</InputLabel>
                <Select
                  value={selectedStreet}
                  label="Street"
                  onChange={handleStreetChange}
                >
                  <MenuItem value="">
                    <em>All Streets</em>
                  </MenuItem>
                  {selectedCity && streetsByCity[selectedCity].map((street) => (
                    <MenuItem key={street.name} value={street.name}>
                      {street.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Map controls - make them more compact */}
        <Box sx={{ 
          position: 'absolute', 
          top: 10, 
          right: 10, 
          zIndex: 10, 
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 1,
          padding: 1
        }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<ThreeSixtyIcon />}
            onClick={() => {
              if (mapRef && selectedSpace) {
                const location = new google.maps.LatLng(
                  selectedSpace.location.lat,
                  selectedSpace.location.lng
                );
                handleStreetViewOpen(location, selectedSpace);
              } else if (mapRef && center) {
                // Create a dummy space at center if no space is selected
                const dummySpace: ParkingSpace = {
                  id: 'temp',
                  location: center,
                  status: 'available',
                  pricePerHour: 0,
                  spaceNumber: 'View'
                };
                const location = new google.maps.LatLng(center.lat, center.lng);
                handleStreetViewOpen(location, dummySpace);
              }
            }}
          >
            360° View
          </Button>
        </Box>

        {/* Map type selector - make it more compact */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            right: 10,
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            p: 1,
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            maxWidth: 130
          }}
        >
          <FormControl size="small" fullWidth>
            <InputLabel id="map-type-label">View</InputLabel>
            <Select
              labelId="map-type-label"
              id="map-type-select"
              value={mapType}
              label="View"
              onChange={handleMapTypeChange}
              size="small"
            >
              <MenuItem value="roadmap">Road</MenuItem>
              <MenuItem value="satellite">Satellite</MenuItem>
              <MenuItem value="hybrid">Hybrid</MenuItem>
              <MenuItem value="terrain">Terrain</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              if (mapRef) {
                const trafficEnabled = mapRef.get('trafficLayer');
                if (trafficEnabled) {
                  trafficEnabled.setMap(null);
                  mapRef.set('trafficLayer', null);
                } else {
                  const trafficLayer = new google.maps.TrafficLayer();
                  trafficLayer.setMap(mapRef);
                  mapRef.set('trafficLayer', trafficLayer);
                }
              }
            }}
          >
            Toggle Traffic
          </Button>
        </Box>

        {/* Street View Exit Button */}
        {showStreetView && (
          <>
            <Fab
              color="primary"
              sx={{ position: 'absolute', top: 16, right: 16, zIndex: 12 }}
              onClick={() => {
                if (mapRef) {
                  mapRef.setStreetView(null);
                  setShowStreetView(false);
                  // Remove the highlight marker
                  if (marker360) {
                    marker360.setMap(null);
                    setMarker360(null);
                  }
                  // Remove any custom DOM elements
                  const indicators = document.querySelectorAll('.parking-spot-indicator');
                  indicators.forEach(el => el.remove());
                }
              }}
            >
              <ExitToAppIcon />
            </Fab>
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 12,
                bgcolor: 'background.paper',
                p: 1,
                borderRadius: 1,
                boxShadow: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <PanoramaPhotosphereIcon color="primary" />
              <Typography variant="body2">
                Spot {selectedSpace?.spaceNumber} - Look for the bouncing marker
              </Typography>
            </Box>
            
            {/* Add a mini-map with the spot location */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                zIndex: 12,
                bgcolor: 'background.paper',
                p: 1,
                borderRadius: 1,
                boxShadow: 3,
                width: 150,
                height: 150,
                overflow: 'hidden'
              }}
            >
              <Typography variant="caption" fontWeight="bold" mb={1}>
                Your parking spot
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  backgroundColor: '#e5e3df'  // Map background color
                }}
              >
                {/* Draw a simple visualization of the spot */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: selectedSpace?.status === 'available' ? 'success.main' : 'error.main',
                    border: '2px solid white',
                    boxShadow: '0 0 0 2px rgba(0,0,0,0.3), 0 0 8px rgba(0,0,0,0.5)',
                    animation: 'pulse 1.5s infinite'
                  }}
                />
                {/* Add CSS for the animation */}
                <style>
                  {`
                    @keyframes pulse {
                      0% { transform: translate(-50%, -50%) scale(1); }
                      50% { transform: translate(-50%, -50%) scale(1.2); }
                      100% { transform: translate(-50%, -50%) scale(1); }
                    }
                  `}
                </style>
              </Box>
            </Box>
          </>
        )}

        {/* Payment dialog */}
        {selectedSpace && showPaymentDialog && (
          <PaymentDialog
            open={showPaymentDialog}
            onClose={() => setShowPaymentDialog(false)}
            parkingSpace={selectedSpace}
            onPaymentComplete={(space) => {
              // Simulate a successful API response
              const mockResponse = { status: 200, message: 'Payment successful' };
              handlePaymentComplete(space, mockResponse);
            }}
          />
        )}

        {/* Success message */}
        {paymentSuccess && bookedSpace && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000,
                padding: '20px',
                borderRadius: '10px',
                backgroundColor: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '400px',
                width: '80%',
              }}
            >
              {showConfetti && (
                <Box sx={{ position: 'absolute', top: -20, left: 0, width: '100%', height: 300, overflow: 'hidden' }}>
                  {Array.from({ length: 50 }).map((_, index) => (
                    <motion.div
                      key={index}
                      style={{
                        position: 'absolute',
                        width: Math.random() * 10 + 5,
                        height: Math.random() * 10 + 5,
                        borderRadius: '50%',
                        backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][
                          Math.floor(Math.random() * 6)
                        ],
                        top: -20,
                        left: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, Math.random() * 200 + 100],
                        x: [0, (Math.random() - 0.5) * 100],
                        rotate: [0, Math.random() * 360],
                        opacity: [1, 0],
                      }}
                      transition={{
                        duration: Math.random() * 2 + 1,
                        ease: 'easeOut',
                        repeat: 0,
                        delay: Math.random() * 0.5,
                      }}
                    />
                  ))}
                </Box>
              )}
              
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                <CheckCircleIcon 
                  color="success" 
                  style={{ fontSize: 80, marginBottom: 16 }} 
                />
              </motion.div>
              
              <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
                Booking Successful!
              </Typography>
              
              <Box sx={{ mt: 2, mb: 3, width: '100%' }}>
                <Typography variant="body1" align="center" paragraph>
                  You have successfully booked space <b>{bookedSpace.spaceNumber}</b>
                </Typography>
                
                <Box sx={{ 
                  border: '1px solid #eee', 
                  borderRadius: 2, 
                  p: 2, 
                  mt: 2,
                  backgroundColor: '#f9f9f9'
                }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Booking Details:
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2">Location:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="medium">
                        {selectedStreet || selectedCity}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2">Space Number:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="medium">
                        {bookedSpace.spaceNumber}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2">Price:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="medium">
                        KES {bookedSpace.pricePerHour}/hour
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2">Duration:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="medium">
                        {bookedSpace.bookingDuration}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2">Booking Time:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" fontWeight="medium">
                        {new Date(bookedSpace.bookingTime).toLocaleTimeString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button 
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setPaymentSuccess(false);
                    // Center map on the booked space
                    if (mapRef) {
                      mapRef.panTo(bookedSpace.location);
                      mapRef.setZoom(19); // Zoom in closer
                    }
                  }}
                >
                  View on Map
                </Button>
                <Button 
                  variant="outlined"
                  onClick={() => setPaymentSuccess(false)}
                >
                  Close
                </Button>
              </Box>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Google Map with traffic layer */}
        <GoogleMap
          id="map"
          mapContainerStyle={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
          zoom={zoom}
          center={center}
          options={{
            ...mapOptions,
            mapTypeId: mapType,
            streetViewControl: !showStreetView,
          }}
          onClick={handleMapClick}
          onLoad={onMapLoad}
        >
          {/* Traffic layer */}
          <TrafficLayer />
          
          {/* Street markers */}
          {selectedCity && streetsByCity[selectedCity].map((street) => (
            <Marker
              key={`street-${street.name}`}
              position={{ lat: street.lat, lng: street.lng }}
              icon={{
                url: '//maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new window.google.maps.Size(20, 20),
              }}
              label={{
                text: street.name,
                color: 'white',
                fontSize: '10px',
              }}
              title={street.name}
            />
          ))}

          {/* Parking space markers */}
          {visibleSpaces.map((space) => (
            <Marker
              key={space.id}
              position={space.location}
              icon={{
                url: space.bookedBy === 'current-user'
                  ? '//maps.google.com/mapfiles/ms/icons/blue-dot.png' // User's booked space
                  : space.status === 'available'
                    ? '//maps.google.com/mapfiles/ms/icons/green-dot.png'
                    : space.status === 'expiring'
                      ? '//maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                      : '//maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new window.google.maps.Size(
                  space.bookedBy === 'current-user' ? 30 : 20, // Larger marker for user's booking
                  space.bookedBy === 'current-user' ? 30 : 20
                ),
              }}
              animation={space.bookedBy === 'current-user' ? google.maps.Animation.BOUNCE : undefined}
              onClick={() => setSelectedSpace(space)}
              title={`Parking Space ${space.spaceNumber} - ${space.status} - KES ${space.pricePerHour}/hr`}
            />
          ))}

          {/* Selected space info box - more compact */}
          {selectedSpace && !showStreetView && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 2,
                bgcolor: 'background.paper',
                p: 2,
                borderRadius: 1,
                boxShadow: 3,
                minWidth: 200,
                maxWidth: 300,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {selectedSpace.id.startsWith('new-') ? 'New Parking Space' : `Space ${selectedSpace.spaceNumber}`}
              </Typography>
              <Typography variant="body2">Location: {selectedStreet || selectedCity}</Typography>
              <Typography variant="body2">Status: {selectedSpace.status}</Typography>
              <Typography variant="body2">Price: KES {selectedSpace.pricePerHour}/hour</Typography>
              <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                {selectedSpace.status === 'available' && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleBooking(selectedSpace)}
                  >
                    Book Now
                  </Button>
                )}
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<ThreeSixtyIcon />}
                  onClick={() => {
                    const location = new google.maps.LatLng(
                      selectedSpace.location.lat,
                      selectedSpace.location.lng
                    );
                    handleStreetViewOpen(location, selectedSpace);
                  }}
                >
                  360° View
                </Button>
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={() => setSelectedSpace(null)}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </GoogleMap>
      </Box>
    </Box>
  );
} 
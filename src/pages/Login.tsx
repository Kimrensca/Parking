import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
} from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface LoginFormData {
  phoneNumber: string;
  password: string;
  confirmPassword?: string;
}

const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    return '+254' + cleaned.slice(1);
  }
  if (cleaned.startsWith('7')) {
    return '+254' + cleaned;
  }
  return cleaned;
};

export default function Login() {
  const navigate = useNavigate();
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginFormData>({
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validatePhoneNumber = (phone: string) => {
    return phone.match(/^(0?7\d{8})$/);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!validatePhoneNumber(formData.phoneNumber)) {
        throw new Error('Please enter a valid phone number (0700123456)');
      }

      const formattedPhone = formatPhoneNumber(formData.phoneNumber);

      if (isNewUser) {
        // Registration
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        // Check if user exists
        const { data: existingUser } = await supabase
          .from('users')
          .select()
          .eq('phone_number', formattedPhone)
          .single();

        if (existingUser) {
          throw new Error('Phone number already registered');
        }

        // Create new user
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ 
            phone_number: formattedPhone,
            password: formData.password  // Store hashed password
          }]);

        if (insertError) throw insertError;
        navigate('/dashboard');
      } else {
        // Login
        const { data: user, error: loginError } = await supabase
          .from('users')
          .select()
          .eq('phone_number', formattedPhone)
          .eq('password', formData.password)
          .single();

        if (loginError || !user) {
          throw new Error('Invalid phone number or password');
        }

        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'An error occurred during authentication'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}
    >
      <Container maxWidth="xs">
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            width: '100%',
            borderRadius: 2,
            bgcolor: 'background.paper'
          }}
        >
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            {isNewUser ? 'Create Account' : 'Login'}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              placeholder="0700123456"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              error={!!error}
              helperText={error || "Enter your phone number starting with 07"}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!error}
            />

            {isNewUser && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!error}
              />
            )}

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (isNewUser ? 'Register' : 'Login')}
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => {
                setIsNewUser(!isNewUser);
                setError(null);
                setFormData({
                  phoneNumber: '',
                  password: '',
                  confirmPassword: '',
                });
              }}
            >
              {isNewUser ? 'Already have an account? Login' : "Don't have an account? Register"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
} 
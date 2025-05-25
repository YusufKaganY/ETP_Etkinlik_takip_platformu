import React, { useState } from 'react';
import api from './api'; 
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Gönderilen login verisi:', { email, password });

    try {
      const response = await api.post('/api/auth/login', { email, password });

      const { token, user, requirePasswordChange, message } = response.data;

      if (requirePasswordChange) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        alert(message || 'Şifrenizi değiştirmeniz gerekiyor.');
        navigate('/change-password');
        return;
      }

      // Normal giriş
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/home');
    } catch (err) {
      setError(err?.response?.data?.message ||'Geçersiz e-posta veya şifre!');
    }
  };


  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom align="center">
        Giriş Yap
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleLogin}>
        <TextField
          label="E-posta"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Şifre"
          type="password"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button type="submit" variant="contained" color="primary">
            Giriş Yap
          </Button>
        </Box>

        <Box sx={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center', py: 2 }}>
          <Typography>
            Yusuf Kağan Yıldırım - AtaUni PCMUH
          </Typography>
        </Box>
      </form>
    </Container>
  );
};

export default Login;

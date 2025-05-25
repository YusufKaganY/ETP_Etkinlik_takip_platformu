import api from './api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Box,
} from '@mui/material';

const user = JSON.parse(localStorage.getItem('user') || '{}');
const userId = user.id;
const userEmail = user.email;

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Tüm alanları doldurmalısınız.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Yeni şifreler eşleşmiyor.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }

    try {
      // Token yoksa userId ile gönderiliyor
      const token = localStorage.getItem('token');
      let config = {};
      if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
      }
      const response = await api.post(
        '/api/auth/change-password',
        { oldPassword, newPassword}, 
        config
      );

      setSuccess('Şifre başarıyla değiştirildi.');
      setError('');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      console.error('Şifre değiştirme hatası:', err);
      setError(err?.response?.data?.message || 'Şifre değiştirilemedi.');
      setSuccess('');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Şifre Değiştir
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Eski Şifre"
            name="oldPassword"
            type="password"
            value={formData.oldPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Yeni Şifre"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Yeni Şifre (Tekrar)"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Şifreyi Güncelle
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChangePassword;
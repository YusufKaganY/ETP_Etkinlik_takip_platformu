import React, { useState, useEffect } from 'react';
import api from './api';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [tickets, setTickets] = useState([]); // Satın alınan biletler

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }

    api.get('/api/user/profile')
      .then(res => {
        setUserInfo(res.data);
      })
      .catch(err => console.error(err));

    // Satın alınan biletleri çek
    const token = localStorage.getItem('token');
    api.get('/api/user/my-tickets', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setTickets(res.data.tickets || []))
      .catch(err => setTickets([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert('Bilgiler kaydedildi: ' + JSON.stringify(userInfo));
  };

  return (
    <Container sx={{ mt: 4, maxWidth: 600, position: 'relative' }}>
      {/* Yönetici Paneli */}
      {user?.isAdmin && (
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/admin-panel')}
          >
            Yönetici Paneli
          </Button>
        </Box>
      )}

      <Typography variant="h4" gutterBottom>Kullanıcı Profili</Typography>

      <Box component="form" noValidate autoComplete="off" sx={{ mb: 3 }}>
        <TextField
          label="Ad"
          name="firstName"
          value={userInfo.firstName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Soyad"
          name="lastName"
          value={userInfo.lastName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="E-posta"
          name="email"
          value={userInfo.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="email"
        />
        <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
          Bilgileri Kaydet
        </Button>
      </Box>

      <Button variant="outlined" onClick={() => navigate('/change-password')} sx={{ mb: 2 }}>
        Şifre Değiştir
      </Button>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Satın Alınan Biletler
      </Typography>
      <List>
        {tickets.length === 0 ? (
          <ListItem>
            <ListItemText primary="Henüz bilet alınmamış." />
          </ListItem>
        ) : (
          tickets.map((ticket, i) => (
            <ListItem key={i} divider>
              <ListItemText
                primary={`Sipariş No: ${ticket.id}`}
                secondary={`Tutar: ${ticket.totalAmount} ₺ - Durum: ${ticket.status} - Tarih: ${ticket.createdAt}`}
              />
            </ListItem>
          ))
        )}
      </List>
    </Container>
  );
};

export default UserProfile;
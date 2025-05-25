import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [capacity, setCapacity] = useState('');
  const [type, setType] = useState('');

  // Etkinlikleri API'den çek
  const fetchEvents = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await api.get('/admin/events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data.data);
    } catch (err) {
      console.error('Etkinlikler alınamadı:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Etkinlik ekle
  const handleAdd = async () => {
    if (
      newTitle.trim() === '' ||
      description.trim() === '' ||
      date.trim() === '' ||
      location.trim() === '' ||
      price.trim() === ''
    )
      return alert('Lütfen tüm alanları doldurun');

    const token = localStorage.getItem('token');
    try {
      await api.post(
        '/events',
        {
          title: newTitle,
          description,
          date,
          location,
          type: type || 'Konser',
          price: parseFloat(price),
          capacity: capacity ? parseInt(capacity) : 100,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Formu temizleme
      setNewTitle('');
      setDescription('');
      setDate('');
      setLocation('');
      setPrice('');
      setCapacity('');
      setType('');

      fetchEvents();
    } catch (err) {
      console.error('Etkinlik eklenemedi:', err);
    }
  };

  // Yayın durumunu değiştir
  const handleToggle = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const updatedEvent = events.find((e) => e.id === id);
      const newStatus = !updatedEvent.isPublished;

      await api.patch(
        `/admin/events/${id}/publish`,
        { isPublished: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEvents((prev) =>
        prev.map((event) =>
          event.id === id ? { ...event, isPublished: newStatus } : event
        )
      );
    } catch (err) {
      console.error('Yayın durumu güncellenemedi:', err);
    }
  };

  // Etkinlik sil
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/admin/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchEvents();
    } catch (err) {
      console.error('Etkinlik silinemedi:', err);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Etkinlik Yönetimi
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1">Yeni Etkinlik Ekle</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Etkinlik Adı"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Açıklama"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tarih"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Yer"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fiyat"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Kapasite"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Tür"
              value={type}
              onChange={(e) => setType(e.target.value)}
              SelectProps={{
                native: true,
              }}
            >
              <option value=""></option>
              <option value="Konser">Konser</option>
              <option value="Tiyatro">Tiyatro</option>
              <option value="Opera">Opera</option>
              <option value="Festival">Festival</option>
              <option value="Stand-up">Stand-up</option>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleAdd}>
              Ekle
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Etkinlik Adı</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.isPublished ? 'Yayında' : 'Yayında Değil'}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color={event.isPublished ? 'warning' : 'success'}
                    onClick={() => handleToggle(event.id)}
                    sx={{ mr: 1 }}
                  >
                    {event.isPublished ? 'Kaldır' : 'Yayınla'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(event.id)}
                  >
                    Sil
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default EventManager;

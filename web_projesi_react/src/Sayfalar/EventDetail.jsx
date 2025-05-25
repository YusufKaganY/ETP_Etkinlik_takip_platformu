import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Button,
  Box,
  Container,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [ticketType, setTicketType] = useState('Standart');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        setEvent(null);
      }
    };
    fetchEvent();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/cart',
        { eventId: event.id, ticketType, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Etkinlik sepete eklendi!');
      setError('');
    } catch (err) {
      setError('Sepete eklenemedi. Giriş yapmış olmalısınız.');
      setSuccess('');
    }
  };

  if (event === null) return <Container><Typography>Etkinlik bulunamadı.</Typography></Container>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Container sx={{ mt: 8, textAlign:'left', width:'80%' }}>
        {success && <Alert severity="success">{success}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <Typography variant="h4" gutterBottom>{event.title}</Typography>
        <Typography variant="body1" gutterBottom>{event.description}</Typography>
        <Typography><strong>Tarih:</strong> {event.date}</Typography>
        <Typography><strong>Yer:</strong> {event.location}</Typography>
        <Typography><strong>Kategori:</strong> {event.category}</Typography>
        <Typography><strong>Kontenjan:</strong> {event.capacity}</Typography>
        <Typography><strong>Fiyat:</strong> {event.price} TL</Typography>
        <Box sx={{ mt: 3, display: 'flex', gap: 3, alignItems: 'center' }}>
          <FormControl>
            <InputLabel id="ticket-type-label">Bilet Türü</InputLabel>
            <Select
              labelId="ticket-type-label"
              value={ticketType}
              label="Bilet Türü"
              onChange={(e) => setTicketType(e.target.value)}
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="Standart">Standart</MenuItem>
              <MenuItem value="VIP">VIP</MenuItem>
              <MenuItem value="Öğrenci">Öğrenci</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              size="small"
            >
              <RemoveIcon />
            </IconButton>
            <Typography sx={{ mx: 1 }}>{quantity}</Typography>
            <IconButton
              onClick={() => setQuantity(q => q + 1)}
              size="small"
            >
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
      <Box sx={{ mt: 5, width:'32%' ,textAlign: 'center' }}>
        <Button
          variant="contained"
          onClick={handleAddToCart}
        >
          Sepete Ekle
        </Button>
      </Box>
    </div>
  );
}

export default EventDetail;
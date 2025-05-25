import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Box,
  Alert,
} from '@mui/material';
import axios from 'axios';

const ticketMultipliers = { Standart: 1, VIP: 1.5, Öğrenci: 0.75 };

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('Kredi Kartı');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Sepeti backend'den çek
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(res.data.data || []);
      } catch (err) {
        setError('Sepet alınamadı.');
      }
    };
    fetchCart();
  }, []);

  const handleTicketTypeChange = async (index, type) => {
    const newCart = [...cart];
    newCart[index].ticketType = type;
    setCart(newCart);
  };

  const getTotal = () => cart.reduce(
    (sum, item) =>
      sum +
      (item.Event?.price || 0) *
        ticketMultipliers[item.ticketType || 'Standart'] *
        (item.quantity || 1),
    0
  );

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(cart.filter(item => item.id !== cartItemId));
    } catch (err) {
      setError('Ürün sepetten çıkarılamadı.');
    }
  };

  const handlePurchase = async () => {
    try {
      const token = localStorage.getItem('token');
      const orderItems = cart.map((item) => ({
        eventId: item.eventId,
        ticketType: item.ticketType,
        quantity: item.quantity,
        pricePerTicket:
          (item.Event?.price || 0) *
          ticketMultipliers[item.ticketType || 'Standart'],
        totalPrice:
          (item.Event?.price || 0) *
          ticketMultipliers[item.ticketType || 'Standart'] *
          item.quantity,
      }));

      const response = await axios.post(
        '/api/orders',
        { paymentMethod, items: orderItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess('Satın alma başarılı! Biletler profilinize eklendi.');
        setError('');
        setCart([]);
      } else {
        setError(response.data.message || 'Satın alma sırasında bir hata oluştu.');
        setSuccess('');
      }
    } catch (err) {
      setError('Satın alma sırasında bir hata oluştu.');
      setSuccess('');
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Sepetim
      </Typography>
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={3}>
        {cart.map((item, index) => (
          <Grid item xs={12} md={6} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{item.Event?.title}</Typography>
                <Typography>{item.Event?.category}</Typography>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Bilet Türü</InputLabel>
                  <Select
                    value={item.ticketType}
                    label="Bilet Türü"
                    onChange={(e) =>
                      handleTicketTypeChange(index, e.target.value)
                    }
                  >
                    {Object.keys(ticketMultipliers).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography sx={{ mt: 2 }}>
                  Fiyat:{' '}
                  {(
                    (item.Event?.price || 0) *
                    ticketMultipliers[item.ticketType || 'Standart']
                  ).toFixed(2)}{' '}
                  TL
                </Typography>
                <Typography>
                  Adet: {item.quantity}
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ mt: 2 }}
                  onClick={() => handleRemoveFromCart(item.id)}
                >
                  Sepetten Çıkar
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ mt: 5 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Ödeme Yöntemi</InputLabel>
          <Select
            value={paymentMethod}
            label="Ödeme Yöntemi"
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <MenuItem value="Kredi Kartı">Kredi Kartı</MenuItem>
            <MenuItem value="Havale">Havale</MenuItem>
          </Select>
        </FormControl>
        <Typography variant="h6">
          Toplam: {getTotal().toFixed(2)} TL
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handlePurchase}
          disabled={cart.length === 0}
        >
          Satın Al
        </Button>
      </Box>
    </Container>
  );
};

export default Cart;
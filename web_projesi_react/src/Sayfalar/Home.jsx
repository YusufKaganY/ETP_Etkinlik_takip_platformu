import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const defaultImage = 'https://via.placeholder.com/300x140?text=Etkinlik'; // Varsayılan görsel

const Home = () => {
  
  const [announcements, setAnnouncements] = useState([]);

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const city = 'Istanbul';
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('/api/events');
        console.log('API Etkinligi: ', res.data);
        setEvents((res.data || []).filter(e => e.isPublished === true));
      } catch (err) {
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = '1933e1884a7064411a120c320af4085f';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=tr`
        );
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error('Hava durumu alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const isWeatherGood = (desc) => {
    return desc?.includes('güneş') || desc?.includes('parçalı bulutlu') || desc?.includes('açık');
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/announcements', {
            headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAnnouncements(res.data.data || []);
      } catch (error) {
        console.error('Duyurular alınamadı:', error.response?.data || error.message);
        setAnnouncements([]);
      }
    };

    fetchAnnouncements();
  }, []);



  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        <strong>
          <span style={{ color: '#e33e3e' }}>ETP</span>
        </strong>
        {' '}&#39;ye Hoş Geldiniz!
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="outlined" component={Link} to="/User-Profile">
          👤 Profil
        </Button>
        <Button variant="outlined" component={Link} to="/cart">
          🛒 Sepete Git
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          Çıkış Yap
        </Button>
      </Box>
      <br />
      {/* DUYURU */}
      <Paper elevation={3} sx={{ p: 2, mb: 4, backgroundColor: '#f3f3f3' }}>
        <Typography variant="h6">📢 Duyurular:</Typography>
        {announcements.length === 0 ? (
          <Typography>Duyuru bulunmamaktadır.</Typography>
        ) : (
          announcements.map((a) => (
            <Box key={a.id} sx={{ mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">{a.title}</Typography>
              <Typography variant="body2">{a.content}</Typography>
            </Box>
          ))
        )}
      </Paper>

      {/* HAVA DURUMU BİLGİSİ */}
      <Paper elevation={2} sx={{ p: 2, mb: 4, backgroundColor: '#e3f2fd' }}>
        <Typography variant="h6">🌦️ Güncel Hava Durumu</Typography>
        {loading ? (
          <Typography>Yükleniyor...</Typography>
        ) : weather && weather.main && weather.weather ? (
          <>
            <Typography>Şehir: {weather.name}</Typography>
            <Typography>Sıcaklık: {weather?.main?.temp}°C</Typography>
            <Typography>Durum: {weather?.weather?.[0]?.description}</Typography>
            <Typography sx={{ mt: 1 }} color={isWeatherGood(weather?.weather?.[0]?.description) ? 'green' : 'red'}>
              {isWeatherGood(weather?.weather?.[0]?.description)
                ? 'Bugün açık hava etkinlikleri için uygun!'
                : 'Bugün hava dış mekan etkinlikleri için uygun değil.'}
            </Typography>
          </>
        ) : (
          <Typography>Hava durumu bilgisi alınamadı.</Typography>
        )}
      </Paper>

      {/* ETKİNLİKLER */}
      <Typography variant="h5" gutterBottom>
        🎭 Etkinlikler
      </Typography>

      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={3} key={event.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={event.image || defaultImage}
                alt={event.title}
              />
              <CardContent>
                <Typography variant="h6">{event.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {event.category} – {event.date}
                </Typography>
                <Typography sx={{ mt: 1, fontWeight: 'bold' }}>
                  Fiyat: {event.price} TL
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  component={Link}
                  to={`/event/${event.id}`}
                  sx={{ mt: 1 }}
                >
                  Detayları Gör
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Alt Bağlantılar */}
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Button variant="outlined" component={Link} to="/interest-suggestions">
          İlgi Alanlarına Göre Öneriler
        </Button>
      </Box>

      {/* Footer */}
      <Box sx={{ display: 'flex', textAlign: 'right', py: 2 }}>
        <Typography>Yusuf Kağan Yıldırım - AtaUni PCMUH</Typography>
      </Box>
    </Container>
  );
};

export default Home;
import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        <strong><span style={{ color: '#e33e3e' }}>🎟️ Etkinlik Takip Platform</span></strong>'una <br/>Hoş Geldiniz!
      </Typography> 
      <Typography variant="h6" sx={{ mb: 4 }}>
        Konserlerden sanat galerilerine, şehirdeki en güzel etkinlikleri kaçırmayın!
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={() => navigate('/register')}>
          Kayıt Ol
        </Button>
        <Button variant="outlined" color="primary" onClick={() => navigate('/login')}>
          Giriş Yap
        </Button>
        <Button variant="text" color="secondary" onClick={() => navigate('/explore')}>
          Etkinlikleri Gözat
        </Button>
      </Box>
      <Box sx={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center', py: 2 }}>
        <Typography>  
          Yusuf Kağan Yıldırım - AtaUni PCMUH
        </Typography>
      </Box>
    </Container>
  );
};

export default Landing;

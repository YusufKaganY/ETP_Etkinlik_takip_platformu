import React from 'react';
import { Container, Typography } from '@mui/material';
import { Box } from '@mui/system';

const Explore = () => {
  return (
    <Container sx={{ mt: 10, position: 'relative', minHeight: '100vh' }}>
        <Typography variant="h3">‼️Daha Fazla Etkinlikler Gelecek‼️</Typography>
        <br />
        <Typography variant="h5">🎶 Konser - MOR VE ÖTESİ</Typography>
        <Typography variant="h6">Erzurum Açık Hava Konser Salonu</Typography>
        <Typography variant="h6">Tarih: 2025-06-15</Typography>
        <Typography variant="h6">Saat: 20:00</Typography>
        <br />
        <Typography variant="h5">🎭 Tiyatro - KÜÇÜK ŞEYLER</Typography>
        <Typography variant="h6">İstanbul Şehir Tiyatrosu</Typography>
        <Typography variant="h6">Tarih: 2025-06-20</Typography>
        <Typography variant="h6">Saat: 19:00</Typography>
        <br />
        <Typography variant="h5">🖼️ Sergi - MODERN SANAT</Typography>
        <Typography variant="h6">İstanbul Modern Sanat Müzesi</Typography>
        <Typography variant="h6">Tarih: 2025-06-25</Typography>
        <Typography variant="h6">Saat: 10:00</Typography>
        <br />
        <Typography variant="h5">📚 Seminer - YAZILIM GELİŞTİRME</Typography>
        <Typography variant="h6">İstanbul Teknik Üniversitesi</Typography>
        <Typography variant="h6">Tarih: 2025-06-30</Typography>
        <Typography variant="h6">Saat: 14:00</Typography>
        <br />
        <Typography variant="h5">🎨 Atölye - RESİM YAPIMI</Typography>
        <Typography variant="h6">İstanbul Sanat Atölyesi</Typography>
        <Typography variant="h6">Tarih: 2025-07-05</Typography>
        <Typography variant="h6">Saat: 11:00</Typography>
        <br />
        <br />
        <Box sx={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center', py: 2 }}>
          <Typography>  
            Yusuf Kağan Yıldırım - AtaUni PCMUH
          </Typography>
        </Box>
    </Container>
  );
};

export default Explore;

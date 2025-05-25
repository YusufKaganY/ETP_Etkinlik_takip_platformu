import React, { useState, useEffect } from 'react';
import {
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Box,
} from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');

  // Duyuruları backend'den çek
  const fetchAnnouncements = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/announcements', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAnnouncements(res.data.data || []);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleAdd = async () => {
    if (newAnnouncement.trim() === '') return;
    const token = localStorage.getItem('token');
    await axios.post(
      '/api/announcements',
      { title: newAnnouncement, content: newAnnouncement },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewAnnouncement('');
    fetchAnnouncements();
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`/api/announcements/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchAnnouncements();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Duyuru Yönetimi
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1">Yeni Duyuru Ekle</Typography>
        <Box sx={{ display: 'flex', mt: 1 }}>
          <TextField
            fullWidth
            label="Duyuru metni"
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
          />
          <Button variant="contained" sx={{ ml: 2 }} onClick={handleAdd}>
            Ekle
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1">Mevcut Duyurular</Typography>
        <List>
          {announcements.map((a) => (
            <React.Fragment key={a.id}>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleDelete(a.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={a.title || a.content} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default AnnouncementManager;
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Typography } from '@mui/material';
import axios from 'axios';

const EventApproval = () => {
  const [pendingEvents, setPendingEvents] = useState([]);

  const fetchPendingEvents = async () => {
    try {
      const response = await axios.get('/api/events/pending', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPendingEvents(response.data.data);
    } catch (error) {
      console.error('Etkinlikler alınamadı:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(`/api/events/${id}/publish`, { isPublished: true }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchPendingEvents(); // Listeyi güncelleme
    } catch (error) {
      console.error('Etkinlik onaylanamadı:', error);
    }
  };

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  if (pendingEvents.length === 0) {
    return <Typography>Onay bekleyen etkinlik bulunmamaktadır.</Typography>;
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>Onay Bekleyen Etkinlikler</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Başlık</TableCell>
            <TableCell>Yayın Durumu</TableCell>
            <TableCell>İşlem</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pendingEvents.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.title}</TableCell>
              <TableCell>{event.isPublished ? 'Yayında' : 'Bekliyor'}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleApprove(event.id)}
                >
                  Yayınla
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default EventApproval;
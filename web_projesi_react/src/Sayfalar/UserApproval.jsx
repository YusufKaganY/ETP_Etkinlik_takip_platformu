import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
} from '@mui/material';
import axios from 'axios';

const UserApproval = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  // Bekleyen kullanıcıları API'den çek
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/users/pending', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.data);
      } catch (err) {
        setError('Bekleyen kullanıcılar alınamadı.');
      }
    };
    fetchPendingUsers();
  }, []);

  // Kullanıcıyı onayla
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/users/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Onaylanan kullanıcıyı güncelle
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, approved: true } : user
        )
      );
    } catch (err) {
      setError('Kullanıcı onaylanamadı.');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Bekleyen Kullanıcılar
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ad</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Durum</TableCell>
              <TableCell>İşlem</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.firstName
                    ? `${user.firstName} ${user.lastName || ''}`
                    : user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.approved ? 'Onaylandı' : 'Bekliyor'}
                </TableCell>
                <TableCell>
                  {!user.approved && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleApprove(user.id)}
                    >
                      Onayla
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default UserApproval;
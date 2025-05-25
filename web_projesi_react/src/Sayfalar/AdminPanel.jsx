import React, { useState } from 'react';
import {
  Container,
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import UserApproval from './UserApproval';
import EventManager from './EventManager';
import AnnouncementManager from './AnnouncementManager';

const AdminPanel = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>Yönetici Paneli</Typography>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Kullanıcı Onayı" />
          <Tab label="Etkinlik Yönetimi" />
          <Tab label="Duyurular" />
        </Tabs>
        <Box sx={{ mt: 3 }}>
          {tabIndex === 0 && <UserApproval />}
          {tabIndex === 1 && <EventManager />}
          {tabIndex === 2 && <AnnouncementManager />}
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminPanel;
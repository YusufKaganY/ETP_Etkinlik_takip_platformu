const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const adminCheck = require('../middleware/adminMiddleware');

module.exports = (User, Event, Announcement) => {
  const router = express.Router();

  router.use(authenticateToken);
  router.use(adminCheck);

  // ====================
  // KULLANICI ONAYLARI
  // ====================
  router.get('/users/pending', async (req, res) => {
    try {
      const pendingUsers = await User.findAll({ where: { approved: false } });
      res.json({ success: true, data: pendingUsers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Bekleyen kullanıcılar alınamadı' });
    }
  });

  router.post('/users/:id/approve', async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı' });

      user.approved = true;
      await user.save();
      res.json({ success: true, message: 'Kullanıcı onaylandı' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Kullanıcı onaylanırken hata oluştu' });
    }
  });

  // ====================
  // ETKİNLİK YÖNETİMİ
  // ====================
  router.get('/admin/events', async (req, res) => {
    try {
      const pendingEvents = await Event.findAll();
      res.json({ success: true, data: pendingEvents });
    } catch (error) {
      console.error('Etkinlik getirme hatası:', error);
      res.status(500).json({ success: false, message: 'Etkinlikler alınamadı.' });
    }
  });

  router.patch('/admin/events/:id/publish', async (req, res) => {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) return res.status(404).json({ message: 'Etkinlik bulunamadı' });
      event.isPublished = req.body.isPublished;
      await event.save();

      res.json({ success: true, message: 'Etkinlik güncellendi', data: event });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Güncellenemedi' });
    }
  });

  router.post('/events', async (req, res) => {
    const { title, description, date, location, type, price, capacity } = req.body;

    if (!title || !description || !date || !location || !type || !price || !capacity) {
      return res.status(400).json({ success: false, message: 'Tüm alanlar zorunludur' });
    }

    try {
      const event = await Event.create({ title, description, date, location, type, price, capacity });
      res.status(201).json({ success: true, message: 'Etkinlik eklendi', data: event });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Etkinlik eklenirken hata oluştu' });
    }
  });

  router.put('/events/:id', async (req, res) => {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) return res.status(404).json({ success: false, message: 'Etkinlik bulunamadı' });

      await event.update(req.body);
      res.json({ success: true, message: 'Etkinlik güncellendi', data: event });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Etkinlik güncellenirken hata oluştu' });
    }
  });

  router.delete('/admin/events/:id', async (req, res) => {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) return res.status(404).json({ success: false, message: 'Etkinlik bulunamadı' });

      await event.destroy();
      res.json({ success: true, message: 'Etkinlik silindi' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Etkinlik silinirken hata oluştu' });
    }
  });


  return router;
};
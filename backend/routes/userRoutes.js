const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');

module.exports = (User, Event, Announcement, Order, OrderItem) => {
  const router = express.Router();

  // Kullanıcı profili görüntüleme
  router.get('/profile', authenticateToken, async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
      if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Profil bilgisi alınamadı', error });
    }
  });

  // Profil güncelleme
  router.put('/profile', authenticateToken, async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

      const { firstName, lastName } = req.body;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;

      await user.save();

      res.json({ message: 'Profil güncellendi', user });
    } catch (error) {
      res.status(500).json({ message: 'Profil güncellenemedi', error });
    }
  });

  // Etkinlikleri listeleme
  router.get('/events', authenticateToken, async (req, res) => {
    try {
      const events = await Event.findAll({ order: [['date', 'ASC']] });
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Etkinlikler alınamadı', error });
    }
  });

  router.get('/announcements', authenticateToken, async (req, res) => {
    try {
      const announcements = await Announcement.findAll({ order: [['createdAt', 'DESC']] });
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ message: 'Duyurular alınamadı', error });
    }
  });

  router.get('/my-tickets', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const orders = await Order.findAll({
        where: { userId },
        attributes: ['id', 'totalAmount', 'status', 'createdAt', 'updatedAt'],
        order: [['createdAt', 'DESC']]
      });
      res.json({ tickets: orders });
    } catch (error) {
      console.error('Biletler alınamadı:', error);
      res.status(500).json({ message: 'Biletler alınamadı.' });
    }
  });

  return router;
};

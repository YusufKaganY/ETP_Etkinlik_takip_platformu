const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');

module.exports = (Event, Announcement, User) => {
  const router = express.Router();

  router.get('/profile', authenticateToken, async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
      if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Profil bilgisi alınamadı', error });
    }
  });

  // Profil güncelleme örneği
  router.put('/profile', authenticateToken, async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

      // İzin verilen alanlar
      const { firstName, lastName } = req.body;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;

      await user.save();

      res.json({ message: 'Profil güncellendi', user });
    } catch (error) {
      res.status(500).json({ message: 'Profil güncellenemedi', error });
    }
  });

  // Yayınlanmış ve tarihi geçmemiş etkinlikleri listeleme
  router.get('/events', async (req, res) => {
    const { type, sort } = req.query;

    try {
      const whereClause = {
        published: true,
        date: { [require('sequelize').Op.gte]: new Date() },
      };

      if (type) {
        whereClause.type = type;
      }

      const events = await Event.findAll({
        where: whereClause,
        order: [['date', sort === 'desc' ? 'DESC' : 'ASC']],
      });

      res.json({ success: true, data: events });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Etkinlikler alınırken hata oluştu' });
    }
  });

  // Tek bir etkinliğin detayını getirme
  router.get('/events/:id', async (req, res) => {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event || !event.published) {
        return res.status(404).json({ success: false, message: 'Etkinlik bulunamadı' });
      }

      res.json({ success: true, data: event });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Etkinlik getirilirken hata oluştu' });
    }
  });

  // İlgi alanına göre önerilen etkinlikler
  router.get('/events/recommendations', authenticateToken, async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user || !user.interests) {
        return res.status(400).json({ success: false, message: 'İlgi alanları bulunamadı' });
      }

      const interests = user.interests.split(',').map(i => i.trim());

      const recommendedEvents = await Event.findAll({
        where: {
          published: true,
          type: { [require('sequelize').Op.in]: interests },
          date: { [require('sequelize').Op.gte]: new Date() },
        },
        order: [['date', 'ASC']],
      });

      res.json({ success: true, data: recommendedEvents });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Etkinlik önerileri alınırken hata oluştu' });
    }
  });

  // Duyuruları listeleme
  router.get('/announcements', async (req, res) => {
    try {
      const announcements = await Announcement.findAll({
        order: [['createdAt', 'DESC']],
      });
      res.json({ success: true, data: announcements });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Duyurular alınırken hata oluştu' });
    }
  });

  return router;
};

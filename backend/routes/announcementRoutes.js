const express = require('express');

module.exports = (Announcement) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      const announcements = await Announcement.findAll({ order: [['createdAt', 'DESC']] });
      res.json({ data: announcements });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Duyurular alınamadı' });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
     const announcement = await Announcement.findByPk(req.params.id);
      if (!announcement) {
        return res.status(404).json({ success: false, message: 'Duyuru bulunamadı' });
      }
      await announcement.destroy();
      res.json({ success: true, message: 'Duyuru silindi' });
    } catch (error) {
      console.error('Duyuru silinirken hata oluştu:', error);
      res.status(500).json({ success: false, message: 'Duyuru silinirken hata oluştu' });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { title, content } = req.body;
      if (!title || !content) {
        return res.status(400).json({ success: false, message: 'Başlık ve içerik zorunludur.' });
      }
      const newAnnouncement = await Announcement.create({ title, content });
      res.status(201).json({ success: true, data: newAnnouncement });
    } catch (error) {
      console.error('Duyuru eklenirken hata oluştu:', error);
      res.status(500).json({ success: false, message: 'Duyuru eklenirken hata oluştu' });
    }
  });

  return router;
};

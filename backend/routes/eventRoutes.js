const express = require('express');
const router = express.Router();
const { Event } = require('../models');

// Tüm etkinlikleri listele
router.get('/events', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Etkinlikler alınamadı', error });
  }
});

// Tek bir etkinliği ID ile getir
router.get('/events/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ message: 'Etkinlik bulunamadı' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Etkinlik getirilemedi', error });
  }
});

// Yeni etkinlik ekle (örnek)
router.post('/events', async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Etkinlik oluşturulamadı', error });
  }
});

// Etkinlik güncelle
router.put('/events/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ message: 'Etkinlik bulunamadı' });

    await event.update(req.body);
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Etkinlik güncellenemedi', error });
  }
});

// Etkinlik sil
router.delete('/events/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const event = await Event.findByPk(id);
    if (!event) return res.status(404).json({ message: 'Etkinlik bulunamadı' });

    await event.destroy();
    res.json({ message: 'Etkinlik silindi' });
  } catch (error) {
    res.status(500).json({ message: 'Etkinlik silinemedi', error });
  }
});

module.exports = router;

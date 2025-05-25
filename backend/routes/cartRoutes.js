const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

module.exports = (CartItem, Event) => {
  // Sepete ekle
  router.post('/', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { eventId, ticketType, quantity } = req.body;
      const event = await Event.findByPk(eventId);
      if (!event) return res.status(404).json({ message: 'Etkinlik bulunamadı.' });

      const cartItem = await CartItem.create({
        userId,
        eventId,
        ticketType,
        quantity,
      });

      res.json({ success: true, data: cartItem });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Sepete eklenemedi.' });
    }
  });

  // Sepeti getir
  router.get('/', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const items = await CartItem.findAll({
        where: { userId },
        include: [Event],
      });
      res.json({ success: true, data: items });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Sepet alınamadı.' });
    }
  });

  // Sepetten sil 
  router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const id = req.params.id;
      await CartItem.destroy({ where: { id, userId } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Silinemedi.' });
    }
  });

  return router;
};
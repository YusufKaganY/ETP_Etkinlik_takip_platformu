const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');

module.exports = (User, Order, OrderItem, Event) => {

  router.get('/tickets', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      // Kullanıcının siparişlerini ve ilgili orderItem ve event'leri çek
      const orders = await Order.findAll({
        where: { userId },
        include: [{
          model: OrderItem,
          include: [Event]
        }]
      });

      // Tüm orderItem'ları düz bir diziye çevir
      const tickets = [];
      orders.forEach(order => {
        order.OrderItems.forEach(item => {
          tickets.push({
            id: item.id,
            eventTitle: item.Event.title,
            eventDate: item.Event.date,
            ticketType: item.ticketType,
            quantity: item.quantity
          });
        });
      });

      res.json({ tickets });
    } catch (error) {
      res.status(500).json({ message: 'Biletler alınamadı.' });
    }
  });

  router.post('/', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.id;
      const { paymentMethod, items } = req.body;
      const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
      const order = await Order.create({
        userId,
        paymentMethod,
        status: 'Tamamlandı',
        totalAmount
      });
      for (const item of items) {
        await OrderItem.create({
          orderId: order.id,           
          eventId: item.eventId,       
          ticketType: item.ticketType,
          quantity: item.quantity,
          pricePerTicket: item.pricePerTicket,
          totalPrice: item.totalPrice,
        });
      }
      res.json({ success: true, message: 'Sipariş başarıyla oluşturuldu.' });
    } catch (error) {
      console.error('Sipariş oluşturulamadı:', error);
      res.status(500).json({ success: false, message: 'Sipariş oluşturulamadı.' });
    }
  });

  return router;
};
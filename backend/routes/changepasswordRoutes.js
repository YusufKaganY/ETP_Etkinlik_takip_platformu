const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');

module.exports = (User) => {
  const router = express.Router();

  router.post('/', authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      }

      if (user.password !== oldPassword) {
        return res.status(400).json({ message: 'Eski şifre hatalı' });
      }

      user.password = newPassword;
      user.passwordChanged = true;

      await user.save();

      res.json({ message: 'Şifre başarıyla değiştirildi' });
    } catch (error) {
      console.error('Şifre değiştirme hatası:', error);
      res.status(500).json({ message: 'Sunucu hatası', error });
    }
  });

  return router;
};

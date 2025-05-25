const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const authenticateToken = require('../middleware/authMiddleware'); 

module.exports = (User) => {
  //
  router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) return res.status(400).json({ message: 'Email zaten kayıtlı!' });

      await User.create({
        firstName,
        lastName,
        email,
        password,  
        isAdmin: false,
        approved: false,         
        passwordChanged: false,  
      });

      res.status(201).json({ message: 'Kullanıcı oluşturuldu! Yönetici onayını bekliyor.' });
    } catch (error) {
      res.status(500).json({ message: 'Kayıt sırasında hata oluştu', error });
    }
  });

  router.post('/login', async (req, res) => {
    console.log('Backend login isteği gövdesi:', req.body);
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      console.log('Bulunan kullanıcı:', user);

      if (!user) return res.status(400).json({ message: 'Kullanıcı bulunamadı!' });

      if (!user.approved) {
        console.log('Kullanıcı onaylı değil.');
        return res.status(403).json({ message: 'Hesabınız henüz yönetici tarafından onaylanmadı.' });
      }

      if (password !== user.password) {
        return res.status(400).json({ message: 'Şifre hatalı!' });
      }

      if (!user.passwordChanged) {
        const token = jwt.sign(
          { id: user.id, email: user.email, isAdmin: user.isAdmin },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );
        return res.status(200).json({ 
          message: 'Şifre değiştirilmesi gerekiyor.',
          requirePasswordChange: true,
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
            passwordChanged: user.passwordChanged
          }
        });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isAdmin: user.isAdmin,
          passwordChanged: user.passwordChanged,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Giriş sırasında hata oluştu', error });
    }
  });

  router.post('/change-password', authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const id = req.user.id;
    console.log('Token ile gelen user id:', req.user.id);

    try {
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı' });

      console.log('DB şifre:', user.password, 'Kullanıcıdan gelen:', oldPassword);

      if (oldPassword !== user.password) {
        return res.status(400).json({ message: 'Mevcut şifre yanlış' });
      }

      user.password = newPassword;
      user.passwordChanged = true;
      await user.save();

      res.json({ message: 'Şifre başarıyla değiştirildi' });
    } catch (error) {
      res.status(500).json({ message: 'Şifre değiştirilirken hata oluştu', error });
    }
  });

  return router;
};

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Örnek kullanıcılar (şifreler düz metin)
const users = [
  {
    id: 1,
    firstName: 'Yusuf',
    email: 'qwerty@gmail.com',
    password: '123456',  // Düz metin şifre
    isAdmin: true
  }
];

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: 'Kullanıcı bulunamadı' });

  if (password !== user.password) return res.status(401).json({ message: 'Şifre yanlış' });

  const token = jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    token,
    user: { id: user.id, firstName: user.firstName, email: user.email, isAdmin: user.isAdmin }
  });
});

module.exports = router;

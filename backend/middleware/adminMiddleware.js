const adminCheck = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Yönetici yetkisi yok' });
  }
  next();
};

module.exports = adminCheck;

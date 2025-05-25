const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const { sequelize, User, Event, Announcement, CartItem, Order, OrderItem } = require("./models");

const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // React sunucun hangi portta çalışıyorsa onu yaz
  credentials: true // Eğer çerez (cookie) veya auth header kullanıyorsan bunu da ekle
}));
app.use(express.json());

// Model tanımlamaları
// const defineCartItem = require('./models/cartItem');
// const defineOrder = require('./models/order');
// const defineOrderItem = require('./models/orderItem');

// const CartItem = defineCartItem(sequelize);
// const Order = defineOrder(sequelize);
// const OrderItem = defineOrderItem(sequelize);

// Model ilişkileri (varsa burada tanımla)
User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Event, { through: OrderItem });
Event.belongsToMany(Order, { through: OrderItem });

User.hasMany(CartItem);
CartItem.belongsTo(User);

Event.hasMany(CartItem);
CartItem.belongsTo(Event);

// Veritabanı bağlantısı
sequelize.authenticate()
  .then(() => console.log('✅ Veritabanı bağlantısı başarılı.'))
  .catch(err => console.error('❌ Veritabanı bağlantı hatası:', err));

sequelize.sync({ force: false }) // force: kısmını false yapmayı unutma !!!!!!!!!!!!!!!!!!!!!!!
  .then(() => console.log('✅ Modeller senkronize edildi.'))
  .catch(err => console.error('❌ Modeller senkronize edilirken hata:', err));

// Route tanımlamaları

const cartRoutes = require('./routes/cartRoutes')(CartItem, Event);
app.use('/api/cart', cartRoutes);

const authRoutes = require('./routes/authRoutes')(User);
app.use('/api/auth', authRoutes);

const eventRoutes = require('./routes/eventRoutes');
app.use('/api', eventRoutes);

const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes(User, Order, OrderItem, Event));

const userRoutes = require('./routes/userRoutes')(User, Event, Announcement, Order, OrderItem);
app.use('/api/user', userRoutes);

const changePasswordRoute = require('./routes/changepasswordRoutes')(User);
app.use('/api/auth/change-password', changePasswordRoute);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api', adminRoutes(User, Event));

const announcementRoutes = require('./routes/announcementRoutes')(Announcement);
app.use('/api/announcements', announcementRoutes);



app.get("/", (req, res) => {
  res.send("🎉 API çalışıyor!");
});

app.get("/", (req, res) => {
  res.send("🎉 API çalışıyor!");
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor...`);
});

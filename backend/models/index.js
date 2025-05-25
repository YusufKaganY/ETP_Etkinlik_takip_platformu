const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    logging: false,
  }
);

// Model tanımlamaları
const User = require('./user')(sequelize, DataTypes);
const Event = require('./event')(sequelize, DataTypes);
const Announcement = require('./announcement')(sequelize, DataTypes);
const CartItem = require('./cartItem')(sequelize, DataTypes);
const Order = require('./order')(sequelize, DataTypes);
const OrderItem = require('./orderItem')(sequelize, DataTypes);

// İlişkiler
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Event.hasMany(OrderItem, { foreignKey: 'eventId' });
OrderItem.belongsTo(Event, { foreignKey: 'eventId' });

User.hasMany(CartItem, { foreignKey: 'userId' });
CartItem.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Event,
  Announcement,
  CartItem,
  Order,
  OrderItem
};

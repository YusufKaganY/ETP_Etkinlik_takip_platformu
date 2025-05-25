module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    ticketType: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    pricePerTicket: DataTypes.FLOAT,
    totalPrice: DataTypes.FLOAT,
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    eventId: { type: DataTypes.INTEGER, allowNull: false },
  });

  OrderItem.associate = models => {
    OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
    OrderItem.belongsTo(models.Event, { foreignKey: 'eventId' });
  };

  return OrderItem;
};
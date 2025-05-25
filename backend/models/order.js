module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    }
  });

  Order.associate = models => {
    Order.belongsTo(models.User, {
      foreignKey: 'userId'
    });
    Order.hasMany(models.OrderItem, { foreignKey: 'orderId' }); 
  };

  return Order;
};
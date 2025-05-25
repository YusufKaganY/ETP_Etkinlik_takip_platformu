const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Event = sequelize.define('Event', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    date: { type: DataTypes.DATE, allowNull: false },
    location: { type: DataTypes.STRING },
    isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
  });

  Event.associate = (models) => {
    Event.hasMany(models.OrderItem, { foreignKey: 'eventId' });
  };

  return Event;
};
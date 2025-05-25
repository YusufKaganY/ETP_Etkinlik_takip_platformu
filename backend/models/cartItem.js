const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('CartItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    eventId: { type: DataTypes.INTEGER, allowNull: false },
    ticketType: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Standart' }, // Ekle
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }, // Ekle
  });
};
const { DataTypes } = require('sequelize');
const db = require('../configuraciones/db');

const Renta = db.define(
  "renta",
  {
    Rentaid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    vehiculoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'vehiculos',
        key: 'vehiculoId',
      },
    },
    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'id',
      },
    },
    seguro: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
      }
      },
    fechaInicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fechaFin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    precioTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'completada', 'cancelada'),
      allowNull: false,
      defaultValue: 'pendiente',
    },
  },
  {
    tableName: "rentas",
  }
);

module.exports = Renta;

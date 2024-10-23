const { DataTypes } = require('sequelize');
const db = require('../configuraciones/db');

const Vehiculo = db.define(
  "vehiculo",
  {
    Vehiculoid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    marca: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    modelo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    año: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precioPorDia: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    tipoVehiculo: {
      type: DataTypes.STRING(50), 
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM('disponible', 'rentado', 'mantenimiento'),
      allowNull: false,
      defaultValue: 'disponible',
    },
    placa: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "vehiculos",
  }
);

module.exports = Vehiculo;

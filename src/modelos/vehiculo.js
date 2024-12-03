const { DataTypes } = require('sequelize');
const db = require('../configuraciones/db');

const Vehiculo = db.define(
  "vehiculo",
  {
    vehiculoid: {
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
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    placa: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    imagen: {
      type: DataTypes.STRING,
      defaultValue: 'image',
    }, 
    nombreImagen: {
      type: DataTypes.STRING,
      defaultValue: 'image',
    },
  },
  {
    tableName: "vehiculos",
  }
);

module.exports = Vehiculo;

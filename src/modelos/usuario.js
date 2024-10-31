const { DataTypes } = require('sequelize');
const db = require('../configuraciones/db');

const Usuario = db.define(
  "usuario",
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
   
    tipo_usuario: {
      type: DataTypes.ENUM('Cliente', 'Empleado'),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    contraseña: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    rol: {
      type: DataTypes.ENUM('Admin', 'Gerente', 'Cajero'),
      allowNull: false,
    },
    fecha_creación: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "usuarios", 
    timestamps: true,
  }
);

module.exports = Usuario;
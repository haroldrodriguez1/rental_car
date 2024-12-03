const sequelize = require('sequelize');
const db = require('../configuraciones/db');
const Empresa = require('./empresa'); 

const Sucursal = db.define(
    "sucursal",
    {
        codigo: {
            type: sequelize.INTEGER,
            primaryKey: true,
             autoIncrement: true
        },
        nombre: {
            type: sequelize.STRING(50),
            allowNull: false
        },
        direccion: { 
            type: sequelize.TEXT,
            allowNull: false
        },
        telefono: {
            type: sequelize.STRING(15),
            allowNull: true
        },
        estado: {
            type: sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },

        
    },
    {
        tableName: "sucursales",
    }
);



module.exports = Sucursal;
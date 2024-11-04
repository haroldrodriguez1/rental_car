const sequelize = require('sequelize');
const db = require('../configuraciones/db');

const ClienteTelefono = db.define(
    "clientetelefono",
    {
        numero: {
            type: sequelize.STRING(15),
            allowNull: false,
        },
        clienteId: {
            type: sequelize.STRING(20),
            references: {
                model: 'clientes', 
                key: 'clienteId',         
            },
            allowNull: false
        }
    },
    {
        tableName:"clientetelefonos",
    }
);
module.exports = ClienteTelefono;
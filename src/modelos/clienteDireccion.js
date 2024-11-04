const sequelize = require('sequelize');
const db = require('../configuraciones/db');

const ClienteDireccion = db.define(
    "clienteDireccion",
    {
        descripcion:{
            type: sequelize.TEXT,
            allowNull: false
        },
        clienteId: {
            type: sequelize.INTEGER,
            references: {
                model: 'clientes', 
                key: 'clienteId',         
            },
            allowNull: false
        }
    },
    {
        tableName:"clientedirecciones",
    }
);
module.exports = ClienteDireccion;
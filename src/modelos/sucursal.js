const sequelize = require('sequelize');
const db = require('../configuraciones/db');
const Empresa = require('./empresa'); 

const Sucursal = db.define(
    "sucursal",
    {
        codigo: {
            type: sequelize.STRING(5),
            allowNull: false
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
        empresaId: {
            type: sequelize.INTEGER,
            references: {
                model: Empresa,
                key: 'id'
            },
            allowNull: false
        },
    },
    {
        tableName: "sucursales",
    }
);

Sucursal.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

module.exports = Sucursal;
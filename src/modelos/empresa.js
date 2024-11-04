const sequelize = require('sequelize');
const db = require('../configuraciones/db');

const Empresa = db.define(
    "empresa",
    {
        nombre: {
            type: sequelize.STRING(50),
            allowNull: false
        },
        empresaId: {
            type: sequelize.STRING(20),
            allowNull: false,
            unique: true
        },
        direccion: {
            type: sequelize.TEXT,
            allowNull: false
        },
        telefono: {
            type: sequelize.STRING(15),
            allowNull: true
        },
    },
    {
        tableName: "empresa",
    }
);

module.exports = Empresa;
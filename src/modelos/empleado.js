const { DataTypes } = require('sequelize'); 
const db = require('../configuraciones/db');

const Empleado = db.define(
    "empleado",
    {
        id_empleado: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        nombre_empleado: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        telefono: {
            type: DataTypes.STRING(20), 
            allowNull: true, 
        },
        correo: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                isEmail: true,
                notEmpty: true,
            },
        },
        cargo: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        tableName: "empleados",
    }
);

module.exports = Empleado;
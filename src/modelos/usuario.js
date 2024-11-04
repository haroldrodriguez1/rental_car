const sequelize = require('sequelize')
const db = require('../configuraciones/db')


const Usuario = db.define(
    "usuario",
    {
        identificacion:{
            type: sequelize.STRING(4),
            allowNull: false
        },
        nombreUsuario: {
            type: sequelize.STRING(120),
            allowNull: false,
            
        },
        contrasena:{
            type: sequelize.STRING(250),
            allowNull: false
        },
        correo:{
            type: sequelize.STRING(250),
            allowNull: false,
            unique:{
            args: true,
            msg: "Ya existe este correo"
            },
            validate:{
                isEmail: true

            }

        },
        tipoUsuario:{
            type: sequelize.ENUM('Cliente', 'Empleado'),
            allowNull: false,

        },
        pin:{
            type: sequelize.STRING(6),
            allowNull: true,
           defaultValue: '000000'

        },
        intentos:{
            type: sequelize.INTEGER,
            allowNull: true,
           defaultValue: 0

        },
        estado: {
            type: sequelize.ENUM('AC', 'iN', 'BL'),
            allowNull: true,
            defaultValue:'AC'

        }

    },

    {
        tableName: "usuarios",
        timestamps: true,
    }
)

module.exports = Usuario;
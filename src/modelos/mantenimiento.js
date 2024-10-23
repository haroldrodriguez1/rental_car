const sequelize = require('sequelize')
const db = require('../configuraciones/db')


const Mantenimiento = db.define(
    "mantenimiento",
    {
       IdMantenimiento:{
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey:true
       },
       descripcion:{
        type: sequelize.STRING(120),
        allowNull: false
       },
       costo:{
        type: sequelize.DOUBLE(10, 2),
        allowNull: false,
       },
      fecha_mantenimiento:{
        type: sequelize.DATE,
        allowNull: false

      }

    },

    {
        tableName: "mantenimientos",
        timestamps: true
    }
)

module.exports = Mantenimiento;
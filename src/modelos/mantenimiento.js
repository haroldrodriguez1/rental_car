const sequelize = require('sequelize')
const db = require('../configuraciones/db')


const Mantenimiento = db.define(
    "mantenimiento",
    {
       IdMantenimiento:{
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement: true
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

      },
      vehiculoId: {  
        type: sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'vehiculos',  
            key: 'vehiculoid'  
        }
    },
    activo: {
      type: sequelize.BOOLEAN,
      defaultValue: true, 
    }
  },

    {
        tableName: "mantenimientos",
        timestamps: true
    }
)

module.exports = Mantenimiento;
const sequelize = require('sequelize')
const db = require('../configuraciones/db')


const Pago = db.define(
    "pago",
    {
       IdPago:{
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey:true
       },
       monto:{
        type: sequelize.DOUBLE(10, 2),
        allowNull: false,
       },
       metodo_pago: {
        type: sequelize.ENUM('Tarjeta', 'Efectivo', 'Transferencia', 'Cheque'), 
        allowNull: false
      },
      fecha_pago:{
        type: sequelize.DATE,
        allowNull: false

      }

    },

    {
        tableName: "pagos",
        timestamps: true
    }
)

module.exports = Pago;
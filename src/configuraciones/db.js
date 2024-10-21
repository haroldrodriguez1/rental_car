const sequelize = require('sequelize');
require('dotenv').config();

const db = new sequelize(
    process.env.NOMBRE_DB,//nombre de la base de datos
    process.env.USUARIO_DB,//usuario de la base de datos
    process.env.CONTRASENA_DB,//contrasena
    {
        host: "localhost",
        dialect: "mysql",
        port: 3306,
    }
);

module.exports = db;
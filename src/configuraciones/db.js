const sequelize = require('sequelize');
const db = new sequelize(
    "rental",//nombre de la base de datos
    "root",//usuario de la base de datos
    "hola",//contrasena
    {
        host: "localhost",
        dialect: "mysql",
        port: 3306,
    }
);

module.exports = db;
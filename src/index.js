const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const modeloSeguro = require('./modelos/seguro');
const modeloRenta = require('./modelos/renta');
const modeloVehiculo = require('./modelos/vehiculo');

const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

const db = require('./configuraciones/db');


db.authenticate()
.then( async (data)=>{
    console.log("Conexion correcta con la base de datos");

    await modeloSeguro.sync().then((data)=>{
        console.log("Modelo seguro creado correctamente");
    });
    await modeloRenta.sync().then((data)=>{
        console.log("Modelo renta creado correctamente");
    });
    await modeloVehiculo.sync().then((data)=>{
        console.log("Modelo vehiculo creado correctamente");
    });
    
})
.catch((er)=>{
    console.log("Error al conectar la base de datos " + er);
});

const limitador = rateLimit({
    windowMs:1000 * 60 * 10,
    max:100
});

const app = express();
app.set('port', 3001);
app.use(morgan('dev'));
app.use(helmet());
app.use(limitador);
app.use(cors(require('./configuraciones/cors')));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/api', require('./rutas'));
app.use('/api/seguro', require('./rutas/rutasSeguro'));
app.use('/api/renta', require('./rutas/rutasRenta'));
app.use('/api/vehiculo', require('./rutas/rutasVehiculo'));

app.listen(process.env.PORT, ()=>{
    console.log('Servidor iniciado en el puerto ' + process.env.PORT);
});
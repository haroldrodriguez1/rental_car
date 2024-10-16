const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
require('dotenv').config();

const db = require('./configuraciones/db');


db.authenticate()
.then( async (data)=>{
    console.log("Conexion correcta con la base de datos");
    
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
app.listen(process.env.PORT, ()=>{
    console.log('Servidor iniciado en el puerto ' + process.env.PORT);
});
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const modeloSeguro = require('./modelos/seguro');
const modeloRenta = require('./modelos/renta');
const modeloVehiculo = require('./modelos/vehiculo');
const modeloPago = require('./modelos/pago')
const modeloMantenimiento = require('./modelos/mantenimiento')
const modeloServicio = require('./modelos/servicioAdicional')
const modeloCliente = require('./modelos/cliente')
const modeloEmpleado = require('./modelos/empleado')
const modeloUsuario = require('./modelos/usuario')
const modeloSucursal = require('./modelos/sucursal')
const modeloEmpresa = require('./modelos/empresa')
const modeloClienteTelefono = require('./modelos/clienteTelefono')
const modeloClienteDireccion = require('./modelos/clienteDireccion')
const rateLimit = require('express-rate-limit');
const cors = require('cors');

require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./configuraciones/swagger');

const db = require('./configuraciones/db');


db.authenticate()
    .then(async (data) => {
        console.log("Conexion correcta con la base de datos");


        modeloSeguro.hasMany(modeloRenta);
        modeloRenta.belongsTo(modeloSeguro);

        modeloServicio.hasMany(modeloRenta);
        modeloRenta.belongsTo(modeloServicio);
        
        modeloUsuario.hasMany(modeloCliente)
        modeloCliente.belongsTo(modeloUsuario)

        modeloCliente.hasMany(modeloClienteDireccion)
        modeloClienteDireccion.belongsTo(modeloCliente)

        modeloCliente.hasMany(modeloClienteTelefono)
        modeloClienteTelefono.belongsTo(modeloCliente)



        await modeloSeguro.sync().then((data) => {
            console.log("Modelo seguro creado correctamente");
        });

        await modeloEmpleado.sync().then((data) => {
            console.log("Modelo seguro creado correctamente");
        });
        await modeloUsuario.sync().then((data) => {
            console.log("modelo usuario creado correctamente");
        });
        await modeloCliente.sync().then((data) => {
            console.log("Modelo cliente creado correctamente");
        });
        await modeloClienteTelefono.sync().then((data) => {
            console.log("Modelo cliente telefono creado correctamente");
        });
        
        
        await modeloClienteDireccion.sync().then((data) => {
            console.log("Modelo cliente direccion creado correctamente");
        });
        await modeloVehiculo.sync().then((data) => {
            console.log("Modelo vehiculo creado correctamente");

        });
        await modeloServicio.sync().then((data) => {
            console.log("Modelo seguro creado correctamente");
        });
        await modeloRenta.sync().then((data) => {
            console.log("Modelo renta creado correctamente");
        });
       
        await modeloMantenimiento.sync().then((data) => {
            console.log("modelo mantenimiento creado correctamente");
        });
        await modeloPago.sync().then((data) => {
            console.log("modelo pago creado correctamente");
        });
        await modeloEmpresa.sync().then((data) => {
            console.log("Modelo empresa creado correctamente");
        });
    
        await modeloSucursal.sync().then((data) => {
            console.log("Modelo sucursal creado correctamente");
        });
    
})
.catch((er)=>{
    console.log("Error al conectar la base de datos " + er);
});

const limitador = rateLimit({
    windowMs: 1000 * 60 * 10,
    max: 100
});

const app = express();
app.set('port', 3001);
app.use(morgan('dev'));
app.use(helmet());
app.use(limitador);
app.use(cors(require('./configuraciones/cors')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', require('./rutas'));
app.use('/api/seguro', require('./rutas/rutasSeguro'));
app.use('/api/servicio', require('./rutas/rutaServicioAdicional'));
app.use('/api/renta', require('./rutas/rutasRenta'));
app.use('/api/vehiculo', require('./rutas/rutasVehiculo'));
app.use('/api/usuarios', require('./rutas/rutasUsuario'));
app.use('/api/empleado', require('./rutas/rutasEmpleado'));
app.use('/api/mantenimiento', require('./rutas/rutaMantenimiento'));
app.use('/api/cliente', require('./rutas/rutaCliente'));
app.use('/api/clientetelefono', require('./rutas/rutaClienteTelefono'));
app.use('/api/clientedireccion', require('./rutas/rutaClienteDireccion'));
app.use('/api/sucursal', require('./rutas/rutaSucursal'));
app.use('/api/empresa', require('./rutas/rutaEmpresas'));
app.use('/api/archivos', require('./rutas/rutasArchivos'));
app.use('/uploads', express.static(path.join(__dirname, 'img/Vehiculos')));
app.use('/clientesIMG', express.static(path.join(__dirname, 'img/Clientes')));

app.use('/api/pago', require('./rutas/rutaPago'));
 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(process.env.PORT, () => {
    console.log('Servidor iniciado en el puerto ' + process.env.PORT);
});
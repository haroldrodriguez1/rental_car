const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();
const archivosController = require('../controladores/archivos/controladorArchivos');
const Vehiculo = require('../modelos/vehiculo');

router.post('/imagen/vehiculo', archivosController.validarImagenVehiculo, archivosController.actualizarImagenVehiculo);
router.post('/imagen/cliente', archivosController.validarImagenCliente, archivosController.actualizarImagenCliente);


module.exports = router;
const { Router } = require('express');
const { body, query } = require('express-validator');
const modeloVehiculo = require('../modelos/vehiculo');
const controladorVehiculo = require('../controladores/controladorVehiculo');
const ruta = Router();

ruta.get('/', controladorVehiculo.inicio);

ruta.get('/listar', controladorVehiculo.listar);

ruta.post('/guardar',
    body("marca").isLength({ min: 3, max: 50 }).withMessage("La marca debe tener entre 3 y 50 caracteres")
        .custom(async value => {
            if (!value) {
                throw new Error('La marca no puede ser nula');
            }
        }),
    body("modelo").isLength({ min: 1, max: 50 }).withMessage("El modelo debe tener entre 1 y 50 caracteres"),
    body("año").isInt({ min: 1900, max: new Date().getFullYear() }).withMessage("El año debe ser un valor válido"),
    body("placa").isLength({ min: 1, max: 20 }).withMessage("La placa debe tener entre 1 y 20 caracteres")
        .custom(async value => {
            const buscarPlaca = await modeloVehiculo.findOne({ where: { placa: value } });
            if (buscarPlaca) {
                throw new Error('La placa del vehículo ya existe');
            }
        }),
    controladorVehiculo.guardar
);

ruta.put('/editar',
    query("id").isInt().withMessage('El ID debe ser un valor entero')
        .custom(async value => {
            const buscarVehiculo = await modeloVehiculo.findOne({ where: { id: value } });
            if (!buscarVehiculo) {
                throw new Error('El ID del vehículo no existe');
            }
        }),
    body("marca").optional().isLength({ min: 3, max: 50 }).withMessage("La marca debe tener entre 3 y 50 caracteres"),
    body("modelo").optional().isLength({ min: 1, max: 50 }).withMessage("El modelo debe tener entre 1 y 50 caracteres"),
    body("año").optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage("El año debe ser un valor válido"),
    body("placa").optional().isLength({ min: 1, max: 20 }).withMessage("La placa debe tener entre 1 y 20 caracteres"),
    controladorVehiculo.modificar
);

ruta.delete('/eliminar',
    query("id").isInt().withMessage('El ID debe ser un valor entero')
        .custom(async value => {
            const buscarVehiculo = await modeloVehiculo.findOne({ where: { id: value } });
            if (!buscarVehiculo) {
                throw new Error('El ID del vehículo no existe');
            }
        }),
    controladorVehiculo.eliminar
);

module.exports = ruta;

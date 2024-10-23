const { Router } = require('express');
const { body, query } = require('express-validator');
const modeloRenta = require('../modelos/renta');
const controladorRenta = require('../controladores/controladorRenta');
const ruta = Router();

ruta.get('/', controladorRenta.inicio);

ruta.get('/listar', controladorRenta.listar);

ruta.post('/guardar',
    body("cliente").isLength({ min: 3, max: 50 }).withMessage("El nombre del cliente debe tener entre 3 y 50 caracteres")
        .custom(async value => {
            if (!value) {
                throw new Error('El nombre del cliente no puede ser nulo');
            }
        }),
    body("vehiculoid").isInt().withMessage("El ID del vehículo debe ser un valor entero")
        .custom(async value => {
            const buscarVehiculo = await modeloRenta.findOne({ where: { vehiculoid: value } });
            if (!buscarVehiculo) {
                throw new Error('El ID del vehículo no existe');
            }
        }),
    body("fechainicio").isISO8601().withMessage("La fecha de inicio debe ser válida"),
    body("fechafin").isISO8601().withMessage("La fecha de fin debe ser válida"),
    controladorRenta.guardar
);

ruta.put('/editar',
    query("id").isInt().withMessage('El ID debe ser un valor entero')
        .custom(async value => {
            const buscarRenta = await modeloRenta.findOne({ where: { id: value } });
            if (!buscarRenta) {
                throw new Error('El ID de la renta no existe');
            }
        }),
    body("cliente").optional().isLength({ min: 3, max: 50 }).withMessage("El nombre del cliente debe tener entre 3 y 50 caracteres"),
    body("vehiculoid").optional().isInt().withMessage("El ID del vehículo debe ser un valor entero"),
    body("fechainicio").optional().isISO8601().withMessage("La fecha de inicio debe ser válida"),
    body("fechafin").optional().isISO8601().withMessage("La fecha de fin debe ser válida"),
    controladorRenta.modificar
);

ruta.delete('/eliminar',
    query("id").isInt().withMessage('El ID debe ser un valor entero')
        .custom(async value => {
            const buscarRenta = await modeloRenta.findOne({ where: { id: value } });
            if (!buscarRenta) {
                throw new Error('El ID de la renta no existe');
            }
        }),
    controladorRenta.eliminar
);

module.exports = ruta;

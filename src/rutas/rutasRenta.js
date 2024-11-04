const { Router } = require('express');
const { body, query } = require('express-validator');
const modeloRenta = require('../modelos/renta');
const controladorRenta = require('../controladores/controladorRenta');
const modeloVehiculo = require('../modelos/vehiculo');
const ruta = Router();

/**
 * @swagger
 * tags:
 *   name: Rentas
 *   description: Operaciones relacionas con las rentas
 */
ruta.get('/', controladorRenta.inicio);

/**
 * @swagger
 * /renta/listar:
 *   get:
 *     summary: Obtiene la lista de las rentas
 *     tags: 
 *         [Rentas]
 *     responses:
 *       200:
 *         description: Lista de las rentas obtenidos con éxito
 *         content: 
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Rentaid:
 *                     type: integer
 *                     description: Identificador único de la renta
 *                   vehiculoid:
 *                     type: integer
 *                     description: Identificador único del vehiculo
 *                   clienteId:
 *                     type: integer
 *                     description: Identificador único del cliente
 *                   fechaInicio:
 *                     type: date
 *                     description: Indica la fecha inicial de la renta del vehiculo
 *                   fechaFin:
 *                     type: date
 *                     description: Indica la fecha final de la renta del vehiculo
 *                   precioTotal:
 *                     type: decimal
 *                     description: Indica el precio total de la renta del vehiculo
 *                   estado:
 *                     type: enum
 *                     description: Indica el estado de la renta
 *       400:
 *         description: Error en la consulta 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: "Error en la consulta"
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: "Error en el servidor"
 */


ruta.get('/listar', controladorRenta.listar);

/**
 * @swagger
 * /renta/buscarrentaid:
 *   get:
 *     summary: Busca un renta por su ID
 *     tags: 
 *        [Rentas]
 *     parameters:
 *         in: query
 *         name: Rentaid
 *         schema:
 *           type: integer
 *         required: true
 *         description: Identificador único de renta a buscar
 *     responses:
 *       200:
 *         description: Renta encontrado con éxito
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   Rentaid:
 *                     type: integer
 *                     description: Identificador único de la renta
 *                   vehiculoid:
 *                     type: interger
 *                     description: Identificar unico del vehiculo
 *                   clienteId:
 *                     type: interger
 *                     description: Identificador unico del clienteid
 *                   fechaInicio:
 *                     type: date
 *                     description: Indica la fecha inicial de la renta del vehiculo
 *                   fechaFin:
 *                     type: date
 *                     description: Indica la fecha final de la renta del vehiculo
 *                   precioTotal:
 *                     type: decimal
 *                     description: Indica el precio taotal de la renta del vehiculo
 *                   estado:
 *                     type: enum
 *                     description: Indica el estado de la renta
 *                
 *       400:
 *         description: Error en la consulta a la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: "Error en la consulta"
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: "Error en el servidor"
 */

ruta.get('/buscarRentaid',
    query('Rentaid').notEmpty().withMessage('El campo Rentaid no puede estar vacío')
        .isInt().withMessage('El Rentaid debe ser un número entero'),
        async(req, res ) =>{
            try {
                const errores = validationResult(req);
                if(!errores.isEmpty()){
                    return res.status(400).json({errores});
                }
                const { Rentaid } = req.query;
                const renta = await modeloRenta.findByPk(Rentaid);

                if(!renta){
                     return res.status(404).json({campo: "Rentaid", msj: "Esta renta no existe"});
                }
                return controladorRenta.buscarRentaid(req, res);
            } catch (error) {
                    return res.status(500).json({msg: "Error en el servidor "});
            }
        },
        controladorRenta.buscarRentaid
);
/**
 * @swagger
 * /renta/guardar:
 *   post:
 *     summary: Guarda una nueva renta
 *     tags: 
 *        [Rentas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                   vehiculoid:
 *                     type: integer
 *                     description: Identificador único del vehículo
 *                   clienteId:
 *                     type: integer
 *                     description: Identificador único del cliente
 *                   fechaInicio:
 *                     type: string
 *                     format: date
 *                     description: Indica la fecha inicial de la renta del vehículo
 *                   fechaFin:
 *                     type: string
 *                     format: date
 *                     description: Indica la fecha final de la renta del vehículo
 *                   precioTotal:
 *                     type: number
 *                     format: float
 *                     description: Indica el precio total de la renta del vehículo
 *                   estado:
 *                     type: string
 *                     description: Indica el estado de la renta
 *                
 *     responses:
 *       201:
 *         description: Renta guardada con éxito
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Mensaje del estado de la acción
 *                 data:
 *                   type: object
 *                   properties:
 *                     Rentaid:
 *                       type: integer
 *                       description: Identificador único de la renta
 *                     vehiculoid:
 *                       type: integer
 *                       description: Identificador único del vehículo
 *                     clienteId:
 *                       type: integer
 *                       description: Identificador único del cliente
 *                     fechaInicio:
 *                       type: string
 *                       format: date
 *                       description: Indica la fecha inicial de la renta del vehículo
 *                     fechaFin:
 *                       type: string
 *                       format: date
 *                       description: Indica la fecha final de la renta del vehículo
 *                     precioTotal:
 *                       type: number
 *                       format: float
 *                       description: Indica el precio total de la renta del vehículo
 *                     estado:
 *                       type: string
 *                       description: Indica el estado de la renta
 *                
 *       400:
 *         description: Error en la consulta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: "Error en la consulta"
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: "Error en el servidor"
 */
ruta.post('/guardar',
    body("clienteId").isLength({ min: 1, max: 50 }).withMessage("El nombre del cliente debe tener entre 3 y 50 caracteres")
        .custom(async value => {
            if (!value) {
                throw new Error('El nombre del cliente no puede ser nulo');
            }
        }),
         body("vehiculoid").isInt().withMessage("El ID del vehículo debe ser un valor entero")
            .custom(async value => {
                const buscarVehiculo = await modeloVehiculo.findOne({ where: { vehiculoid: value } });
                if (!buscarVehiculo) {
                    throw new Error('El ID del vehículo no existe');
                }
            }),
     /*body("fechainicio").isISO8601().withMessage("La fecha de inicio debe ser válida"),
    body("fechafin").isISO8601().withMessage("La fecha de fin debe ser válida"), */
    controladorRenta.guardar
);


/**
 * @swagger
 * /renta/editar:
 *   put:
 *     summary: Modifica una renta existente
 *     tags:
 *       [Rentas]
 *     parameters:
 *       - in: query
 *         name: Rentaid
 *         required: true
 *         description: Identificador único de la renta a modificar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                   vehiculoid:
 *                     type: integer
 *                     description: Identificador único del vehículo
 *                   clienteId:
 *                     type: integer
 *                     description: Identificador único del cliente
 *                   fechaInicio:
 *                     type: string
 *                     format: date
 *                     description: Indica la fecha inicial de la renta del vehículo
 *                   fechaFin:
 *                     type: string
 *                     format: date
 *                     description: Indica la fecha final de la renta del vehículo
 *                   precioTotal:
 *                     type: number
 *                     format: float
 *                     description: Indica el precio total de la renta del vehículo
 *                   estado:
 *                     type: string
 *                     description: Indica el estado de la renta
 *     responses:
 *       200:
 *         description: Renta modificada con éxito
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Mensaje del estado de la acción
 *                 data:
 *                   type: object
 *                   properties:
 *                     Rentaid:
 *                       type: integer
 *                       description: Identificador único de la renta
 *                     vehiculoid:
 *                       type: integer
 *                       description: Identificador único del vehículo
 *                     clienteId:
 *                       type: integer
 *                       description: Identificador único del cliente
 *                     fechaInicio:
 *                       type: string
 *                       format: date
 *                       description: Indica la fecha inicial de la renta del vehículo
 *                     fechaFin:
 *                       type: string
 *                       format: date
 *                       description: Indica la fecha final de la renta del vehículo
 *                     precioTotal:
 *                       type: number
 *                       format: float
 *                       description: Indica el precio total de la renta del vehículo
 *                     estado:
 *                       type: string
 *                       description: Indica el estado de la renta
 *       400:
 *         description: Error en la consulta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: "Error en la consulta"
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: "Error en el servidor"
 */
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

/**
 * @swagger
 * /renta/eliminar:
 *   delete:
 *     summary: Elimina una renta existente
 *     tags:
 *       [Rentas]
 *     parameters:
 *       - in: query
 *         name: Rentaid
 *         required: true
 *         description: Identificador único de la renta a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro eliminado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: "Registro eliminado"
 *                 data:
 *                   type: object
 *                   properties:
 *                     Rentaid:
 *                       type: integer
 *                       description: Identificador único de la renta eliminada
 *       400:
 *         description: Error en la consulta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: "Error en la consulta"
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: "Error en el servidor"
 */

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

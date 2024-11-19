const { Router } = require('express');
const { body, query, validationResult } = require('express-validator');
const modeloVehiculo = require('../modelos/vehiculo');
const controladorVehiculo = require('../controladores/controladorVehiculo');
const { verificarUsuario } = require('../configuraciones/passport');
const ruta = Router();

/**
 * @swagger
 * tags:
 *   name: Vehiculos
 *   description: Operaciones relacionas con los vehiculos
 */

ruta.get('/', controladorVehiculo.inicio);
/**
 * @swagger
 * /vehiculo/listar:
 *   get:
 *     summary: Obtiene la lista de los vehículos
 *     tags: 
 *       - Vehiculos
 *     responses:
 *       200:
 *         description: Lista de los vehículos obtenidos con éxito
 *         content: 
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   vehiculoid:
 *                     type: integer
 *                     description: Identificador único del vehículo
 *                   marca:
 *                     type: string
 *                     description: Indica la marca del vehículo
 *                   modelo:
 *                     type: string
 *                     description: Indica el modelo del vehículo
 *                   año:
 *                     type: integer
 *                     description: Indica el año del vehículo
 *                   precioPorDia:
 *                     type: number
 *                     format: float
 *                     description: Indica el precio por día del vehículo
 *                   tipoVehiculo:
 *                     type: string
 *                     description: Indica el tipo de vehículo
 *                   estado:
 *                     type: string
 *                     description: Indica el estado del vehículo
 *                   placa:
 *                     type: string
 *                     description: Indica la placa del vehículo
 *                   imagen:
 *                     type: string
 *                     description: Imagen del vehículo
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



ruta.get('/listar', verificarUsuario,controladorVehiculo.listar);

/**
 * @swagger
 * /vehiculo/buscarvehiculoid:
 *   get:
 *     summary: Busca un vehiculo por su ID
 *     tags: 
 *        [Vehiculos]
 *     parameters:
 *         in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Identificador único de vehiculo a buscar
 *     responses:
 *       200:
 *         description: Vehiculo encontrado con éxito
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   vehiculoid:
 *                     type: interger
 *                     description: Identificar unico del vehiculo
 *                   marca:
 *                     type: string
 *                     description: Indica la marca del vehiculo
 *                   modelo:
 *                     type: string
 *                     description: Indica el modelo del vehiculo
 *                   año:
 *                     type: interger
 *                     description: Indica el año del vehiculo
 *                   precioPorDia:
 *                     type: decimal
 *                     description: Indica el precio por dia del vehiculo
 *                   tipoVehiculo:
 *                     type: string
 *                     description: Indica el tipo de vehiculo
 *                   estado:
 *                     type: enum
 *                     description: Indica el estado del vehiculo
 *                   placa:
 *                     type: string
 *                     description: Indica la placa del vehiculo
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
ruta.get('/buscarvehiculoid',
    query('vehiculoid').notEmpty().withMessage('El campo vehiculoid no puede estar vacío')
        .isInt().withMessage('El vehiculoid debe ser un número entero'),
        async(req, res ) =>{
            try {
                const errores = validationResult(req);
                if(!errores.isEmpty()){
                    return  res.status(400).json({errores});
                }
                const { vehiculoid } = req.query
                const vehiculo = await modeloVehiculo.findByPk(vehiculoid);

                if(!vehiculo){
                     return res.status(404).json({campo: "vehiculoid", msj: "Este vehiculo no existe"});
                }
                return controladorVehiculo.buscarIdvehiculo(req, res);
            }   catch (error) {
                    return res.status(500).json({msg: "Error en el servidor "});
            }
        }, verificarUsuario,
);

/**
 * @swagger
 * /vehiculo/guardar:
 *   post:
 *     summary: Guarda un nuevo vehículo
 *     tags: 
 *       - Vehiculos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marca:
 *                 type: string
 *                 description: Indica la marca del vehículo
 *               modelo:
 *                 type: string
 *                 description: Indica el modelo del vehículo
 *               año:
 *                 type: integer
 *                 description: Indica el año del vehículo
 *               precioPorDia:
 *                 type: number
 *                 format: float
 *                 description: Indica el precio por día del vehículo
 *               tipoVehiculo:
 *                 type: string
 *                 description: Indica el tipo de vehículo
 *               estado:
 *                 type: string
 *                 description: Indica el estado del vehículo
 *               placa:
 *                 type: string
 *                 description: Indica la placa del vehículo
 *               imagen:
 *                 type: string
 *                 description: Imagen del vehículo
 *     responses:
 *       201:
 *         description: Vehículo guardado con éxito
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
 *                     vehiculoid:
 *                       type: integer
 *                       description: Identificador único del vehículo
 *                     marca:
 *                       type: string
 *                       description: Indica la marca del vehículo
 *                     modelo:
 *                       type: string
 *                       description: Indica el modelo del vehículo
 *                     año:
 *                       type: integer
 *                       description: Indica el año del vehículo
 *                     precioPorDia:
 *                       type: number
 *                       format: float
 *                       description: Indica el precio por día del vehículo
 *                     tipoVehiculo:
 *                       type: string
 *                       description: Indica el tipo de vehículo
 *                     estado:
 *                       type: string
 *                       description: Indica el estado del vehículo
 *                     placa:
 *                       type: string
 *                       description: Indica la placa del vehículo
 *                     imagen:
 *                       type: string
 *                       description: Imagen del vehículo
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
        }), verificarUsuario,
    controladorVehiculo.guardar
);

/**
 * @swagger
 * /vehiculo/editar:
 *   put:
 *     summary: Modifica un vehículo existente
 *     tags:
 *       - Vehiculos
 *     parameters:
 *       - in: query
 *         name: vehiculoid
 *         required: true
 *         description: Identificador único del vehículo a modificar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehiculoid:
 *                 type: integer
 *                 description: Identificador único del vehículo
 *               marca:
 *                 type: string
 *                 description: Indica la marca del vehículo
 *               modelo:
 *                 type: string
 *                 description: Indica el modelo del vehículo
 *               año:
 *                 type: integer
 *                 description: Indica el año del vehículo
 *               precioPorDia:
 *                 type: number
 *                 format: float
 *                 description: Indica el precio por día del vehículo
 *               tipoVehiculo:
 *                 type: string
 *                 description: Indica el tipo de vehículo
 *               estado:
 *                 type: string
 *                 description: Indica el estado del vehículo
 *               placa:
 *                 type: string
 *                 description: Indica la placa del vehículo
 *               imagen:
 *                 type: string
 *                 description: Imagen del vehículo
 *     responses:
 *       200:
 *         description: Vehículo modificado con éxito
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
 *                     vehiculoid:
 *                       type: integer
 *                       description: Identificador único del vehículo
 *                     marca:
 *                       type: string
 *                       description: Indica la marca del vehículo
 *                     modelo:
 *                       type: string
 *                       description: Indica el modelo del vehículo
 *                     año:
 *                       type: integer
 *                       description: Indica el año del vehículo
 *                     precioPorDia:
 *                       type: number
 *                       format: float
 *                       description: Indica el precio por día del vehículo
 *                     tipoVehiculo:
 *                       type: string
 *                       description: Indica el tipo de vehículo
 *                     estado:
 *                       type: string
 *                       description: Indica el estado del vehículo
 *                     placa:
 *                       type: string
 *                       description: Indica la placa del vehículo
 *                     imagen:
 *                       type: string
 *                       description: Imagen del vehículo
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
            const buscarVehiculo = await modeloVehiculo.findOne({ where: { vehiculoid: value } });
            if (!buscarVehiculo) {
                throw new Error('El ID del vehículo no existe');
            }
        }),
    body("marca").optional().isLength({ min: 3, max: 50 }).withMessage("La marca debe tener entre 3 y 50 caracteres"),
    body("modelo").optional().isLength({ min: 1, max: 50 }).withMessage("El modelo debe tener entre 1 y 50 caracteres"),
    body("año").optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage("El año debe ser un valor válido"),
    body("placa").optional().isLength({ min: 1, max: 20 }).withMessage("La placa debe tener entre 1 y 20 caracteres"), verificarUsuario,
    controladorVehiculo.modificar
);

/**
 * @swagger
 * /vehiculo/eliminar:
 *   delete:
 *     summary: Elimina un vehículo existente
 *     tags:
 *       - Vehiculos
 *     parameters:
 *       - in: query
 *         name: vehiculoid
 *         required: true
 *         description: Identificador único del vehículo a eliminar
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
 *                     vehiculoid:
 *                       type: integer
 *                       description: Identificador único del vehículo eliminado
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
            const buscarVehiculo = await modeloVehiculo.findOne({ where: { vehiculoid: value } });
            if (!buscarVehiculo) {
                throw new Error('El ID del vehículo no existe');
            }
        }), verificarUsuario,
    controladorVehiculo.eliminar
);

module.exports = ruta;

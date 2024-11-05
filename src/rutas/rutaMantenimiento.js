
const { Router } = require('express')
const controladorMantenimiento = require ('../controladores/controladorMantenimiento')
const modeloMantenimiento = require("../modelos/mantenimiento")
const { body, query } = require('express-validator')
const rutas = Router();
const modeloVehiculo = require('../modelos/vehiculo')
const { validationResult } = require('express-validator');
const { verificarUsuario } = require('../configuraciones/passport');


/**
 * @swagger
 * tags: 
 *     name: Mantenimiento
 *     description: Operaciones relacionadas con los mantenimientos
 * 
 */
/**
 * @swagger
 * /mantenimiento/listar:
 *   get:
 *     summary: Obtiene la lista de los mantenimientos
 *     tags: 
 *       [Mantenimiento]
 *     responses:
 *       200:
 *         description: Lista de los mantenimientos obtenidos con éxito
 *         content: 
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   IdMantenimiento:
 *                     type: integer
 *                     description: Identificador único del mantenimiento
 *                   descripcion:
 *                     type: varchar(250)
 *                     description: Descripcion del mantenimiento
 *                   costo:
 *                     type: double
 *                     description: Costo del mantenimiento
 *                   fecha_mantenimiento:
 *                     type: date
 *                     description: Indica la fecha del mantenimiento
 *                   vehiculoid:
 *                     type: integer
 *                     description: Indicador unico del vehiculo
 *       400:
 *         description: Error en la consulta 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: "Error en la consulta "
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


rutas.get('/listar',verificarUsuario, controladorMantenimiento.listar)

/**
* @swagger
* /mantenimiento/buscaridmantenimiento:
*   get:
*     summary: Busca un mantenimiento por su ID
*     tags: 
*       [Mantenimiento]
*     parameters:
*       - in: query
*         name: vehiculoid
*         schema:
*           type: integer
*         required: true
*         description: Identificador único del vehiculo a buscar
*     responses:
*       200:
*         content: 
*           application/json:
*             schema:
*               type: object
*               properties:
*                 vehiculoid:
*                   type: integer
*                   description: Identificador único del vehiculo
*                 marca:
*                   type: string
*                   description: Descripcion de la marca del vehiculo
*                 modelo:
*                   type: string
*                   description: Descripcion del modelo del vehiculo
*                 año:
*                   type: integer
*                   description: Año del vehiculo
*                 precioPorDia:
*                   type: number
*                   format: decimal
*                   description: Indica el precio por dia
*                 tipoVehiculo:
*                   type: string
*                   description: Tipo de vehiculo
*                 estado:
*                   type: boolean
*                   description: Indica el estado del carro
*                 placa:
*                   type: string
*                   description: Placa del vehiculo
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


rutas.get('/buscaridmantenimiento',
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
                return controladorMantenimiento.buscarIdvehiculo(req, res);
            }   catch (error) {
                    return res.status(500).json({msg: "Error en el servidor "});
            }
        },
);

/**
 * @swagger
 * /mantenimiento/guardar:
 *   post:
 *     summary: Guarda un nuevo mantenimiento
 *     tags: 
 *       [Mantenimiento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdMantenimiento:
 *                 type: integer
 *                 description: Identificador único del mantenimiento
 *               descripcion:
 *                 type: string
 *                 description: Descripción del mantenimiento
 *               costo:
 *                 type: double
 *                 description: Costo del mantenimiento
 *               fecha_mantenimiento:
 *                 type: date
 *                 description: Indica la fecha del mantenimiento
 *               vehiculoid:
 *                 type: integer
 *                 description: Indicador único del vehículo
 *     responses:
 *       201:
 *         description: Mantenimiento guardado con éxito
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
 *                     IdMantenimiento:
 *                       type: integer
 *                       description: Identificador único del mantenimiento
 *                     descripcion:
 *                       type: string
 *                       description: Descripción del mantenimiento
 *                     costo:
 *                       type: double
 *                       description: Costo del mantenimiento
 *                     fecha_mantenimiento:
 *                       type: date
 *                       description: Indica la fecha del mantenimiento
 *                     vehiculoid:
 *                       type: integer
 *                       description: Indicador único del vehículo
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


rutas.post('/guardar', 
    body("IdMantenimiento").isInt().withMessage("El id del mantenimiento debe ser un numero entero")
    .custom(async value =>{
        if(!value){
            throw new Error('El IdMantenimiento no permite nulos')
        }
        else{
            const mantenimiento = await modeloMantenimiento.findOne({
                where: {IdMantenimiento: value}
            });
            if(mantenimiento){
                throw new Error('El Id del mantenimiento ya existe');
            }
        }
    }),
    body("descripcion").isLength({ min: 10, max:120 }).withMessage("El limite de caracteres es de 120"),
    body("costo").isFloat({ min: 0 }).withMessage("El costo debe ser un número positivo")
    .isLength({max:12}).withMessage("El limite de caracteres es de 12")
    .custom(async value =>{
        if(!value){
            throw new Error('El costo no permite nulos')
        }
    }), 
    body("fecha_mantenimiento").isDate({ format: 'YYYY-MM-DD' }).withMessage("La fecha debe estar en formato YYYY-MM-DD"),
    body("vehiculoId").isInt().withMessage("El id del vehiculo debe ser un numero entero"), verificarUsuario,
    controladorMantenimiento.guardar)

/**
 * @swagger
 * /mantenimiento/editar:
 *   put:
 *     summary: Modifica un mantenimiento existente
 *     tags:
 *       [Mantenimiento]
 *     parameters:
 *       - in: query
 *         name: IdMantenimiento
 *         required: true
 *         description: Identificador único del mantenimiento a modificar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdMantenimiento:
 *                 type: integer
 *                 description: Identificador único del mantenimiento 
 *               descripcion:
 *                 type: varchar(250)
 *                 description: Descripcion del mantenimiento (opcional)
 *               costo:
 *                 type: double
 *                 description: Costo del mantenimiento (opcional)
 *               fecha_mantenimiento:
 *                 type: date
 *                 description: Indica la fecha del mantenimiento (opcional)
 *               vehiculoid:
 *                 type: integer
 *                 description: Indicador unico del vehiculo (opcional)
 *     responses:
 *       201:
 *         description: Mantenimiento modificado con éxito
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
 *                     IdMantenimiento:
 *                       type: integer
 *                       description: Identificador único del mantenimiento
 *                     descripcion:
 *                       type: varchar(250)
 *                       description: Descripcion del mantenimiento
 *                     costo:
 *                       type: double
 *                       description: Costo del mantenimiento
 *                     fecha_mantenimiento:
 *                       type: date
 *                       description: Indica la fecha del mantenimiento
 *                     vehiculoid:
 *                       type: integer
 *                       description: Indicador unico del vehiculo
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



rutas.put('/editar', 
    query("IdMantenimiento").isInt().withMessage("El id del mantenimiento debe ser un numero entero")
    .custom(async value =>{
        if(!value){
            throw new Error('El IdMantenimiento no permite nulos')
        }
        else{
            const mantenimiento = await modeloMantenimiento.findOne({
                where: {IdMantenimiento: value}
            });
            if(!mantenimiento){
                throw new Error('El id del mantenimiento no existe');
            }
        }
    }),
    body("descripcion").optional().isLength({ min: 10, max:120 }).withMessage("El limite de caracteres es de 120"),
    body("costo").optional().isFloat({ min: 0 }).withMessage("El costo debe ser un número positivo")
    .isLength({max:12}).withMessage("El limite de caracteres es de 12")
    .custom(async value =>{
        if(!value){
            throw new Error('El costo no permite nulos')
        }
    }), 
    body("fecha_mantenimienti").optional(),
    body("vehiculoid").optional().isInt().withMessage("El id del vehiculo debe ser un numero entero"), verificarUsuario,
        controladorMantenimiento.modificar)




/**
 * @swagger
 * /mantenimiento/eliminar:
 *   delete:
 *     summary: Elimina un mantenimiento existente
 *     tags:
 *       [Mantenimiento]
 *     parameters:
 *       - in: query
 *         name:  IdMantenimiento
 *         required: true
 *         description: Identificador único del mantenimiento a eliminar
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
 *                     idMantenimiento:
 *                       type: integer
 *                       description: Identificador único del mantenimiento eliminado
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


        rutas.delete('/eliminar', 
            query("IdMantenimiento").isInt().withMessage("El id del mantenimiento debe ser un numero entero")
            .custom(async value =>{
                if(!value){
                    throw new Error('El IdMantenimiento no permite nulos')
                }
                else{
                    const mantenimiento = await modeloMantenimiento.findOne({
                        where: {IdMantenimiento: value}
                    });
                    if(!mantenimiento){
                        throw new Error('El id del mantenimiento no existe');
                    }
                }
            }),verificarUsuario,
            controladorMantenimiento.eliminar);

        module.exports = rutas;

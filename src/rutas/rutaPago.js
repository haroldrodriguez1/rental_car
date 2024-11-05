
const { Router } = require('express')
const controladorPago = require ('../controladores/controladorPago')
const modeloPago = require("../modelos/pago")
const { validationResult } = require('express-validator');
const { body, query } = require('express-validator');
const { verificarUsuario } = require('../configuraciones/passport');
const rutas = Router();


/**
 * @swagger
 * tags: 
 *     name: Pagos
 *     description: Operaciones relacionadas con los pagos
 * 
 */
/**
 * @swagger
 * /pago/listar:
 *   get:
 *     summary: Obtiene la lista de los pagos
 *     tags: 
 *         [Pagos]
 *     responses:
 *       200:
 *         description: Lista de los pagos obtenidos con éxito
 *         content: 
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   IdPago:
 *                     type: integer
 *                     description: Identificador único del pago
 *                   monto:
 *                     type: double
 *                     description: Monto del pago
 *                   metodo_pago:
 *                     type: boolean
 *                     description: Indica el metodo del pago
 *                   fecha_pago:
 *                     type: date
 *                     description: Indica la fecha del pago
 *                   rentaId:
 *                     type: integer
 *                     description: Indicador unico de la renta
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


rutas.get('/listar',verificarUsuario, controladorPago.listar)

/**
 * @swagger
 * /pago/buscaridpago:
 *   get:
 *     summary: Busca un pago por su ID
 *     tags: 
 *        [Pagos]
 *     parameters:
 *         in: query
 *         name: IdPago
 *         schema:
 *           type: integer
 *         required: true
 *         description: Identificador único del pago a buscar
 *     responses:
 *       200:
 *         description: Pago encontrado con éxito
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 IdPago:
 *                   type: integer
 *                   description: Identificador único del pago
 *                 monto:
 *                   type: double
 *                   description: Indica el monto del pago
 *                 metodo_pago:
 *                   type: boolean
 *                   description: Indica el método de pago utilizado
 *                 fecha_pago:
 *                   type: date
 *                   description: Fecha en la que se realizó el pago
 *                 rentaId:
 *                   type: integer
 *                   description: Indicador unico de la renta
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

rutas.get('/buscaridpago',
    query('IdPago').notEmpty().withMessage('El campo IdPago no puede estar vacío')
        .isInt().withMessage('El IdPago debe ser un número entero'),
        async(req, res ) =>{
            try {
                const errores = validationResult(req);
                if(!errores.isEmpty()){
                    return  res.status(400).json({errores});
                }
                const { IdPago } = req.query
                const pago = await modeloPago.findByPk(IdPago);

                if(!pago){
                     return res.status(404).json({campo: "IdPago", msj: "Este pago no existe"});
                }
                return controladorPago.buscarIdPago(req, res);
            }   catch (error) {
                    return res.status(500).json({msg: "Error en el servidor "});
            }
        },verificarUsuario,
        controladorPago.buscarIdPago
);

/**
 * @swagger
 * /pago/guardar:
 *   post:
 *     summary: Guarda un nuevo pago
 *     tags: 
 *        [Pagos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdPago:
 *                 type: integer
 *                 description: Identificador único del pago
 *               monto:
 *                 type: double
 *                 description: Indica el monto del pago
 *               metodo_pago:
 *                 type: boolean
 *                 description: Indica el método de pago utilizado
 *               fecha_pago:
 *                 type: date
 *                 description: Fecha en la que se realizó el pago
 *               rentaId:
 *                 type: integer
 *                 description: Indicador único de la renta
 *     responses:
 *       201:
 *         description: Pago guardado con éxito
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
 *                     IdPago:
 *                       type: integer
 *                       description: Identificador único del pago
 *                     monto:
 *                       type: double
 *                       description: Indica el monto del pago
 *                     metodo_pago:
 *                       type: boolean
 *                       description: Indica el método de pago utilizado
 *                     fecha_pago:
 *                       type: date
 *                       description: Fecha en la que se realizó el pago
 *                     rentaId:
 *                       type: integer
 *                       description: Indicador único de la renta
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
    body("IdPago").isInt().withMessage("El id del pago debe ser un numero entero")
    .custom(async value =>{
        if(!value){
            throw new Error('El IdPago no permite nulos')
        }
        else{
            const pago = await modeloPago.findOne({
                where: {IdPago: value}
            });
            if(pago){
                throw new Error('El IdPago del pago ya existe');
            }
        }
    }),
    body("monto").isFloat({ min: 0 }).withMessage("El monto debe ser un número positivo")
    .isLength({max:12}).withMessage("El limite de caracteres es de 12")
    .custom(async value =>{
        if(!value){
            throw new Error('El monto no permite nulos')
        }
    }), 
    body("metodo_pago").isIn(['Tarjeta', 'Efectivo', 'Transferencia', 'Cheque']).withMessage("Solo permite valores como 'Tarjeta', 'Efectivo', 'Transferencia', 'Cheque'"),
    body("fecha_pago").isDate({ format: 'YYYY-MM-DD' }).withMessage("La fecha debe estar en formato YYYY-MM-DD"),
    body("rentaId").isInt().withMessage("El id de la renta debe ser un numero entero"),verificarUsuario,
    controladorPago.guardar)

/**
 * @swagger
 * /pago/editar:
 *   put:
 *     summary: Modifica un pago existente
 *     tags:
 *       [Pagos]
 *     parameters:
 *       - in: query
 *         name:  IdPago
 *         required: true
 *         description: Identificador único del pago a modificar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               IdPago:
 *                 type: integer
 *                 description: Identificador único del pago
 *               monto:
 *                 type: double
 *                 description: Indica el monto del pago (opcional)
 *               metodo_pago:
 *                 type: boolean
 *                 description: Indica el método de pago utilizado (opcional)
 *               fecha_pago:
 *                 type: date
 *                 description: Fecha en la que se realizó el pago (opcional)
 *               rentaId:
 *                 type: integer
 *                 description: Indicador único de la renta (opcional)
 *     responses:
 *       201:
 *         description: Pago modificado con éxito
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
 *                     IdPago:
 *                       type: integer
 *                       description: Identificador único del pago
 *                     monto:
 *                       type: double
 *                       description: Indica el monto del pago
 *                     metodo_pago:
 *                       type: boolean
 *                       description: Indica el método de pago utilizado
 *                     fecha_pago:
 *                       type: date
 *                       description: Fecha en la que se realizó el pago
 *                     rentaId:
 *                       type: integer
 *                       description: Indicador único de la renta
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
    query("IdPago").isInt().withMessage("El id del pago debe ser un numero entero")
    .custom(async value =>{
        if(!value){
            throw new Error('El IdPago no permite nulos')
        }
        else{
            const pago = await modeloPago.findOne({
                where: {IdPago: value}
            });
            if(!pago){
                throw new Error('El IdPago del pago no existe');
            }
        }
    }),
    body("monto").optional().isFloat({ min: 0 }).withMessage("El monto debe ser un número positivo")
    .isLength({max:12}).withMessage("El limite de caracteres es de 12")
    .custom(async value =>{
        if(!value){
            throw new Error('El monto no permite nulos')
        }
    }), 
    body("metodo_pago").optional().isIn(['Tarjeta', 'Efectivo', 'Transferencia', 'Cheque']).withMessage("Solo permite valores como 'Tarjeta', 'Efectivo', 'Transferencia', 'Cheque'"),
    body("fecha_pago").optional(),
    body("rentaId").optional().isInt().withMessage("El id de la renta debe ser un numero entero"),verificarUsuario,
        controladorPago.modificar)



/**
 * @swagger
 * /pago/eliminar:
 *   delete:
 *     summary: Elimina un pago existente
 *     tags:
 *       [Pagos]
 *     parameters:
 *       - in: query
 *         name: IdPago
 *         required: true
 *         description: Identificador único del pago a eliminar
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
 *                     idPago:
 *                       type: integer
 *                       description: Identificador único del pago eliminado
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
            query("IdPago").isInt().withMessage("El id del pago debe ser un numero entero")
            .custom(async value =>{
                if(!value){
                    throw new Error('El IdPago no permite nulos')
                }
                else{
                    const pago = await modeloPago.findOne({
                        where: {IdPago: value}
                    });
                    if(!pago){
                        throw new Error('El id del pago no existe');
                    }
                }
            }),verificarUsuario,
            controladorPago.eliminar);

        module.exports = rutas;

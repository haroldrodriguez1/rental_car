const { Router } = require('express');
const { body, query } = require('express-validator');
const modeloEmpleado = require('../modelos/empleado');
const controladorEmpleado = require('../controladores/controladorEmpleado');
const ruta = Router();

/**
 * @swagger
 * tags: 
 *     name: Empleado
 *     description: Operaciones relacionadas con los empleados
 * 
 */

ruta.get('/', controladorEmpleado.inicio);

/**
 * @swagger
 * /empleado/listar:
 *   get:
 *     summary: Obtiene la lista de los empleados
 *     tags:
 *       - Empleados
 *     responses:
 *       200:
 *         description: Lista de los empleados obtenidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_empleado:
 *                     type: integer
 *                     description: Identificador único del empleado
 *                   nombre_empleado:
 *                     type: string
 *                     description: Indica el nombre del empleado
 *                   telefono:
 *                     type: string
 *                     description: Indica el teléfono del empleado
 *                   correo:
 *                     type: string
 *                     description: Indica el correo del empleado
 *                   cargo:
 *                     type: string
 *                     description: Indicador del cargo del empleado
 *       400:
 *         description: Error en la consulta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error en la consulta
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error en el servidor
 */

ruta.get('/listar',controladorEmpleado.listar);


/**
 * @swagger
 * /empleado/buscaridempleado:
 *   get:
 *     summary: Busca un empleado por su ID
 *     tags: 
 *        [Empleado]
 *     parameters:
 *         in: query
 *         name: IdEmpleado
 *         schema:
 *           type: integer
 *         required: true
 *         description: Identificador único del empleado a buscar
 *     responses:
 *       200:
 *         description: Empleado encontrado con éxito
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   id_empleado:
 *                     type: integer
 *                     description: Identificador único del empleado
 *                   nombre_empleado:
 *                     type: string
 *                     description: Indica el nombre del empleado
 *                   telefono:
 *                     type: string
 *                     description: Indica el teléfono del empleado
 *                   correo:
 *                     type: string
 *                     description: Indica el correo del empleado
 *                   cargo:
 *                     type: string
 *                     description: Indicador del cargo del empleado
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


ruta.get('/buscaridempleado',
    query('id_empleado').notEmpty().withMessage('El campo IdEmpleado no puede estar vacío')
        .isInt().withMessage('El IdEmpleado debe ser un número entero'),
        async(req, res ) =>{
            try {
               /* const errores = validationResult(req);
                if(!errores.isEmpty()){
                    return  res.status(400).json({errores});
                }
                 const { id_empleado } = req.query
                const empleado = await modeloEmpleado.findByPk(id_empleado);

                if(!empleado){
                     return res.status(404).json({campo: "IdEmpleado", msj: "Este empleado no existe"});
                } */
                return controladorEmpleado.buscarIdEmpleado(req, res);
            }   catch (error) {
                    return res.status(500).json({msg: "Error en el servidor Ruta"});
            }
        },
        controladorEmpleado.buscarIdEmpleado
);
/**
 * @swagger
 * /empleado/guardar:
 *   post:
 *     summary: Guarda un nuevo empleado
 *     tags:
 *       - Empleados
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_empleado:
 *                 type: integer
 *                 description: Identificador único del empleado
 *               nombre_empleado:
 *                 type: string
 *                 description: Indica el nombre del empleado
 *               telefono:
 *                 type: string
 *                 description: Indica el teléfono del empleado
 *               correo:
 *                 type: string
 *                 description: Indica el correo del empleado
 *               cargo:
 *                 type: string
 *                 description: Indicador del cargo del empleado
 *     responses:
 *       201:
 *         description: Empleado guardado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_empleado:
 *                   type: integer
 *                   description: Identificador único del empleado
 *                 nombre_empleado:
 *                   type: string
 *                   description: Indica el nombre del empleado
 *                 telefono:
 *                   type: string
 *                   description: Indica el teléfono del empleado
 *                 correo:
 *                   type: string
 *                   description: Indica el correo del empleado
 *                 cargo:
 *                   type: string
 *                   description: Indicador del cargo del empleado
 *       400:
 *         description: Error en la consulta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error en la consulta
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error en el servidor
 */


 
ruta.post('/guardar', 
    body("nombre_empleado").isLength({min: 3, max:50}).withMessage("El limite de caracteres es de 3 - 50")
    .custom(async value =>{
        if(!value){
            throw new Error('El nombre no permite nulos')
        }
        else{
            const buscarEmpleado = await modeloEmpleado.findOne({
                where: {nombre_empleado: value}
            });
            console.log(buscarEmpleado);
            if(buscarEmpleado){
                throw new Error('El nombre del empleado ya existe');
            }
        }
    }),
    controladorEmpleado.guardar); 


/**
 * @swagger
 * /empleado/editar:
 *   put:
 *     summary: Modifica un empleado existente
 *     tags:
 *       - Empleados
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: Identificador único del empleado a modificar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_empleado:
 *                 type: integer
 *                 description: Identificador único del empleado
 *               nombre_empleado:
 *                 type: string
 *                 description: Indica el nombre del empleado
 *               telefono:
 *                 type: string
 *                 description: Indica el teléfono del empleado
 *               correo:
 *                 type: string
 *                 description: Indica el correo del empleado
 *               cargo:
 *                 type: string
 *                 description: Indicador del cargo del empleado
 *     responses:
 *       201:
 *         description: Empleado modificado con éxito
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
 *                     id_empleado:
 *                       type: integer
 *                       description: Identificador único del empleado
 *                     nombre_empleado:
 *                       type: string
 *                       description: Indica el nombre del empleado
 *                     telefono:
 *                       type: string
 *                       description: Indica el teléfono del empleado
 *                     correo:
 *                       type: string
 *                       description: Indica el correo del empleado
 *                     cargo:
 *                       type: string
 *                       description: Indicador del cargo del empleado
 *       400:
 *         description: Error en la consulta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error en la consulta
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error en el servidor
 */




ruta.put('/editar', 
        query("id_empleado").isInt().withMessage('Solo se permiten valores enteros en el id')
        .custom(async value =>{
            if(!value){
                throw new Error('El id no permite nulos')
            }
            else{
                const buscarEmpleado = await modeloEmpleado.findOne({
                    where: {id_empleado: value}
                });
                if(!buscarEmpleado){
                    throw new Error('El id del empleado no existe');
                }
            }
        }),
        body("nombre_empleado").optional().isLength({min: 3, max:50}).withMessage("El limite de caracteres es de 3 - 50")
        .custom(async value =>{
            if(!value){
                throw new Error('El nombre no permite nulos')
            }
            else{
                const buscarEmpleado = await modeloEmpleado.findOne({
                    where: {nombre: value}
                });
                console.log(buscarEmpleado);
                if(buscarEmpleado){
                    throw new Error('El nombre del empleado ya existe');
                } */
            }
        }),
        body("estado").optional().isBoolean().withMessage("Solo permite valores boleanos"),
        controladorEmpleado.modificar);
    


/**
 * @swagger
 * /empleado/eliminar:
 *   delete:
 *     summary: Elimina un empleado existente
 *     tags:
 *       - Empleados
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: Identificador único del empleado a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Empleado eliminado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Empleado eliminado
 *                 data:
 *                   type: object
 *                   properties:
 *                     idEmpleado:
 *                       type: integer
 *                       description: Identificador único del empleado eliminado
 *       400:
 *         description: Error en la consulta
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error en la consulta
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error en el servidor
 */
ruta.delete('/eliminar', 
    query("id_empleado").isInt().withMessage('Solo de permiten valores enteros en el id')
    .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscarEmpleado = await modeloEmpleado.findOne({
                where: {id_empleado: value}
            });
            if(!buscarEmpleado){
                throw new Error('El id del empleado no existe');
            }
        }
    }),
    controladorEmpleado.eliminar);
    
module.exports = ruta;
const { Router } = require('express');
const { body, query } = require('express-validator');
const modeloUsuario = require('../modelos/usuario');
const controladorUsuario = require('../controladores/controladorUsuario');
const ruta = Router();


/**
 * @swagger
 * tags: 
 *     name: Usuario
 *     description: Operaciones relacionadas con los usuarios
 * 
 */

/**
 * @swagger
 * /usuario/listar:
 *   get:
 *     summary: Obtiene la lista de los usuario
 *     tags: 
 *         [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de los usuarios obtenidos 
 *         content: 
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_usuario: 
                     type: integer
 *                     description: Identificador único del usuario
 *                    tipo_usuario: 
                      type:enum
 *                     description: tipo de usuario
 *                    email: 
                     type: string
 *                     description: Indica el email del usuario
 *                   contraseña: 
                     type: string
 *                     description: Indica la contraseña del usuario
 *                   rol: 
                      type: enum
 *                     description: Indicador del rol del usuario
                       fecha_creación: 
                      type: date
                       description: Indicador de la fecha de creacion del usuario
*        400:
 *         description: Error en la consulta 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: "Error en la consulta"
 *        500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: "Error en el servidor"
 * 
 */

ruta.get('/', controladorUsuario.inicio);


ruta.get('/listar',controladorUsuario.listar);

/**
 * @swagger
 * /usuario/guardar:
 *   post:
 *     summary: Guarda un nuevo usuario
 *     tags: 
 *        [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario: 
                     type: integer
 *                     description: Identificador único del usuario
 *                    tipo_usuario: 
                      type:enum
 *                     description: tipo de usuario
 *                    email: 
                     type: string
 *                     description: Indica el email del usuario
 *                   contraseña: 
                     type: string
 *                     description: Indica la contraseña del usuario
 *                   rol: 
                      type: enum
 *                     description: Indicador del rol del usuario
                       fecha_creación: 
                      type: date
                       description: Indicador de la fecha de creacion del usuario
 *     responses:
 *       201:
 *         description: Usuario guardado con éxito
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                    id_usuario: 
                     type: integer
 *                     description: Identificador único del usuario
 *                    tipo_usuario: 
                      type:enum
 *                     description: tipo de usuario
 *                    email: 
                     type: string
 *                     description: Indica el email del usuario
 *                   contraseña: 
                     type: string
 *                     description: Indica la contraseña del usuario
 *                   rol: 
                      type: enum
 *                     description: Indicador del rol del usuario
                       fecha_creación: 
                      type: date
                       description: Indicador de la fecha de creacion del usuario
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
    body("nombre").isLength({min: 3, max:50}).withMessage("El limite de caracteres es de 3 - 50")
    .custom(async value =>{
        if(!value){
            throw new Error('El nombre no permite nulos')
        }
        else{
            const buscarUsuario = await modeloUsuario.findOne({
                where: {nombre: value}
            });
            console.log(buscarUsuario);
            if(buscarUsuario){
                throw new Error('El nombre del usuario ya existe');
            }
        }
    }),
    controladorUsuario.guardar);


/**
 * @swagger
 * /usuario/editar:
 *   put:
 *     summary: Modifica un usuario existente
 *     tags:
 *       [Usuarios]
 *     parameters:
 *       - in: query
 *         name:  IdUsuario
 *         required: true
 *         description: Identificador único del usuario a modificar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                  id_usuario: 
                     type: integer
 *                     description: Identificador único del usuario
 *                    tipo_usuario: 
                      type:enum
 *                     description: tipo de usuario
 *                    email: 
                     type: string
 *                     description: Indica el email del usuario
 *                   contraseña: 
                     type: string
 *                     description: Indica la contraseña del usuario
 *                   rol: 
                      type: enum
 *                     description: Indicador del rol del usuario
                       fecha_creación: 
                      type: date
                       description: Indicador de la fecha de creacion del usuario
 *     responses:
 *       201:
 *         description: Usuario modificado con éxito
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
 *                        id_usuario: 
                     type: integer
 *                     description: Identificador único del usuario
 *                    tipo_usuario: 
                      type:enum
 *                     description: tipo de usuario
 *                    email: 
                     type: string
 *                     description: Indica el email del usuario
 *                   contraseña: 
                     type: string
 *                     description: Indica la contraseña del usuario
 *                   rol: 
                      type: enum
 *                     description: Indicador del rol del usuario
                       fecha_creación: 
                      type: date
                       description: Indicador de la fecha de creacion del usuario
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
        query("id").isInt().withMessage('Solo se permiten valores enteros en el id')
        .custom(async value =>{
            if(!value){
                throw new Error('El id no permite nulos')
            }
            else{
                const buscarUsuario = await modeloUsuario.findOne({
                    where: {id: value}
                });
                if(!buscarUsuario){
                    throw new Error('El id del usuario no existe');
                }
            }
        }),
        body("nombre").optional().isLength({min: 3, max:50}).withMessage("El limite de caracteres es de 3 - 50")
        .custom(async value =>{
            if(!value){
                throw new Error('El nombre no permite nulos')
            }
            else{
                const buscarUsuario = await modeloUsuario.findOne({
                    where: {nombre: value}
                });
                console.log(buscarUsuario);
                if(buscarUsuario){
                    throw new Error('El nombre del usuario ya existe');
                }
            }
        }),
        body("estado").optional().isBoolean().withMessage("Solo permite valores boleanos"),
        controladorUsuario.modificar);


 /**
 * @swagger
 * /usuario/eliminar:
 *   delete:
 *     summary: Elimina un usuario existente
 *     tags:
 *       [Usuarios]
 *     parameters:
 *       - in: query
 *         name:  IdUsuario
 *         required: true
 *         description: Identificador único del usuario a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: "Usuario eliminado"
 *                 data:
 *                   type: object
 *                   properties:
 *                     idUsuario:
 *                       type: integer
 *                       description: Identificador único del usuario eliminado
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
    query("id").isInt().withMessage('Solo de permiten valores enteros en el id')
    .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscarUsuario = await modeloUsuario.findOne({
                where: {id: value}
            });
            if(!buscarUsuario){
                throw new Error('El id del usuario no existe');
            }
        }
    }),
    controladorUsuario.eliminar);
    
module.exports = ruta;
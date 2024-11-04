const { Router } = require('express');
const { body, query } = require('express-validator');
const modeloCliente = require('../modelos/cliente');
const controladorCliente = require('../controladores/controladorCliente');
const ruta = Router();
const { verificarUsuario } = require('../configuraciones/passport');
/**
 * @swagger
 * tags:
 *   name: Cliente
 *   description: Operaciones relacionadas con los clientes
 */

/**
 * @swagger
 * /cliente:
 *   get:
 *     summary: Información general de las rutas de clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Información general de las rutas
 */

ruta.get('/', controladorCliente.inicio);

/**
 * @swagger
 * /cliente/listar:
 *   get:
 *     summary: Obtiene la lista de los clientes
 *     tags: [Cliente]
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Identificador único del cliente
 *                   nombre:
 *                     type: string
 *                     description: Nombre del cliente
 *                   activo:
 *                     type: boolean
 *                     description: Indica el estado del cliente
 */

ruta.get('/listar',verificarUsuario,  controladorCliente.listar);

/**
 * @swagger
 * /cliente/guardar:
 *   post:
 *     summary: Crear un cliente
 *     tags: [Cliente]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del cliente
 *                 example: "Cliente Ejemplo"
 *               activo:
 *                 type: boolean
 *                 description: Estado del cliente
 *                 example: true
 *     responses:
 *       201:
 *         description: Cliente creado con éxito
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
 *                     id:
 *                       type: integer
 *                       description: Identificador del cliente
 *                     nombre:
 *                       type: string
 *                       description: Nombre del cliente
 *                     activo:
 *                       type: boolean
 *                       description: Estado del cliente
 */

ruta.post('/guardar', 
    body("primernombre").isLength({ min: 3, max: 50 }).withMessage("El límite de caracteres es de 3 - 50"),
    controladorCliente.guardar
);

/**
 * @swagger
 * /cliente/editar:
 *   put:
 *     summary: Modifica un cliente existente
 *     tags: [Cliente]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID del cliente a modificar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del cliente
 *                 example: "Cliente Modificado"
 *               activo:
 *                 type: boolean
 *                 description: Estado del cliente
 *                 example: true
 *     responses:
 *       200:
 *         description: Cliente actualizado con éxito
 *       400:
 *         description: Error en la validación
 */

ruta.put('/editar', 
    query("id").isInt().withMessage('Solo se permiten valores enteros en el id')
    .custom(async value => {
        if (!value) {
            throw new Error('El id no permite nulos');
        } else {
            const buscarCliente = await modeloCliente.findOne({
                where: { id: value }
            });
            if (!buscarCliente) {
                throw new Error('El id del cliente no existe');
            }
        }
    }),
    body("nombre").optional().isLength({ min: 3, max: 50 }).withMessage("El límite de caracteres es de 3 - 50")
    .custom(async value => {
        if (!value) {
            throw new Error('El nombre no permite nulos');
        } else {
            const buscarCliente = await modeloCliente.findOne({
                where: { nombre: value }
            });
            if (buscarCliente) {
                throw new Error('El nombre del cliente ya existe');
            }
        }
    }),
    body("activo").optional().isBoolean().withMessage("Solo permite valores booleanos"),verificarUsuario,
    controladorCliente.modificar
);

/**
 * @swagger
 * /cliente/eliminar:
 *   delete:
 *     summary: Elimina un cliente existente
 *     tags: [Cliente]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID del cliente a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente eliminado con éxito
 *       400:
 *         description: Error en la eliminación
 */

ruta.delete('/eliminar', 
    query("id").isInt().withMessage('Solo se permiten valores enteros en el id')
    .custom(async value => {
        if (!value) {
            throw new Error('El id no permite nulos');
        } else {
            const buscarCliente = await modeloCliente.findOne({
                where: { id: value }
            });
            if (!buscarCliente) {
                throw new Error('El id del cliente no existe');
            }
        }
    }),
    verificarUsuario,
    controladorCliente.eliminar
);

module.exports = ruta;
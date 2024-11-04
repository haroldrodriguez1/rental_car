const { Router } = require('express');
const { body, query } = require('express-validator');
const modeloClienteTelefono = require('../modelos/clienteTelefono');
const controladorclienteTelefono = require('../controladores/controladorClienteTelefono');
const ruta = Router();
const { validarAutenticacion } = require('../configuraciones/passport');

/**
 * @swagger
 * tags:
 *   name: ClienteTelefono
 *   description: Operaciones relacionadas con los teléfonos de clientes
 */

/**
 * @swagger
 * /clienteTelefono:
 *   get:
 *     summary: Información general de las rutas de teléfonos de clientes
 *     tags: [ClienteTelefono]
 *     responses:
 *       200:
 *         description: Información general de las rutas
 */

ruta.get('/',controladorclienteTelefono.inicio);

/**
 * @swagger
 * /clienteTelefono/listar:
 *   get:
 *     summary: Obtiene la lista de los teléfonos de clientes
 *     tags: [ClienteTelefono]
 *     responses:
 *       200:
 *         description: Lista de teléfonos de clientes obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Identificador único del teléfono de cliente
 *                   numero:
 *                     type: string
 *                     description: Número de teléfono
 *                   activo:
 *                     type: boolean
 *                     description: Indica el estado del teléfono de cliente
 */

ruta.get('/listar', controladorclienteTelefono.listar);

/**
 * @swagger
 * /clienteTelefono/guardar:
 *   post:
 *     summary: Crear un teléfono de cliente
 *     tags: [ClienteTelefono]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero:
 *                 type: string
 *                 description: Número de teléfono del cliente
 *                 example: "555-1234"
 *               activo:
 *                 type: boolean
 *                 description: Estado del teléfono
 *                 example: true
 *     responses:
 *       201:
 *         description: Teléfono de cliente creado con éxito
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
 *                       description: Identificador del teléfono de cliente
 *                     numero:
 *                       type: string
 *                       description: Número de teléfono
 *                     activo:
 *                       type: boolean
 *                       description: Estado del teléfono
 */

ruta.post('/guardar', 
    body("numero").isLength({ min: 3, max: 15 }).withMessage("El límite de caracteres es de 3 - 15"),
    controladorclienteTelefono.guardar
);

/**
 * @swagger
 * /clienteTelefono/editar:
 *   put:
 *     summary: Modifica un teléfono de cliente existente
 *     tags: [ClienteTelefono]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID del teléfono de cliente a modificar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero:
 *                 type: string
 *                 description: Número de teléfono
 *                 example: "555-5678"
 *               activo:
 *                 type: boolean
 *                 description: Estado del teléfono
 *                 example: true
 *     responses:
 *       200:
 *         description: Teléfono de cliente actualizado con éxito
 *       400:
 *         description: Error en la validación
 */

ruta.put('/editar', 
    query("id").isInt().withMessage('Solo se permiten valores enteros en el id')
    .custom(async value => {
        if (!value) {
            throw new Error('El id no permite nulos');
        } else {
            const buscarClienteTelefono = await modeloClienteTelefono.findOne({
                where: { id: value }
            });
            if (!buscarClienteTelefono) {
                throw new Error('El id del teléfono de cliente no existe');
            }
        }
    }),
    body("numero").optional().isLength({ min: 3, max: 15 }).withMessage("El límite de caracteres es de 3 - 15"),
    body("activo").optional().isBoolean().withMessage("Solo permite valores booleanos"),
    controladorclienteTelefono.modificar
);

/**
 * @swagger
 * /clienteTelefono/eliminar:
 *   delete:
 *     summary: Elimina un teléfono de cliente existente
 *     tags: [ClienteTelefono]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID del teléfono de cliente a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Teléfono de cliente eliminado con éxito
 *       400:
 *         description: Error en la eliminación
 */

ruta.delete('/eliminar', 
    query("id").isInt().withMessage('Solo se permiten valores enteros en el id')
    .custom(async value => {
        if (!value) {
            throw new Error('El id no permite nulos');
        } else {
            const buscarClienteTelefono = await modeloClienteTelefono.findOne({
                where: { id: value }
            });
            if (!buscarClienteTelefono) {
                throw new Error('El id del teléfono de cliente no existe');
            }
        }
    }),
    controladorclienteTelefono.eliminar
);

module.exports = ruta;
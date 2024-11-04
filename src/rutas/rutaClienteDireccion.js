const { Router } = require('express');
const { body, query } = require('express-validator');
const modeloClienteDireccion = require('../modelos/clienteDireccion');
const controladorClienteDireccion = require('../controladores/controladoClienteDireccion');
const ruta = Router();
const { verificarUsuario } = require('../configuraciones/passport');

/**
 * @swagger
 * tags:
 *   name: ClienteDireccion
 *   description: Operaciones relacionadas con las direcciones de clientes
 */

/**
 * @swagger
 * /clienteDireccion:
 *   get:
 *     summary: Información general de las rutas de direcciones de clientes
 *     tags: [ClienteDireccion]
 *     responses:
 *       200:
 *         description: Información general de las rutas
 */

ruta.get('/', verificarUsuario, controladorClienteDireccion.inicio);

/**
 * @swagger
 * /clienteDireccion/listar:
 *   get:
 *     summary: Obtiene la lista de direcciones de clientes
 *     tags: [ClienteDireccion]
 *     responses:
 *       200:
 *         description: Lista de direcciones de clientes obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Identificador único de la dirección de cliente
 *                   descripcion:
 *                     type: string
 *                     description: Descripción de la dirección
 */

ruta.get('/listar',verificarUsuario, controladorClienteDireccion.listar);

/**
 * @swagger
 * /clienteDireccion/guardar:
 *   post:
 *     summary: Crear una dirección de cliente
 *     tags: [ClienteDireccion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 description: Descripción de la dirección del cliente
 *                 example: "Calle Falsa 123, Ciudad Ejemplo"
 *     responses:
 *       201:
 *         description: Dirección de cliente creada con éxito
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
 *                       description: Identificador de la dirección de cliente
 *                     descripcion:
 *                       type: string
 *                       description: Descripción de la dirección
 */

ruta.post('/guardar', 
    body("descripcion").notEmpty().withMessage("La descripción de la dirección es obligatoria"), verificarUsuario,
    controladorClienteDireccion.guardar
);

/**
 * @swagger
 * /clienteDireccion/editar:
 *   put:
 *     summary: Modifica una dirección de cliente existente
 *     tags: [ClienteDireccion]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID de la dirección de cliente a modificar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 description: Nueva descripción de la dirección
 *                 example: "Calle Nueva 456, Ciudad Ejemplo"
 *     responses:
 *       200:
 *         description: Dirección de cliente actualizada con éxito
 *       400:
 *         description: Error en la validación
 */

ruta.put('/editar', 
    query("id").isInt().withMessage('Solo se permiten valores enteros en el id')
    .custom(async value => {
        if (!value) {
            throw new Error('El id no permite nulos');
        } else {
            const buscarClienteDireccion = await modeloClienteDireccion.findOne({
                where: { id: value }
            });
            if (!buscarClienteDireccion) {
                throw new Error('El id de la dirección de cliente no existe');
            }
        }
    }),
    body("descripcion").optional().notEmpty().withMessage("La descripción de la dirección es obligatoria"), verificarUsuario,
    controladorClienteDireccion.modificar
);

/**
 * @swagger
 * /clienteDireccion/eliminar:
 *   delete:
 *     summary: Elimina una dirección de cliente existente
 *     tags: [ClienteDireccion]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID de la dirección de cliente a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dirección de cliente eliminada con éxito
 *       400:
 *         description: Error en la eliminación
 */

ruta.delete('/eliminar', 
    query("id").isInt().withMessage('Solo se permiten valores enteros en el id')
    .custom(async value => {
        if (!value) {
            throw new Error('El id no permite nulos');
        } else {
            const buscarClienteDireccion = await modeloClienteDireccion.findOne({
                where: { id: value }
            });
            if (!buscarClienteDireccion) {
                throw new Error('El id de la dirección de cliente no existe');
            }
        }
    }),
    verificarUsuario,
    controladorClienteDireccion.eliminar
);

module.exports = ruta;
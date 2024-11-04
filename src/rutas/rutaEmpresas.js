const { Router } = require('express');
const { body, query } = require('express-validator');
const modeloEmpresa = require('../modelos/empresa');
const controladorEmpresa = require('../controladores/controladorEmpresa');
const ruta = Router();
const { verificarUsuario } = require('../configuraciones/passport');

/**
 * @swagger
 * tags:
 *   name: Empresa
 *   description: Operaciones relacionadas con las empresas
 */

/**
 * @swagger
 * /empresa:
 *   get:
 *     summary: Información general de las rutas de empresas
 *     tags: [Empresa]
 *     responses:
 *       200:
 *         description: Información general de las rutas
 */

ruta.get('/', controladorEmpresa.inicio);

/**
 * @swagger
 * /empresa/listar:
 *   get:
 *     summary: Obtiene la lista de las empresas
 *     tags: [Empresa]
 *     responses:
 *       200:
 *         description: Lista de empresas obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Identificador único de la empresa
 *                   nombre:
 *                     type: string
 *                     description: Nombre de la empresa
 *                   direccion:
 *                     type: string
 *                     description: Dirección de la empresa
 *                   telefono:
 *                     type: string
 *                     description: Teléfono de la empresa
 */

ruta.get('/listar', verificarUsuario, controladorEmpresa.listar);

/**
 * @swagger
 * /empresa/guardar:
 *   post:
 *     summary: Crear una empresa
 *     tags: [Empresa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la empresa
 *                 example: "Empresa Ejemplo"
 *               empresaId:
 *                 type: string
 *                 description: Identificador único de la empresa
 *                 example: "EMP123"
 *               direccion:
 *                 type: string
 *                 description: Dirección de la empresa
 *                 example: "Calle Falsa 123"
 *               telefono:
 *                 type: string
 *                 description: Teléfono de la empresa
 *                 example: "555-1234"
 *     responses:
 *       201:
 *         description: Empresa creada con éxito
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
 *                       description: Identificador de la empresa
 *                     nombre:
 *                       type: string
 *                       description: Nombre de la empresa
 *                     direccion:
 *                       type: string
 *                       description: Dirección de la empresa
 *                     telefono:
 *                       type: string
 *                       description: Teléfono de la empresa
 */

ruta.post('/guardar', 
    body("nombre").isLength({ min: 3, max: 50 }).withMessage("El límite de caracteres es de 3 - 50"),
    body("empresaId").isLength({ max: 20 }).withMessage("El límite de caracteres para el ID es de 20").notEmpty().withMessage("El ID de la empresa es obligatorio"),
    body("direccion").notEmpty().withMessage("La dirección es obligatoria"),
    body("telefono").optional().isLength({ max: 15 }).withMessage("El límite de caracteres es de 15"),
    controladorEmpresa.guardar
);

/**
 * @swagger
 * /empresa/editar:
 *   put:
 *     summary: Modifica una empresa existente
 *     tags: [Empresa]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID de la empresa a modificar
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
 *                 description: Nombre de la empresa
 *                 example: "Empresa Modificada"
 *               direccion:
 *                 type: string
 *                 description: Dirección de la empresa
 *                 example: "Calle Nueva 456"
 *               telefono:
 *                 type: string
 *                 description: Teléfono de la empresa
 *                 example: "555-5678"
 *     responses:
 *       200:
 *         description: Empresa actualizada con éxito
 *       400:
 *         description: Error en la validación
 */

ruta.put('/editar', 
    query("id").isInt().withMessage('Solo se permiten valores enteros en el id')
    .custom(async value => {
        if (!value) {
            throw new Error('El id no permite nulos');
        } else {
            const buscarEmpresa = await modeloEmpresa.findOne({
                where: { id: value }
            });
            if (!buscarEmpresa) {
                throw new Error('El id de la empresa no existe');
            }
        }
    }),
    body("nombre").optional().isLength({ min: 3, max: 50 }).withMessage("El límite de caracteres es de 3 - 50"),
    body("direccion").optional().isLength({ min: 3 }).withMessage("La dirección es obligatoria"),
    body("telefono").optional().isLength({ max: 15 }).withMessage("El límite de caracteres es de 15"),
    controladorEmpresa.modificar
);

/**
 * @swagger
 * /empresa/eliminar:
 *   delete:
 *     summary: Elimina una empresa existente
 *     tags: [Empresa]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID de la empresa a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Empresa eliminada con éxito
 *       400:
 *         description: Error en la eliminación
 */

ruta.delete('/eliminar', 
    query("id").isInt().withMessage('Solo se permiten valores enteros en el id')
    .custom(async value => {
        if (!value) {
            throw new Error('El id no permite nulos');
        } else {
            const buscarEmpresa = await modeloEmpresa.findOne({
                where: { id: value }
            });
            if (!buscarEmpresa) {
                throw new Error('El id de la empresa no existe');
            }
        }
    }),
    controladorEmpresa.eliminar
);

module.exports = ruta;
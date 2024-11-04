const { Router } = require('express');
const { body, query } = require('express-validator');
const controladorSucursal = require('../controladores/controladorSucursal');
const modeloSucursal = require('../modelos/sucursal');
const modeloEmpresa = require('../modelos/empresa');

const ruta = Router();

/**
 * @swagger
 * tags:
 *   name: Sucursal
 *   description: API para gestionar sucursales
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Información general de las rutas de sucursales
 *     tags: [Sucursal]
 *     responses:
 *       200:
 *         description: Información general de las rutas
 */

/**
 * @swagger
 * /sucursal/listar:
 *   get:
 *     summary: Lista todas las sucursales
 *     tags: [Sucursal]
 *     responses:
 *       200:
 *         description: Lista de sucursales
 */

/**
 * @swagger
 * /sucursal/buscaridempresa:
 *   get:
 *     summary: Busca sucursales por el ID de la empresa
 *     tags: [Sucursal]
 *     parameters:
 *       - in: query
 *         name: empresaId
 *         required: true
 *         description: ID de la empresa a buscar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sucursal encontrada
 *       400:
 *         description: Error en la validación
 */

/**
 * @swagger
 * /sucursal/guardar:
 *   post:
 *     summary: Guarda una nueva sucursal
 *     tags: [Sucursal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: "AB12"
 *               nombre:
 *                 type: string
 *                 example: "Sucursal Central"
 *               direccion:
 *                 type: string
 *                 example: "Av. Principal #123"
 *               empresaId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Registro guardado
 *       400:
 *         description: Error en la validación
 */

/**
 * @swagger
 * /sucursal/editar:
 *   put:
 *     summary: Modifica una sucursal existente
 *     tags: [Sucursal]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID de la sucursal a modificar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: "AB12"
 *               nombre:
 *                 type: string
 *                 example: "Sucursal Central"
 *               empresaId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Registro actualizado
 *       400:
 *         description: Error en la validación
 */

/**
 * @swagger
 * /sucursal/eliminar:
 *   delete:
 *     summary: Elimina una sucursal existente
 *     tags: [Sucursal]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID de la sucursal a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro eliminado
 *       400:
 *         description: Error en la eliminación
 */

ruta.get('/', controladorSucursal.inicio);

ruta.get('/listar', controladorSucursal.listar);

ruta.get('/buscaridempresa',
    query("empresaId").isInt().withMessage("El id de la empresa debe ser un número entero")
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
    controladorSucursal.buscarIdEmpresa
);

ruta.post('/guardar', 
    body("codigo").isLength({ min: 2, max: 5 }).withMessage("El límite de caracteres es de 2 - 5"),
    body("nombre").isLength({ min: 3, max: 50 }).withMessage("El límite de caracteres es de 3 - 50"),
    body("direccion").isLength({ min: 5 }).withMessage("La dirección debe tener al menos 5 caracteres"),
    body("empresaId").isInt().withMessage("El id de la empresa debe ser un número entero")
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
    controladorSucursal.guardar
);

ruta.put('/editar', 
    query("id").isInt().withMessage('Solo se permiten valores enteros en el id')
    .custom(async value => {
        if (!value) {
            throw new Error('El id no permite nulos');
        } else {
            const buscarSucursal = await modeloSucursal.findOne({
                where: { id: value }
            });
            if (!buscarSucursal) {
                throw new Error('El id de la sucursal no existe');
            }
        }
    }),
    body("codigo").optional().isLength({ min: 2, max: 5 }).withMessage("El límite de caracteres es de 2 - 5"),
    body("nombre").optional().isLength({ min: 3, max: 50 }).withMessage("El límite de caracteres es de 3 - 50"),
    body("empresaId").optional().isInt().withMessage("El id de la empresa debe ser un número entero")
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
    controladorSucursal.modificar
);

ruta.delete('/eliminar', 
    query("id").isInt().withMessage('Solo se permiten valores enteros en el id')
    .custom(async value => {
        if (!value) {
            throw new Error('El id no permite nulos');
        } else {
            const buscarSucursal = await modeloSucursal.findOne({
                where: { id: value }
            });
            if (!buscarSucursal) {
                throw new Error('El id de la sucursal no existe');
            }
        }
    }),
    controladorSucursal.eliminar
);

module.exports = ruta;
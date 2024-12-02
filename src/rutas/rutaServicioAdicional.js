const { Router } = require('express');
const { body, query } = require('express-validator');
const modeloServicio = require('../modelos/servicioAdicional');
const controladorServicio = require('../controladores/controladorServicio');
const {  verificarUsuario } = require('../configuraciones/passport')

const ruta = Router();

/**
 * @swagger
 * tags:
 *   name: Servicios Adicionales
 *   description: API para gestionar servicios adicionales
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Información general de las rutas de Servicios Adicionales
 *     tags: [Servicios Adicionales]
 *     responses:
 *       200:
 *         description: Información general de las rutas
 */

/**
 * @swagger
 * /servicio/listar:
 *   get:
 *     summary: Lista todos los servicios adicionales
 *     tags: [Servicios Adicionales]
 *     responses:
 *       200:
 *         description: Lista de servicios adicionales
 */

/**
 * @swagger
 * /servicio/guardar:
 *   post:
 *     summary: Guarda un nuevo servicio adicional
 *     tags: [Servicios Adicionales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Servicio de Mantenimiento"
 *               descripcion:
 *                 type: string
 *                 example: "Servicio de mantenimiento preventivo y correctivo"
 *               precio:
 *                 type: number
 *                 format: float
 *                 example: 150.00
 *               disponibilidad:
 *                 type: boolean
 *                 example: true
 *               estado:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Registro guardado
 *       400:
 *         description: Error en la validación
 */

/**
 * @swagger
 * /servicio/editar:
 *   put:
 *     summary: Modifica un servicio adicional existente
 *     tags: [Servicios Adicionales]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID del servicio adicional a modificar
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
 *                 example: "Servicio de Mantenimiento"
 *               estado:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Registro actualizado
 *       400:
 *         description: Error en la validación
 */

/**
 * @swagger
 * /servicio/eliminar:
 *   delete:
 *     summary: Elimina un servicio adicional existente
 *     tags: [Servicios Adicionales]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID del servicio adicional a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro eliminado
 *       400:
 *         description: Error en la eliminación
 */
ruta.get('/', controladorServicio.inicio);


ruta.get('/listar',controladorServicio.listar);

ruta.post('/guardar', 
    body("nombre").isLength({min: 3, max:50}).withMessage("El limite de caracteres es de 3 - 50")
    .custom(async value =>{
        if(!value){
            throw new Error('El nombre no permite nulos')
        }
        else{
            const buscarServicio = await modeloServicio.findOne({
                where: {nombre: value}
            });
            console.log(buscarServicio);
            if(buscarServicio){
                throw new Error('El nombre del servicio ya existe');
            }
        }
    }),
    controladorServicio.guardar);

ruta.put('/editar', verificarUsuario,
        
         query("id").isInt().withMessage('Solo de permiten valores enteros en el id')
         .custom(async value =>{
            if(!value){
                throw new Error('El id no permite nulos')
            }
            else{
                
                const buscarServicio = await modeloServicio.findOne({
                    where: {id: value}
                });
                if(!buscarServicio){
                    throw new Error('El id del servicio no existe');
                }
            }
        }), 
        body("nombre").optional().isLength({min: 3, max:50}).withMessage("El limite de caracteres es de 3 - 50")
        .custom(async value =>{
            if(!value){
                throw new Error('El nombre no permite nulos')
            }
            
        }), 
        body("estado").optional().isBoolean().withMessage("Solo permite valores boleanos"),
        controladorServicio.modificar);
    
ruta.delete('/eliminar', 
    query("id").isInt().withMessage('Solo de permiten valores enteros en el id')
    .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscarServicio = await modeloServicio.findOne({
                where: {id: value}
            });
            if(!buscarServicio){
                throw new Error('El id del servicio no existe');
            }
        }
    }),
    controladorServicio.eliminar);

    ruta.get('/buscarservicio', verificarUsuario,
         controladorServicio.buscarServicio
    );
    
module.exports = ruta;
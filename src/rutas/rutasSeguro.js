const { Router } = require('express');
const { body, query } = require('express-validator');
const modeloSeguro = require('../modelos/seguro');
const controladorSeguro = require('../controladores/controladorSeguro');
const ruta = Router();
const {  verificarUsuario } = require('../configuraciones/passport')


/**
 * @swagger
 * tags:
 *   name: Seguros
 *   description: API para gestionar seguros
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Información general de las rutas de seguro
 *     tags: [Seguros]
 *     responses:
 *       200:
 *         description: Información general de las rutas
 */

/**
 * @swagger
 * /seguro/listar:
 *   get:
 *     summary: Lista todos los seguros
 *     tags: [Seguros]
 *     responses:
 *       200:
 *         description: Lista de seguros
 */

/**
 * @swagger
 * /seguro/guardar:
 *   post:
 *     summary: Guarda un nuevo seguro
 *     tags: [Seguros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Seguro de Vida"
 *               tipo:
 *                 type: string
 *                 example: "Vida"
 *               descripcion:
 *                 type: string
 *                 example: "Seguro de vida con cobertura total"
 *               cobertura:
 *                 type: string
 *                 example: "Cobertura total"
 *               precio:
 *                 type: number
 *                 format: float
 *                 example: 100.00
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
 * /seguro/editar:
 *   put:
 *     summary: Modifica un seguro existente
 *     tags: [Seguros]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID del seguro a modificar
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
 *                 example: "Seguro de Vida"
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
 * /seguro/eliminar:
 *   delete:
 *     summary: Elimina un seguro existente
 *     tags: [Seguros]
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: ID del seguro a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro eliminado
 *       400:
 *         description: Error en la eliminación
 */

ruta.get('/', controladorSeguro.inicio);


ruta.get('/listar',verificarUsuario,controladorSeguro.listar);

ruta.post('/guardar', 
    body("nombre").isLength({min: 3, max:50}).withMessage("El limite de caracteres es de 3 - 50")
    .custom(async value =>{
        if(!value){
            throw new Error('El nombre no permite nulos')
        }
        else{
            const buscarSeguro = await modeloSeguro.findOne({
                where: {nombre: value}
            });
            console.log(buscarSeguro);
            if(buscarSeguro){
                throw new Error('El nombre del seguro ya existe');
            }
        }
    }),
    controladorSeguro.guardar);

ruta.put('/editar', 
        query("id").isInt().withMessage('Solo de permiten valores enteros en el id')
        .custom(async value =>{
            if(!value){
                throw new Error('El id no permite nulos')
            }
            else{
                const buscarSeguro = await modeloSeguro.findOne({
                    where: {id: value}
                });
                if(!buscarSeguro){
                    throw new Error('El id del seguro no existe');
                }
            }
        }),
        body("nombre").optional().isLength({min: 3, max:50}).withMessage("El limite de caracteres es de 3 - 50")
        .custom(async value =>{
            if(!value){
                throw new Error('El nombre no permite nulos')
            }
            else{
                const buscarSeguro = await modeloSeguro.findOne({
                    where: {nombre: value}
                });
                console.log(buscarSeguro);
                if(buscarSeguro){
                    throw new Error('El nombre del seguro ya existe');
                }
            }
        }),
        body("estado").optional().isBoolean().withMessage("Solo permite valores boleanos"),
        controladorSeguro.modificar);
    
ruta.delete('/eliminar', verificarUsuario, 
    query("id").isInt().withMessage('Solo de permiten valores enteros en el id')
    .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscarSeguro = await modeloSeguro.findOne({
                where: {id: value}
            });
            if(!buscarSeguro){
                throw new Error('El id del seguro no existe');
            }
        }
    }),
    controladorSeguro.eliminar);

    ruta.get('/buscarseguro', verificarUsuario,
        /* query('id').notEmpty().withMessage('El campo id no puede estar vacío')
            .isInt().withMessage('El id debe ser un número entero'),
            async(req, res ) =>{
                try {
                    const errores = validationResult(req);
                    if(!errores.isEmpty()){
                        return  res.status(400).json({errores});
                    }
                    const { id } = req.query
                    const seguro = await modeloSeguro.findByPk(id);
    
                    if(!seguro){
                         return res.status(404).json({campo: "id", msj: "Este id no existe"});
                    }
                   return  controladorSeguro.buscarSeguro(req, res);
                }   catch (error) {
                        return res.status(500).json({msg: "Error en el servidor ruta"});
                }
            } */ controladorSeguro.buscarSeguro
    );
    
module.exports = ruta;
const { Router } = require('express');
const controladorUsuario = require('../controladores/controladorUsuario');
const ruta = Router();
/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Operaciones relacionadas con los usuarios
 */


/**
 * @swagger
 * /usuarios/recuperar:
 *   post:
 *     summary: Genera un PIN para la recuperación de la cuenta
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: PIN generado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: "PIN generado correctamente"
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error en el servidor
 */

ruta.post('/recuperar', controladorUsuario.generarPin);
/**
 * @swagger
 * /usuarios/contrasena:
 *   post:
 *     summary: Actualiza la contraseña del usuario
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Contraseña actualizada con éxito
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error en el servidor
 */
ruta.post('/contrasena', controladorUsuario.actualizarContrasena)
/**
 * @swagger
 * /usuarios/iniciosesion:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error en el servidor
 */
ruta.post('/iniciosesion', controladorUsuario.IniciarSesion)
/**
 * @swagger
 * /usuarios/error:
 *   get:
 *     summary: Ruta de prueba para manejar errores
 *     tags:
 *       - Usuarios
 *     responses:
 *       500:
 *         description: Error simulado en el servidor
 */
ruta.get('/error', controladorUsuario.error)
    
module.exports = ruta;
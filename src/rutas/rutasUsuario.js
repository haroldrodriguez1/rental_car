const { Router } = require('express');
const { body, query } = require('express-validator');
const modeloUsuario = require('../modelos/usuario');
const controladorUsuario = require('../controladores/controladorUsuario');
const ruta = Router();


ruta.get('/', controladorUsuario.inicio);


ruta.get('/listar',controladorUsuario.listar);

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
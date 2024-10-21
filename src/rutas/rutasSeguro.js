const { Router } = require('express');
const { body, query } = require('express-validator');
const modeloSeguro = require('../modelos/seguro');
const controladorSeguro = require('../controladores/controladorSeguro');
const ruta = Router();


ruta.get('/', controladorSeguro.inicio);


ruta.get('/listar',controladorSeguro.listar);

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
    
ruta.delete('/eliminar', 
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
    
module.exports = ruta;
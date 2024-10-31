const { Router } = require('express');
const { body, query } = require('express-validator');
const modeloServicio = require('../modelos/servicioAdicional');
const controladorServicio = require('../controladores/controladorServicio');
const ruta = Router();


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

ruta.put('/editar', 
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
    
module.exports = ruta;
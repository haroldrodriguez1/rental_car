const { Router } = require('express');
const { body, query } = require('express-validator');
const modeloEmpleado = require('../modelos/empleado');
const controladorEmpleado = require('../controladores/controladorEmpleado');
const ruta = Router();


ruta.get('/', controladorEmpleado.inicio);


ruta.get('/listar',controladorEmpleado.listar);

ruta.post('/guardar', 
    body("nombre").isLength({min: 3, max:50}).withMessage("El limite de caracteres es de 3 - 50")
    .custom(async value =>{
        if(!value){
            throw new Error('El nombre no permite nulos')
        }
        else{
            const buscarEmpleado = await modeloEmpleado.findOne({
                where: {nombre: value}
            });
            console.log(buscarEmpleado);
            if(buscarEmpleado){
                throw new Error('El nombre del empleado ya existe');
            }
        }
    }),
    controladorEmpleado.guardar);

ruta.put('/editar', 
        query("id").isInt().withMessage('Solo se permiten valores enteros en el id')
        .custom(async value =>{
            if(!value){
                throw new Error('El id no permite nulos')
            }
            else{
                const buscarEmpleado = await modeloEmpleado.findOne({
                    where: {id: value}
                });
                if(!buscarEmpleado){
                    throw new Error('El id del empleado no existe');
                }
            }
        }),
        body("nombre").optional().isLength({min: 3, max:50}).withMessage("El limite de caracteres es de 3 - 50")
        .custom(async value =>{
            if(!value){
                throw new Error('El nombre no permite nulos')
            }
            else{
                const buscarEmpleado = await modeloEmpleado.findOne({
                    where: {nombre: value}
                });
                console.log(buscarEmpleado);
                if(buscarEmpleado){
                    throw new Error('El nombre del empleado ya existe');
                }
            }
        }),
        body("estado").optional().isBoolean().withMessage("Solo permite valores boleanos"),
        controladorEmpleado.modificar);
    
ruta.delete('/eliminar', 
    query("id").isInt().withMessage('Solo de permiten valores enteros en el id')
    .custom(async value =>{
        if(!value){
            throw new Error('El id no permite nulos')
        }
        else{
            const buscarEmpleado = await modeloEmpleado.findOne({
                where: {id: value}
            });
            if(!buscarEmpleado){
                throw new Error('El id del empleado no existe');
            }
        }
    }),
    controladorEmpleado.eliminar);
    
module.exports = ruta;
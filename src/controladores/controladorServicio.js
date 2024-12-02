const modeloServicio = require('../modelos/servicioAdicional');
const { validationResult, body } = require('express-validator');

exports.inicio = (req, res)=>{
    var info = {
        rutas:[
            {
                descripcion: 'Informacion general de las rutas de Servicios Adicionales',
                metodo: 'get',
                url: 'servidor:3001/api/servicio/',
                parametros: 'ninguno'   
            },
            {
                descripcion: 'Lista todos los servicios',
                metodo: 'get',
                url: 'servidor:3001/api/servicio/listar',
                parametros: 'ninguno'   
            },
        ]
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(info);
}
exports.listar = async (req, res) => {
    
    try {
        await modeloServicio.findAll()
        .then((data)=>{
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(data);
        })
        .catch((er)=>{
            console.log(er);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Error en la consulta"});
        });
    } catch (error) {
        console.log(error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Error en el servidor"});
    }
}

exports.guardar = async (req, res) => {
    const errores = validationResult(req);
    var ers =[];
    errores.errors.forEach(e =>{
        ers.push({campo: e.path, msj: e.msg});
    })
    if(ers.length>0){
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ers});
    }
    else{
        try {
            await modeloServicio.create({...req.body})
            .then((data)=>{
                res.statusCode = 201;
                res.setHeader("Content-Type", "application/json");
                res.json({msg: "Registro guardado "+ data});        
            })
            .catch((er)=>{
                console.log(er);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({msg: "Error en la consulta"});
            })
        } catch (error) {
            console.log(error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Error en el servidor"});
        }
    }
}

exports.modificar = async (req, res) => {
    const errores = validationResult(req);
    var ers =[];
    errores.errors.forEach(e =>{
        ers.push({campo: e.path, msj: e.msg});
    })
    if(ers.length>0){
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ers});
    }
    else{
        try {
            const { id } = req.query;
            
            await modeloServicio.update(
                {...req.body},
                { where: { id: id}})
            .then((data)=>{
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({msg: "Registro actualizado "+ data});        
            })
            .catch((er)=>{
                console.log(er);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({msg: "Error en la consulta"});
            });
        } catch (error) {
            console.log(error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Error en el servidor"});
        }
    }
}

exports.eliminar = async (req, res) => {
    const errores = validationResult(req);
    var ers =[];
    errores.errors.forEach(e =>{
        ers.push({campo: e.path, msj: e.msg});
    })
    if(ers.length>0){
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ers});
    }
    else{
        try {
            const { id } = req.query;
            await modeloServicio.destroy({ where: { id: id}})
            .then((data)=>{
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({msg: "Registro eliminado "+ data});        
            })
            .catch((er)=>{
                console.log(er);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({msg: "Error en la consulta"});
            });
        } catch (error) {
            console.log(error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Error en el servidor"});
        }
    }
}

exports.buscarServicio = async (req, res) => {
    
    try {
        const {  id } = req.query;
        await modeloServicio.findAll({
            where: {
                id
            }
        })
        .then((data)=>{
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(data);
        })
        .catch((er)=>{
            console.log(er);
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Error en la consulta"});
        });
    } catch (error) {
        console.log(error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Error en el servidor"});
    }
}

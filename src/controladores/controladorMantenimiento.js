const modeloMantenimiento = require('../modelos/mantenimiento')
const { validationResult } = require('express-validator')
const modeloVehiculo = require('../modelos/vehiculo')

exports.listar = async(req,res) =>{


    try{
        await modeloMantenimiento.findAll()
        .then((data)=>{
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json")
            res.json(data)
        })
        .catch((err)=>{
            console.log(err)
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json")
            res.json({ msg: "Error en la consulta"})
        })
    }
    catch (error){
        console.log(error)
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json")
            res.json({ msg: "Error en el servidor"})
    }
}
exports.buscarIdvehiculo = async (req, res) => {
    
    try {
        const {  vehiculoid } = req.query;
        await modeloVehiculo.findAll({
            where: {
                vehiculoid
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


exports.guardar = async(req,res)=>{
    console.log(req.body)
    const errores = validationResult(req);
    console.log(errores)
    var  ers = []
    errores.errors.forEach(e => {
        ers.push({
            campo: e.path, msj: e.msg
        })
    });
   
    if(ers.length>0){
        res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
            res.json({ers})

    }else{
        try {
            await modeloMantenimiento.create({...req.body})
            .then((data)=>{
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json")
                res.json({msg: "Registro guardado", data})
    
            })
            .catch((err)=>{
                console.log(err)
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json")
                res.json({ msg: "Error en la consulta"})
            })
        } catch (error) {
            console.log(error)
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json")
                res.json({ msg: "Error en el servidor"})
            
        }
    }
    
}

exports.modificar = async(req,res)=>{
    console.log(req.body)
    const errores = validationResult(req);
    console.log(errores)
    var  ers = []
    errores.errors.forEach(e => {
        ers.push({
            campo: e.path, msj: e.msg
        })
    });
   
    if(ers.length>0){
        res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
            res.json({ers})

    }else{
        try {
            const { id } = req.query
            await modeloMantenimiento.update(
                {...req.body},
                { where:{IdMantenimiento: id} })
            .then((data)=>{
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json")
                res.json({msg: "Registro actualizado", data})
    
            })
            .catch((err)=>{
                console.log(err)
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json")
                res.json({ msg: "Error en la consulta"})
            })
    
        } catch (error) {
            console.log(error)
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json")
                res.json({ msg: "Error en el servidor"})
            
            }
    }
    
   
}

exports.eliminar = async(req,res)=>{
    console.log(req.body)
    const errores = validationResult(req);
    var  ers = []
    errores.errors.forEach(e => {
        ers.push({
            campo: e.path, msj: e.msg
        })
    });
   
    if(ers.length>0){
        res.statusCode = 200
            res.setHeader("Content-Type", "application/json")
            res.json({ers})

    }else{
        try {
            const { id } = req.query
            await modeloMantenimiento.destroy(
                { where:{id: id} })
            .then((data)=>{
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json")
                res.json({msg: "Registro eliminado", data})
    
            })
            .catch((err)=>{
                console.log(err)
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json")
                res.json({ msg: "Error en la consulta"})
            })
    
        } catch (error) {
            console.log(error)
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json")
                res.json({ msg: "Error en el servidor"})
            
            }
    }
    
   
}
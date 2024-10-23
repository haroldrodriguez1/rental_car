const modeloPago= require('../modelos/pago')
const { validationResult } = require('express-validator')


exports.listar = async(req,res) =>{


    try{
        await modeloPago.findAll()
        .then((data)=>{
            res.statusCode = 200;
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

exports.buscarIdPago = async (req, res) => {
    
    try {
        const { IdPago } = req.query;
        await modeloPago.findAll({
            where: {
                IdPago 
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
            await modeloPago.create({...req.body})
            .then((data)=>{
                res.statusCode = 201
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
            await modeloPago.update(
                {...req.body},
                { where:{id: id} })
            .then((data)=>{
                res.statusCode = 201
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
            await modeloPago.destroy(
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
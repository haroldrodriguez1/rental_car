const modeloUsuario = require('../modelos/usuario')
const crypto = require('crypto')
const { validationResult } = require('express-validator');
const { Op } = require('sequelize')
const argon2 = require('argon2')
const { getToken } = require('../configuraciones/passport')

const generarPin = ()=>{
    return crypto.randomBytes(3).toString('hex').slice(0,6)
}

exports.generarPin = async (req, res) =>{
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
            const { correo } = req.body;
            var usuario = await modeloUsuario.findOne({where: {correo: correo}});
            usuario.pin=generarPin();
            await usuario.save();
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Correo enviado "});
        } catch (error) {
            console.log(error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Error en el servidor"});
        }
    }
     
}
exports.actualizarContrasena = async (req, res) =>{
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
            const { correo, pin, contrasena } = req.body;
            var usuario = await modeloUsuario.findOne({where: {correo: correo}});
           if(usuario.pin != pin){
            await usuario.save();
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "El pin o correo no es valido "});
           }
           else{
            const hash = await argon2.hash(contrasena, {
                type: argon2.argon2id,
                memoryCost: 2**16,
                timeCost: 4,
                parallelism: 2
            });
            usuario.contrasena = hash;
            usuario.pin = '000000'
            await usuario.update();
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Registro actualizado "});
           }
    
        } catch (error) {
            console.log(error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Error en el servidor"});
        }
    }
     
}
exports.IniciarSesion = async (req, res) =>{
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
            const { login, contrasena } = req.body;
            var usuario = await modeloUsuario.findOne(
                {where: 
                    {   [Op.or]:{
                        correo:login, 
                        nombre: login
                    },
                    estado: 'AC'
                        
                    }
                });
           if(!usuario){
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Usuario o contrasena incorrectos "});
           }
           else{
           if( await argon2.verify(usuario.contrasena, contrasena)){
            usuario.intentos = 0
            await usuario.save();
            const token = getToken({id: usuario.id})
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({token});
           }else{
            usuario.intentos += 1;
            if(usuario.intentos == 5){
                usuario.estado = 'BL'
            }
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Usuario o contrasena incorrectos "});
           }
            usuario.contrasena = hash;
            usuario.pin = '000000'
            await usuario.update();
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({token});
           }
    
        } catch (error) {
            console.log(error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Error en el servidor"});
        }
    }
     
}


exports.error = async(req, res)=>{
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.json({msg: "Las credenciales son incorrectas"});
}
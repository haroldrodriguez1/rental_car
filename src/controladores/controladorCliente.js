const modeloCliente = require('../modelos/cliente');
const modeloUsuario = require('../modelos/usuario');
const modeloClienteDireccion = require('../modelos/clienteDireccion');
const modeloClienteTelefono = require('../modelos/clienteTelefono');
const db = require('../configuraciones/db');

const { validationResult } = require('express-validator');

const argon2 = require('argon2');

exports.inicio = (req, res)=>{
    var info = {
        rutas:[
            {
                descripcion: 'Informacion general de las rutas de cargos',
                metodo: 'get',
                url: 'servidor:3001/api/cargos/',
                parametros: 'ninguno'   
            },
            {
                descripcion: 'Lista todos los cargos',
                metodo: 'get',
                url: 'servidor:3001/api/cargos/listar',
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
        await modeloCliente.findAll({
            include: [
                modeloClienteDireccion,
                modeloClienteTelefono,
                modeloUsuario
            ]
        })
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
            const { contrasena, nombreUsuario, tipoUsuario, correo, telefonos, direcciones, identificacion} = req.body;
            const hash = await argon2.hash(contrasena, {
                type: argon2.argon2id,
                memoryCost: 2**16,
                timeCost: 4,
                parallelism: 2
            });
            const t = await db.transaction();
            const usuario = await modeloUsuario.create({contrasena: hash, nombreUsuario, tipoUsuario, correo, identificacion}, {transaction: t});
            const cliente = await modeloCliente.create({...req.body, usuarioId: usuario.id}, {transaction: t})
            .then(async (data)=>{
                const telefonosCliente = telefonos.map((f)=>({
                    numero: f.numero,
                    clienteId: data.clienteId
                }));
                await modeloClienteTelefono.bulkCreate(telefonosCliente, {transaction: t});
                const direccionesCliente = direcciones.map((f)=>({
                    descripcion: f.descripcion,
                    clienteId: data.clienteId
                }));
                await modeloClienteDireccion.bulkCreate(direccionesCliente, {transaction: t});
                await t.commit();
                res.statusCode = 201;
                res.setHeader("Content-Type", "application/json");
                res.json({msg: "Registro guardado ", data});        
            })
            .catch(async (er)=>{
                console.log(er);
                await t.rollback();
                res.statusCode = 400;
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
            const { telefonos, direcciones } = req.body;
            const t = await db.transaction();
            await modeloCliente.update(
                {...req.body},
                {transaction: t},
                { where: { id: id}})
            .then(async(data)=>{
                const telefonosCliente = telefonos.map((f)=>({
                    numero: f.numero,
                    clienteId: id
                }));
                await modeloClienteTelefono.destroy({where: {clienteId:id}}, {transaction: t});
                await modeloClienteTelefono.bulkCreate(telefonosCliente, {transaction: t});
                const direccionesCliente = direcciones.map((f)=>({
                    descripcion: f.descripcon,
                    clienteId: id
                }));
                await modeloClienteDireccion.destroy({where: {clienteId:id}}, {transaction: t});
                await modeloClienteDireccion.bulkCreate(direccionesCliente, {transaction: t});
                await t.commit();
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({msg: "Registro actualizado "+ data});        
            })
            .catch(async(er)=>{
                await t.rollback();
                console.log(er);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({msg: "Error en la consulta"});
            });
        } catch (error) {
            await t.rollback();
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
            const t = await db.transaction();
            await modeloClienteTelefono.destroy({where: {clienteId:id}}, {transaction: t});
            await modeloClienteDireccion.destroy({where: {clienteId:id}}, {transaction: t});
            const cliente = await modeloCliente.findOne({ where: { id: id}});
            const usuarioId = cliente.usuarioId;
            await cliente.destroy({transaction: t});
            await modeloUsuario.destroy({ where: { id: usuarioId}}, {transaction: t});
            await t.commit();
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Registro eliminado "}); 
        } catch (error) {
            await t.rollback();
            console.log(error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({msg: "Error en el servidor"});
        }
    }
}

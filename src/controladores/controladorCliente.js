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
    var ers = [];
    errores.errors.forEach(e => {
        ers.push({ campo: e.path, msj: e.msg });
    });
    if (ers.length > 0) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ ers });
    } else {
        try {
            const { contrasena, nombreUsuario, tipoUsuario, correo, telefonos, direcciones, identificacion } = req.body;
            if (!telefonos || !direcciones) {
                res.statusCode = 400;
                return res.json({ msg: "Los campos 'telefonos' y 'direcciones' son obligatorios" });
            }

            const hash = await argon2.hash(contrasena, {
                type: argon2.argon2id,
                memoryCost: 2 ** 16,
                timeCost: 4,
                parallelism: 2
            })
            const t = await db.transaction();
            const usuario = await modeloUsuario.create(
                { contrasena: hash, nombreUsuario, tipoUsuario, correo, identificacion },
                { transaction: t }
            )
            const cliente = await modeloCliente.create({ ...req.body, usuarioId: usuario.id }, { transaction: t })
                .then(async (data) => {
                    await modeloClienteTelefono.create(
                        {
                            numero: telefonos.numero, 
                            clienteId: data.clienteId
                        },
                        { transaction: t }
                    )
                    await modeloClienteDireccion.create(
                        {
                            descripcion: direcciones.descripcion, 
                            clienteId: data.clienteId
                        },
                        { transaction: t }
                    );

                    await t.commit();
                    res.statusCode = 201;
                    res.setHeader("Content-Type", "application/json");
                    res.json({ msg: "Registro guardado", data });
                })
                .catch(async (er) => {
                    console.log(er);
                    await t.rollback();
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.json({ msg: "Error en la consulta" });
                });
        } catch (error) {
            console.log(error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ msg: "Error en el servidor" });
        }
    }
}
exports.modificar = async (req, res) => {
    const errores = validationResult(req);
    const ers = [];
    
    errores.errors.forEach(e => {
        ers.push({ campo: e.path, msj: e.msg });
    });

    if (ers.length > 0) {
        res.status(200).json({ ers });
        return;
    }
    const { id } = req.query;
    const { primernombre, segundonombre, primerapellido, segundoapellido } = req.body;
    let t; 
    try {
        t = await db.transaction();
        await modeloCliente.update(
            { primernombre, segundonombre, primerapellido, segundoapellido },
            { 
                where: { clienteId: id },
                transaction: t
            }
        );
        await t.commit();
        res.status(200).json({ msg: "Registro actualizado correctamente" });
    } catch (error) {
        if (t) await t.rollback(); 
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

exports.eliminar = async (req, res) => {
    const errores = validationResult(req);
    const ers = [];
    errores.errors.forEach((e) => {
        ers.push({ campo: e.path, msj: e.msg });
    });

    if (ers.length > 0) {
        res.status(200).json({ ers });
    } else {
        let t; 
        try {
            const { id } = req.query;
            t = await db.transaction();
            await modeloClienteTelefono.update(
                { estado: 'IN' }, 
                { where: { clienteId: id }, transaction: t }
            );
            await modeloClienteDireccion.update(
                { estado: 'IN' },
                { where: { clienteId: id }, transaction: t }
            );
            const cliente = await modeloCliente.findOne({ where: { clienteId: id } });
            if (!cliente) {
                throw new Error('Cliente no encontrado');
            }
            const usuarioId = cliente.usuarioId
            await cliente.update({ estado: 'IN' }, { transaction: t })
            await modeloUsuario.update(
                { estado: 'IN' },
                { where: { id: usuarioId }, transaction: t }
            );
            await t.commit();
            res.status(200).json({ msg: 'Registro eliminado' });
        } catch (error) {
            if (t) await t.rollback();
            console.error(error);
            res.status(500).json({ msg: 'Error en el servidor' });
        }
    }
};


exports.buscarCliente = async (req, res) => {
    
    try {
        const {  id } = req.query;
        await modeloCliente.findAll({
            where: {
                clienteId: id
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

const modeloEmpresa = require('../modelos/empresa');
const modeloUsuario = require('../modelos/usuario');
const db = require('../configuraciones/db');

const { validationResult } = require('express-validator');
const argon2 = require('argon2');

exports.inicio = (req, res) => {
    var info = {
        rutas: [
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
    };
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(info);
};

exports.listar = async (req, res) => {
    try {
        await modeloEmpresa.findAll({
            include: [
                modeloUsuario
            ]
        })
        .then((data) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(data);
        })
        .catch((er) => {
            console.log(er);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ msg: "Error en la consulta" });
        });
    } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ msg: "Error en el servidor" });
    }
};

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
            const { contrasena, nombre, tipoUsuario, correo } = req.body;
            const hash = await argon2.hash(contrasena, {
                type: argon2.argon2id,
                memoryCost: 2**16,
                timeCost: 4,
                parallelism: 2
            });
            const t = await db.transaction();
            const usuario = await modeloUsuario.create({ contrasena: hash, nombre, tipoUsuario, correo }, { transaction: t });
            const empresa = await modeloEmpresa.create({ ...req.body, usuarioId: usuario.id }, { transaction: t });
            await t.commit();
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.json({ msg: "Registro guardado ", empresa });
        } catch (error) {
            console.log(error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ msg: "Error en el servidor" });
        }
    }
};

exports.modificar = async (req, res) => {
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
            const { id } = req.query;
            const t = await db.transaction();
            await modeloEmpresa.update(
                { ...req.body },
                { where: { id: id }, transaction: t }
            );
            await t.commit();
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ msg: "Registro actualizado" });
        } catch (error) {
            await t.rollback();
            console.log(error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ msg: "Error en el servidor" });
        }
    }
};

exports.eliminar = async (req, res) => {
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
            const { id } = req.query;
            const t = await db.transaction();
            const empresa = await modeloEmpresa.findOne({ where: { id: id } });
            const usuarioId = empresa.usuarioId;
            await empresa.destroy({ transaction: t });
            await modeloUsuario.destroy({ where: { id: usuarioId } }, { transaction: t });
            await t.commit();
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ msg: "Registro eliminado" });
        } catch (error) {
            await t.rollback();
            console.log(error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ msg: "Error en el servidor" });
        }
    }
};
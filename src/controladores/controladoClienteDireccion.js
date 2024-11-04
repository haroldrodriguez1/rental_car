
const modeloClienteDireccion = require('../modelos/clienteDireccion');
const db = require('../configuraciones/db');
const { validationResult } = require('express-validator');

exports.inicio = (req, res) => {
    const info = {
        rutas: [
            {
                descripcion: 'Información general de las rutas de direcciones de clientes',
                metodo: 'get',
                url: 'servidor:3001/api/clienteDireccion/',
                parametros: 'ninguno'
            },
            {
                descripcion: 'Lista todas las direcciones de clientes',
                metodo: 'get',
                url: 'servidor:3001/api/clienteDireccion/listar',
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
        const data = await modeloClienteDireccion.findAll();
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(data);
    } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ msg: "Error en el servidor" });
    }
};

exports.guardar = async (req, res) => {
    const errores = validationResult(req);
    const ers = errores.errors.map(e => ({ campo: e.path, msj: e.msg }));
    if (ers.length > 0) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ ers });
    } else {
        try {
            const { descripcion } = req.body;
            const t = await db.transaction();
            const clienteDireccion = await modeloClienteDireccion.create({ descripcion }, { transaction: t });
            await t.commit();
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.json({ msg: "Registro guardado", clienteDireccion });
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
    const ers = errores.errors.map(e => ({ campo: e.path, msj: e.msg }));
    if (ers.length > 0) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ ers });
    } else {
        try {
            const { id } = req.query;
            const t = await db.transaction();
            await modeloClienteDireccion.update(
                { ...req.body },
                { where: { id }, transaction: t }
            );
            await t.commit();
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({ msg: "Registro actualizado" });
        } catch (error) {
            console.log(error);
            await t.rollback();
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ msg: "Error en el servidor" });
        }
    }
};

exports.eliminar = async (req, res) => {
    const errores = validationResult(req);
    const ers = errores.errors.map(e => ({ campo: e.path, msj: e.msg }));
    if (ers.length > 0) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ ers });
    } else {
        try {
            const { id } = req.query;
            const t = await db.transaction();
            const clienteDireccion = await modeloClienteDireccion.findOne({ where: { id } });
            if (clienteDireccion) {
                await clienteDireccion.destroy({ transaction: t });
                await t.commit();
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({ msg: "Registro eliminado" });
            } else {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.json({ msg: "Dirección de cliente no encontrada" });
            }
        } catch (error) {
            console.log(error);
            await t.rollback();
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ msg: "Error en el servidor" });
        }
    }
};
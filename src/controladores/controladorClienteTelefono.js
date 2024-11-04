const modeloClienteTelefono = require('../modelos/clienteTelefono');
const db = require('../configuraciones/db');
const { validationResult } = require('express-validator');


exports.inicio = (req, res) => {
    const info = {
        rutas: [
            {
                descripcion: 'Información general de las rutas de teléfonos de clientes',
                metodo: 'get',
                url: 'servidor:3001/api/clienteTelefono/',
                parametros: 'ninguno'
            },
            {
                descripcion: 'Lista todos los teléfonos de clientes',
                metodo: 'get',
                url: 'servidor:3001/api/clienteTelefono/listar',
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
        const data = await modeloClienteTelefono.findAll();
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
            const { numero } = req.body;
            const t = await db.transaction();
            const clienteTelefono = await modeloClienteTelefono.create({ numero }, { transaction: t });
            await t.commit();
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.json({ msg: "Registro guardado", clienteTelefono });
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
            await modeloClienteTelefono.update(
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
            const clienteTelefono = await modeloClienteTelefono.findOne({ where: { id } });
            if (clienteTelefono) {
                await clienteTelefono.destroy({ transaction: t });
                await t.commit();
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({ msg: "Registro eliminado" });
            } else {
                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.json({ msg: "Teléfono de cliente no encontrado" });
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
const modeloRenta = require('../modelos/renta');
const { validationResult } = require('express-validator');
const db = require('../configuraciones/db');
const modeloSeguro = require('../modelos/seguro');
const modeloServicio = require('../modelos/servicioAdicional');




exports.inicio = (req, res) => {
    var info = {
        rutas: [
            {
                descripcion: 'Información general de las rutas de renta',
                metodo: 'get',
                url: 'servidor:3001/api/renta/',
                parametros: 'ninguno'
            },
            {
                descripcion: 'Lista todas las rentas',
                metodo: 'get',
                url: 'servidor:3001/api/renta/listar',
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
        await modeloRenta.findAll({
            include:[
                modeloSeguro,
                modeloServicio
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
}

exports.guardar = async (req, res) => {
    const errores = validationResult(req);
    var ers = [];
    errores.errors.forEach(e => {
        ers.push({ campo: e.path, msj: e.msg });
    })
    if (ers.length > 0) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ ers });
    } else {
        try {
            const {servicioAdicionalId} = req.body;
            const t = await db.transaction();
            
            
            await modeloRenta.create({ ...req.body },{transaction: t})
                .then( async (data) => {
                    
                    await t.commit();
                    res.statusCode = 201;
                    res.setHeader("Content-Type", "application/json");
                    res.json({ msg: "Registro de renta guardado", data });
                })
                .catch(async (er) => {
                    await t.rollback(); 
                    console.log(er);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json({ msg: "Error en la consulta" });
                })
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
    var ers = [];
    errores.errors.forEach(e => {
        ers.push({ campo: e.path, msj: e.msg });
    })
    if (ers.length > 0) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ ers });
    } else {
        try {
            const { id } = req.query;
            await modeloRenta.update(
                { ...req.body },
                { where: { id: id } }
            )
                .then((data) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json({ msg: "Registro de renta actualizado", data });
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
    }
}
 
exports.eliminar = async (req, res) => {
    const errores = validationResult(req);
    var ers = [];
    errores.errors.forEach(e => {
        ers.push({ campo: e.path, msj: e.msg });
    })
    if (ers.length > 0) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ ers });
    } else {
        try {
            const { id } = req.query;
            await modeloRenta.destroy({ where: { id: id } })
                .then((data) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json({ msg: "Registro de renta eliminado", data });
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
    }
}

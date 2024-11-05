const modeloVehiculo = require('../modelos/vehiculo');
const { validationResult } = require('express-validator');

exports.inicio = (req, res) => {
    var info = {
        rutas: [
            {
                descripcion: 'Información general de las rutas de vehículo',
                metodo: 'get',
                url: 'servidor:3001/api/vehiculo/',
                parametros: 'ninguno'
            },
            {
                descripcion: 'Lista todos los vehículos',
                metodo: 'get',
                url: 'servidor:3001/api/vehiculo/listar',
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
        await modeloVehiculo.findOne()
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
            await modeloVehiculo.create({ ...req.body })
                .then((data) => {
                    res.statusCode = 201;
                    res.setHeader("Content-Type", "application/json");
                    res.json({ msg: "Registro de vehículo guardado", data });
                })
                .catch((er) => {
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
            await modeloVehiculo.update(
                { ...req.body },
                { where: { vehiculoid: id } }
            )
                .then((data) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json({ msg: "Registro de vehículo actualizado", data });
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
            await modeloVehiculo.destroy({ where: { vehiculoid: id } })
                .then((data) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json({ msg: "Registro de vehículo eliminado", data });
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

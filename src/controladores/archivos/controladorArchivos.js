const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { uploadImagenVehiculo , uploadImagenCliente } = require('../../configuraciones/archivos');


const Vehiculo = require('../../modelos/vehiculo');
const Cliente = require('../../modelos/cliente');
const { validationResult } = require('express-validator');
const { resizeImage } = require('../../configuraciones/archivos');


exports.validarImagenCliente = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.json(errors.array());
        
    }
    else {
        uploadImagenCliente(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                
                res.json({ msj: "Hay errores al cargar la imagen", error: err });
            }
            else if (err) {
                res.json({ msj: "Hay errores al cargar la imagen", error: err });
            }
            else {
                next();
            }
        }); 
    }
}
exports.actualizarImagenCliente = async (req, res) => {
    const validacion = validationResult(req);
    if (validacion.errors.length > 0) {
        var msjerror = "";
        validacion.errors.forEach(r => {
            msjerror = msjerror + r.msg + ". ";
        })
        res.json({ msj: "Hay errores en la peticion", error: msjerror });
    }
    else {
        
        if (!req.file.fieldname) {
            return res.json({ msj: "No se envio la imagen req vacio" });
        }
        const id = parseInt(req.query.id); 

        console.log(req.file);
        const nombreImagen = req.file.filename;
        var buscarVehiculo = await Cliente.findAll({ where: { clienteId: id } });
        if (!buscarVehiculo) {
            res.json({ mjs: "El id del Vehiculo no existe" });
        }
        else {
            console.log(buscarVehiculo[0].imagen)
            const imagenAnterior = fs.existsSync(path.join( buscarVehiculo[0].imagen));
            console.log(imagenAnterior);
            if (imagenAnterior) {
                fs.unlinkSync(path.join(buscarVehiculo[0].imagen));
                console.log("Imagen eliminada");
            }
            const imagenNueva = fs.existsSync(path.join(__dirname, '../../img/Clientes/'+nombreImagen));
            if  (imagenNueva) { 
                const ruta = path.join(__dirname, '../../img/Clientes/'+nombreImagen);
                 await Cliente.update(
                    { imagen : ruta,
                      nombreImagen: nombreImagen  
                     },
                    { where: { clienteId: id } }
                ) 
                .
                    then((data) => {
                        res.status(200).json({ id: data.clienteId, imagen: data.imagen });
                        console.log("Imagen actualizada");
                    }).catch((er) => {
                        console.log(er);
                        res.status(500).json(er);
                    });
                
            }
            else {
                res.json({ msj: "se actualizo la imagen el la base de datos" });
            }
        }
    }
}

exports.validarImagenVehiculo = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.json(errors.array());
        
    }
    else {
        uploadImagenVehiculo(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                
                res.json({ msj: "Hay errores al cargar la imagen", error: err });
            }
            else if (err) {
                res.json({ msj: "Hay errores al cargar la imagen", error: err });
            }
            else {
                next();
            }
        }); 
    }
}
exports.actualizarImagenVehiculo = async (req, res) => {
    const validacion = validationResult(req);
    if (validacion.errors.length > 0) {
        var msjerror = "";
        validacion.errors.forEach(r => {
            msjerror = msjerror + r.msg + ". ";
        })
        res.json({ msj: "Hay errores en la peticion", error: msjerror });
    }
    else {
        //console.log(req);
        if (!req.file.fieldname) {
            return res.json({ msj: "No se envio la imagen req vacio" });
        }
        const id = parseInt(req.query.id); 

        console.log(req.file);
        const nombreImagen = req.file.filename;
        var buscarVehiculo = await Vehiculo.findAll({ where: { vehiculoid: id } });
        if (!buscarVehiculo) {
            res.json({ mjs: "El id del Vehiculo no existe" });
        }
        else {
            console.log(buscarVehiculo[0].imagen)
            const imagenAnterior = fs.existsSync(path.join( buscarVehiculo[0].imagen));
            console.log(imagenAnterior);
            if (imagenAnterior) {
                fs.unlinkSync(path.join(buscarVehiculo[0].imagen));
                console.log("Imagen eliminada");
            }
            const imagenNueva = fs.existsSync(path.join(__dirname, '../../img/Vehiculos/'+nombreImagen));
            if  (imagenNueva) { 
                const ruta = path.join(__dirname, '../../img/Vehiculos/'+nombreImagen);
                 await Vehiculo.update(
                    { imagen : ruta,
                      nombreImagen: nombreImagen  
                     },
                    { where: { vehiculoid: id } }
                ) 
                .
                    then((data) => {
                        res.status(200).json({ id: data.vehiculoid, imagen: data.imagen });
                        console.log("Imagen actualizada");
                    }).catch((er) => {
                        console.log(er);
                        res.status(500).json(er);
                    });
                
            }
            else {
                res.json({ msj: "se actualizo la imagen el la base de datos" });
            }
        }
    }
}


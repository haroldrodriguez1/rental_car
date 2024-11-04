
const modeloSucursal = require('../modelos/sucursal');
const modeloEmpresa = require('../modelos/empresa');

exports.inicio = (req, res) => {
    const info = {
        rutas: [
            {
                descripcion: 'Informacion general de las rutas de sucursales',
                metodo: 'get',
                url: 'servidor:3001/api/sucursales/',
                parametros: 'ninguno'
            },
            {
                descripcion: 'Lista todas las sucursales',
                metodo: 'get',
                url: 'servidor:3001/api/sucursales/listar',
                parametros: 'ninguno'
            },
            {
                descripcion: 'Buscar sucursal por ID de empresa',
                metodo: 'get',
                url: 'servidor:3001/api/sucursales/buscarIdEmpresa',
                parametros: 'empresaId'
            },
            {
                descripcion: 'Guardar una nueva sucursal',
                metodo: 'post',
                url: 'servidor:3001/api/sucursales/guardar',
                parametros: 'codigo, nombre, direccion, telefono, empresaId'
            },
            {
                descripcion: 'Modificar una sucursal existente',
                metodo: 'put',
                url: 'servidor:3001/api/sucursales/modificar',
                parametros: 'id, codigo, nombre, direccion, telefono, empresaId'
            },
            {
                descripcion: 'Eliminar una sucursal',
                metodo: 'delete',
                url: 'servidor:3001/api/sucursales/eliminar',
                parametros: 'id'
            }
        ]
    };
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(info);
};

exports.listar = async (req, res) => {
    try {
        const sucursales = await modeloSucursal.findAll({ include: 'empresas' });
        res.json(sucursales);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al listar sucursales', error });
    }
};

exports.buscarIdEmpresa = async (req, res) => {
    try {
        const { empresaId } = req.query;
        const sucursales = await modeloSucursal.findAll({
            where: { empresaId },
            include: 'empresas'
        });
        res.json(sucursales);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al buscar sucursales por ID de empresa', error });
    }
};

exports.guardar = async (req, res) => {
    try {
        const { codigo, nombre, direccion, telefono, empresaId } = req.body;
        const nuevaSucursal = await modeloSucursal.create({ codigo, nombre, direccion, telefono, empresaId });
        res.json(nuevaSucursal);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al guardar sucursal', error });
    }
};

exports.modificar = async (req, res) => {
    try {
        const { id } = req.query;
        const { codigo, nombre, direccion, telefono, empresaId } = req.body;
        await modeloSucursal.update(
            { codigo, nombre, direccion, telefono, empresaId },
            { where: { id } }
        );
        res.send("Sucursal actualizada correctamente");
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar sucursal', error });
    }
};

exports.eliminar = async (req, res) => {
    try {
        const { id } = req.query;
        await modeloSucursal.destroy({ where: { id } });
        res.send("Sucursal eliminada correctamente");
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar sucursal', error });
    }
};
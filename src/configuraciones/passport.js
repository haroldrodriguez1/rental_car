
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const moment = require('moment');
const Usuario = require('../modelos/usuario');

dotenv.config();

const CLAVE_TOKEN = process.env.CLAVE_TOKEN;
const tiempoExpiracion = moment.duration(10, 'days').asSeconds();

exports.getToken = (data) => {
    return jwt.sign(data, CLAVE_TOKEN, { expiresIn: tiempoExpiracion });
};

const opciones = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: CLAVE_TOKEN,
};

exports.validarAutenticacion = passport.use(new JwtStrategy(opciones, async (payload, done) => {
    try {
        const usuario = await Usuario.findOne({ where: { id: payload.id } });
        if (usuario) {
            return done(null, { id: usuario.id, tipo: usuario.tipoUsuario });
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

exports.verificarUsuario = passport.authenticate("jwt", { session: false, failureRedirect: '/api/usuarios/error' });

const passport = require('passport')
const JwtStategy = require('passport-jwt').Strategy
const extract = require('passport-jwt').ExtractJwt
const jwt = require('jsonwebtoken')
const { CLAVE_TOKEN } = process.env
const moment = require('moment')
const tiempoExpiracion = moment.duration(10, 'days').asSeconds();

const usuario = require('../modelos/usuario')
const { ExtractJwt } = require('passport-jwt')

exports.getToken = (data)=>{
    return jwt.sign(data, CLAVE_TOKEN, {expiresIn: tiempoExpiracion})
}

const opciones = {

    jwtFromRequest:  ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: CLAVE_TOKEN
}
//funcion de autenticacion
exports.validarAutenticacion = passport.use( new JwtStategy(opciones, async(playload, done)=>{
    await usuario.findOne((playload.id).then( (err, user)=>{
        if(data){
            return done(err, {id:data.id, tipo:data.tipoUsuario});
        }else{
            return done(null, false)
        }
    })).catch((err)=>{
        return done(null, false)
    })
}))

exports.verificarUsuario = passport.authenticate("jwt",{session:false, failureRedirect: '/api/usuarios/error'})
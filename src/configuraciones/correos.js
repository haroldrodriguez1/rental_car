const nodemailer = require('nodemailer')
const {USUARIO_CORREO, CONTRASENA_CORREO, SERVICIO_CORREO } = process.env; 
exports.enviarCorreo = async(datos)=>{
    const transporte = nodemailer.createTransport({
        host: SERVICIO_CORREO,
        auth : {
            user: USUARIO_CORREO,
            pass: CONTRASENA_CORREO
        }
    })
    const optCorreo = {
        from: USUARIO_CORREO,
        to: datos.para,
        subject: datos.asuntos, 
        text: datos.descripcion,
        html: datos.html
    }

    return transporte.sendMail(optCorreo, (error, info) =>{
        if(error){
            return console.log(error)
        }
        console.log("correo enviado", + info.response)
    })
   
} 
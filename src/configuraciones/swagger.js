const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');


const options = {
    definition:{
        openapi : '3.0.0',
        info: {
            title: 'API de Seguros',
            version: '1.0.0',
            description: 'Documentación de la API para gestionar seguros'
        },
        servers: [
            {
                url: 'http://localhost:' + process.env.PORT +'/api',
                description: 'Servidor Local'
            }
        ]
    },
    apis: [path.join(__dirname, "../rutas/*.js")]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
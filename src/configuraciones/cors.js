const cors = {
    origin: '*',
    methods: ['GET','PUT','POST','DELETE'],
    allowedHeaders:['Content-Type','Authorization'],
    credentials :true
};
module.exports = cors;
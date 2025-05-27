const mongoose = require('mongoose');

require('dotenv').config({path: './config/.env'});
//Funcion asincrona para conectarse a la bd de datos
const conertarDB = async () => { 
    try {
        await mongoose.connect(process.env.DB_MONGO);
        //Mensaje cuabndo se establece la conexion
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Salir del proceso si hay un error
    }
};

module.exports = conertarDB;

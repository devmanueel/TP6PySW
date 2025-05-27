const mongoose = require('mongoose');

const SocioSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    }
    ,
    nombre: {
        type: String,
        required: true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        match: /^\S+@\S+\.\S+$/  // Expresión regular para validar formato email
    },
    telefono: {
        type: String,
        required: true,
        default:null,
        match: /^\d{10}$/  // Expresión regular para validar formato de teléfono
    },
    estado: {
        type: String,
        enum: ['Activo', 'Inactivo', ''],
        default: ''
    },
    foto: {
        type: String,
        default: null
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Socio', SocioSchema);
const mongoose = require('mongoose');

const generosValidos = ['Novela', 'Ciencia Ficción', 'Historia', 'Educativo', 'Fantasía', 'Biografía'];
const formatosValidos = ['Físico', 'PDF', 'ePub', 'Audiolibro'];

const LibroSchema = new mongoose.Schema({
  isbn: {
    type: String,
    required: [true, 'El ISBN es requerido'],
    unique: true,
    trim: true
  },
  titulo: {
    type: String,
    required: [true, 'El título es requerido'],
    minlength: [3, 'El título debe tener al menos 3 caracteres'],
    maxlength: [255, 'El título no puede exceder 255 caracteres'],
    trim: true
  },
  autor: {
    type: String,
    required: [true, 'El autor es requerido'],
    minlength: [3, 'El autor debe tener al menos 3 caracteres'],
    maxlength: [100, 'El autor no puede exceder 100 caracteres'],
    trim: true
  },
  anioPublicacion: {
    type: Number,
    required: [true, 'El año de publicación es requerido'],
    min: [1450, 'El año no puede ser menor a 1450'],
    max: [new Date().getFullYear(), `El año no puede ser mayor a ${new Date().getFullYear()}`]
  },
  genero: {
    type: String,
    required: [true, 'El género es requerido'],
    enum: {
      values: generosValidos,
      message: `Género no válido. Opciones: ${generosValidos.join(', ')}`
    }
  },
  estado: {
    type: String,
    required: [true, 'El estado es requerido'],
    enum: ['Disponible', 'Prestado'],
    default: 'Disponible'
  },
  imagenPortada: {
    type: String,
    default: ''
  },
  formato: {
    type: String,
    required: [true, 'El formato es requerido'],
    enum: {
      values: formatosValidos,
      message: `Formato no válido. Opciones: ${formatosValidos.join(', ')}`
    }
  },
  editorial: {
    type: String,
    required: [true, 'La editorial es requerida'],
    minlength: [3, 'La editorial debe tener al menos 3 caracteres'],
    maxlength: [100, 'La editorial no puede exceder 100 caracteres'],
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Libro', LibroSchema);
const express = require('express');
const router = express.Router();

const socioController = require('../controllers/socioController');
// Ruta del post para crear un socio
//Endpoint: POST /api/socios
router.post('/', socioController.crearSocio);

// Ruta del get para obtener todos los socios
//Endpoint: GET /api/socios
router.get('/', socioController.obtenerSocios);

// Ruta del get para obtener un socio por su id
//Endpoint: GET /api/socios/:id
router.get('/:id', socioController.obtenerSocioPorId);

// Ruta del put para actualizar un socio
//Endpoint: PUT /api/socios/:id
router.put('/:id', socioController.actualizarSocio);

// Ruta del delete para eliminar un socio
//Endpoint: DELETE /api/socios/:id
router.delete('/:id', socioController.eliminarSocio);

module.exports = router;
// Importar el controlador de socios
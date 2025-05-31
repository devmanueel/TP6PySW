const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libroController');
const multer = require('multer');

// Configuración de Multer para imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'), false);
    }
  }
});

// CRUD
router.post('/', upload.single('imagenPortada'), libroController.crearLibro);
router.get('/', libroController.obtenerLibros);
router.put('/:id', upload.single('imagenPortada'), libroController.actualizarLibro);
router.delete('/:id', libroController.eliminarLibro);

router.get('/:id', libroController.obtenerLibro);  
// Cambio de estado
router.patch('/:id/estado', libroController.cambiarEstado);

module.exports = router;
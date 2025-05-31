const Libro = require('../models/Libro');
const fs = require('fs');
const path = require('path');

exports.crearLibro = async (req, res) => {
  try {
    // Validar ISBN único
    const existeISBN = await Libro.findOne({ isbn: req.body.isbn });
    if (existeISBN) {
      return res.status(400).json({ error: 'El ISBN ya está registrado' });
    }

    const libro = new Libro({
      ...req.body,
      imagenPortada: req.file ? req.file.filename : ''
    });

    await libro.save();
    res.status(201).json(libro);
    console.log('Libro creado:', libro.titulo);
  } catch (error) {
    console.error('Error al crear libro:', error);
    res.status(400).json({ error: error.message });
  }
};
exports.obtenerLibro = async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);
    if (!libro) {
      return res.status(404).json({ 
        mensaje: 'Libro no encontrado' 
      });
    }
    res.json(libro);
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error al obtener el libro',
      error: error.message 
    });
  }
};

exports.obtenerLibros = async (req, res) => {
  try {
    const { titulo, autor } = req.query;
    const filtro = {};

    if (titulo) filtro.titulo = { $regex: titulo, $options: 'i' };
    if (autor) filtro.autor = { $regex: autor, $options: 'i' };

    const libros = await Libro.find(filtro);
    res.json(libros);
    console.log('Libros listados:', libros.length);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ error: 'Error al listar libros' });
  }
};

exports.actualizarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validar ISBN único (si se modifica)
    if (updateData.isbn) {
      const existeISBN = await Libro.findOne({ 
        isbn: updateData.isbn, 
        _id: { $ne: id } 
      });
      if (existeISBN) {
        return res.status(400).json({ error: 'El ISBN ya está en uso' });
      }
    }

    // Manejo de imagen
    if (req.file) {
      updateData.imagenPortada = req.file.filename;
      // Eliminar imagen anterior si existe
      const libro = await Libro.findById(id);
      if (libro.imagenPortada) {
        const imagePath = path.join(__dirname, '../public/uploads', libro.imagenPortada);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }
    }

    const libroActualizado = await Libro.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!libroActualizado) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json(libroActualizado);
    console.log('Libro actualizado:', libroActualizado.titulo);
  } catch (error) {
    console.error('Error al actualizar libro:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!['Disponible', 'Prestado'].includes(estado)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }

    const libro = await Libro.findByIdAndUpdate(
      id,
      { estado },
      { new: true }
    );

    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json(libro);
    console.log('Estado actualizado:', libro.titulo, '-', libro.estado);
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};

exports.eliminarLibro = async (req, res) => {
  try {
    const libro = await Libro.findByIdAndDelete(req.params.id);

    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    // Eliminar imagen asociada
    if (libro.imagenPortada) {
      const imagePath = path.join(__dirname, '../public/uploads', libro.imagenPortada);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    res.json({ message: 'Libro eliminado correctamente' });
    console.log('Libro eliminado:', libro.titulo);
  } catch (error) {
    console.error('Error al eliminar libro:', error);
    res.status(500).json({ error: 'Error interno' });
  }
};
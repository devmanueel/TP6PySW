const Socio = require('../models/Socio');

exports.crearSocio = async (req, res) => {
    try {
        // Validar que el ID no exista
        const ultimoSocio = await Socio.findOne().sort({ id: -1 });
        const nuevoId = ultimoSocio ? ultimoSocio.id + 1 : 1;

        const socio = new Socio({...req.body, id: nuevoId });
        await socio.save();
        res.status(201).json(socio);
        console.log('Socio creado Correctamente:', socio.nombre);
    } catch (error) {
        console.error('Error al crear socio:', error);
        res.status(400).json({ error: error.message });
    }
};

exports.obtenerSocios = async (req, res) => {
    try {
        const { estado } = req.query;
        const filtro = estado ? { estado } : {};
        
        const socios = await Socio.find(filtro);
        res.json(socios);

        console.log('Get Listando Socios ', socios);

    } catch (error) {
        console.error('Error al obtener socios:', error);
        res.status(500).json({ error: 'Error al Listar socios', error });
    }
};

exports.actualizarSocio = async (req, res) => {
    try {
        const socioId = req.params.id;
        const updateDate  = req.body;
        if (updateDate.email){
            const emailExistenteConEseEmail = await Socio.findOne({ 
                email: updateDate.email,
                _id: { $ne: socioId }, // Excluir el socio actual

            });
            if (emailExistenteConEseEmail) {
                return res.status(400).json({ error: 'El email ya está en uso por otro socio' });
            }
        }
        const socioActualizado = await Socio.findByIdAndUpdate(
            socioId,
            updateDate,
            {
                new: true, // Devuelve el documento actualizado
                runValidators: true, // Ejecuta validadores de esquema
                context: 'query' // Contexto de la consulta
            }
        );
        if (!socioActualizado) {
            return res.status(404).json({ error: 'Socio no encontrado' });
        }
        res.status(200).json({
            message: 'Socio actualizado correctamente',
            socio: socioActualizado
        });
        console.log('Socio actualizado Correctamente:', socioActualizado.nombre);
        
    }
    catch (error) {
        console.error('Error al actualizar socio:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Id de socio Invalido o con formato incorrecto. ', error });
        }

        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];

            return res.status(400).json({ 
                message: `El Valor ${error.keyValue[field]}  ya está en uso por otro socio`,
            });
        }

        if (error.name === 'ValidationError') {
            const mensaje = Object.values(error.errors).map((err)=> err.message);
            return res.status(400).json({ error: 'Errore de validacoi ', errors: mensaje });
        }
        res.status(500).json({ 
            message: 'Error Interno en el servidor al actualizar socio',
            error: error.message,
        });
    }
};

exports.eliminarSocio = async (req, res) => {
    try {
        // Validar que el ID sea un ObjectId válido
        const socioId = req.params.id;

        const socioEliminado = await Socio.findByIdAndDelete(socioId);

        
        if (!socioEliminado) {
            return res.status(404).json({ error: 'Socio no encontrado para eliminar' });
        }
        
        res.status(200).json({
            message: 'Socio eliminado correctamente',
            socio: socioEliminado
        });
        console.log('Socio eliminado Correctamente:', socioEliminado.nombre);
    } catch (error) {
        console.error('Error al eliminar socio:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Id de socio Invalido o con formato incorrecto. ', error });
        }
        res.status(500).json({ 
            message: 'Error Interno en el servidor al eliminar socio',
            error: error.message,
        });

        
    }
};


exports.obtenerSocioPorId = async (req, res) => {
    try {
        const socioId = req.params.id;

        const socio = await Socio.findById(socioId);

        if (!socio) {
            return res.status(404).json({ error: 'Socio no encontrado Con el Id Proporcionado' });
        }
        res.status(200).json({
            message: 'Socio encontrado correctamente',
            socio
        });

    } catch (error) {
        console.error('Error al obtener socio:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Id de socio Invalido o con formato incorrecto. ', error });
        }
        res.status(500).json({ error: 'Error al obtener socio', error });
    }
};



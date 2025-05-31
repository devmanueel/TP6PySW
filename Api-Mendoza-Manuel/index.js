require(`dotenv`).config({ path: `variables.env` });
const express = require(`express`);

const cors = require(`cors`);

const conectarDB = require(`./config/db`);

const app = express();

app.use(cors());
//desde las consultas nosotros mandamos como json 
app.use(express.json());

// Conectar a la base de datos llama al metodo para conectar a la base de datos
conectarDB();
//todas las rutas son accesible mediante estos prefijos defininos en las rutas para las consulta 

app.use(`/api/socios`, require(`./routes/socio`));
app.use(`/api/libros`, require(`./routes/libro`));


// Configuración para subir imágenes (si usas multer)
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


//DEFINIMOS UNA CONSTANTE PARA EL Puerto
const PORT = process.env.PORT || 4000;


//Como va a estar escuchando el servidor en el puerto especifico 
app.listen(PORT, () => {
    //mensaje para saver en que puerto se esta escuchando 
    console.log(`Servidor Corriendo en http://localhost:${PORT}`);
});
// console.log(`Servidor en el puerto ${PORT}`);


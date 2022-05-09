// Importaciones
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const expressFileUpload = require('express-fileupload');
const path =require('path');
const bodyParser = require('body-parser');
const port = 3000;

// Levantando el servidor
app.listen(port, () => console.log('Escuchando al puerto: ', port));

// Motor de plantillas
app.set('view engine', 'handlebars');

app.set('views', path.join(__dirname, '/views/layouts'));

// Configuración de las rutas de Handlebars
app.engine(
    'handlebars',
    exphbs.engine({
        defaultLayout: 'Index',
        layoutsDir: app.get('views'),
        partialsDir: path.join(__dirname, '/views/components'),
        helpers: {
            inc: (value, options) => {
                return parseInt(value) + 1;
            }
        },
    })
);

// Configuración del fileupload
const configFileUploadImg = {
    limits: { fileSize: 50000000 },
    abortOnLimit: true,
    responseOnLimit: "El peso del archivo que intentas subir supera el limite permitido",
};

// Integrando fileupload
app.use(expressFileUpload(configFileUploadImg));

// Integrando body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CSS
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
// Imágenes (Files)
app.use('/img', express.static(path.join(__dirname, 'public', 'img', )));
// JS
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
// Bootstrap
app.use('/bootstrapcss', express.static(path.join(__dirname, '..', '/node_modules/bootstrap/dist/css')));
app.use('/bootstrapjs', express.static(path.join(__dirname, '..', '/node_modules/bootstrap/dist/js')));
// jQuery
app.use('/jquery', express.static(path.join(__dirname, '..', '/node_modules/jquery/dist')));
// Axios
app.use('/axios', express.static(path.join(__dirname, '..', '/node_modules/axios/dist')));

// Router
app.use(require('./routes'));
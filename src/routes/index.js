// Importaciones
const { verify } = require('crypto');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const { getSkaters, getSkater, insertSkater, updateEstado, updateSkater, deleteSkater } = require('./../database/consultas');
const secretKey = 'Secret Key';

console.log('dirname: ', __dirname);

// Vista principal
router.get('/', async (req, res) => {

    try {

        let skaters = await getSkaters();

        res.render('Index',
            {
                layout: 'Index',
                usuarios: skaters
            });

    } catch (error) {

        res.status(500).send({

            error: `Algo salió mal. ${error}`,
            code: 500

        });

    };

});

// Registro
router.get('/register', async (req, res) => {

    try {

        res.render('Registro', { layout: 'Registro' });

    } catch (error) {

        res.status(500).send({

            error: `Algo salió mal. ${error}`,
            code: 500

        });

    };

});

// Inicio de Sesión
router.get('/login', async (req, res) => {

    try {

        res.render('Login', { layout: 'Login' });

    } catch (error) {

        res.status(500).send({

            error: `Algo salió mal. ${error}`,
            code: 500

        });

    };

});

// Página del administrador
router.get('/admin', async (req, res) => {

    try {

        let skaters = await getSkaters();

        res.render('Admin',
            {
                layout: 'Admin',
                usuarios: skaters
            });

    } catch (error) {

        res.status(500).send({

            error: `Algo salió mal. ${error}`,
            code: 500

        });

    };

});

// Datos para el script
router.get('/usuario', async (req, res) => {

    try {

        const respuesta = await getSkaters();
        res.statusCode = 201;
        res.send(JSON.stringify(respuesta));

    } catch (error) {

        res.status(500).send({

            error: `Algo salió mal. ${error}`,
            code: 500

        });

    };

});

// Registrando un nuevo usuario
router.post('/usuario', async (req, res) => {

    try {

        let { imagen } = req.files;
        let { name } = imagen;

        let { email, nombre, contrasena, confirmoContrasena, anos_experiencia, especialidad } = req.body;

        if (contrasena == confirmoContrasena) {

            try {

                await insertSkater(email, nombre, contrasena, anos_experiencia, especialidad, name);

                imagen.mv(`${__dirname}/../public/img/${name}`, (error) => {

                    if (error) {
                        console.log('Error al cargar la imagen');
                    };

                });

                res.send(`<script>alert('El registro ha sido exitoso. Bienvenido, ${nombre}');window.location.href = '/';</script>`);

            } catch (error) {

                console.log(error);

            };

        } else {

            res.send("<script>alert('Las contraseñas no coinciden');window.location.href = '/register';</script>");

        };

    } catch (error) {

        res.status(500).send({

            error: `Algo salió mal. ${error}`,
            code: 500

        });

    };

});

// Editar estado de usuario
router.put('/usuario', async (req, res) => {

    try {

        const { id, estado } = req.body;

        const resultado = await updateEstado(id, estado);

        res.status(201).send(resultado);

    } catch (error) {

        res.status(500).send({

            error: `Algo salió mal. ${error}`,
            code: 500

        });

    };

});

// Verificar inicio de sesión
router.post('/verificar', async (req, res) => {

    const { email, pass } = req.body;

    const usuario = await getSkater(email, pass);

    if (usuario) {

        if (usuario.estado) {

            const token = jwt.sign({

                // exp: Math.floor(Date.now() / 1000) + 60,
                data: usuario

            },
                secretKey
            );

            res.send(token);

        } else {

            res.status(403).send({

                error: 'Este usuario aún se encuentra en revisión',
                code: 403

            });

        };

    } else {

        res.status(500).send({

            error: 'El usuario no está registrado',
            code: 500

        });

    };

});

// Perfil del usuario
router.get('/cuenta', async (req, res) => {

    const { token } = req.query;

    try {

        jwt.verify(token, secretKey, (error, decoded) => {

            const { data } = decoded;
            const { id, nombre, email, contrasena, anos_experiencia, especialidad, foto } = data;
            const datos = { id, nombre, email, contrasena, anos_experiencia, especialidad, foto };

            error ? (

                res.status(401).send({

                    error: '401 Unauthorized',
                    message: 'No se encuentra autorizado para ver esta página',
                    token_error: error.message

                })

            ) : (

                res.render('Datos',
                    {
                        layout: 'Datos',
                        datos: datos
                    })

            );

        });

    } catch (error) {

        res.status(500).send({
            error: `Ha ocurrido un error. ${error}`,
            code: 500
        });

    };

});

// Editar datos de la cuenta
router.put('/cuenta', async (req, res) => {

    const { id, nombre, password, confirmar, experiencia, especialidad } = req.body;

    try {

        const resultado = await updateSkater(id, nombre, password, experiencia, especialidad);
        res.status(201).send(resultado);

    } catch (error) {

        res.status(500).send({
            error: `Ha ocurrido un error. ${error}`,
            code: 500
        });

    };

});

// Eliminar cuenta
router.delete('/cuenta', async (req, res) => {

    const { id, foto } = req.query;

    try {

        await fs.unlink(`${__dirname}/../public/img/${foto}`);

        const respuesta = await deleteSkater(id);

        res.status(200).send(respuesta);

    } catch (error) {

        res.status(500).send({
            error: `Ha ocurrido un error. ${error}`,
            code: 500
        });

    };

});

module.exports = router;
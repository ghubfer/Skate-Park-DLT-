// Importaciones
const { Pool } = require('pg');

// Configuración del pool
const pool = new Pool({

    user: 'postgres',
    host: 'localhost',
    password: 'alguien1234',
    database: 'skatepark',
    port: 5432

});

const getSkaters = async () => {

    const respuesta = await pool.query('SELECT * FROM skaters ORDER BY id ASC');
    return respuesta.rows;

};

const getSkater = async (...data) => {

    const consulta = {

        text: 'SELECT * FROM skaters WHERE email = $1 AND contrasena = $2',
        values: data

    };

    const respuesta = await pool.query(consulta);
    return respuesta.rows[0];

};

const insertSkater = async (...data) => {

    try {

        const consulta = {

            text: 'INSERT INTO skaters(email, nombre, contrasena, anos_experiencia, especialidad, foto, estado) VALUES($1, $2, $3, $4, $5, $6, false) RETURNING *',
            values: data

        };

        const respuesta = await pool.query(consulta);
        return respuesta.rows[0];

    } catch (error) {

        console.log(error);
        console.log(`El error se encuentra en la tabla: ${error.table}.
        El detalle del error es: ${error.detail}.
        El código de error es: ${error.code}.
        Restricción violada: ${error.constraint}`);

    };

};

const updateEstado = async (...data) => {

    try {

        const consulta = {

            text: 'UPDATE skaters SET estado = $2 WHERE id = $1 RETURNING *',
            values: data

        };

        const respuesta = await pool.query(consulta);
        return respuesta.rows[0];

    } catch (error) {

        console.log(error);
        console.log(`El error se encuentra en la tabla: ${error.table}.
        El detalle del error es: ${error.detail}.
        El código de error es: ${error.code}.
        Restricción violada: ${error.constraint}`);

    };

};

const updateSkater = async (...data) => {

    console.log(data);

    try {

        const consulta = {

            text: 'UPDATE skaters SET nombre = $2, contrasena = $3, anos_experiencia = $4, especialidad = $5 WHERE id = $1 RETURNING *',
            values: data

        };

        const respuesta = await pool.query(consulta);
        return respuesta.rows[0];

    } catch {

        console.log(error);
        console.log(`El error se encuentra en la tabla: ${error.table}.
        El detalle del error es: ${error.detail}.
        El código de error es: ${error.code}.
        Restricción violada: ${error.constraint}`);

    };

};

const deleteSkater = async (...data) => {

    try {

        consulta = {

            text: 'DELETE FROM skaters WHERE id = $1 RETURNING *',
            values: data
    
        };
    
        const respuesta = await pool.query(consulta);
        return respuesta.rows[0];

    } catch (error) {

        console.log(error);
        console.log(`El error se encuentra en la tabla: ${error.table}.
        El detalle del error es: ${error.detail}.
        El código de error es: ${error.code}.
        Restricción violada: ${error.constraint}`);

    };

};

module.exports = { getSkaters, getSkater, insertSkater, updateEstado, updateSkater, deleteSkater };
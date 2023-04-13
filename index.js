const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
// Configurar la conexión a la base de datos
const pool = new Pool({
    user: 'postgres', // Usuario de la base de datos
    password: 'hmfdzpkjqx', // Contraseña de la base de datos
    host: 'localhost', // Host de la base de datos (puede ser una dirección IP o un dominio)
    port: 5432, // Puerto de la base de datos (por defecto es 5432 para PostgreSQL)
    database: 'Crud' // Nombre de la base de datos
  });

  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

// Método para obtener todos los usuarios
app.get('/usuarios', (req, res) => {
    const sql = 'SELECT * FROM usuarios';
    pool.query(sql, (err, result) => {
      if (err) {
        res.status(500).send('Error al obtener los usuarios');
      } else {
        res.json(result.rows);
      }
    });
  });
  
  // Método para obtener un usuario por su ID
  app.get('/usuarios/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM usuarios WHERE id = $1';
    pool.query(sql, [id], (err, result) => {
      if (err) {
        res.status(500).send('Error al obtener el usuario');
      } else {
        if (result.rows.length === 0) {
          res.status(404).send('Usuario no encontrado');
        } else {
          res.json(result.rows[0]);
        }
      }
    });
  });
  
  // Método para crear un nuevo usuario
  app.post('/usuarios', (req, res) => {
    const { nombre, edad, fechaNac, fechaIns, costo } = req.body;
    console.log(req)
    console.log("req")
    console.log(res)
    console.log("res")
    const sql = 'INSERT INTO usuarios (nombre, edad, "fechaNac", "fechaIns", costo) VALUES ($1, $2, $3, $4, $5)';
    pool.query(sql, [nombre, edad, fechaNac, fechaIns, costo], (err) => {
      if (err) {
        res.status(500).send('Error al crear el usuario');
      } else {
        res.send('Usuario creado exitosamente');
      }
    });
  });
  
  // Método para actualizar un usuario por su ID
  app.put('/usuarios/:id', (req, res) => {
    const id = req.params.id;
    const { nombre, edad, fechaNac, fechaIns, costo } = req.body;
    const sql = 'UPDATE usuarios SET nombre = $1, edad = $2, fechaNac = $3, fechaIns = $4, costo = $5 WHERE id = $6';
    pool.query(sql, [nombre, edad, fechaNac, fechaIns, costo, id], (err) => {
      if (err) {
        res.status(500).send('Error al actualizar el usuario');
      } else {
        res.send('Usuario actualizado exitosamente');
      }
    });
  });

// Método para eliminar un usuario por su ID
app.delete('/usuarios/:id', (req, res) => {
    const id = req.params.id; // Obtén el ID del usuario de los parámetros de la URL
    const sql = 'DELETE FROM usuarios WHERE id = $1 RETURNING *'; // Consulta SQL para eliminar un usuario y devolver el resultado
    pool.query(sql, [id], (err, result) => {
        if (err) {
            console.error(`Error al eliminar usuario con ID ${id}:`, err);
            res.status(500).json({ mensaje: `Error al eliminar usuario con ID ${id}` });
        } else {
            if (result.rows.length > 0) {
                res.json(result.rows[0]); // Devuelve el usuario eliminado en formato JSON
            } else {
                res.status(404).json({ mensaje: `Usuario con ID ${id} no encontrado` });
            }
        }
    });
});
    // Inicia el servidor en el puerto 3000
    app.listen(3000, () => {
      console.log('Servidor iniciado en el puerto 3000');
    });

module.exports = pool;
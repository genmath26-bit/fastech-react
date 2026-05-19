require('dotenv').config(); // Carga las variables del archivo .env
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

//conexion usando variables de entorno
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Ruta para obtener productos 
app.get('/productos', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Ruta para REGISTRAR nuevos usuarios (Con Encriptación y Roles)
app.post('/register', async (req, res) => {
  const { usuario, contrasena, rol } = req.body;

  // 1. Validaciones básicas
  if (!usuario || !contrasena) {
    return res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
  }

  try {
    // 2. Encriptar la contraseña (el número 10 es el nivel de seguridad/complejidad)
    const salt = await bcrypt.genSalt(10);
    const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);

    // 3. Definir el rol (Si no mandan rol, por defecto será 'cliente')
    const rolAsignado = rol || 'cliente';

    // 4. Insertar en la base de datos MySQL
    db.query(
      'INSERT INTO usuarios (usuario, contrasena, rol) VALUES (?, ?, ?)',
      [usuario, contrasenaEncriptada, rolAsignado],
      (err, result) => {
        if (err) {
          // Si el usuario ya existe (por el UNIQUE que pusimos en MySQL)
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "El nombre de usuario ya está en uso" });
          }
          return res.status(500).send(err);
        }
        
        // Responder con éxito (¡Nunca devuelvas la contraseña en la respuesta!)
        res.json({ message: "Usuario registrado con éxito", usuario, rol: rolAsignado });
      }
    );

  } catch (error) {
    res.status(500).json({ error: "Error en el servidor al procesar el registro" });
  }
});

// Ruta para INICIAR SESIÓN 
app.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;

  // 1. Validar que vengan los datos
  if (!usuario || !contrasena) {
    return res.status(400).json({ error: "Usuario y contraseña requeridos" });
  }

  // 2. Buscar el usuario en la base de datos
  db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], async (err, results) => {
    if (err) return res.status(500).send(err);
    
    // Si no encontró al usuario
    if (results.length === 0) {
      return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
    }

    const usuarioDb = results[0];

    // 3. Comparar la contraseña escrita con la encriptada en MySQL
    const contrasenaValida = await bcrypt.compare(contrasena, usuarioDb.contrasena);
    
    if (!contrasenaValida) {
      return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
    }

    // Guardamos los datos públicos del usuario dentro del token
    const datosPayload = {
      id: usuarioDb.id,
      usuario: usuarioDb.usuario,
      rol: usuarioDb.rol
    };

    // Firmamos el token usando nuestra palabra secreta del .env y hacemos que expire en 2 horas
    const token = jwt.sign(datosPayload, process.env.JWT_SECRET, { expiresIn: '2h' });

    // 5. Devolvemos el token a React (¡Brazalete entregado!)
    res.json({
      message: "Login exitoso",
      token: token
    });
  });
});

// FUNCION FILTRO MIDDLEWARE: Verifica que el usuario tenga un token válido
const verificarToken = (req, res, next) => {
  // 1. Buscar el token en las cabeceras (headers) de la petición
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Si no hay token, denegar el acceso de inmediato
  if (!token) {
    return res.status(401).json({ error: "Acceso denegado. No tienes un token de sesión." });
  }

  try {
    // 2. Verificar si el token es real usando la clave secreta
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    
    // Guardamos los datos del usuario dentro de la petición para que las rutas la usen
    req.usuario = verificado; 
    
    next(); // 👈 ¡Todo en orden! Pasa a la siguiente función (tu ruta de MySQL)
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado." });
  }
};

// Ruta para agregar un producto 
app.post('/productos', verificarToken, (req, res) => {
  //validacion al agregar productos.
  const { nombre, precio, stock } = req.body;

  // Validación básica
  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }
  if (parseFloat(precio) <= 1) {
    return res.status(400).json({ error: "El precio debe ser mayor a 0" });
  }
  if (parseInt(stock) < 1) {
    return res.status(400).json({ error: "El stock no puede ser negativo" });
  }
  
  db.query(
    'INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
    [nombre, precio, stock],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

// Ruta para BORRAR un producto por su ID
app.delete('/productos/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM productos WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.log("Error en MySQL:", err); 
      return res.status(500).send(err);
    }
    res.json({ message: "Producto eliminado con éxito" });
  });
});

// Ruta para EDITAR/ACTUALIZAR un producto por su ID
app.put('/productos/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock } = req.body;

  // Validaciones del Nivel 1 (por seguridad)
  if (!nombre || nombre.trim() === "") return res.status(400).json({ error: "Nombre obligatorio" });
  if (parseFloat(precio) <= 0) return res.status(400).json({ error: "Precio debe ser mayor a 0" });
  if (parseInt(stock) < 0) return res.status(400).json({ error: "Stock no puede ser negativo" });

  db.query(
    'UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?',
    [nombre, precio, stock, id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Producto actualizado con éxito" });
    }
  );
});

//inicio de servidor usando el puerto del .env o el 5000 por defecto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

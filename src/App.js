// import React, { useState, useEffect } from 'react';

// export default function App() {
//   const [productos, setProductos] = useState([]);
//   const [nombre, setNombre] = useState('');
//   const [precio, setPrecio] = useState('');
//   const [stock, setStock] = useState('');
//   const [editandoId, setEditandoId] = useState(null);
//   const [usuario, setUsuario] = useState('');
//   const [contrasena, setContrasena] = useState('');
//   const [error, setError] = useState('');
//   const [token, setToken] = useState(localStorage.getItem('token') || null);
//   // estado "cargando" para animacion del fetch
//   const [cargando, setCargando] = useState(true);

//   // Manejo de Login.
//   const manejarLogin = async (e) => {
//   e.preventDefault();
//   setError('');

//   try {
//     // const respuesta = await fetch('http://localhost:5000/login', {
//     const respuesta = await fetch('https://undusted-reroute-unrivaled.ngrok-free.dev/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ usuario, contrasena })
//     });

//     const datos = await respuesta.json();

//     if (!respuesta.ok) {
//       throw new Error(datos.error || 'Error al iniciar sesión');
//     }

//     // Si todo sale bien, guardamos el token
//     localStorage.setItem('token', datos.token);
//     setToken(datos.token);
    
//     // Opcional: limpiar los campos de texto
//     setUsuario('');
//     setContrasena('');
//   } catch (err) {
//     setError(err.message);
//   }
// };

// const manejarLogout = () => {
//   localStorage.removeItem('token'); // Borra el token de la memoria del navegador
//   setToken(null);                   // Regresa el estado a null para que React vuelva a mostrar el Login
// };

//   // LEER datos de la DB real 
//   useEffect(() => {
//     setCargando(true);

//     // fetch('http://localhost:5000/productos')
//     fetch('https://undusted-reroute-unrivaled.ngrok-free.dev/productos')
//       .then(res => res.json())
//       .then(data => {
//         setProductos(data);
//         setCargando(false);
//       })
//       .catch(err => {
//         console.error(err);
//         setCargando(false);
//       });
//   }, []);

//   // GUARDAR en la DB real 
//   const agregarProducto = async (e) => {
//     e.preventDefault();

//     const datosProducto = {
//       nombre,
//       precio: parseFloat(precio),
//       stock: parseInt(stock)
//     };

//     //Si editandoId tiene un número de ID
//     if (editandoId) {
//       // Petición PUT usando el ID que guardamos al dar clic en editar
//       // const res = await fetch(`http://localhost:5000/productos/${editandoId}`, {
//       const res = await fetch(`https://undusted-reroute-unrivaled.ngrok-free.dev/productos/${editandoId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json',
//            'Authorization': `Bearer ${token}`
//          },
//         body: JSON.stringify(datosProducto)
//       });

//       if (res.ok) {
//         // reemplazando el viejo producto por el nuevo mapeado.
//         setProductos(productos.map(p => p.id === editandoId ? { ...p, ...datosProducto } : p));

//         // Muy importante: Limpiamos el estado de edición regresándolo a null
//         setEditandoId(null);
//       }
//     } else {
//       // CREAR NUEVO (Tu código original del POST)
//       // const res = await fetch('http://localhost:5000/productos', {
//       const res = await fetch('https://undusted-reroute-unrivaled.ngrok-free.dev/productos', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//          },
//         body: JSON.stringify(datosProducto)
//       });

//       const productoGuardado = await res.json();
//       setProductos([...productos, productoGuardado]);
//     }

//     setNombre('');
//     setPrecio('');
//     setStock('');
//   };

//   // Función para eliminar un producto por su ID
//   const eliminarProducto = async (id) => {
//     if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
//       // Hacemos la petición DELETE al servidor pasando el ID en la URL
//       // const res = await fetch(`http://localhost:5000/productos/${id}`, {
//       const res = await fetch(`https://undusted-reroute-unrivaled.ngrok-free.dev/productos/${id}`, {
//         method: 'DELETE',
//         headers: {
//          'Authorization': `Bearer ${token}`
//         }
//       });

//       if (res.ok) {
//         // actualiza el estado de React para quitar el producto visualmente de inmediato
//         setProductos(productos.filter(p => p.id !== id));
//       } else {
//         alert("Hubo un error al intentar eliminar el producto.");
//       }
//     }
//   };

//   //Funcion para editar productos en la DB
//   const prepararEditar = (producto) => {
//     setEditandoId(producto.id);      // Guardamos el ID para saber cuál vamos a actualizar
//     setNombre(producto.nombre);      // Ponemos el nombre en el input
//     setPrecio(producto.precio);      // Ponemos el precio en el input
//     setStock(producto.stock);        // Ponemos el stock en el input
//   };
  
//   // Si NO hay token guardado, bloqueamos la pantalla con el formulario de Login
// if (!token) {
//   return (
//     <div className="login-container" style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
//       <h2>Fastech - Control de Inventario</h2>
//       <form onSubmit={manejarLogin}>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ display: 'block', marginBottom: '5px' }}>Usuario:</label>
//           <input 
//             type="text" 
//             value={usuario} 
//             onChange={(e) => setUsuario(e.target.value)} 
//             style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
//             required 
//           />
//         </div>
//         <div style={{ marginBottom: '15px' }}>
//           <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
//           <input 
//             type="password" 
//             value={contrasena} 
//             onChange={(e) => setContrasena(e.target.value)} 
//             style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
//             required 
//           />
//         </div>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
//           Ingresar al Panel
//         </button>
//       </form>
//     </div>
//   );
// }

//   return (
//     <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
//       <h1>Inventario Real (MySQL)</h1>

//       <form onSubmit={agregarProducto} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
//         <input
//           placeholder="Nombre"
//           value={nombre}
//           onChange={e => setNombre(e.target.value)}
//           required
//         />
//         <input
//           placeholder="Precio"
//           type="number"
//           value={precio}
//           onChange={e => setPrecio(e.target.value)}
//           required
//         />
//         <input
//           placeholder="Stock"
//           type="number"
//           value={stock}
//           onChange={e => setStock(e.target.value)}
//           required
//         />
//         <button
//           type="submit"
//           style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}
//         >
//           Guardar en MySQL
//         </button>
//       </form>

//       {cargando ? (
//         /* Lo que se ve mientras carga */
//         <h3 style={{ textAlign: 'center', color: '#007bff' }}>Cargando productos desde MySQL...</h3>
//       ) : (
//         <>
//           <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr>
//                 <th>Producto</th>
//                 <th>Precio</th>
//                 <th>Stock</th>
//                 <th>Acciones</th>
//               </tr>
//             </thead>
//             <tbody>
//               {productos.map(p => (
//                 <tr key={p.id}>
//                   <td>{p.nombre}</td>
//                   <td>${Number(p.precio).toFixed(2)}</td>
//                   <td>{p.stock} unidades</td>
//                   <td>
//                     <button
//                       onClick={() => prepararEditar(p)}
//                       style={{ background: '#007bff', color: 'white', border: 'none', padding: '5px 10px', marginRight: '5px', cursor: 'pointer', borderRadius: '3px' }}
//                     >
//                       Editar
//                     </button>
//                     <button
//                       onClick={() => eliminarProducto(p.id)}
//                       style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '3px' }}
//                     >
//                       Borrar
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Botón de Cerrar Sesión */}
//           <div style={{ marginTop: '20px' }}>
//             <button 
//               onClick={manejarLogout} 
//               style={{ width: '100%', padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
//             >
//               Cerrar Sesión
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';

export default function App() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  // estado "cargando" para animacion del fetch
  const [cargando, setCargando] = useState(true);

  // Manejo de Login.
  const manejarLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const respuesta = await fetch('https://undusted-reroute-unrivaled.ngrok-free.dev/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' // 👈 Evita la alerta de ngrok
        },
        body: JSON.stringify({ usuario, contrasena })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || 'Error al iniciar sesión');
      }

      // Si todo sale bien, guardamos el token
      localStorage.setItem('token', datos.token);
      setToken(datos.token);
      
      // Opcional: limpiar los campos de texto
      setUsuario('');
      setContrasena('');
    } catch (err) {
      setError(err.message);
    }
  };

  const manejarLogout = () => {
    localStorage.removeItem('token'); // Borra el token de la memoria del navegador
    setToken(null);                   // Regresa el estado a null para que React vuelva a mostrar el Login
  };

  // LEER datos de la DB real (Agregamos [token] en las dependencias para que recargue al loguearse)
  useEffect(() => {
    setCargando(true);

    fetch('https://undusted-reroute-unrivaled.ngrok-free.dev/productos', {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true' // 👈 Evita la alerta de ngrok para traer el JSON limpio
      }
    })
      .then(res => res.json())
      .then(data => {
        setProductos(data);
        setCargando(false);
      })
      .catch(err => {
        console.error(err);
        setCargando(false);
      });
  }, [token]); // 👈 Escucha cuando el token cambie para refrescar la tabla al instante

  // GUARDAR en la DB real 
  const agregarProducto = async (e) => {
    e.preventDefault();

    const datosProducto = {
      nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock)
    };

    //Si editandoId tiene un número de ID
    if (editandoId) {
      // Petición PUT usando el ID que guardamos al dar clic en editar
      const res = await fetch(`https://undusted-reroute-unrivaled.ngrok-free.dev/productos/${editandoId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
         },
        body: JSON.stringify(datosProducto)
      });

      if (res.ok) {
        // reemplazando el viejo producto por el nuevo mapeado.
        setProductos(productos.map(p => p.id === editandoId ? { ...p, ...datosProducto } : p));

        // Muy importante: Limpiamos el estado de edición regresándolo a null
        setEditandoId(null);
      }
    } else {
      // CREAR NUEVO
      const res = await fetch('https://undusted-reroute-unrivaled.ngrok-free.dev/productos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
         },
        body: JSON.stringify(datosProducto)
      });

      const productoGuardado = await res.json();
      setProductos([...productos, productoGuardado]);
    }

    setNombre('');
    setPrecio('');
    setStock('');
  };

  // Función para eliminar un producto por su ID
  const eliminarProducto = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
      // Hacemos la petición DELETE al servidor pasando el ID en la URL
      const res = await fetch(`https://undusted-reroute-unrivaled.ngrok-free.dev/productos/${id}`, {
        method: 'DELETE',
        headers: {
         'Authorization': `Bearer ${token}`,
         'ngrok-skip-browser-warning': 'true'
        }
      });

      if (res.ok) {
        // actualiza el estado de React para quitar el producto visualmente de inmediato
        setProductos(productos.filter(p => p.id !== id));
      } else {
        alert("Hubo un error al intentar eliminar el producto.");
      }
    }
  };

  //Funcion para editar productos en la DB
  const prepararEditar = (producto) => {
    setEditandoId(producto.id);      // Guardamos el ID para saber cuál vamos a actualizar
    setNombre(producto.nombre);      // Ponemos el nombre en el input
    setPrecio(producto.precio);      // Ponemos el precio en el input
    setStock(producto.stock);        // Ponemos el stock en el input
  };
  
  // Si NO hay token guardado, bloqueamos la pantalla con el formulario de Login
  if (!token) {
    return (
      <div className="login-container" style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Fastech - Control de Inventario</h2>
        <form onSubmit={manejarLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Usuario:</label>
            <input 
              type="text" 
              value={usuario} 
              onChange={(e) => setUsuario(e.target.value)} 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              required 
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
            <input 
              type="password" 
              value={contrasena} 
              onChange={(e) => setContrasena(e.target.value)} 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              required 
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Ingresar al Panel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h1>Inventario Real (MySQL)</h1>

      <form onSubmit={agregarProducto} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          required
        />
        <input
          placeholder="Precio"
          type="number"
          value={precio}
          onChange={e => setPrecio(e.target.value)}
          required
        />
        <input
          placeholder="Stock"
          type="number"
          value={stock}
          onChange={e => setStock(e.target.value)}
          required
        />
        <button
          type="submit"
          style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}
        >
          Guardar en MySQL
        </button>
      </form>

      {cargando ? (
        <h3 style={{ textAlign: 'center', color: '#007bff' }}>Cargando productos desde MySQL...</h3>
      ) : (
        <>
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>${Number(p.precio).toFixed(2)}</td>
                  <td>{p.stock} unidades</td>
                  <td>
                    <button
                      onClick={() => prepararEditar(p)}
                      style={{ background: '#007bff', color: 'white', border: 'none', padding: '5px 10px', marginRight: '5px', cursor: 'pointer', borderRadius: '3px' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarProducto(p.id)}
                      style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '3px' }}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={manejarLogout} 
              style={{ width: '100%', padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cerrar Sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
}
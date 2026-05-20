# Fastech - Sistema de Control de Inventario 

Fastech es una aplicación web full-stack diseñada para la gestión y control automatizado de inventarios en tiempo real. El proyecto implementa una arquitectura desacoplada utilizando un backend robusto en **Node.js/Express** conectado a una base de datos **MySQL/MariaDB**, y una interfaz de usuario dinámica e interactiva construida en **React.js**.

La plataforma prioriza la seguridad y el rendimiento mediante el uso de mecanismos avanzados de autenticación criptográfica y control de acceso por tokens.

---

## Demostración Visual

### Panel de Autenticación (Login)
<img width="620" height="496" alt="imagen" src="https://github.com/user-attachments/assets/c295ab25-1858-426a-9170-463fc3188fa2" />

### Panel de Control de Inventario (CRUD)
<img width="620" height="496" alt="imagen" src="https://github.com/user-attachments/assets/9db4a180-0bcc-440e-8c78-89f8ef74a8fc" />

---

## Arquitectura y Tecnologías

### Frontend (Cliente)
* **React.js (Single Page Application):** Gestión del árbol de componentes, ciclo de vida y renderizado condicional.
* **Hooks Avanzados (`useState`, `useEffect`):** Control del estado global del inventario, manejo de formularios y persistencia de sesión.
* **Fetch API:** Consumo asíncrono de endpoints RESTful con inyección dinámica de cabeceras HTTP de autorización.

### Backend (Servidor)
* **Node.js & Express:** Entorno de ejecución y framework para la construcción de la API REST de alto rendimiento.
* **MySQL / MariaDB:** Sistema de gestión de base de datos relacional para la persistencia del inventario y registros de usuario.
* **CORS (Cross-Origin Resource Sharing):** Configuración de políticas de seguridad para la comunicación selectiva entre dominios.

---

## Características del Sistema de Seguridad

El núcleo de seguridad de Fastech mitiga las vulnerabilidades estándar de la web mediante tres capas técnicas:

1.  **Protección de Credenciales en Reposo (Bcryptjs):** Las contraseñas se procesan mediante un algoritmo de hashing asimétrico unidireccional basado en *Blowfish* con un factor de costo (*salt*) de 10. Las credenciales nunca se almacenan en texto plano en la base de datos.
2.  **Autenticación sin Estado (JSON Web Tokens):** Tras el inicio de sesión, el servidor expide un token criptográfico firmado con el algoritmo `HS256`. Este token transporta la identidad cifrada del usuario y expira estrictamente en 2 horas.
3.  **Middleware Perimetral de Autorización:** Las rutas críticas del inventario (`POST`, `PUT`, `DELETE`) están blindadas por un interceptor secuencial en Express que valida la integridad y vigencia de la firma del token antes de permitir operaciones en la base de datos, respondiendo con estados `HTTP 401 Unauthorized` si detecta anomalías.

---

## Instalación y Configuración Local

Sigue estos pasos para clonar el repositorio y ejecutar el entorno de desarrollo local:

### Prerrequisitos
* Node.js (v16 o superior)
* Servidor MySQL / MariaDB activo

### 1. Clonar el repositorio e instalar dependencias
```bash
git clone [https://github.com/genmath26-bit/fastech-react.git](git@github.com:genmath26-bit/fastech-react.git)
cd fastech-react
npm install

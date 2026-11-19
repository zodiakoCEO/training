
Training es una aplicación web full-stack diseñada para gestionar usuarios y conocimiento de entrenamiento. Utiliza una arquitectura separada entre frontend y backend:

Frontend: desarrollado con React 19 y Vite. Incluye una pantalla de bienvenida y un panel principal para consultar la información disponible.
Backend: API REST creada con Node.js y Express que gestiona usuarios y registros de conocimiento.
Base de datos: MySQL, administrada mediante mysql2.
Seguridad: las contraseñas se cifran con bcrypt antes de almacenarse.
Comunicación: CORS permite integrar el frontend desplegado con el backend. El frontend consume la API mediante una URL configurable.
Funcionalidades principales
Registro de usuarios mediante validación de nombre, correo y contraseña.
Inicio de sesión con verificación de credenciales.
Gestión de información almacenada en MySQL.
API organizada mediante rutas y controladores.
Interfaz desarrollada con React y componentes reutilizables.
Despliegue compatible con Vite y Vercel.
Alertas y mensajes interactivos mediante SweetAlert2.
Tecnologías
Área	Tecnologías
Frontend	React, JavaScript, CSS, Vite, HTML
Backend	Node.js, Express
Base de datos	MySQL
Seguridad	bcrypt, CORS
Desarrollo	ESLint/Oxlint, npm, dotenv
El proyecto está disponible en: https://training-orcin-alpha.vercel.app

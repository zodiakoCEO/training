# API del backend

## Configuración

Inicia el servidor con `npm start`; el puerto predeterminado es `3001`. Copia
`.env.example` a `.env` para desarrollo y define las variables requeridas. En
producción configura `HOST_DB`, `NAME_DB`, `PORT_DB`, `USER_DB`, `PASSWORD_DB`,
`JWT_SECRET`, `ADMIN_EMAILS` y `FRONTEND_ORIGIN` como variables privadas del
proveedor. `JWT_SECRET` debe tener al menos 32 bytes aleatorios. `ADMIN_EMAILS`
es una lista separada por comas; el servidor no inicia en producción sin al
menos un correo administrador válido. No guardes `.env` en Git.

La tabla `usuarios` debe tener `id`, `name`, `gmail` y `password`. La columna
`usuarios.gmail` debe tener un índice `UNIQUE` para evitar duplicados incluso
ante solicitudes concurrentes. Normaliza los correos existentes a minúsculas
antes de agregar ese índice.

## Crear un usuario

La creación de usuarios requiere un token de administrador. Envía un `POST` a
`http://localhost:3001/api/users` con `Content-Type: application/json` y
`Authorization: Bearer <token>`:

```json
{
  "name": "Duvan Ochoa",
  "gmail": "duvan@gmail.com",
  "password": "una-contrasena-segura"
}
```

Los tres campos son obligatorios; los datos inválidos responden `400` y un
correo existente responde `409`. Las contraseñas se guardan con bcrypt (10 salt
rounds), deben caber en 72 bytes UTF-8 y nunca se incluyen en las respuestas.
Los correos se normalizan a minúsculas.

## Iniciar sesión y permisos

Envía el correo y la contraseña en JSON mediante
`POST http://localhost:3001/api/users/login`:

```json
{
  "gmail": "duvan@gmail.com",
  "password": "una-contrasena-segura"
}
```

La respuesta contiene los datos públicos del usuario y un token Bearer que
vence en 15 minutos. El rol `admin` se asigna únicamente a correos incluidos en
`ADMIN_EMAILS`; los demás usuarios reciben el rol `user`. El rol se firma en el
token y no se acepta desde el cuerpo de una solicitud.

Todos los endpoints de usuarios, salvo login, requieren un administrador. La
lectura de la base de conocimiento requiere inicio de sesión; crear, actualizar
o borrar artículos requiere un administrador. El frontend no guarda el token
en `localStorage`.

Configura `FRONTEND_ORIGIN` con los dominios permitidos separados por comas. En
producción debe incluir al menos un origen HTTPS sin rutas. En desarrollo, por
defecto permite `http://localhost:5173`. Para apuntar el frontend a otro
backend, define `VITE_API_URL` con una URL que termine en `/api` (por ejemplo,
`https://api.ejemplo.com/api`).

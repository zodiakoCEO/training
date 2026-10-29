# API de usuarios

## Crear un usuario

Inicia el backend con `npm start` y envia una solicitud `POST` a
`http://localhost:3001/api/users` con `Content-Type: application/json`:

```json
{
  "name": "Duvan Ochoa",
  "gmail": "duvan@gmail.com",
  "password": "una-contrasena-segura"
}
```

El servidor responde con estado `201` y los datos publicos del usuario creado.
La contrasena se guarda con hash y nunca se incluye en la respuesta ni en las
consultas de usuarios.

Los tres campos son obligatorios. Si falta alguno o tiene un formato invalido,
la API responde con `400`. Asegurate tambien de configurar las variables de
conexion a MySQL (`HOST_DB`, `NAME_DB`, `PORT_DB`, `USER_DB` y `PASSWORD_DB`)
en el archivo `.env` del backend. La tabla `usuarios` debe tener las columnas
`id`, `name`, `gmail` y `password`.

Los `INSERT` que solo incluyen `name`, como `INSERT INTO usuarios (name) ...`,
no usan este endpoint y dejan `gmail` y `password` en `NULL` si esas columnas
permiten valores nulos. Para crear usuarios con los tres campos completos,
usa este POST; los registros antiguos con valores nulos no se modifican.

## Iniciar sesion desde el frontend

El frontend envia un `POST` a `http://localhost:3001/api/users/login` (en
desarrollo, Vite redirige `/api` al backend). Envia el correo y la contrasena
como JSON:

```json
{
  "gmail": "duvan@gmail.com",
  "password": "una-contrasena-segura"
}
```

La API compara la contrasena con el hash guardado y responde con los datos
publicos del usuario. Usa `FRONTEND_ORIGIN` para configurar el origen permitido
por CORS; acepta varios origenes separados por comas. Por defecto permite
`http://localhost:5173`.

Para apuntar el frontend a otro backend, define `VITE_API_URL` con la URL base
que termina en `/api` (por ejemplo, `https://api.ejemplo.com/api`).

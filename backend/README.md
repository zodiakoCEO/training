# API de usuarios

## Crear un usuario

Inicia el backend con `npm start` y envia una solicitud `POST` a
`http://localhost:3000/api/users` con `Content-Type: application/json`:

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

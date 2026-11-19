# React + Vite

## Project structure

The UI follows Atomic Design. Keep dependencies flowing from smaller building
blocks to larger compositions:

```text
src/
  App.jsx
  main.jsx
  assets/
  components/
    atoms/                 Basic reusable controls and visual primitives
    molecules/             Small groups of atoms, such as headers and previews
    organisms/
      project-bar/         Project cards, grid, and project create/edit modal
    templates/             Page-level layout compositions
  pages/                   Screens and page-specific flows
  types/                   Shared domain types
  styles.css               Global and component styles
```

Atoms should not depend on molecules, organisms, templates, or pages. Molecules
may compose atoms; organisms may compose atoms and molecules; templates and
pages compose the layers below them. Keep project-specific collections together
under a named organism folder such as `organisms/project-bar`.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## Gráficas del panel

El análisis de tickets usa Recharts para comparar el ticket seleccionado con el
promedio de los tickets de la sesión, en tiempo de creación o porcentaje de
campos obligatorios completados. El componente se carga de forma diferida para
mantener la gráfica fuera del paquete inicial de la aplicación.

## Conexion con el backend

Inicia el backend en `http://localhost:3001` y el frontend con `npm run dev`.
Vite redirige las solicitudes `/api` al backend, y el formulario de inicio de
sesion valida las credenciales en `POST /api/users/login`. Si el backend esta en
otra direccion, configura `VITE_API_URL` con la URL base de su API terminada en
`/api` y permite el origen del frontend con `FRONTEND_ORIGIN` en el backend.

## Modo de demostración en Vercel

Mientras el backend y MySQL no estén desplegados, el frontend activa el modo
de demostración en producción mediante `.env.production`. Vercel debe desplegar
la carpeta `frontend` para que Vite cargue esa configuración. La cuenta de
prueba funciona incluso si `VITE_DEMO_LOGIN=false` está configurada en Vercel;
el formulario acepta:

- Correo: `testing@gmail.com`
- Contraseña: `testing123`

Al iniciar sesión con esta cuenta, el frontend no llama al backend. La sesión y
sus cambios son solo de demostración, se mantienen en memoria y no se guardan.
`VITE_DEMO_LOGIN=false` desactiva el modo demo para otras cuentas, pero no la
cuenta de prueba. Estas credenciales se incluyen en el JavaScript público del
frontend y no deben usarse para proteger datos ni para una cuenta real.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

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

## Conexion con el backend

Inicia el backend en `http://localhost:3001` y el frontend con `npm run dev`.
Vite redirige las solicitudes `/api` al backend, y el formulario de inicio de
sesion valida las credenciales en `POST /api/users/login`. Si el backend esta en
otra direccion, configura `VITE_API_URL` con la URL base de su API terminada en
`/api` y permite el origen del frontend con `FRONTEND_ORIGIN` en el backend.

## Modo de demostración en Vercel

Mientras el backend y MySQL no estén desplegados, puedes habilitar el acceso de
demostración definiendo `VITE_DEMO_LOGIN=true` en las variables de entorno del
proyecto de Vercel y volviendo a desplegar. El formulario aceptará:

- Correo: `testing@gmail.com`
- Contraseña: `testing123`

Con esta opción activa, el frontend no llama al backend para iniciar sesión. La
sesión y sus cambios son solo de demostración, se mantienen en memoria y no se
guardan. Desactiva o elimina `VITE_DEMO_LOGIN` al configurar la autenticación
real. Estas credenciales se incluyen en el JavaScript público del frontend y no
deben usarse para proteger datos ni para una cuenta real.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

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

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

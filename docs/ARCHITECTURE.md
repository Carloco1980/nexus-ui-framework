# Arquitectura

**Proyecto:** Nexus UI Framework
**Versión:** 1.0.0

## Estructura oficial

```text
components/             Componentes organizados por carpeta
sections/               Secciones de página organizadas por carpeta
assets/css/             Base, layout, páginas, temas, utilidades y hojas de entrada
assets/js/core/         Configuración, eventos, temas, almacenamiento y animaciones
assets/js/app.js        Bootstrap global
dist/                   Hojas CSS compiladas
docs/                   Documentación del framework
examples/               Páginas de ejemplo
```

Los estilos propios de cada componente viven junto al componente dentro de `components/<componente>/`. Los estilos de sección viven junto a la sección dentro de `sections/<seccion>/`. No se utilizan `assets/css/components/`, `assets/css/sections/` ni `assets/js/components/`.

## CSS

`assets/css/style.css` es la hoja de entrada completa y `assets/css/style-components.css` es la entrada de estilos reutilizables. Ambas importan archivos existentes desde `assets/css/`, `components/` y `sections/`, usando rutas relativas al archivo de entrada.

```text
assets/css/
  base/       Tokens, resets, tipografía y animaciones
  layout/     Contenedores y grillas
  pages/      Estilos de páginas de ejemplo y documentación
  themes/     Temas claro y oscuro
  utilities/  Clases auxiliares
  style.css
  style-components.css

components/<nombre>/<nombre>.css
sections/<nombre>/<nombre>.css
```

## JavaScript

Los servicios compartidos están en `assets/js/core/`; el bootstrap vive en `assets/js/app.js`. Cada módulo de componente está junto a su componente en `components/<nombre>/`.

```text
assets/js/
  app.js
  core/
    config.js
    events.js
    theme.js
    storage.js
    animations.js

components/
  catalog/catalog.js
  fab/fab.js
  form/form.js
  icon/icon.js
  modal/modal.js
  navbar/navbar.js
  theme-toogle/theme-toggle.js
```

Las páginas cargan los módulos que utilizan desde sus rutas actuales. El namespace público es `window.NX`.

## Componentes y secciones

Cada carpeta de componente contiene su `README.md`. HTML, CSS y JavaScript se mantienen junto al componente cuando corresponden; el registry declara `preview` para las vistas previas disponibles. El registro se encuentra en `components/registry/`. Las secciones de página se organizan en carpetas bajo `sections/`, por ejemplo `sections/hero/hero.css` y `sections/design-system/design-system.css`.

## Build

Los comandos de `package.json` procesan `assets/css/style.css` y `assets/css/style-components.css` con la configuración de `config/` y generan las hojas compiladas en `dist/`.

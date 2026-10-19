# Release 1.0.0

## Estado

Nexus UI Framework 1.0.0 es la primera versión **Stable**. El namespace público del framework es `window.NX`. El estado de cada componente se mantiene por separado en [`components/registry/components.json`](components/registry/components.json); la entrada Catalog está marcada como Experimental.

## Requisitos

- Node.js 24 o superior
- npm 11 o superior

## Instalación y build

```bash
npm ci
npm run build
```

El build utiliza la configuración PostCSS de `config/` y genera:

- `dist/nexus-ui.css`
- `dist/nexus-ui-components.css`

`npm run watch` observa la hoja completa y reconstruye `dist/nexus-ui.css`.

## Contenido de la versión

- Fuentes CSS modulares, design tokens compartidos y temas claro y oscuro.
- Bootstrap JavaScript vanilla y módulos del Core.
- Componentes y secciones de página disponibles en el repositorio; la página Showcase está en `showcase.html`.
- Metadatos de componentes y rutas de previews/documentación en el registry.

El registry es la fuente de verdad para la disponibilidad y el estado de cada componente. Esta página describe la versión del framework y no cambia las entradas Experimental a Stable.

## Verificación antes de publicar

- Confirmar que la versión y las notas describan el contenido que se publicará.
- Ejecutar `npm ci` y `npm run build` desde un checkout limpio.
- Revisar los archivos de distribución generados y confirmar que la etiqueta de release apunte al commit aprobado.
- Incluir el archivo `LICENSE` al publicar bajo MIT.

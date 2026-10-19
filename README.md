# Nexus UI Framework

Framework de interfaz modular construido con HTML, CSS y JavaScript vanilla. La versión 1.0.0 del framework es **Stable**. El estado de cada entrada del catálogo se indica por separado en el registry; `catalog` figura como Experimental.

## Componentes y secciones

Las entradas Stable del catálogo incluyen Badge, Button, Card, Chart Card, Dashboard, FAB, Feature Card, Form, Icon, KPI, Modal, Navbar, Panel, Section Header y Theme Toggle. Hero está disponible como sección. Catalog también existe y figura como Experimental. Los estados y rutas de preview y documentación están en [`components/registry/components.json`](components/registry/components.json), y cada componente tiene su README local.

## Requisitos

- Node.js 24 o superior
- npm 11 o superior

## Instalación y build

Desde la raíz del repositorio:

```bash
npm ci
npm run build
```

El build genera `dist/nexus-ui.css` y `dist/nexus-ui-components.css`. `npm run watch` observa la hoja completa y reconstruye `dist/nexus-ui.css`.

## Arquitectura y estructura

- `assets/css/`: tokens, temas, estilos base, layout y hojas de entrada.
- `assets/js/app.js` y `assets/js/core/`: bootstrap y servicios compartidos.
- `components/`: componentes con sus recursos y documentación local.
- `components/registry/`: metadatos del catálogo y rutas de previews.
- `sections/`: secciones de página reutilizables, incluido Hero.
- `dist/`: hojas CSS compiladas.
- `docs/`, `examples/` y `templates/`: documentación y material de ejemplo.

El framework expone el namespace `window.NX`. Los módulos JavaScript de componentes viven junto a sus componentes; los servicios compartidos están en el Core.

## Documentación de release

- [Release 1.0.0](RELEASE.md)
- [Changelog](CHANGELOG.md)
- [Roadmap](ROADMAP.md)
- [Contribuciones](CONTRIBUTING.md)
- [Código de conducta](CODE_OF_CONDUCT.md)
- [Seguridad](SECURITY.md)
- [Arquitectura](docs/ARCHITECTURE.md)
- [Componentes](docs/COMPONENTS.md)

## Licencia

MIT. Consulta [LICENSE](LICENSE).

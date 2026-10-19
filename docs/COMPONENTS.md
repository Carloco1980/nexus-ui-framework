# Componentes

El catálogo y sus rutas de preview y documentación se mantienen en [`components/registry/components.json`](../components/registry/components.json). Cada carpeta de componente incluye un `README.md` con su uso y opciones.

## Componentes registrados

| Categoría | Componentes |
| --- | --- |
| Acciones | Badge, Button, FAB, Theme Toggle |
| Datos | Chart Card, Icon, KPI, Table |
| Formularios | Form |
| Feedback | Modal |
| Layout | Card, Catalog, Dashboard, Feature Card, Hero, Panel, Section Header |
| Navegación | Navbar |

Hero se implementa como sección en `sections/hero/`. El resto de componentes reside en `components/`.

## Integración

1. Incluye la hoja compilada adecuada desde `dist/` o importa los estilos fuente definidos en `assets/css/style-components.css`.
2. Usa el HTML y las clases documentadas en el README de cada componente.
3. Carga el módulo JavaScript correspondiente solo cuando el componente requiera comportamiento.

Los componentes usan los tokens del framework y admiten los temas claro y oscuro. Conserva etiquetas semánticas, nombres accesibles para controles y estados de foco visibles al integrarlos.

# Card

## Proposito

Superficie reutilizable para resumenes, dashboards, graficos y resultados. Card, Panel, KPI y Result Summary comparten la capa glass, borde, radio, sombra y transicion Nexus.

## Header y Footer compartidos

Usa `nx-card-header` para un titulo o badge y, opcionalmente, un icono, estado o accion al lado opuesto. Agrupa el contenido principal en `nx-card-header-content` y los controles en `nx-card-header-actions`. `nx-card-footer` admite metadatos, estadisticas, acciones y links; organiza cada lado con `nx-card-footer-content` y `nx-card-footer-actions`.

```html
<article class="nx-card">
    <header class="nx-card-header">
        <div class="nx-card-header-content">
            <span class="nx-badge nx-badge-info">Estadisticas</span>
            <h3 class="nx-card-title">Iniciativas por ano</h3>
        </div>
        <div class="nx-card-header-actions">
            <span class="nx-badge nx-badge-success">Actualizado</span>
            <button class="nx-panel-action" type="button" aria-label="Mas opciones">...</button>
        </div>
    </header>
    <div class="nx-card-body">
        <p class="nx-card-text">Descripcion breve del contenido.</p>
    </div>
    <footer class="nx-card-footer">
        <div class="nx-card-footer-content">Actualizado recientemente</div>
        <div class="nx-card-footer-actions"><a href="#details">Ver detalles</a></div>
    </footer>
</article>
```

## Clases

- `nx-card`
- `nx-card-header`, `nx-card-header-content`, `nx-card-header-actions`
- `nx-card-body`
- `nx-card-footer`, `nx-card-footer-content`, `nx-card-footer-actions`
- `nx-card-title`, `nx-card-text`, `nx-card-meta`

## Estado

Estable.

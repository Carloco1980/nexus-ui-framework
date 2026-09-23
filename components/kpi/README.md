# KPI Card

## Descripción

El componente **KPI Card** permite visualizar indicadores clave (Key Performance Indicators) dentro del Dashboard Kit de Nexus UI Framework.

Está diseñado para mostrar métricas resumidas, tendencias y estados de forma clara, reutilizable y consistente con el sistema de diseño.

---

## Anatomía

```
nx-kpi
├── nx-kpi-header
│   └── nx-kpi-icon
├── nx-kpi-body
│   ├── nx-kpi-value
│   ├── nx-kpi-title
│   └── nx-kpi-description
└── nx-kpi-footer
    ├── nx-kpi-trend
    └── nx-kpi-update
```

---

## HTML

```html
<article class="nx-kpi">

    <div class="nx-kpi-header">
        <div class="nx-kpi-icon">📊</div>
    </div>

    <div class="nx-kpi-body">

        <span class="nx-kpi-value">234</span>

        <h3 class="nx-kpi-title">
            Proyectos
        </h3>

        <p class="nx-kpi-description">
            Innovación e Investigación
        </p>

    </div>

    <div class="nx-kpi-footer">

        <span class="nx-kpi-trend">
            ▲ +12%
        </span>

        <span class="nx-kpi-update">
            Últimos 12 meses
        </span>

    </div>

</article>
```

---

## Clases

| Clase | Descripción |
|--------|-------------|
| `.nx-kpi` | Contenedor principal |
| `.nx-kpi-header` | Encabezado |
| `.nx-kpi-icon` | Icono del indicador |
| `.nx-kpi-body` | Contenido principal |
| `.nx-kpi-value` | Valor numérico |
| `.nx-kpi-title` | Nombre del KPI |
| `.nx-kpi-description` | Texto descriptivo |
| `.nx-kpi-footer` | Información secundaria |
| `.nx-kpi-trend` | Tendencia |
| `.nx-kpi-update` | Última actualización |

---

## Tokens utilizados

- `--nx-glass-bg`
- `--nx-glass-border`
- `--nx-glass-blur`
- `--nx-radius-md`
- `--nx-shadow-sm`
- `--nx-shadow-md`
- `--nx-space-md`
- `--nx-white`
- `--nx-text`
- `--nx-text-muted`
- `--nx-green`
- `--nx-red`
- `--nx-cyan`

---

## Variantes previstas

- Default
- Success
- Warning
- Danger
- Trend Up
- Trend Down
- Loading
- Empty

---

## Responsive

El componente debe adaptarse automáticamente al sistema de grid (`.nx-grid` y `.nx-grid-auto`) sin requerir estilos adicionales.

---

## Estado

🟡 Versión 0.1

Estructura HTML y CSS implementadas.

Pendiente:

- Responsive
- Variantes (Success, Warning, Danger)
- Demo en Design System

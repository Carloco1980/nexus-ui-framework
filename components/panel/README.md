# Panel

## Descripción

El componente **Panel** define la estructura base utilizada por los componentes del **Dashboard Kit** de Nexus UI Framework.

Su propósito es proporcionar una interfaz consistente para paneles que contienen información, métricas, gráficos o cualquier otro contenido visual, evitando duplicación de código entre componentes.

---

## Anatomía

```text
nx-panel

├── nx-panel-header
│   ├── nx-panel-heading
│   │   ├── nx-panel-title
│   │   └── nx-panel-subtitle
│   └── nx-panel-action
│
├── nx-panel-body
│
└── nx-panel-footer
```

---

## HTML

```html
<article class="nx-panel">

    <header class="nx-panel-header">

        <div class="nx-panel-heading">

            <h3 class="nx-panel-title">
                Título
            </h3>

            <p class="nx-panel-subtitle">
                Subtítulo
            </p>

        </div>

        <button
            class="nx-panel-action"
            aria-label="Opciones">

            ⋯

        </button>

    </header>

    <div class="nx-panel-body">

        <!-- Contenido -->

    </div>

    <footer class="nx-panel-footer">

        <!-- Información adicional -->

    </footer>

</article>
```

---

## Clases

| Clase | Descripción |
|--------|-------------|
| `.nx-panel` | Contenedor principal del panel. |
| `.nx-panel-header` | Encabezado del panel. |
| `.nx-panel-heading` | Agrupa título y subtítulo. |
| `.nx-panel-title` | Título principal. |
| `.nx-panel-subtitle` | Texto descriptivo. |
| `.nx-panel-action` | Acción principal del panel. |
| `.nx-panel-body` | Contenido del panel. |
| `.nx-panel-footer` | Información secundaria. |

---

## Tokens utilizados

- `--nx-space-sm`
- `--nx-space-md`
- `--nx-border`
- `--nx-border-soft`
- `--nx-primary`
- `--nx-glow-blue`
- `--nx-text-muted`
- `--nx-white`
- `--nx-transition`

---

## Componentes que lo utilizan

- KPI Card
- Chart Card
- Data Table *(próximamente)*
- Activity Feed *(próximamente)*
- Timeline *(próximamente)*

---

## Objetivo

El componente **Panel** centraliza la estructura compartida del Dashboard Kit, promoviendo la reutilización de código y la consistencia visual entre todos los paneles del Framework.

---

## Estado

🟢 Estable.
Componente base del Dashboard Kit.
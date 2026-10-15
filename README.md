# Nexus UI Framework

Framework UI moderno, modular y ligero para construir dashboards, aplicaciones web, sitios institucionales y plugins de WordPress utilizando HTML, CSS y JavaScript Vanilla.

---

# Estado del proyecto

**Versión actual**

```text
v1.0.0 Core
```

Estado:

> Núcleo estable.

Esta versión consolida la arquitectura base del Framework, define la API pública y establece los componentes fundamentales para futuras versiones.

---

# Características

## CSS

- Arquitectura modular
- Design Tokens
- Sistema de temas (Light / Dark)
- Layout Responsive
- Componentes reutilizables
- Utilidades CSS
- Accesibilidad
- Sistema de variables CSS

## JavaScript

- Core modular
- API pública `NX`
- Sistema de eventos
- Theme Manager
- Navbar
- Modal
- Forms
- FAB
- Icons
- Animations
- Inicialización automática

---

# Filosofía

Nexus UI Framework se basa en cuatro principios fundamentales:

- Una responsabilidad por archivo.
- Componentes desacoplados.
- HTML semántico.
- JavaScript Vanilla.

El objetivo es construir interfaces reutilizables, mantenibles y escalables sin depender de frameworks externos.

---

# Arquitectura

```
assets/

├── css/
│   ├── base/
│   ├── layout/
│   ├── components/
│   ├── sections/
│   ├── themes/
│   ├── utilities/
│   └── vendor/
│
├── js/
│   ├── core/
│   │
│   │── app.js
│   │── config.js
│   │── events.js
│   │── storage.js
│   │── theme.js
│   │── animations.js
│   │
│   └── components/
│
│       navbar.js
│       modal.js
│       forms.js
│       fab.js
│       icons.js
│       theme-toggle.js
│
├── icons/
├── img/
└── fonts/
```

---

# Componentes disponibles

## Layout

- Container
- Grid
- Navbar
- Footer

## Componentes

- Buttons
- Cards
- Badges
- Dashboard
- Forms
- FAB
- Modal
- Icons
- Theme Toggle
- Tables
- KPI Cards
- Chart Cards

## Secciones

- Hero
- Features
- Templates
- Framework
- Contact

---

# Sistema de temas

El Framework incorpora soporte para:

- Light
- Dark
- System

Los temas utilizan Design Tokens y pueden cambiarse dinámicamente mediante:

```javascript
NX.theme.set("dark");

NX.theme.set("light");

NX.theme.set("system");

NX.theme.toggle();
```

---

# API pública

El Framework expone un único namespace:

```javascript
NX
```

Servicios disponibles:

```javascript
NX.init()

NX.theme

NX.modal

NX.icons

NX.events
```

---

# Compatibilidad

Compatible con navegadores modernos compatibles con:

- CSS Variables
- CSS Grid
- Flexbox
- ES6+
- CustomEvent
- IntersectionObserver

---

# Documentación

La documentación del proyecto se encuentra en:

```
docs/

README.md

ARCHITECTURE.md

DESIGN_SYSTEM.md

COMPONENTS.md

ROADMAP.md

CHANGELOG.md
```

---

# Desarrollo

Clonar el repositorio

```bash
git clone https://github.com/Carloco1980/nexus-ui-framework.git
```

Instalar dependencias

```bash
npm install
```

Compilar

```bash
npm run build
```

Modo desarrollo

```bash
npm run watch
```

---

# Roadmap

Las próximas versiones incorporarán:

- Accordion
- Tabs
- Dropdown
- Toast
- Notification
- Tooltip
- Dashboard Widgets
- Charts
- Templates
- Playground

Más información en:

```
docs/ROADMAP.md
```

---

# Ecosistema Nexus

Nexus UI Framework forma parte del **Nexus Ecosystem**.

Proyectos relacionados:

- Nexus Core
- Nexus Explorer
- Nexus Dashboard
- Nexus Forms
- Nexus WordPress
- Nexus API

---

# Licencia

MIT License

---

# Autor

**Carlos Santander Díaz**

---

> Nexus UI Framework es la capa visual del Nexus Ecosystem y proporciona una base consistente para el desarrollo de aplicaciones web modernas.

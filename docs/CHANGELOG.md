# Changelog

Todos los cambios importantes de **Nexus UI Framework** se documentan en este archivo.

El proyecto utiliza Versionado Semántico (Semantic Versioning) y sigue el formato de Keep a Changelog.

---

# [1.0.0] - 2026-10

## Primera versión estable

Esta versión establece la arquitectura oficial del Framework y define la primera API pública estable.

---

## Agregado

### Core

- Nuevo namespace público `NX`.
- Bootstrap unificado mediante `NX.init()`.
- Sistema centralizado de configuración (`config.js`).
- Servicio de eventos (`events.js`).
- Sistema de almacenamiento (`storage.js`).
- Motor de temas (`theme.js`).
- Motor de animaciones (`animations.js`).

### Componentes

Se incorporan oficialmente:

- Navbar
- Modal
- Theme Toggle
- Forms
- Icons
- Floating Action Button (FAB)

### Sistema de Temas

- Light Theme
- Dark Theme
- Design Tokens centralizados
- Variables semánticas
- Cambio dinámico de tema

### CSS

- Reorganización completa de la arquitectura.
- Normalización mediante Design Tokens.
- Componentes desacoplados del tema.
- Compilación automática de:

  - dist/nexus-ui.css
  - dist/nexus-ui-components.css

### Assets

Se agrega el sistema base de iconos SVG.

---

## Mejorado

### Arquitectura JavaScript

- Separación entre Core y Components.
- API pública consistente.
- Inicialización centralizada.
- Mejor manejo de errores durante el bootstrap.
- Los módulos pueden fallar sin impedir la inicialización del resto.

### Arquitectura CSS

- Eliminación de valores repetidos.
- Componentes basados completamente en tokens.
- Mejor organización por responsabilidades.

### Configuración

Ahora la configuración controla:

- Debug
- Modal
- Navbar
- Theme
- Icons
- Animations

---

## Corregido

- Inconsistencia entre `NexusTheme` y `NX.theme`.
- Bootstrap ahora inicializa correctamente el sistema de temas.
- Mejoras en el manejo de errores del núcleo.
- Corrección de nombres de archivos del Core.
- Compatibilidad entre módulos.

---

## API Pública

Se define oficialmente:

```javascript
window.NX
```

Servicios disponibles:

- NX.init()
- NX.theme
- NX.modal
- NX.icons
- NX.events

---

## Arquitectura

La estructura oficial pasa a ser:

```text
assets/js/

app.js

core/
components/
```

Los módulos internos dejan de formar parte de la API pública.

---

## Compatibilidad

Compatible con:

- HTML5
- CSS3
- ES6+
- CSS Variables
- Flexbox
- CSS Grid
- CustomEvent
- IntersectionObserver

---

## Estado

Versión estable.

La arquitectura del Core y la API pública se consideran la base oficial del Framework.

---

# [0.9.0 RC1] - 2026-09

## Primera Release Candidate

### Agregado

- Arquitectura modular inicial.
- Sistema de Design Tokens.
- Navbar.
- Forms.
- FAB.
- Animaciones.
- Organización inicial del proyecto.

### Estado

Release Candidate utilizada como base para el desarrollo de la versión estable 1.0.

---

## Próxima versión

### 1.1.0

Planificado:

- Showcase oficial.
- Sitio de documentación.
- Componentes adicionales.
- Tabs.
- Accordion.
- Toast.
- Notifications.
- Carousel.
- Timeline.
- Charts.
- Mejoras de accesibilidad.
- Optimización del rendimiento.

---

**Autor**

Carlos Santander Díaz

**Proyecto**

Nexus UI Framework

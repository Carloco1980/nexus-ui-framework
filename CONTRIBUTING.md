# Guía de Contribución

Gracias por tu interés en contribuir a **Nexus UI Framework**.

Este documento describe las convenciones utilizadas durante el desarrollo del Framework para mantener una arquitectura consistente, modular y escalable.

---

# Filosofía

Nexus UI Framework sigue cinco principios fundamentales.

## 1. Una responsabilidad por archivo

Cada archivo debe resolver un único problema.

No mezclar:

- estructura
- estilos
- comportamiento

---

## 2. Componentes desacoplados

Los componentes deben ser independientes.

Un componente nunca debe depender directamente de otro componente.

Toda comunicación debe realizarse mediante la API pública o el sistema de eventos.

---

## 3. HTML semántico

Siempre utilizar HTML semántico antes que soluciones basadas únicamente en JavaScript.

---

## 4. JavaScript Vanilla

El Framework no depende de:

- Bootstrap
- Tailwind CSS
- jQuery
- React
- Vue
- Angular

---

## 5. Design Tokens

Todos los valores reutilizables deben definirse mediante variables CSS.

Nunca repetir colores, radios, espaciados o sombras dentro de los componentes.

---

# Arquitectura

```
assets/

css/

base/
layout/
components/
sections/
themes/
utilities/

js/

core/
components/

docs/
```

---

# Convenciones CSS

Todas las clases deben utilizar el prefijo:

```css
.nx-
```

Ejemplo

```css
.nx-button

.nx-card

.nx-modal

.nx-navbar
```

Evitar nombres genéricos.

Incorrecto

```css
.button

.card

.header
```

---

# Design Tokens

Todos los valores reutilizables deben definirse en

```
assets/css/base/variables.css
```

Ejemplo

```css
--nx-primary

--nx-radius-md

--nx-space-lg

--nx-shadow-md
```

Los componentes solo consumen tokens.

---

# Organización CSS

## Base

Contiene únicamente:

- Variables
- Reset
- Tipografía
- Animaciones

---

## Layout

Elementos estructurales.

Ejemplo

- Container
- Grid
- Navbar
- Footer

---

## Components

Componentes reutilizables.

Ejemplo

- Buttons
- Cards
- Forms
- Modal
- FAB
- Icons
- Theme Toggle

---

## Sections

Secciones completas.

Ejemplo

- Hero
- Features
- Templates
- Contact

---

## Utilities

Clases auxiliares.

Nunca deben modificar componentes.

---

# JavaScript

El Framework utiliza una arquitectura modular.

```
core/

components/
```

El Core proporciona:

- configuración
- eventos
- tema
- almacenamiento
- inicialización

Los componentes únicamente implementan comportamiento visual.

---

# API pública

La única API pública es:

```javascript
NX
```

Ejemplos

```javascript
NX.init();

NX.theme.set("dark");

NX.theme.toggle();

NX.modal.open("#demo");

NX.icons.refresh();
```

Los módulos internos no deben invocarse directamente desde código externo.

---

# Eventos

La comunicación entre módulos debe realizarse mediante:

```javascript
NX.events
```

Evitar referencias directas entre componentes.

---

# Accesibilidad

Todo componente nuevo debe considerar:

- aria-label
- aria-expanded
- aria-hidden
- focus-visible
- navegación mediante teclado

Siempre que sea posible.

---

# Responsive

Todo componente debe funcionar correctamente en:

- Desktop
- Tablet
- Mobile

---

# Rendimiento

Priorizar siempre:

- CSS nativo
- JavaScript Vanilla
- pocas dependencias
- reutilización
- Design Tokens

Evitar:

- código duplicado
- listeners innecesarios
- consultas repetidas al DOM

---

# Flujo de desarrollo

Toda nueva funcionalidad debe seguir este proceso.

1. Analizar el problema.
2. Diseñar el componente.
3. Implementar HTML.
4. Implementar CSS.
5. Implementar JavaScript.
6. Validar accesibilidad.
7. Verificar comportamiento responsive.
8. Actualizar la documentación.
9. Registrar el cambio en CHANGELOG.
10. Crear Commit.

---

# Versionado

El proyecto utiliza Semantic Versioning.

Ejemplos

```
1.0.0

1.0.1

1.1.0

2.0.0
```

---

# Código limpio

Antes de agregar código nuevo verificar:

- ¿Existe un componente similar?
- ¿Puede reutilizarse uno existente?
- ¿Respeta la arquitectura?
- ¿Utiliza Design Tokens?
- ¿Mantiene una única responsabilidad?

Si alguna respuesta es negativa, el cambio debe revisarse antes de integrarse.

---

# Objetivo

Nexus UI Framework busca convertirse en la capa visual del **Nexus Ecosystem**, proporcionando una base moderna, reutilizable y mantenible para aplicaciones web, dashboards y soluciones institucionales.

---

Autor

Carlos Santander Díaz

# Guía de Contribución

¡Gracias por tu interés en contribuir a **Nexus UI Framework**!

Este documento describe las reglas y convenciones utilizadas durante el desarrollo del Framework.

---

# Filosofía del Proyecto

Nexus UI Framework sigue un principio fundamental:

> **Un archivo = una responsabilidad.**

Cada módulo debe resolver un único problema.

El objetivo es mantener un Framework:

- Modular
- Escalable
- Fácil de mantener
- Reutilizable
- Independiente de cualquier proyecto específico

---

# Arquitectura

```
css/

base/
layout/
components/
sections/
utilities/

js/

app.js
navbar.js
forms.js
fab.js
animations.js
```

No se deben mezclar responsabilidades entre carpetas.

---

# Convenciones CSS

Todas las clases deben comenzar con el prefijo:

```css
.nx-
```

Ejemplos

```css
.nx-button

.nx-card

.nx-dashboard

.nx-navbar
```

Nunca utilizar nombres genéricos como:

```css
.button

.card

.container

.title
```

---

# Variables CSS

Todos los valores reutilizables deben declararse en:

```
base/variables.css
```

Ejemplo

```css
--nx-primary
--nx-text
--nx-radius-md
--nx-space-lg
```

No repetir colores ni tamaños directamente en los componentes.

---

# Organización CSS

## Base

Contiene únicamente:

- Variables
- Reset
- Tipografía
- Animaciones Base

Nunca deben existir componentes en esta carpeta.

---

## Layout

Contiene únicamente elementos estructurales.

Ejemplos

- Container
- Grid
- Navbar
- Footer

---

## Components

Aquí viven los componentes reutilizables.

Ejemplos

- Buttons
- Cards
- Dashboard
- Forms
- FAB

Un componente nunca debe depender de otro componente.

---

## Sections

Contiene únicamente secciones completas.

Ejemplos

- Hero
- Features
- Contact
- Templates
- Framework

---

## Utilities

Clases auxiliares.

Ejemplos

```css
.nx-text-center

.nx-hidden

.nx-mt-lg

.nx-flex
```

Las utilidades nunca deben modificar componentes.

---

# Convenciones JavaScript

El Framework utiliza una arquitectura modular.

```
app.js
```

es únicamente el núcleo del sistema.

No debe contener lógica de componentes.

---

Cada módulo debe tener esta estructura.

```javascript
const NexusModulo = {

    init(){},

    cacheDOM(){},

    bindEvents(){}

};

window.NexusModulo = NexusModulo;
```

---

# Inicialización

Todos los módulos deben inicializarse desde:

```
app.js
```

Ejemplo

```javascript
if(window.NexusNavbar?.init){

    window.NexusNavbar.init();

}
```

Nunca llamar módulos directamente desde otro módulo.

---

# Convenciones de nombres

CSS

```
nx-button

nx-card

nx-dashboard
```

JavaScript

```
NexusNavbar

NexusForms

NexusFab

NexusAnimations
```

Variables CSS

```
--nx-primary

--nx-space-md

--nx-radius-lg
```

---

# Accesibilidad

Todo componente debe considerar:

- aria-label
- aria-expanded
- aria-hidden
- focus-visible
- Navegación mediante teclado

Siempre que sea posible.

---

# Responsive

Todo componente nuevo debe probarse en:

- Desktop
- Tablet
- Mobile

No se aceptan componentes exclusivos para escritorio.

---

# Rendimiento

Se recomienda:

- Evitar dependencias innecesarias.
- Reducir el uso de JavaScript.
- Favorecer CSS nativo cuando sea posible.
- Evitar duplicación de código.
- Reutilizar Design Tokens.

---

# Dependencias

Actualmente el Framework funciona únicamente con tecnologías estándar.

- HTML5
- CSS3
- JavaScript ES6+

No depende de:

- Bootstrap
- Tailwind CSS
- jQuery
- React
- Vue
- Angular

---

# Compatibilidad

El Framework está orientado a navegadores modernos compatibles con:

- CSS Grid
- Flexbox
- CSS Variables
- ES6+
- IntersectionObserver

---

# Flujo de desarrollo

Cada nueva funcionalidad debe seguir este proceso:

1. Analizar la necesidad.
2. Diseñar el componente.
3. Implementar el CSS.
4. Implementar el JavaScript (si aplica).
5. Validar la accesibilidad.
6. Verificar el comportamiento responsive.
7. Actualizar la documentación.
8. Registrar el cambio en `CHANGELOG.md`.

---

# Versionado

Se utiliza **Semantic Versioning**.

Ejemplos

```
0.9.0 RC1

0.9.0 RC2

1.0.0

1.1.0
```

---

# Código limpio

Antes de incorporar código nuevo, verificar:

- ¿Existe ya un componente similar?
- ¿Puede reutilizarse una utilidad existente?
- ¿Respeta la arquitectura del Framework?
- ¿Mantiene una única responsabilidad?

Si la respuesta es **no**, el código debe revisarse antes de integrarlo.

---

# Objetivo del Proyecto

Nexus UI Framework busca convertirse en la base visual del **Nexus Ecosystem**, proporcionando una arquitectura moderna, consistente y reutilizable para el desarrollo de aplicaciones web, dashboards y soluciones basadas en WordPress.

---

**Autor**

Carlos Santander Díaz

**Proyecto**

Nexus UI Framework

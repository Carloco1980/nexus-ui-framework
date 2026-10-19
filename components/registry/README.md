# Nexus Component Registry

El Registry es la fuente oficial de componentes del Framework.

Toda nueva incorporación al Framework debe registrarse aquí antes de aparecer en el Showcase.

## Archivos

components.json
Listado oficial de componentes.

categories.json
Categorías disponibles.

statuses.json
Estados oficiales de desarrollo.

## Flujo

Nuevo componente
        │
        ▼
Registrar en components.json
        │
        ▼
El módulo `components/catalog/catalog.js` consume este listado cuando una página incluye `#component-catalog`. Cada `preview` y `documentation` debe apuntar a un archivo físico existente; `preview` se omite si el componente no tiene HTML propio.

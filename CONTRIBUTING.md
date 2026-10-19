# Guía de contribución

Gracias por considerar una contribución a Nexus UI Framework. El proyecto usa HTML, CSS y JavaScript vanilla, con el código fuente organizado en la estructura existente.

## Antes de enviar un cambio

1. Revisa la documentación de componentes y el registry para encontrar trabajo relacionado.
2. Mantén los cambios dentro de la arquitectura actual y conserva clases públicas, rutas y API, salvo que las personas responsables aprueben explícitamente un cambio incompatible.
3. Usa los tokens CSS y las convenciones de temas existentes cuando corresponda.
4. Mantén el marcado semántico y los controles accesibles mediante teclado.
5. Actualiza el README del componente afectado y `CHANGELOG.md` cuando cambie el comportamiento o el uso documentado.
6. Ejecuta `npm ci` y `npm run build` para cambios CSS; ejecuta `node --check` en los archivos JavaScript modificados.
7. En el pull request describe el cambio, cómo lo verificaste y cualquier impacto de compatibilidad.

## Convenciones del proyecto

- Prioriza APIs nativas del navegador y no agregues dependencias de ejecución sin acuerdo previo de mantenimiento.
- Conserva HTML, CSS, JavaScript y README junto al componente cuando esos archivos ya existan en su ubicación actual.
- Las entradas compartidas de CSS son `assets/css/style.css` y `assets/css/style-components.css`.
- Usa `window.NX` para los servicios documentados del framework. Los módulos internos no forman parte de la API pública.
- Sigue Semantic Versioning y registra en el changelog los cambios visibles para quienes usan el framework.

Las contribuciones deben respetar el [Código de conducta](CODE_OF_CONDUCT.md). Para reportes de seguridad, consulta [SECURITY.md](SECURITY.md).

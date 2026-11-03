# ARQUITÉ · Paquete de especificaciones integrales v6.1

**Fecha:** 03/11/2026  
**Propósito:** entregar seis documentos `.md` reescritos para ARQUITÉ, fundamentados funcionalmente en v5 y visualmente en las diez pantallas de Stitch, con arquitectura frontend moderna orientada a una experiencia visual profesional.

## Empezar por aquí

Leer **en este orden**:

1. `01_PRD_ARQUITE.md` — producto, alcance, requisitos, roles, criterios de aceptación y backlog ARQ-01..ARQ-14.
2. `02_TRD_Arquitectura_ARQUITE.md` — frontend React, CSS/Tailwind, Motion/SVG, dominio, APIs, PDF, seguridad, arquitectura visual y alternativas.
3. `03_Flujos_UX_User_Journey_ARQUITE.md` — inventario de vistas, navegación, flujo de versiones A/B, consentimientos, cartas, umbrales, administración y microinteracciones.
4. `04_Design_Brief_UI_Tokens_ARQUITE.md` — dirección de arte Warm Editorial Roadmap, tokens, componentes, 10 referencias, responsividad y motion premium.
5. `05_Backend_Data_Schema_Supabase_ARQUITE.md` — tablas, claves, Auth/RLS, control de ediciones, renovación atómica, purga, documentos privados y pruebas.
6. `06_Plan_Implementacion_Antigravity_ARQUITE.md` — preflight, mapa Stitch→React, stack comparado, fases F0–F7, gates, pruebas y prompt operativo.

## Fuentes y recursos incluidos

- `fuentes/ARQUITE_Especificacion_Funcional_y_Backlog_Actualizada_v5.md`: **la fuente de autoridad para reglas funcionales**. Se conserva sin modificar.
- `referencias_stitch/`: **diez carpetas originales** con `code.html` y `screen.png` además de `warm_editorial_roadmap/DESIGN.md`. Sirven para reproducir la identidad visual.
- `recursos-visuales/ARQUITE_Vistas_Clave_Stitch.png`: tablero de seis pantallas reales del ZIP con indicación de adaptación pendiente.
- `recursos-visuales/ARQUITE_Componentes_Clave_Stitch.png`: tablero de ocho grupos de componentes extraídos de las referencias visuales.

## Decisión tecnológica recomendada [PROPUESTA]

**React 19.3 compatible + Vite 8.3.x + TypeScript (si el repo lo admite) + Tailwind CSS 4 + CSS nativo moderno + Motion for React + SVG React + Radix headless para controles complejos.** Supabase Auth/Postgres/RLS/Storage como backend propuesto, PDF con servicio privado. Librerías opcionales: TanStack Table para tabla compleja, TanStack Query para integración API, d3-shape/visx solo si la geometría lo exige. React Three Fiber/WebGL **no** en el MVP por defecto.

### No confundir especificación con implementación

Las capturas de Stitch y los documentos **no** constituyen prueba de que ARQUITÉ ya tenga Auth, Supabase, doble diamante, PDF o administrador en producción. La versión v5 indica que el demo v4 usa `localStorage`; el **HTML v4 no está dentro del ZIP Stitch** recibido. Antigravity deberá localizarlo y cotejarlo antes de reconstruir la lógica. Los `code.html` de Stitch usan Tailwind por CDN y scripts de demostración: no copiarlos literalmente a la aplicación final.

## Reglas que no pueden perderse

- Dos versiones temporales A/B del mismo diamante, **máximo dos visibles**; v1 y v2 cerradas son de solo lectura; v3 requiere **consentimiento específico** para sustituir v1.
- El diamante tiene **10 facetas** para diez decisiones, pero informe final requiere **13/13**: tres exploraciones + diez decisiones y cierre confirmado (**regla propuesta en v5 por ratificar**).
- **Informes independientes:** Diamante, Siete Umbrales (7/7) y Cartas al Futuro (2/2); intervenciones 7/7 independiente, 29 global no bloqueante.
- Textos e historia basados en datos reales, sin scores inventados de madurez o liderazgo.
- La nueva plataforma requiere autorización real para acceder a respuestas privadas y ver expedientes de terceros.

## Diferencias por resolver en preflight

1. La especificación v5 propone nombres de umbrales diferentes de la pantalla `siete_umbrales_arquit`; se deben revisar contra el demo v4 y aprobar catálogo antes de migrar datos.
2. Las maquetas muestran `Informe Dossier` como vista singular; ARQUITÉ exige **tres informes autónomos**. Puede existir un hub visual de informes, nunca sustituir las tres descargas.
3. Los nombres y cifras de las maquetas son demostrativos; no usarlos como registros ni métricas reales.
4. Falta ratificar política de eliminación/retención, confirmación final de umbrales/cartas y tecnología exacta del repositorio actual.

**Entrega:** documentación renovada + visuales reales de Stitch organizada para continuar directamente con el agente Antigravity.

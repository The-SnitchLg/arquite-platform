# 06 · Plan de implementación para Antigravity — ARQUITÉ

**Versión:** 6.1 · 03/11/2026  
**Estado:** hoja de ruta ejecutable, sujeta a preflight del repositorio.  
**Objetivo:** construir ARQUITÉ con fidelidad visual a Stitch, funcionalidad de v5, arquitectura React moderna, seguridad de versiones y tres informes PDF independientes. **No** presupone que se haya implementado código ni que se conozca el árbol real de GitHub.

## 1. Prioridades innegociables

1. **Preservar la lógica contractual** de `ARQUITE_Especificacion_Funcional_y_Backlog_Actualizada_v5.md`: ciclo de dos diamantes, reemplazo consentido, 13/13, 7/7, 2/2, administración y tres informes autónomos.
2. **Reproducir visualmente las maquetas Stitch** en React con fidelidad de layout/tipografía/color y elevar su calidad con interacción; **no** desplegar sus `code.html` estáticos ni copiar su CDN Tailwind como arquitectura final.
3. **Diseño premium sin sobreingeniería:** CSS nativo moderno + Tailwind 4 + Motion para microinteracciones; SVG semántico como soporte del diamante; accesibilidad y rendimiento obligatorios.
4. **Una sola fuente de verdad** para datos reales: Auth + API/RPC segura + RLS + Storage privado; no `localStorage` productivo para respuestas personales.
5. **No tocar código a ciegas:** inspeccionar repositorio, demo v4 y skills de Antigravity antes de cambiar archivos, instalar paquetes o refactorizar.
6. **Cada entrega vertical incluye** UI + reglas + pruebas + evidencia visual + estado. Documentar decisiones mediante ADR.

## 2. Entradas y autoridad de los archivos

| Prioridad | Entrada | Uso |
|---|---|---|
| 1 | `fuentes/ARQUITE_Especificacion_Funcional_y_Backlog_Actualizada_v5.md` | **Contrato del dominio**, decisiones confirmadas y criterios de aceptación |
| 2 | `01_PRD_ARQUITE.md` | Alcance, roles, prioridades de producto |
| 3 | `02_TRD_Arquitectura_ARQUITE.md` y `05_Backend_Data_Schema_Supabase_ARQUITE.md` | Contratos técnicos, estados, seguridad y persistencia |
| 4 | `03_Flujos_UX_User_Journey_ARQUITE.md` | Navegación, journeys, microcopy y excepciones |
| 5 | `04_Design_Brief_UI_Tokens_ARQUITE.md` | Diseño visual, responsive, componentes y motion |
| 6 | `referencias_stitch/` con `DESIGN.md`, 10×`code.html` y 10×`screen.png` | **Objetivo visual**, no autoridad sobre decisiones funcionales |
| 7 | Demo real `ARQUITE_Demo_v4_Playing_to_Win.html` **[NO APORTADO EN ZIP STITCH]** | Verificar funcionalidades existentes antes de migrar; localizar en repo o solicitar la versión si falta |

**Conflictos conocidos:** Stitch muestra «Informe Dossier» común y textos de algunos umbrales distintos de v5; el negocio requiere **tres informes por separado** y la taxonomía de umbrales debe validarse con el demo real. Maqueta de administración contiene cifras inventadas de diseño; reemplazarlas por datos dinámicos y estados vacíos. Su gráfico de 10 facetas **NO** representa automáticamente dos versiones A/B: requiere comparador.

## 3. Stack propuesto para máxima calidad visual con sentido técnico

| Capa | Decisión recomendada | Nivel | Validación antes de instalar |
|---|---|---|---|
| Base web | React 19.3+ **estable compatible** + Vite 8.3.x + TypeScript | **Core [PROPUESTA]** | Revisar `package.json` y lockfile, no forzar upgrade si el repo ya funciona |
| Estilos | Tailwind CSS 4 con `@theme` + CSS custom properties, Grid, container queries, `clamp()`, cascade layers | **Core** | Eliminar dependencia de `cdn.tailwindcss.com` de las referencias |
| Interacciones | Motion for React (`motion/react`) solo en componentes que requieran transiciones compartidas o animaciones de estado | **Core visual** | Inspeccionar licencia/API y `prefers-reduced-motion` |
| Navegación | React Router o router actual, rutas privadas y carga diferida | Core | Mantener configuración existente si válida |
| Controles accesibles | Radix UI Primitives (Dialog, Tabs, Accordion, Tooltip) o equivalentes instalados | Por necesidad | Headless para no imponer estética genérica |
| Diamante | SVG React nativo con geometría estable y accesible; Motion para revelar 10 facetas | Core diferencial | Geometría SVG igual al demo v4, contenido de v5 |
| Umbrales | CSS Grid + SVG de conexión; `@visx`/`d3-shape` **solo si geometría nueva lo exige** | Opcional | 3 bandas 2/3/2 no requiere motor gráfico completo |
| Admin | TanStack Table headless si filtros/ordenamientos/paginación superan implementación simple | Opt-in | Diseño 100% propio con el estilo Stitch |
| Server state | TanStack Query si la integración real necesita caché/invalidación | Opt-in backend | No usar como reemplazo de reglas transaccionales |
| Formularios | React Hook Form + Zod si complejidad justifica; validación de dominio server-side siempre | Opt-in | Evitar duplicar esquemas no versionados |
| PDF | Render HTML/CSS print + SVG vectorial mediante servicio compatible y seguro | Core funcional | Probar entorno y saltos de página; no asumir navegador en Edge Function |
| 3D | React Three Fiber / Three.js | **Laboratorio opcional, NO MVP** | Solo demo medible si suma comprensión, sin impedir lectura ni PDF |
| GSAP, scroll cinematográfico | **No por defecto** | Experimental | Usar solo si Motion/CSS no resuelven una secuencia específica; no sumar librerías que compiten |

**Razón:** innovación visual no equivale a agregar librerías. La experiencia diferencial es el **diamante SVG interactivo**, la comparación A/B, el roadmap de siete estaciones y el documento exportado con diseño editorial. Antes de incorporar WebGL, probar una opción 2D excelente y una alternativa 3D acotada: no existe requisito de manipular profundidad ni física.

## 4. Score multicriterio interno para decidir el frontend

**Evaluación de diseño [PROPUESTA, no benchmark empírico]:** fidelidad a Stitch 30 %, interacción 20 %, rendimiento/accesibilidad 20 %, mantenimiento 20 %, esfuerzo de integración 10 %. Escala de 1–5; puntajes como juicio técnico para discusión, no evidencia científica.

| Alternativa | Fidelidad | Interacción | Rend./A11y | Mantenimiento | Integración | Score ponderado /5 | Veredicto |
|---|---:|---:|---:|---:|---:|---:|---|
| React + Vite + Tailwind 4 + CSS + Motion + SVG | 5.0 | 4.8 | 4.6 | 4.5 | 4.6 | **4.74** | **Recomendada** |
| React + Next.js + CSS + Motion + SVG | 5.0 | 4.8 | 4.4 | 4.1 | 3.3 | **4.49** | Elegir si aparecen requisitos reales de SSR, SEO o fullstack Next |
| React + CSS + Three/R3F como elemento principal | 4.0 | 5.0 | 2.8 | 3.0 | 2.7 | **3.63** | No usar como base de la plataforma; opcional en laboratorio |
| HTML Stitch original + scripts/CDN | 4.8 | 2.0 | 2.8 | 1.5 | 4.0 | **3.10** | Solo referencia y demo estática |

**No cambiar a Next.js solo por moda.** ARQUITÉ es fundamentalmente una aplicación privada e interactiva. React con Vite permite máxima personalización visual; backend y PDF pueden operarse separadamente.

## 5. Fases y entregables con gates

### F0 · Preflight y mapa de equivalencias — BLOQUEANTE

1. Localizar repositorio real; leer `package.json`, lockfile, `vite.config.*`, `src/**`, `.agent/**`, `.opencode/**`, `.github/workflows/**`, tests, componentes UI y dependencias instaladas.
2. Encontrar demo v4 mencionado por v5. Inventariar sus 3 exploraciones, 10 preguntas (5/5), SVG, 7 umbrales, 7 intervenciones, 2 cartas, bitácora, export JSON y localStorage `arquite-v2-local`. Si no existe en repositorio/inputs, marcar **bloqueo documental**; no inventar preguntas ni valores.
3. Descomprimir e inspeccionar los 10 `code.html` + `screen.png` y `DESIGN.md`. Identificar CSS (tokens, fuentes, breakpoints), JS de demostración y componentes replicables. Registrar por pantalla qué existe, qué falta y contradicciones.
4. Levantar **matriz `pantalla→componente→regla→test`**. Registrar diferencias de títulos U01-U07 y de «Dossier». Congelar textos canónicos solo después de cotejo; no borrar historial.
5. Auditar skills/automatizaciones de Antigravity; **no instalar paquetes de skills masivamente** ni ejecutar scripts terceros sin revisar origen y permisos.
6. Crear branch de trabajo, snapshot del estado original y ADR-001 «Tecnología visual y fuentes». No reescribir aplicación con un scaffold vacío.

**Gate F0:** inventario firmado + mapa de 10 pantallas + diff de reglas v5 contra Stitch + decisión documentada de catálogo de umbrales. Comandos npm actuales verificados y rama base intacta.

### F1 · Design system de alto impacto y shell React

- Portar tokens y composición editorial de Stitch: Newsreader/Plus Jakarta Sans (licencias/hosting verificadas), superficies crema, teal, terracota, grandes espacios, cards suaves y controles nítidos. Definir `@theme` de Tailwind v4 y variables CSS, sin duplicar paletas.
- Construir `AppShell`, `TopNav`, `EditorialHero`, `SectionIntro`, `ModuleCard`, `StatusChip`, `Button`, `Dialog`, `Accordion`, `Tabs`, `Progress`, `Skeleton`, `Toast/SaveState`, `EmptyState` y `Footer`.
- Implementar páginas Panorama, login simple, registro simple y administrador con fixtures, usando las pantallas de Stitch como referencia visual. Las dos variantes de acceso de Stitch son **alternativas**, no dos logins simultáneos obligatorios.
- Añadir transiciones por CSS para hover/foco y Motion para entrada de paneles y layout compartido. Nunca animar textos largos o impedir scroll por decoraciones.
- Pruebas visuales baseline a 1440×900 y 1366×768; también 1024, 768, 390.

**Gate F1:** fidelidad de composición y tokens revisada por PO (capturas lado a lado); navegación con teclado, foco visible y responsive sin scroll horizontal global.

### F2 · Mi Diamante: contenido real, SVG y progresión visual

- Migrar las **3 exploraciones** sincronizadas con **10 decisiones** personal/profesional por versión.
- `DiamondSvg10` con geometría basada en demo real (sin asignar scores psicológicos) y animación progresiva de facetas al responder. Cada faceta es una acción accesible, con alternativa textual/lista.
- Acordeones de preguntas, indicadores 10 facetas vs 13 requisitos, autosave visual, restauración de borrador y edición sin pérdida ante cambios de pestaña.
- Distinguir «completo 13/13» de «confirmado»: pantalla de revisión de las 13 respuestas, diálogo de confirmación, snapshot y estado fijo de solo lectura.
- **No** usar valores demostrativos de Stitch como decisiones reales de la persona.

**Gate F2:** tests 0/13, 12/13, 13/13 sin confirmar, 13/13 confirmado; SVG fiel sin cortes; edición de A cerrada prohibida.

### F3 · Comparador A/B y ciclo perpetuo consentido

- Activar segunda versión solo tras fijar v1. La nueva versión es vacía y editable por defecto **[PROPUESTA]**, copia por campo **opt-in**, nunca prellenado silencioso.
- Comparador A/B con dos SVG y respuestas completas (3 exploraciones + 10 elecciones) al lado; marcadores objetivos «sin cambios», «modificada», «agregada»; móvil apilado.
- Al cerrar v2, mostrar aviso exacto antes de crear v3: fechas/IDs de ambos, qué desaparece, opción de descargar anterior, checkbox sin marcar, cancelar y botón de aceptación explícita.
- Implementar transacción (staging) con locks, token específico, idempotency key, purge policy y auditoría; **no** borrar localmente antes de recibir confirmación servidor.

**Gate F3:** 19 escenarios v5 asociados a diamantes, doble clic/concurrencia y cancelación sin cambios; máximo dos slots visibles.

### F4 · Siete Umbrales, historia e intervenciones

- Crear mapa ejecutivo 3 franjas/7 nodos 2/3/2 con geometría responsive, estado textual, fecha, evidencia y panel lateral. **Resolver catálogo antes de persistir.**
- Mantener 7 planes de intervención con tipo/acción/evidencia, módulo secundario independiente; jamás condición oculta para PDF de umbrales.
- Implementar edición, historial de eventos reales y comparativo «antes / ahora» solo cuando existan revisiones; no radar/score ni supuesta escala objetiva de madurez.
- Si se adopta cierre por edición [PROPUESTA], crear revisión completa y confirmación explícita, sin congelar todo el recorrido.

**Gate F4:** 7/7 habilita únicamente su informe, no fuerza diamante ni cartas; pruebas de estado/historia y modo teclado.

### F5 · Cartas al Futuro y tres informes finales premium

- Editor de carta personal y profesional con párrafos conservados, sin marcas de ejemplo; sello o marca de cierre solo con confirmación real [PROPUESTA].
- Plataforma de documentos con **tres tarjetas de informes autónomos**: Diamante, Umbrales y Cartas. No mostrar un «Dossier final» combinado como única salida.
- Diseñar plantillas PDF/HTML imprimible diferenciadas; portada, fecha, edición/versión, contenidos íntegros y SVG vectorial donde aplica.
- Mostrar preview con marca **«Borrador»** si faltan requisitos. Generar finales exclusivamente con snapshots cerrados.
- Pruebas con 10 preguntas extensas, 3 exploraciones largas, todas las reflexiones de umbrales, dos cartas de varias páginas, diacríticos y documentos sin desbordes.

**Gate F5:** PDFs descargables separados, legibles y autorizados; sin perder textos y sin esperar al 29/29 global. Las cartas 1/2 no generan «informe final».

### F6 · Acceso real, Supabase y administración segura

- Configurar Supabase Auth, perfil con rol verificado, sesiones, recuperación y ruta `/admin` protegida. Definir y publicar aviso de privacidad antes de recoger respuestas reales.
- Crear migrations, constraints, RLS, RPC de cierre y reemplazo, Storage privado para reportes, revisiones, auditoría, paginación y pruebas negativas.
- Sustituir fixtures por repositorios seguros detrás de una configuración de entorno; aislar demo de producción, no copiar respuestas de test a usuarios reales.
- Construir tabla administrativa fiel a Stitch (búsqueda, filtros, paginación, estado real, detalle de expediente y auditoría), con acceso de solo lectura a los diamantes cerrados.
- Documentar política de purga: versiones eliminadas, PDFs antiguos, historial mínimo y backups. Verificar límites de acceso de admin y exportaciones.

**Gate F6:** usuario A no ve B (DB, Storage, PDF, URL); admin solo según permiso; doble renovación robusta; sin PII en logs ni build; auditoría de lectura administrativa.

### F7 · Performance, accesibilidad y regresión visual final

- Auditoría con Lighthouse/DevTools, Playwright, lector de pantalla y teclado; contrastes AA; motion reduced; zoom 200 %.
- Medir rendimiento real en equipos modestos antes de optar por motor 3D. Importación diferida de vistas administrativas/reportes; evitar animar todo en cada scroll.
- Comparar capturas finales contra las 10 Stitch. Definir tolerancia visual revisada, no un «pixel perfect» que rompa responsive o contenido real.
- Revisar estados vacíos, errores, autosave, flujo de red lenta, cierre y cancelación de modales; informe largo.
- `npm ci` + `lint` + `test` + `build` + E2E; publicar staging bajo acceso controlado; PO aprueba antes de datos reales.

**Gate F7:** matriz completa de requisitos y pruebas verdes, deuda conocida documentada, checklist seguridad y aceptación UX firmadas.

## 6. Mapa Stitch → componentes / entregables

| Pantalla del ZIP | Implementación obligatoria | Observación |
|---|---|---|
| `panorama_arquit` | Home / ProgressCards / CTAs contextuales | Datos dinámicos y módulos separados |
| `mi_diamante_arquit` | Hero + DiamondSvg10 + Acordeones + Selector A/B | Hemisferios personales/profesionales NO equivalen a A/B |
| `gu_a_de_desplegables_mi_diamante_siete_umbrales` | Accordion y drawer de detalle | Fuente útil de comportamiento expandido, no nuevas preguntas |
| `siete_umbrales_arquit` | Mapa 2/3/2 + progreso y estados | Nombres y semántica pendiente contraste con v5/demo |
| `cartas_al_futuro_arquit` | 2 cartas + lector/editor + cierre | Sello solo tras cierre real |
| `informe_dossier_arquit` | Vistas previa/final de **3 reportes** | «Dossier» como contenedor opcional, no única descarga |
| `panel_administrador_arquit` | Estadísticas + filtros + tabla + expediente | No usar números ficticios 42/29/13 en producción |
| `registro_simple_arquit` | Registro claro y accesible | Política/consentimiento y mensajes de error |
| `acceso_directivo_simple_arquit` | Login sencillo recomendado | Evitar duplicar UI de login sin criterio |
| `acceso_directivo_arquit` | Referencia premium alternativa de acceso | Passkeys/FIDO2 y custodia notarial NO confirmados |

## 7. Reglas concretas para convertir código Stitch a React

- Tomar estructura visual, **no copiar** `<script src="https://cdn.tailwindcss.com">` ni JS inline de demostración.
- Descomponer por página, bloque y componente. Mantener un inventario de elementos interactivos: cada CTA debe cambiar estado o navegar de verdad, no quedarse `href="#"`.
- Pasar clases compatibles con Tailwind 4 al pipeline local y mover tokens a `@theme` / CSS variables. Verificar visualmente porque clases y capas generadas por el CDN no son contrato de compilación.
- Usar SVG con `viewBox`, geometría intacta y controles con etiquetas. Cada faceta tiene `aria-label` y respuesta equivalente en texto; clases `data-complete` para color y motion.
- CSS Grid, flex, container queries y `clamp()` para editorial responsive; `prefers-reduced-motion` desactiva transformaciones no esenciales.
- **Motion solo para** entrada de tarjetas, transiciones de estado, acordeones, cambios de versión y realce progresivo de facetas. Los componentes de formulario deben seguir siendo utilizables con animación desactivada.
- Evitar CSS-in-JS generalista si el sistema ya tiene Tailwind/CSS; no introducir shadcn UI visualmente por defecto (Radix headless sí cuando hace falta).
- Evitar 3D/WebGL en la ruta crítica de crear, revisar, confirmar y descargar. Si se propone piloto visual 3D, mantener SVG 2D completo y testeado como alternativa.
- El sistema de diseño debe ser **temático y reutilizable**: una sola fuente de tokens, componentes documentados, ninguna página con colores arbitrarios inconsistentes.

## 8. Checklist de revisión automatizada y manual

```text
[ ] Contrato de v5 preservado y correspondencia 01–06 completa
[ ] Demo v4 inspeccionado o registrado como ausencia bloqueante
[ ] Las 10 maquetas Stitch catalogadas, screenshots conservados
[ ] Sin Tailwind CDN / scripts inline de Stitch en build de producción
[ ] 3 exploraciones + 10 decisiones por versión del diamante
[ ] Solo 2 slots A/B; v1 fija, v2 construible, v3 requiere consentimiento
[ ] Cierre de diamante 13/13 + confirmación; NO por 10 facetas solamente
[ ] Umbrales 7/7 independientes, intervenciones 7/7 separadas
[ ] Cartas 2/2 independientes
[ ] Tres informes separados con texto íntegro y diseño editorial
[ ] Admin: datos reales autorizados + expediente + auditoría
[ ] Tests RLS, Storage, URLs e idempotencia de renovación
[ ] Foco visible, reduced-motion, contraste, teclado, zoom 200 %
[ ] QA a 1440, 1366, 1024, 768 y 390 px
[ ] Unitarias, integración, Playwright, lint y build exitosos
[ ] PO valida propuesta visual y diferencias declaradas
[ ] Sin datos personales en fixtures o artefactos públicos
```

## 9. Entregables por PR y definición de terminado

Cada PR debe incluir: alcance y HU (`ARQ-xx` v5), captura antes/después, componente reutilizado, tests funcionales, pruebas de navegador (vista normal, móvil y reduced motion), cambios de DB revisados si existen, rollback plan y decision log. Un PR visual que haga bonita una pantalla pero deje cierre/consentimiento incorrectos **no está terminado**; igualmente un backend correcto detrás de una vista que no sigue Stitch tampoco cumple.

**Criterio final de calidad de interfaz:** el usuario comprende **qué ha completado, qué puede continuar y qué documento puede obtener**, sin trucos de hover, scores ficticios, efectos 3D obligatorios ni desplazamientos intrusivos.

## 10. Prompt operativo para pegar en Antigravity

> Analiza primero el repositorio existente, el demo ARQUITÉ v4 real y los 6 archivos `.md` del paquete en orden numérico. La especificación v5 es la fuente funcional; las 10 carpetas Stitch son referencia visual. Diseña una implementación React/Vite/Tailwind 4 + CSS nativo + Motion + SVG de alta fidelidad; no uses Tailwind CDN de los prototipos, no cambies taxonomías ni reglas sin ADR. Antes de editar, presenta inventario y plan de PRs; después ejecuta una fase F0–F7 a la vez con pruebas y evidencia comparativa. Prioriza dos versiones de diamante temporal, consentimientos atómicos, tres módulos cerrables por separado, PDF editorial, historial y administración segura. No uses datos personales reales antes de Auth, RLS y Storage privados auditados. No implementes WebGL/3D salvo evaluación y autorización específica. Genera diff, lint, tests y build y detalla qué quedó implementado y qué continúa pendiente.

## 11. Fuentes técnicas verificables

- React 19.3, `ViewTransition` estable: https://react.dev/blog/2026/09/09/react-19-3
- Vite 8/releases: https://vite.dev/releases y https://vite.dev/blog/announcing-vite8
- Tailwind v4 y `@theme`: https://tailwindcss.com/docs/theme
- Motion for React: https://motion.dev/docs/react
- Motion shared layout: https://motion.dev/docs/react-layout-animations
- Radix Primitives: https://www.radix-ui.com/primitives
- React Three Fiber (usar estable v9 con React 19, experimental no recomendado por defecto): https://r3f.docs.pmnd.rs/
- TanStack Table headless: https://tanstack.com/table/latest/docs/overview
- WCAG / reduced motion: https://www.w3.org/WAI/WCAG22/Techniques/css/C39
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security

**Importante:** las versiones exactas de dependencias del repositorio solo podrán fijarse tras leer su `package.json` y `lockfile`; las fuentes citadas evidencian capacidades, no estado instalado.

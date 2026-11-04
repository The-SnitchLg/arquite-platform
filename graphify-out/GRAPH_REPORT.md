# Graph Report - Arquite  (2026-11-03)

## Corpus Check
- 49 files · ~368,804 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 1, .css 1, .tsbuildinfo 1)

## Summary
- 462 nodes · 864 edges · 33 communities (32 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `83de57ab`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DiamondView.tsx
- domain.ts
- package.json
- DataRepository
- compilerOptions
- 04 · Design Brief — ARQUITÉ | UI/UX, componentes y tokens
- 06 · Plan de implementación para Antigravity — ARQUITÉ
- dependencies
- devDependencies
- 02 · TRD — ARQUITÉ | Arquitectura y contratos técnicos
- 01 · PRD — ARQUITÉ | Requisitos del producto
- 03 · App Flow — ARQUITÉ | Flujos UX y recorridos
- 05 · Backend & Data Schema — ARQUITÉ | Supabase, seguridad y versionado
- 9. Historias de usuario corregidas y priorización
- Reglas_Diseño/warm_editorial_roadmap/DESIGN.md
- referencias_stitch/warm_editorial_roadmap/DESIGN.md
- ARQUITÉ — Especificación funcional actualizada, decisiones de producto y backlog
- verify-all-reports-pdf.mjs
- 3. Regla exacta del doble diamante: versiones y renovación perpetua
- ARQUITÉ · Paquete de especificaciones integrales v6.1
- vercel.json
- ARQUITÉ — Estudio de Dirección Estratégica & Liderazgo
- scripts
- 5. Descargables con diseño diferenciado y contenido completo
- 6. Visualización gerencial óptima para los siete umbrales
- vite.config.ts
- 4. Reglas de completitud independientes y habilitación de descargables
- 7. Panel de administrador: alcance funcional y seguridad
- 13. Fuentes y trazabilidad
- 8. Modelo de datos y transacciones recomendadas
- JourneyData
- ADR-001-Visual-Architecture-And-Data-Isolation.md
- reportFilenames.ts

## God Nodes (most connected - your core abstractions)
1. `DataRepository` - 30 edges
2. `JourneyData` - 25 edges
3. `react` - 22 edges
4. `Button()` - 20 edges
5. `UserProfile` - 20 edges
6. `Card()` - 19 edges
7. `compilerOptions` - 19 edges
8. `Badge()` - 18 edges
9. `isValidNarrative()` - 15 edges
10. `02 · TRD — ARQUITÉ | Arquitectura y contratos técnicos` - 15 edges

## Surprising Connections (you probably didn't know these)
- `F1 · Design system de alto impacto y shell React` --references--> `Button()`  [INFERRED]
  Demo/Reglas_Estructura/06_Plan_Implementacion_Antigravity_ARQUITE.md → src/components/ui/Button.tsx
- `F2 · Mi Diamante: contenido real, SVG y progresión visual` --references--> `DiamondSvg10()`  [INFERRED]
  Demo/Reglas_Estructura/06_Plan_Implementacion_Antigravity_ARQUITE.md → src/features/diamond/DiamondSvg10.tsx
- `5. Catálogo de componentes a desarrollar` --references--> `AppHeader()`  [INFERRED]
  Demo/Reglas_Estructura/04_Design_Brief_UI_Tokens_ARQUITE.md → src/components/layout/AppHeader.tsx
- `5. Catálogo de componentes a desarrollar` --references--> `Badge()`  [INFERRED]
  Demo/Reglas_Estructura/04_Design_Brief_UI_Tokens_ARQUITE.md → src/components/ui/Badge.tsx
- `5. Catálogo de componentes a desarrollar` --references--> `DiamondSvg10()`  [INFERRED]
  Demo/Reglas_Estructura/04_Design_Brief_UI_Tokens_ARQUITE.md → src/features/diamond/DiamondSvg10.tsx

## Import Cycles
- None detected.

## Communities (33 total, 1 thin omitted)

### Community 0 - "DiamondView.tsx"
Cohesion: 0.13
Nodes (42): 5. Catálogo de componentes a desarrollar, lucide-react, react, react-dom, App(), AppHeader(), Badge(), BadgeProps (+34 more)

### Community 1 - "domain.ts"
Cohesion: 0.09
Nodes (34): ChoiceComparisonItem, compareDiamondVersions(), computeDiff(), DiffStatus, ExplorationComparisonItem, CANONICAL_THRESHOLDS, createInitialInterventions(), createInitialThresholds() (+26 more)

### Community 2 - "package.json"
Cohesion: 0.10
Nodes (19): name, packageManager, private, type, version, clsx, motion, @radix-ui/react-accordion (+11 more)

### Community 3 - "DataRepository"
Cohesion: 0.18
Nodes (5): 7. Máquina del doble diamante y operaciones críticas, 8. Módulos independientes y ediciones, DataRepository, AuditEvent, Dimension

### Community 4 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, baseUrl, isolatedModules, jsx, lib, module, moduleDetection (+12 more)

### Community 5 - "04 · Design Brief — ARQUITÉ | UI/UX, componentes y tokens"
Cohesion: 0.08
Nodes (24): 04 · Design Brief — ARQUITÉ | UI/UX, componentes y tokens, 10. Criterios visuales de aceptación, 11. Matriz exacta de referencia del ZIP, 12.1 Aplicación del sistema moderno de CSS, 12.2 Política de movimiento y microinteracción, 12.3 Jerarquía de calidad de visualizaciones, 12.4 Pruebas de aceptación visual adicionales, 12. Dirección de experiencia premium — innovación visual que sí añade valor (+16 more)

### Community 6 - "06 · Plan de implementación para Antigravity — ARQUITÉ"
Cohesion: 0.10
Nodes (20): 06 · Plan de implementación para Antigravity — ARQUITÉ, 10. Prompt operativo para pegar en Antigravity, 11. Fuentes técnicas verificables, 1. Prioridades innegociables, 2. Entradas y autoridad de los archivos, 3. Stack propuesto para máxima calidad visual con sentido técnico, 4. Score multicriterio interno para decidir el frontend, 5. Fases y entregables con gates (+12 more)

### Community 7 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, clsx, lucide-react, motion, @radix-ui/react-accordion, @radix-ui/react-dialog, @radix-ui/react-tabs, @radix-ui/react-tooltip (+4 more)

### Community 8 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, playwright, tailwindcss, @tailwindcss/vite, tsx, @types/node, @types/react, @types/react-dom (+3 more)

### Community 9 - "02 · TRD — ARQUITÉ | Arquitectura y contratos técnicos"
Cohesion: 0.12
Nodes (16): 02 · TRD — ARQUITÉ | Arquitectura y contratos técnicos, 10. Reportes: renderizado confiable, 11. No funcionales y seguridad, 12. Pruebas técnicas mínimas, 13. Referencias y restricciones de fuente, 14.1 Arquitectura de interacción visual, 14.2 Presupuesto de calidad medible [PROPUESTA], 14.3 Referencias oficiales del stack (+8 more)

### Community 10 - "01 · PRD — ARQUITÉ | Requisitos del producto"
Cohesion: 0.13
Nodes (14): 01 · PRD — ARQUITÉ | Requisitos del producto, 10. Criterios de aceptación prioritarios, 11. Decisiones abiertas para refinamiento, 12. Fuentes y referencias visuales, 13. Experiencia visual como criterio de calidad del producto, 1. Visión del producto, 2. Usuarios y acceso, 3. Arquitectura funcional y contenidos (+6 more)

### Community 11 - "03 · App Flow — ARQUITÉ | Flujos UX y recorridos"
Cohesion: 0.13
Nodes (14): 03 · App Flow — ARQUITÉ | Flujos UX y recorridos, 10. Pruebas de recorrido E2E, 11. Trazabilidad, 12. Microinteracciones por recorrido y límites de animación, 1. Navegación y arquitectura de información, 2. Inventario de pantallas y anclaje a Stitch, 3. Recorrido de primer acceso y primer diamante (S0–S3), 4.1 Microcopy crítico de renovación (+6 more)

### Community 12 - "05 · Backend & Data Schema — ARQUITÉ | Supabase, seguridad y versionado"
Cohesion: 0.13
Nodes (14): 05 · Backend & Data Schema — ARQUITÉ | Supabase, seguridad y versionado, 10. Índices, rendimiento y escalamiento, 11. Gobierno de datos y retención — decisiones pendientes, 12. Contratos de pruebas y liberación, 13. Referencias, 1. Decisión arquitectónica, 2. Definiciones que gobiernan el esquema, 3. Entidades y relaciones propuestas (+6 more)

### Community 13 - "9. Historias de usuario corregidas y priorización"
Cohesion: 0.13
Nodes (15): 9. Historias de usuario corregidas y priorización, ARQ-01 · Autenticación y acceso a participantes [P0], ARQ-02 · Persistencia multiusuario y control transaccional [P0], ARQ-03 · Completitud independiente por módulo [P0], ARQ-04 · Informe visual completo del diamante [P0], ARQ-05 · Doble diamante y renovación consentida [P0], ARQ-06 · Visualizador gerencial de siete umbrales y cambios [P1], ARQ-07 · Informe autónomo de cartas [P1] (+7 more)

### Community 14 - "Reglas_Diseño/warm_editorial_roadmap/DESIGN.md"
Cohesion: 0.14
Nodes (13): Brand & Style, Buttons, Chips & Pathway Badges, Color Roles & Guidelines, Colors, Components, Elevation & Depth, Inputs & Form Elements (+5 more)

### Community 15 - "referencias_stitch/warm_editorial_roadmap/DESIGN.md"
Cohesion: 0.14
Nodes (13): Brand & Style, Buttons, Chips & Pathway Badges, Color Roles & Guidelines, Colors, Components, Elevation & Depth, Inputs & Form Elements (+5 more)

### Community 16 - "ARQUITÉ — Especificación funcional actualizada, decisiones de producto y backlog"
Cohesion: 0.20
Nodes (9): 10. Casos de prueba y criterios de liberación, 11. Estrategia de implementación sin perder el demo existente, 12. Decisiones técnicas residuales (sin alterar requisitos confirmados), 14. Inventario de archivos del paquete entregado, 1.1 Principios no negociables, 1. Resumen ejecutivo y qué cambia frente al documento anterior, 2.1 Marco estratégico de los diez campos, 2. Arquitectura de contenidos conservada (estado actual del demo) (+1 more)

### Community 17 - "verify-all-reports-pdf.mjs"
Cohesion: 0.18
Nodes (7): playwright, distDir, mimeTypes, server, distDir, mimeTypes, server

### Community 18 - "3. Regla exacta del doble diamante: versiones y renovación perpetua"
Cohesion: 0.25
Nodes (8): 3.1 Semántica de los espacios, 3.2 Secuencia funcional obligatoria, 3.3 Ejemplo verificable con tres mediciones, 3.4 Confirmación de cierre (no confundir con 100%), 3.5 Consentimiento ante sobrescritura (acción irreversible desde la experiencia de usuario), 3.6 Datos/versiones y edición, 3.7 Máquina de estados (referencia de implementación), 3. Regla exacta del doble diamante: versiones y renovación perpetua

### Community 19 - "ARQUITÉ · Paquete de especificaciones integrales v6.1"
Cohesion: 0.25
Nodes (7): ARQUITÉ · Paquete de especificaciones integrales v6.1, Decisión tecnológica recomendada [PROPUESTA], Diferencias por resolver en preflight, Empezar por aquí, Fuentes y recursos incluidos, No confundir especificación con implementación, Reglas que no pueden perderse

### Community 20 - "vercel.json"
Cohesion: 0.22
Nodes (8): buildCommand, cleanUrls, framework, installCommand, name, outputDirectory, rewrites, $schema

### Community 21 - "ARQUITÉ — Estudio de Dirección Estratégica & Liderazgo"
Cohesion: 0.29
Nodes (6): 🔐 Acceso al Sistema, 🏛️ Arquitectura & Tecnologías, ARQUITÉ — Estudio de Dirección Estratégica & Liderazgo, 📂 Grafo de Conocimiento (Graphify), 🚀 Puesta en Marcha Rápida, 💎 Reglas Centrales de Producto

### Community 22 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, build, dev, preview, test, test:e2e, test:pdf

### Community 23 - "5. Descargables con diseño diferenciado y contenido completo"
Cohesion: 0.40
Nodes (5): 5.1 Informe del diamante — «Mi arquitectura estratégica», 5.2 Informe de siete umbrales — «Mapa de evolución», 5.3 Entregable Cartas — «Cartas a mi yo futuro», 5.4 Garantías documentales y calidad, 5. Descargables con diseño diferenciado y contenido completo

### Community 24 - "6. Visualización gerencial óptima para los siete umbrales"
Cohesion: 0.40
Nodes (5): 6.1 Alternativas evaluadas, 6.2 Diseño seleccionado [PROPUESTA]: «Mapa de transiciones», 6.3 Cómo representar cambios reales, 6.4 Sustento UX y accesibilidad, 6. Visualización gerencial óptima para los siete umbrales

### Community 25 - "vite.config.ts"
Cohesion: 0.40
Nodes (3): @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 26 - "4. Reglas de completitud independientes y habilitación de descargables"
Cohesion: 0.50
Nodes (4): 4.1 Definición operativa recomendada de los tres entregables, 4.2 Completitud visual versus entrega formal, 4.3 Estados de botones, 4. Reglas de completitud independientes y habilitación de descargables

### Community 27 - "7. Panel de administrador: alcance funcional y seguridad"
Cohesion: 0.50
Nodes (4): 7.1 Roles mínimos [PROPUESTA], 7.2 Secciones del administrador, 7.3 Una tensión de producto que debe ser explícita, 7. Panel de administrador: alcance funcional y seguridad

### Community 28 - "13. Fuentes y trazabilidad"
Cohesion: 0.67
Nodes (3): 13. Fuentes y trazabilidad, Fuentes externas contrastadas para fundamento y diseño, Fuentes internas proporcionadas

### Community 29 - "8. Modelo de datos y transacciones recomendadas"
Cohesion: 0.67
Nodes (3): 8.1 Pseudocódigo seguro de renovación, 8.2 Migración desde el demo, 8. Modelo de datos y transacciones recomendadas

### Community 30 - "JourneyData"
Cohesion: 0.18
Nodes (13): AppHeaderProps, NavTab, AdminViewProps, DiamondViewProps, InterventionsViewProps, LettersViewProps, PanoramaViewProps, ReportsHubViewProps (+5 more)

### Community 32 - "reportFilenames.ts"
Cohesion: 0.67
Nodes (3): formatISODate(), getReportFilename(), ReportFilenameMeta

## Knowledge Gaps
- **13 isolated node(s):** `@radix-ui/react-accordion`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `@supabase/supabase-js`, `clsx` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 278 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `DiamondView.tsx` to `domain.ts`, `package.json`, `JourneyData`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **What connects `@radix-ui/react-accordion`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DiamondView.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13114754098360656 - nodes in this community are weakly interconnected._
- **Why does `5. Catálogo de componentes a desarrollar` connect `DiamondView.tsx` to `04 · Design Brief — ARQUITÉ | UI/UX, componentes y tokens`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `domain.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08562367864693446 - nodes in this community are weakly interconnected._
- **Why does `04 · Design Brief — ARQUITÉ | UI/UX, componentes y tokens` connect `04 · Design Brief — ARQUITÉ | UI/UX, componentes y tokens` to `DiamondView.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
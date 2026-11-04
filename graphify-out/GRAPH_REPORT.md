# Graph Report - Arquite  (2026-11-04)

## Corpus Check
- 53 files · ~371,608 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 1, .css 1, .tsbuildinfo 1)

## Summary
- 479 nodes · 900 edges · 29 communities (25 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.94)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cd0af177`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DiamondView.tsx
- storage.ts
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
- playwright
- ARQUITÉ · Paquete de especificaciones integrales v6.1
- vercel.json
- ARQUITÉ — Estudio de Dirección Estratégica & Liderazgo
- scripts
- @supabase/supabase-js
- vite-env.d.ts
- vite.config.ts
- JourneyData
- ADR-001-Visual-Architecture-And-Data-Isolation.md
- reportFilenames.ts

## God Nodes (most connected - your core abstractions)
1. `DataRepository` - 35 edges
2. `JourneyData` - 26 edges
3. `react` - 22 edges
4. `UserProfile` - 21 edges
5. `Button()` - 20 edges
6. `Card()` - 19 edges
7. `compilerOptions` - 19 edges
8. `Badge()` - 18 edges
9. `isValidNarrative()` - 15 edges
10. `02 · TRD — ARQUITÉ | Arquitectura y contratos técnicos` - 15 edges

## Surprising Connections (you probably didn't know these)
- `F1 · Design system de alto impacto y shell React` --references--> `Button()`  [INFERRED]
  Demo/Reglas_Estructura/06_Plan_Implementacion_Antigravity_ARQUITE.md → src/components/ui/Button.tsx
- `5. Catálogo de componentes a desarrollar` --references--> `AppHeader()`  [INFERRED]
  Demo/Reglas_Estructura/04_Design_Brief_UI_Tokens_ARQUITE.md → src/components/layout/AppHeader.tsx
- `5. Catálogo de componentes a desarrollar` --references--> `Badge()`  [INFERRED]
  Demo/Reglas_Estructura/04_Design_Brief_UI_Tokens_ARQUITE.md → src/components/ui/Badge.tsx
- `F2 · Mi Diamante: contenido real, SVG y progresión visual` --references--> `DiamondSvg10()`  [INFERRED]
  Demo/Reglas_Estructura/06_Plan_Implementacion_Antigravity_ARQUITE.md → src/features/diamond/DiamondSvg10.tsx
- `5. Catálogo de componentes a desarrollar` --references--> `DiamondSvg10()`  [INFERRED]
  Demo/Reglas_Estructura/04_Design_Brief_UI_Tokens_ARQUITE.md → src/features/diamond/DiamondSvg10.tsx

## Import Cycles
- None detected.

## Communities (29 total, 4 thin omitted)

### Community 0 - "DiamondView.tsx"
Cohesion: 0.16
Nodes (35): lucide-react, react, react-dom, App(), AppHeader(), NavTab, Badge(), BadgeProps (+27 more)

### Community 1 - "storage.ts"
Cohesion: 0.07
Nodes (43): 5. Catálogo de componentes a desarrollar, F2 · Mi Diamante: contenido real, SVG y progresión visual, ChoiceComparisonItem, compareDiamondVersions(), computeDiff(), DiffStatus, ExplorationComparisonItem, CANONICAL_EXPLORATIONS (+35 more)

### Community 2 - "package.json"
Cohesion: 0.11
Nodes (18): name, packageManager, private, type, version, clsx, motion, @radix-ui/react-accordion (+10 more)

### Community 3 - "DataRepository"
Cohesion: 0.15
Nodes (7): 7. Máquina del doble diamante y operaciones críticas, 8. Módulos independientes y ediciones, DataRepository, AuditEvent, Dimension, InterventionKind, ThresholdStatus

### Community 4 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, baseUrl, isolatedModules, jsx, lib, module, moduleDetection (+12 more)

### Community 5 - "04 · Design Brief — ARQUITÉ | UI/UX, componentes y tokens"
Cohesion: 0.08
Nodes (24): 04 · Design Brief — ARQUITÉ | UI/UX, componentes y tokens, 10. Criterios visuales de aceptación, 11. Matriz exacta de referencia del ZIP, 12.1 Aplicación del sistema moderno de CSS, 12.2 Política de movimiento y microinteracción, 12.3 Jerarquía de calidad de visualizaciones, 12.4 Pruebas de aceptación visual adicionales, 12. Dirección de experiencia premium — innovación visual que sí añade valor (+16 more)

### Community 6 - "06 · Plan de implementación para Antigravity — ARQUITÉ"
Cohesion: 0.10
Nodes (19): 06 · Plan de implementación para Antigravity — ARQUITÉ, 10. Prompt operativo para pegar en Antigravity, 11. Fuentes técnicas verificables, 1. Prioridades innegociables, 2. Entradas y autoridad de los archivos, 3. Stack propuesto para máxima calidad visual con sentido técnico, 4. Score multicriterio interno para decidir el frontend, 5. Fases y entregables con gates (+11 more)

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
Cohesion: 0.05
Nodes (41): 10. Casos de prueba y criterios de liberación, 11. Estrategia de implementación sin perder el demo existente, 12. Decisiones técnicas residuales (sin alterar requisitos confirmados), 13. Fuentes y trazabilidad, 14. Inventario de archivos del paquete entregado, 1.1 Principios no negociables, 1. Resumen ejecutivo y qué cambia frente al documento anterior, 2.1 Marco estratégico de los diez campos (+33 more)

### Community 17 - "verify-all-reports-pdf.mjs"
Cohesion: 0.22
Nodes (6): distDir, mimeTypes, server, distDir, mimeTypes, server

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

### Community 25 - "vite.config.ts"
Cohesion: 0.40
Nodes (3): @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 30 - "JourneyData"
Cohesion: 0.18
Nodes (12): AppHeaderProps, AdminViewProps, DiamondViewProps, InterventionsViewProps, LettersViewProps, PanoramaViewProps, ReportsHubViewProps, FutureLettersReportProps (+4 more)

### Community 32 - "reportFilenames.ts"
Cohesion: 0.67
Nodes (3): formatISODate(), getReportFilename(), ReportFilenameMeta

## Knowledge Gaps
- **12 isolated node(s):** `@radix-ui/react-accordion`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `clsx`, `motion` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 284 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `DiamondView.tsx` to `storage.ts`, `package.json`, `JourneyData`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **What connects `@radix-ui/react-accordion`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `storage.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06688311688311688 - nodes in this community are weakly interconnected._
- **Why does `5. Catálogo de componentes a desarrollar` connect `storage.ts` to `DiamondView.tsx`, `04 · Design Brief — ARQUITÉ | UI/UX, componentes y tokens`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Why does `04 · Design Brief — ARQUITÉ | UI/UX, componentes y tokens` connect `04 · Design Brief — ARQUITÉ | UI/UX, componentes y tokens` to `storage.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Should `DataRepository` be split into smaller, more focused modules?**
  _Cohesion score 0.14795008912655971 - nodes in this community are weakly interconnected._
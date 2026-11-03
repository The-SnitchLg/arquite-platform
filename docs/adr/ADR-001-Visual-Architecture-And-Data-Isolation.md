# ADR-001: Visual Architecture, Dual-Diamond Lifecycle & Data Isolation

**Fecha:** 2026-11-03  
**Estado:** Aprobado  
**Contexto:**  
ARQUITÉ es una plataforma premium de arquitectura estratégica de liderazgo basada en la adaptación personal y profesional del modelo *Playing to Win*, complementada con tres exploraciones, siete umbrales, siete intervenciones y dos cartas al futuro.

**Decisiones Técnicas Clave:**
1. **Frontend:** React 19.x con Vite 8.x, Tailwind CSS 4 con `@theme` y variables nativas CSS, Motion for React para microinteracciones fluidas y accesibles, y primitivas headless de Radix UI.
2. **Visualización de Diamante:** SVG React nativo con geometría vectorial idéntica a la del demo v4 (`viewBox="105 24 630 495"`), con 10 facetas interactivas y 3 exploraciones contextuales. Se rechaza WebGL/Three.js para el núcleo por penalizar accesibilidad, rendimiento y exportación documental.
3. **Ciclo de Doble Diamante:** Se mantiene una ventana de dos slots (A y B). Slot A es la referencia inmutable y Slot B la actualización activa. La creación de un tercer ciclo exige consentimiento explícito para la sustitución atómica de la versión más antigua.
4. **Completitud y Cierre Independiente:**
   - Mi Diamante: 13/13 (3 exploraciones + 10 decisiones) + confirmación de cierre.
   - Siete Umbrales: 7/7 con estado y reflexión válida.
   - Cartas al Futuro: 2/2 (personal y profesional).
   - El progreso global de 29 campos es estrictamente informativo y no condiciona los reportes individuales.
5. **Ciberseguridad & Aislamiento:**
   - Autenticación mediante Supabase Auth.
   - Tablas bajo el prefijo `arq_` con Row Level Security (RLS) mandatorio en cada entidad.
   - Rol de administrador protegido a nivel de servidor (`larrygomezg@gmail.com`).
   - Pista de auditoría obligatoria para consultas administrativas y eventos de sustitución.
6. **Filosofía Ponytail (Reducción de consumo):**
   - Máxima reutilización de APIs nativas de plataforma.
   - Cero dependencias superfluas.
   - Código conciso, estructurado y modular.

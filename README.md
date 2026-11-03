# ARQUITÉ — Estudio de Dirección Estratégica & Liderazgo

Plataforma premium para la formulación, evolución y preservación de decisiones estratégicas de liderazgo, adaptando la cascada de elecciones de *Playing to Win* (A. G. Lafley & Roger L. Martin) a dos dimensiones —personal y profesional—, con dos versiones temporales del Diamante, mapa gerencial de Siete Umbrales, planes de intervención, Cartas al Futuro y reportes autónomos descargables.

---

## 🏛️ Arquitectura & Tecnologías

- **Frontend:** React 19 + Vite 8 + TypeScript + Tailwind CSS 4 (`@theme`).
- **Interacción & Animación:** Motion for React + SVG vectorial interactivo.
- **Accesibilidad:** Radix UI Primitives (WCAG 2.2 AA).
- **Backend & Persistencia:** Supabase Auth + PostgreSQL 17 + Row Level Security (RLS) + Storage Privado.
- **Auditoría & Conocimiento:** Pista de auditoría transaccional y grafo de conocimiento con **Graphify**.

---

## 🚀 Puesta en Marcha Rápida

```bash
# 1. Instalar dependencias
pnpm install

# 2. Iniciar servidor de desarrollo
pnpm dev

# 3. Compilar para producción
pnpm build
```

---

## 🔐 Acceso al Sistema

- **Acceso Autenticado:** El ingreso se realiza a través de la pantalla de inicio de sesión con credenciales autorizadas.
- **Registro de Participantes:** Cualquier participante puede registrarse directamente para iniciar su recorrido estratégico.

---

## 💎 Reglas Centrales de Producto

1. **Tres exploraciones por versión:** Entorno, Talentos Singulares, Posibilidades.
2. **Diez decisiones de *Playing to Win*:** 5 personales y 5 profesionales (10 facetas en el Diamante SVG).
3. **Cierre del Diamante 13/13:** Exige las 3 exploraciones + 10 decisiones validadas y confirmación expresa para fijar snapshot inmutable.
4. **Ciclo de Doble Diamante:** Máximo dos slots visibles (A = Referencia anterior inmutable; B = Actualización). La creación de una versión 3 exige consentimiento atómico de sustitución de v1.
5. **Tres informes autónomos:**
   - *Mi Arquitectura Estratégica* (Informe Diamante 13/13).
   - *Mapa de Evolución* (Informe Siete Umbrales 7/7).
   - *Cartas a mi Yo Futuro* (Informe Epistolar 2/2).
   - El progreso global de 29 unidades es meramente informativo y jamás bloquea las descargas individuales.

---

## 📂 Grafo de Conocimiento (Graphify)

El repositorio incluye un grafo de conocimiento navegable generado con `graphify`:
- Resumen en `graphify-out/GRAPH_REPORT.md` (201 nodos, 569 aristas, 9 comunidades).
- Visualización interactiva en `graphify-out/graph.html`.

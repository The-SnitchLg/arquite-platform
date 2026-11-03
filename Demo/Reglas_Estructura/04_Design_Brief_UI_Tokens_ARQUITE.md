# 04 · Design Brief — ARQUITÉ | UI/UX, componentes y tokens

**Versión:** 6.1 · 03/11/2026  
**Referencia visual primaria:** `referencias_stitch/warm_editorial_roadmap/DESIGN.md` y las diez carpetas de Stitch con `screen.png` + `code.html`.  
**Regla de autoridad:** preservar **lenguaje estético** de Stitch; adaptar contenido, textos, flujos y habilitación de acciones a la especificación ARQUITÉ v5. No tomar cifras ficticias de la maqueta como datos reales ni convertir títulos de los siete umbrales en definiciones del dominio sin validación.

## 1. Dirección visual: «Warm Editorial Roadmap»

Estética **editorial minimalista, cálida y arquitectónica**, con fondo de papel marfil, bloques blancos, titulares serif elegantes, textos de interfaz geométricos y una acentuación verde teal; terracota para alertas/acciones puntuales. Debe sentirse como un estudio de dirección estratégica, **no** una plataforma escolar, un CRM ni una pantalla bancaria.

**Sensación buscada:** claridad, introspección, sobriedad contemporánea, orden modular y confianza. **Evitar:** gradientes saturados, tarjetas flotantes excesivas, dashboards oscuros, rankings de «madurez», gamificación con porcentajes de calidad personal, jerarquía visual basada solo en color.

## 2. Tokens cromáticos rastreables

Los valores siguientes proceden de `DESIGN.md` (paleta y apartado Brand & Style). Cuando este archivo alterna `primary: #00685f` y **Primary narrativo `#0D9488`**, se propone usarlos en funciones diferenciadas para evitar inconsistencias; ratificar en una muestra renderizada antes de congelar diseño.

| Token CSS propuesto | Valor | Uso |
|---|---|---|
| `--arq-canvas` | `#FBFAF7` | Fondo general cálido |
| `--arq-canvas-subtle` | `#F7F5F0` | Bandas y superficies secundarias |
| `--arq-surface` | `#FFFFFF` | Tarjetas, campos y modales |
| `--arq-border` | `#E9E6DF` | Límites, separadores |
| `--arq-primary` | `#00685F` | Acciones primarias y encabezado, según tokens estructurados |
| `--arq-primary-accent` | `#0D9488` | Hitos y estados de foco según guía narrativa |
| `--arq-mint` | `#2DD4BF` | Resalte puntual de progreso/foco, **no** texto pequeño sobre claro |
| `--arq-secondary` | `#EA580C` | Terracota para atención y acciones cautelosas |
| `--arq-text` | `#1E293B` | Titulares y texto principal |
| `--arq-text-muted` | `#64748B` | Metadatos, sujeto a contraste AA |
| `--arq-sage-soft` | `#EEF3E7` | Chips positivos y tarjetas de ruta |
| `--arq-terracotta-soft` | `#FCE7D9` | Chips de aviso/edición pendiente |
| `--arq-focus-soft` | `rgba(45,212,191,.25)` | Anillo exterior de foco acompañado por borde contrastante |

**Advertencia:** `#0D9488` y `#64748B` deben comprobarse con el fondo específico y tamaño real; no declarar WCAG AA por inspección visual. El color de cada faceta indica únicamente *campo completo*, no valoración del individuo.

## 3. Tipografía, espaciado y elevación

**Familias objetivo de `DESIGN.md`:** Newsreader para titulares editoriales; Plus Jakarta Sans para cuerpos, controles, tablas y etiquetas; usar alternativas seguras (`Georgia`, `system-ui`) si la carga de fuentes falla, sin depender de una URL externa en un PDF crítico. No distribuir archivos de fuentes sin licencia.

| Estilo | Escritorio | Móvil | Uso |
|---|---|---|---|
| Hero | 56/64 px, peso 400 | 36/44 px | Título Panorama / Mi Diamante |
| Headline XL | 40/48 px | 28/36 px | Títulos de secciones principales |
| Headline LG | 32/40 px | 26–28 px **[PROPUESTA]** | Subtítulos narrativos |
| Headline MD | 24/32 px | 22/30 px **[PROPUESTA]** | Secciones / cuadros |
| Body LG | 18/28 px | 16–18 px **[PROPUESTA]** | Introducciones |
| Body MD | 15/24 px | 15/24 px | Lectura y formularios |
| Body SM | 13/20 px | 13/20 px | Metadatos; verificar contraste |
| Labels | 11–12 px semibold | 12–13 px **[PROPUESTA]** | Categorías y chips, nunca único soporte de estado |

**Malla de `DESIGN.md`:** escritorio ≥1024: 12 columnas, contenedor máx. 1320 px, gutter 24 px y margen exterior 48 px; tablet 768–1023: 8 columnas, márgenes 32 px; móvil <768: 4 columnas, gutter 16 px y margen 20 px. Espaciado base 4, 8, 16, 24, 40 y 64 px. Radios: botones y controles 8 px; tarjetas 16–24 px; chips píldora. Sombras sutiles:

```css
:root {
  --arq-shadow-card: 0 2px 8px -2px rgba(30,41,59,.04), 0 1px 3px -1px rgba(30,41,59,.02);
  --arq-shadow-hover: 0 12px 24px -6px rgba(30,41,59,.06), 0 4px 10px -2px rgba(30,41,59,.03);
  --arq-shadow-modal: 0 24px 48px -12px rgba(30,41,59,.08), 0 8px 16px -4px rgba(30,41,59,.04);
}
```

## 4. Navegación y shell

Tomar de `panorama_arquit/screen.png` la barra superior, el logo tipográfico `ARQUITÉ · ESTUDIO DE DIRECCIÓN`, pestañas activas suaves, ícono de perfil, máximo ancho y pie editorial. La posición administrativa depende del rol. Añadir estados de sesión y errores discretos.

- **Participante:** Panorama, Mi Diamante, Siete Umbrales, Cartas al Futuro, Informes. Ruta de intervención disponible desde Umbrales (o como submenú).
- **Administrador:** Panel de Administración, Recepciones, Entregables, Auditoría; puede regresar a la vista propia solo si tiene perfil participante.
- **Sin autenticación:** pantalla de acceso/registro; el menú del participante no debe estar accesible con respuestas reales.

En las maquetas la navegación incorpora `Informe Dossier` singular; en producto deben existir **informes por módulo**. Se puede conservar «Informes» como destino genérico, pero dentro se presentan tres tarjetas separadas con estados de elegibilidad.

## 5. Catálogo de componentes a desarrollar

| ID | Componente | Referencia Stitch | Comportamiento final |
|---|---|---|---|
| C01 | `AppHeader` / `NavigationTabs` | Panorama / todas | Navegación activa, acceso por rol y responsive |
| C02 | `EditorialHero` | Panorama / Diamante | Título, introducción y CTA adecuado |
| C03 | `ModuleProgressCard` | Panorama | 13/13, 7/7, 2/2 y estado confirmado por separado |
| C04 | `DiamondSvg10` | Mi Diamante | 10 facetas, 5 personales y 5 profesionales, color por campo válido; leyenda textual |
| C05 | `DiamondVersionSelector` | Mi Diamante | `Versión inicial/Anterior/Actual`, fechas y rol editable/solo lectura reales |
| C06 | `DiamondComparison` | **Nuevo diseño** inspirado en Mi Diamante | Dos paneles A/B, 3+10 campos, cambios literales; móvil apilado |
| C07 | `ExplorationAccordion` | Mi Diamante + Guía de desplegables | 3 paneles con respuesta larga y autosave; propiedad por versión |
| C08 | `DecisionAccordion` | Mi Diamante + Guía | 10 decisiones, selector personal/profesional, estados por faceta |
| C09 | `CompletionMeter` | Panorama / Umbrales | Progreso estructural con texto `x/y`, no score de calidad |
| C10 | `ThresholdBand` y `ThresholdStation` | Siete Umbrales | 3 franjas 2/3/2, tarjetas, estado y evidencia; catálogo aprobado |
| C11 | `ThresholdDetailDrawer` / `HistoryTimeline` | Guía / Siete Umbrales | Reflexión íntegra, historial verdadero y antes/después si existe |
| C12 | `InterventionEditor` | **Nuevo diseño** basado en tarjetas y guía | Siete planes con tipo, acción y evidencia; progreso autónomo |
| C13 | `LetterEditor` / `LetterTabs` | Cartas | Editor de 2 cartas con estado borrador/edición y fechas |
| C14 | `ReviewAndConfirmDialog` | Cartas (modal de sello) / nueva vista | Cierre con contenido completo y consecuencias explícitas |
| C15 | `ReplacementConsentDialog` | **Nuevo** con estilo de Cartas | Dos versiones identificadas, checkbox no premarcado, descarga/cancelación |
| C16 | `ReportPreview` / `ReportCard` | Informe Dossier | Plantilla editorial distinta para cada módulo, previa vs final |
| C17 | `AdminStatCard` | Panel Administrador | KPIs reales, etiqueta, período |
| C18 | `ReceiptsTable` / `Filters` | Panel Administrador | Búsqueda, filtros, paginación, acceso al expediente |
| C19 | `ParticipantDossierDrawer` | Modal en panel | Respuestas y versiones existentes, descargas autorizadas, auditoría |
| C20 | `SaveStatus` / `FeedbackInline` | Guía / editores | Guardando/guardado/error/conflicto con `aria-live` |

**Componentes de apoyo:** `StatusChip`, `Badge`, `Checkbox`, `FileDownloadButton`, `EmptyState`, `AccessibleModal`, `TextArea`, `DateMeta`, `AuditTimeline`, `Skeleton`. No construir «todo en un solo componente» por economía inicial.

## 6. Especificación de las vistas principales

### V01 · Panorama (referencia `panorama_arquit`)

Conservar bienvenida editorial, tarjetas de tres módulos y sección «Direcciones principales». Sustituir el estado ficticio por: completitud por módulo, último guardado, estado de cierre, `Continuar` y `Descargar informe` solo si es elegible. Ruta de intervención puede aparecer como una cuarta pieza secundaria sin convertirla en cuarto reporte obligatorio. Cifras de ejemplo como «7 de 7» no deben salir de HTML estático al conectar datos.

### V02 · Mi Diamante (referencia `mi_diamante_arquit`)

**Hero** izquierda con título y frase, **selector de versión** derecha. **Tarjeta grande central** con SVG de 10 facetas coloreadas; leyenda de personal y profesional. El gráfico del ZIP presenta ambas mitades a modo de silueta, pero **no** resuelve A/B temporal por sí solo: incluir un comparador explícito de dos versiones y no confundir los dos hemisferios de un diamante con dos diamantes distintos.

Debajo del SVG, dos secciones: tres exploraciones y diez decisiones agrupadas en 5 personales + 5 profesionales (el ZIP muestra cinco textos de ejemplo; no inferir que ya contiene las diez respuestas completas). Texto largo se despliega sin corte. Contrato de completitud: `10/10 facetas activas` puede coexistir con `12/13` de informe pendiente.

### V03 · Comparación y consentimiento (NUEVO)

Escritorio: dos tarjetas simétricas `A – Versión anterior [fecha]`, `B – Actualización [fecha]`; encabezado de estado y acciones; barra de navegación de 13 campos con marcas de cambios; ninguna de las dos tarjetas debe ser editable después de cerrar. En ciclo de renovación, modal específico con identidad de v1/v2, aviso de sustitución y checkbox claro. En móvil: selector `Anterior/Actual` y modo «Ver cambios» con paneles apilados; la comparación no depende de vista side by side.

### V04 · Siete Umbrales (referencia `siete_umbrales_arquit`)

Conservar tres capítulos: Funcional, Identitaria, Trascendente; tarjetas 2/3/2; estado y desplegables. **No importar nombres literales de la captura** a la base de datos: hay diferencia con v5; resolver catálogo. Completar estación exige estado seleccionado y reflexión/evidencia, no avanzar de nivel jerárquico. Timeline inferior de revisiones reales en vez de radar o índice psicométrico.

### V05 · Cartas al futuro (referencia `cartas_al_futuro_arquit`)

Área de lectura/escritura amplia con tipografía cómoda, dos tabs y ayudas contextuales colapsables. Conservar microinteracciones editoriales «Guardar borrador» y «Revisar». El botón «Sellar definitivamente» de maqueta requiere adaptación a reglas **del módulo 2/2**. No usar imagen adjunta de Stitch como contenido real de un participante ni asignar firma inexistente.

### V06 · Informes (referencia `informe_dossier_arquit`)

Hereda portada, ritmos de sección, márgenes, numeración/folio, impresión. Construir **tres vistas finales**: informe de diamante, mapa de umbrales y colección de dos cartas; cada una contiene el texto íntegro del snapshot. Botón `Descargar PDF` solo si backend confirma módulo cerrado. La maqueta de dossier enfocada en siete umbrales no sustituye otros dos reportes.

### V07 · Administrador (referencia `panel_administrador_arquit`)

Conservar tres tarjetas resumen, filtros, tabla y modal de expediente, pero sustituir nombres, fechas y cantidades de demo por datos autorizados. En el modal permitir seleccionar módulo y versión, no descargar un «dossier» por defecto si la regla exige informes separados. Registrar accesos al detalle y exportaciones.

### V08 · Acceso y registro (referencias `registro_simple_arquit`, `acceso_directivo_simple_arquit`)

Reutilizar composición centrada, campos claros, aviso de privacidad y error legible. La alternativa `acceso_directivo_arquit` es **exploración visual** de autenticación reforzada; no habilitar FIDO2/«bóveda» como requisito ni afirmar garantías notariales sin implementación/auditoría correspondientes.

## 7. Acordeones y estados de edición — guía de diseño

Según `gu_a_de_desplegables_mi_diamante_siete_umbrales`, el patrón permite mostrar contenido resumido y desplegarlo para editar, revisar o añadir evidencia. Contrato mínimo:

- Resumen cerrado con nombre, estado, extracto truncado **solo en tarjeta** y fecha; al desplegar, **texto completo**.
- Un botón explícito para edición del borrador; al cerrar versión, acceso de lectura sin controles de edición.
- Guardado visible y accesible; evitar confundir `desplegar` con `validar`.
- Acciones agrupadas en barra final; evitar varios botones primarios simultáneos.
- «Desplegar todos» no debe causar pérdida de foco, lag ni escritura accidental.

## 8. Estados de UI y microcopy

| Escenario | Estado / acción visual | Texto sugerido |
|---|---|---|
| Faltan campos | Chip neutro, contador | «Faltan 2 de 13 elementos para revisar tu diamante» |
| Facetas 10/10 pero exploración faltante | Diamante completo visual, aviso informativo | «Todas las facetas tienen respuesta; falta una exploración» |
| 13/13 sin confirmación | CTA principal habilitado | «Revisar y confirmar diamante» |
| Versión confirmada | Sello/fecha no editable | «Versión confirmada el [fecha]. Solo lectura» |
| Segundo ciclo | B claro editable y A atenuado | «Tu actualización comienza vacía. Consulta la anterior» |
| Reemplazo | Fondo neutral + acento atención, checkbox | «Esta acción sustituirá la versión más antigua; confirma cuál es» |
| Umbral completado | Estado textual + fecha | «Reflexión registrada» (no «nivel superado») |
| 7/7 umbrales | Acción de informe | «Informe de umbrales disponible» |
| Una carta completada | Estado parcial | «1 de 2 cartas listas; el informe final requiere ambas» |
| Fallo de PDF | Error contextual, reintento | «No se generó el archivo. Tu cierre sigue guardado» |

## 9. Accesibilidad, motion y PDF

Objetivo WCAG 2.2 AA; controles operables con teclado, área clicable cómoda, contraste medido por estado, foco 2–3 px, errores junto a campos, `aria-live` para autosave, SVG con `title/desc` y alternativa textual, prefers-reduced-motion, fechas y porcentajes accesibles. Evitar usar exclusivamente `verde/naranja` como significado. Los PDFs no deben imprimir UI (menús y botones): hojas A4 con `@page`, saltos apropiados, encabezado y pie, texto sin truncar, elemento gráfico vectorial y capítulos completos. Un PDF final es **dato sensible**, no asset público.

## 10. Criterios visuales de aceptación

`DS-01` correspondencia estética con las pantallas base; `DS-02` misma paleta y jerarquía en 8 vistas; `DS-03` no hay colisión de SVG y exploraciones; `DS-04` dos diamantes temporales sin confundir hemisferios; `DS-05` 3 capas/7 estaciones con etiquetas accesibles; `DS-06` comparación móvil entendible; `DS-07` modal de reemplazo claro y no premarcado; `DS-08` admin con datos dinámicos, no cifras de demo; `DS-09` tres plantillas PDF diferenciadas y texto íntegro; `DS-10` 1440/1366/1024/768/390 y zoom 200% sin perder tareas clave.

## 11. Matriz exacta de referencia del ZIP

| Ruta base `referencias_stitch/` | Qué se conserva | Qué no se traslada como negocio |
|---|---|---|
| `panorama_arquit` | Hero, cards, microcopy cálido, navegación | Datos ficticios y progreso de muestra |
| `mi_diamante_arquit` | Geometría, layout, 3 exploraciones y acordeones | Interpretar personal/profesional como A/B; cinco ejemplos como 10 respuestas |
| `siete_umbrales_arquit` | Franjas, tarjetas, chips | Nombres diferentes a v5 sin validación |
| `cartas_al_futuro_arquit` | Editor, pestañas, ayudas, modal | «Sellar» una carta equivale a 2/2 final |
| `informe_dossier_arquit` | Diseño editorial del PDF | Un solo dossier para todos los módulos |
| `panel_administrador_arquit` | KPI/tabla/filtros/modal | Valores de 42, 29, 13; nombres de muestra y permisos supuestos |
| `registro_simple_arquit` | Registro simple | Consentimiento omitido o datos de ejemplo |
| `acceso_directivo_simple_arquit` | Login limpio | Rol determinado por botón |
| `acceso_directivo_arquit` | Estética alternativa | Passkey/FIDO2, notaría digital como prestaciones existentes |
| `gu_a_de_desplegables_mi_diamante_siete_umbrales` | Anatomía y UX de desplegables | Considerar acciones de demo como persistencia real |


## 12. Dirección de experiencia premium — innovación visual que sí añade valor

**[PROPUESTA de diseño]** La interfaz debe sentirse como un **atlas vivo de decisiones**: la navegación no solo abre pantallas, sino que revela conexiones entre exploraciones, elecciones, versiones, umbrales y documentos. El efecto «premium» proviene de la jerarquía tipográfica, consistencia, respuesta al usuario y representación propia del dominio, no de animaciones interminables.

| Momento | Tratamiento visual premium | Sustento funcional |
|---|---|---|
| Primera entrada | Hero editorial con entrada suave de encabezado, tres módulos y CTA principal; microtextura sutil de papel **CSS**, no imagen gigante | Orienta el recorrido, no inventa resultados |
| Editar una respuesta | Acordeón expansible y estado `Guardando / Guardado / No guardado` sin salto; contador de requisitos | Evita pérdida y proporciona feedback |
| Completar una decisión | Faceta SVG pasa de neutral a verde/terracota por su dimensión con breve interpolación | Activación = respuesta estructuralmente válida, no calidad |
| Cambiar v1→v2 | Reorganización animada del espacio usando Motion; el diamante anterior adquiere etiqueta `Solo lectura` | Ayuda a diferenciar dos momentos temporales |
| Comparar A/B | Dos paneles coordinados con 13 campos en paralelo; resaltar literalidad de cambios mediante contorno/etiqueta | Evita «score de mejora» ficticio |
| Explorar umbrales | Capas 2/3/2 y estaciones que despliegan ficha lateral y evento histórico real; conexión SVG sutil | Mapa conceptual no lineal, no escalera de madurez |
| Sellar una carta | Transición breve de editor a vista editorial `Confirmado` **solo tras persistencia validada** | Feedback sin confundir progreso con aprobación |
| Exportar | Transición de vista del módulo a previsualización editorial y progreso de documento | Tres salidas por separado, PDF íntegro |
| Administrar | Grid gerencial sobrio, tabla y filtros animados mínimamente, skeleton para carga | La información y privacidad prevalecen |

### 12.1 Aplicación del sistema moderno de CSS

**Elección:** Tailwind CSS v4 para composición reusable, **CSS nativo** para detalles de marca. Las utilidades no sustituyen la dirección de arte. Aprovechar CSS moderno: `@theme` para tokens, `clamp()` para escalas fluidas, `@container` para tarjetas que cambian por espacio disponible, `color-mix()` con contrastes verificados, `@starting-style` para apariciones sencillas, `scrollbar-gutter: stable` para evitar desplazamientos, `text-wrap: balance` en titulares y `prefers-reduced-motion` para accesibilidad.

```css
@import "tailwindcss";

@theme {
  --color-arq-canvas: #FBFAF7;
  --color-arq-paper: #FFFFFF;
  --color-arq-ink: #1E293B;
  --color-arq-deep: #00685F;
  --color-arq-teal: #0D9488;
  --color-arq-clay: #EA580C;
  --color-arq-rule: #E9E6DF;
  --font-arq-display: "Newsreader", Georgia, serif;
  --font-arq-ui: "Plus Jakarta Sans", system-ui, sans-serif;
}

:root { color-scheme: light; }
body { background: var(--color-arq-canvas); color: var(--color-arq-ink); }
.arq-editorial-title { font-family: var(--font-arq-display); font-size: clamp(2.25rem, 5vw, 3.5rem); text-wrap: balance; }
.arq-interactive-card { container-type: inline-size; border: 1px solid var(--color-arq-rule); }
@container (max-width: 25rem) { .arq-interactive-card__layout { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
```

**No replicar** `cdn.tailwindcss.com`, `script` inline y cifras duras de `code.html`: cada maqueta debe reconstruirse como componentes React con estilos compilados. Las fuentes deben servirse legalmente, preferentemente desde assets propios/licenciados; los PDF requieren estrategia de tipografías compatible con el servicio de impresión.

### 12.2 Política de movimiento y microinteracción

- **0–120 ms:** microrespuesta de foco, pulsación, hover y cambio de chip con CSS.
- **120–240 ms:** acordeones, despliegue de paneles y transiciones pequeñas con Motion cuando CSS no alcance.
- **240–400 ms:** transición de vista o comparación A/B con movimiento mínimo, solo en dispositivos adecuados.
- **0 ms/no esencial:** con `prefers-reduced-motion`, sin penalizar acceso a formularios ni estado.
- `React.ViewTransition` de React 19.3 puede servir para transiciones de vistas; **no animar simultáneamente el mismo elemento con Motion y ViewTransition**.
- Ninguna transición de cierre irreversible se ejecuta visualmente antes del **éxito** de la operación servidor; rollback UI explícito ante error.

### 12.3 Jerarquía de calidad de visualizaciones

1. **Obligatorio:** SVG de diamante con 10 facetas, etiquetado accesible, color según completitud y contenido real.
2. **Obligatorio:** comparador A/B con dos momentos y respuestas íntegras; tamaños adaptables.
3. **Obligatorio:** mapa de umbrales 2/3/2 con estaciones, historia y cambio real, sin calificación.
4. **Obligatorio:** 3 reportes documentales con identidad editorial coherente y paginación.
5. **Mejora condicionada:** animaciones de conexiones entre nodos, subrayados compartidos y entrada por sección.
6. **No recomendado para MVP:** 3D, partículas, gráficos radar, parallax forzado o fondos WebGL; solo después de prototipo que pruebe utilidad y rendimiento con fallback 2D.

### 12.4 Pruebas de aceptación visual adicionales

`DS-11` una faceta cambia estado a partir de contenido real con transición accesible; `DS-12` animaciones deshabilitadas no alteran funcionalidad; `DS-13` las dos versiones del diamante se distinguen por fecha y modo edición, no solo por color; `DS-14` en móvil las 13 respuestas son consultables sin scroll horizontal obligatorio; `DS-15` las entradas en PDF nunca dependen de una captura de baja resolución; `DS-16` la UI renderizada no lleva CDN de Tailwind; `DS-17` cada pantalla se compara contra el screenshot correspondiente; `DS-18` Lighthouse/contrastes se miden y corrigen antes de liberar.

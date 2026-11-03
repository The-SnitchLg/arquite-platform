# 01 · PRD — ARQUITÉ | Requisitos del producto

**Versión:** 6.1 — 03/11/2026  
**Estado:** contrato de producto para desarrollo; no constituye evidencia de implementación  
**Prioridad de fuentes:** (1) `ARQUITE_Especificacion_Funcional_y_Backlog_Actualizada_v5(1).md` (normativa funcional), (2) prototipo v4 descrito por v5 (preservación condicionada a inspección del código real), (3) diez maquetas `stitch_l_derhub_interactivo` (referencia visual), (4) seis DOCX originales (solo organización documental; su contenido académico es de **otro producto** y queda reemplazado).  
**Convenciones:** **[CONFIRMADO]** pedido por el solicitante; **[DEMO REPORTADO]** existente según v5, pendiente de comprobar contra el HTML v4 en el repositorio; **[VISUAL]** presente en Stitch, no necesariamente funcional; **[PROPUESTA]** decisión que precisa refinamiento; **[PENDIENTE]** decisión no resuelta.

## 1. Visión del producto

ARQUITÉ es una plataforma personal/profesional de **reflexión y arquitectura estratégica de liderazgo**, con continuidad entre sesiones, dos versiones temporales comparables del **Mi Diamante**, un registro de **Siete Umbrales**, una **Ruta de intervención**, **Cartas al futuro**, informes independientes y seguimiento administrativo autorizado. Adapta las cinco elecciones de *Playing to Win* a dos dimensiones —personal y profesional—, sin presentar los siete umbrales, las cartas o el propio diamante como instrumentos oficiales de dicho modelo.

**Problema:** una experiencia de reflexión compleja suele quedar dispersa entre formularios, documentos y versiones sin trazabilidad. El usuario debe recuperar respuestas literales, distinguir cambios reales de estados declarados y descargar sus entregables cuando cada módulo esté completo, sin esperar por los demás.

**Resultado deseado:** un espacio coherente donde la persona pueda escribir, revisar, fijar sus versiones, compararlas, actualizar su narrativa y obtener documentos de calidad editorial; y donde un administrador autorizado consulte recepciones, versiones existentes y reportes con trazabilidad.

**Fuera de alcance conceptual:** calificaciones de liderazgo, recomendaciones psicológicas, medición automática de madurez, análisis predictivo, afirmaciones de validez científica del instrumento, tercer diamante visible, descarga final por progreso global incompleto del módulo.

## 2. Usuarios y acceso

| Rol | Necesidad | Capacidades | Restricciones |
|---|---|---|---|
| Participante | Construir y revisar su recorrido | Cuenta, borradores, exploraciones, decisiones, umbrales, intervenciones, cartas, cierre, comparación y exportación propias | No acceder a registros ajenos; no editar snapshots cerrados |
| Administrador | Supervisión operativa de recepciones y entregables | Resumen, búsqueda, filtros, expedientes de participantes, versiones conservadas, módulos, exportaciones autorizadas, auditoría | No modificar silenciosamente versiones cerradas; exportaciones sujetas a finalidad y permisos |
| Facilitador | Acompañamiento de participantes | **[PROPUESTA FUTURA]** solo expedientes asignados | No heredar rol administrador |

**[CONFIRMADO]** La autenticación y autorización reales deben existir antes de operar con respuestas privadas; el selector decorativo de rol no concede acceso. **[PROPUESTA]** usar en el MVP un login sencillo de correo/contraseña; passkey/FIDO2 y «custodia cripto-notarial» aparecen en una maqueta avanzada, pero no son requisitos validados.

## 3. Arquitectura funcional y contenidos

| Módulo | Unidades / contenido | Regla de negocio |
|---|---|---|
| Panorama | 3 bloques principales: Mi Diamante, Siete Umbrales y Cartas | Resume; muestra avance por módulo y próxima acción; no bloquea informes por indicador global |
| Tres exploraciones | Entorno, Talentos Singulares, Posibilidades | **3 respuestas por versión de diamante**, nunca globales entre A/B |
| Mi Diamante | 5 elecciones personales y 5 profesionales, 10 facetas | Cierre de versión con **13/13** requisitos (3 exploraciones + 10 decisiones), más confirmación; 10 facetas iluminadas corresponden solo a decisiones |
| Siete Umbrales | 7 registros, distribuidos en 3 capas visuales 2/3/2 **[PROPUESTA]** | Estado elegido y reflexión/evidencia válida por umbral; historia de modificaciones reales |
| Ruta de intervención | 7 planes asociados, con tipo, acción, evidencia | **Progreso independiente 7/7**; no bloquea reportes de los otros módulos |
| Cartas al futuro | Carta personal y carta profesional | **2/2** con contenido válido para informe final autónomo |
| Informes | Diamante; Umbrales; Cartas | **Tres entregables independientes**; texto íntegro, fecha, versión/edición, diseño editorial |
| Administración | Registro de participantes, recepciones, versiones conservadas y exportaciones | Consulta autorizada y auditada, sin recuperar versiones efectivamente eliminadas |

El indicador global informativo conserva el universo de **29 unidades = 3 exploraciones + 10 decisiones + 7 umbrales + 7 intervenciones + 2 cartas**. No duplicar las 13 unidades por tener dos versiones del diamante: el indicador muestra el ciclo elegido y comunica cuál utiliza.

## 4. Reglas de completitud y cierre — contrato verificable

**[CONFIRMADO]** El informe final de cada módulo se habilita por separado, nunca por completar toda la plataforma.

| Entregable | Completitud estructural | Cierre / descarga | Dependencias ajenas expresamente prohibidas |
|---|---|---|---|
| Diamante individual | 3/3 exploraciones + 10/10 elecciones = 13/13 **[PROPUESTA operativa del v5 pendiente ratificación]** | Revisión visible y confirmación expresa que fija versión; después PDF final | Umbrales, intervenciones, cartas |
| Diamante comparativo | Dos diamantes confirmados | PDF del módulo con A/B, fechas y cambios literales | Otros módulos |
| Umbrales | 7/7 con estado y reflexión/evidencia válida | Al 100%; **[PROPUESTA]** confirmación de edición antes del informe final | Diamante, cartas, intervenciones |
| Cartas | Personal y profesional válidas: 2/2 | Al 100%; **[PROPUESTA]** confirmación de edición antes del informe final | Diamante, umbrales, intervenciones |

**Validación [PROPUESTA derivada del demo]:** respuestas narrativas con un mínimo inicial de 10 caracteres no blancos (parametrizable); esto valida estructura, **no** suficiencia estratégica, calidad del texto, identidad ni «avance personal». El cambio de estado se confirma en backend; no basarse solo en el color. Antes de finalizar, revisión completa y explicación de irreversibilidad del cierre de diamante.

Estados visuales canónicos **propuestos**: `sin_iniciar`, `en_curso`, `completo_100`, `pendiente_confirmacion`, `cerrado_confirmado`. Estados internos más específicos de versiones se desarrollan en 02/03/05.

## 5. Regla central: doble diamante y renovación

**[CONFIRMADO]** Son **dos momentos de una misma persona**, nunca plantilla fija vs persona. Máximo **dos espacios visibles**.

| Hito | Referencia anterior A | Actualización B | Acción disponible |
|---|---|---|---|
| Primer acceso | Diamante inicial editable | Espacio bloqueado | Completar 3+10 |
| 13/13, sin confirmar | Editable para revisión | Bloqueado | Revisar y confirmar |
| Primera confirmación | v1 cerrada e inmutable | Disponible para crear | Crear actualización |
| Segundo ciclo | v1 cerrada | v2 vacía y editable | Guardar cambios; copiar anterior **por campo** si se elige |
| Segunda confirmación | v1 cerrada | v2 cerrada | Comparar; informes individual/comparativo; solicitar nueva revisión |
| Solicitud tercer ciclo | v1 cerrada | v2 cerrada | Advertencia que identifica versión antigua, fechas, consecuencia y casilla no premarcada |
| Consentimiento aceptado | v2 cerrada pasa a A | Nuevo v3 vacío y editable | Trabajar v3; registrar sustitución atómica |
| Consentimiento cancelado | Sin cambios | Sin cambios | Seguir comparando |

**Invariantes obligatorios:** ninguna versión cerrada se edita; B tiene sus propias tres exploraciones y diez decisiones; una nueva versión no hereda silenciosamente el 100%; doble clic no crea dos renovaciones; no mostrar tres diamantes; la cancelación no cambia datos; sustituir A no implica retener clandestinamente su texto. Descargar v1 antes de reemplazar es **[PROPUESTA]** recomendable.

**Comparación:** 3 exploraciones + 10 elecciones en paralelo, identificando `modificado / sin cambios / agregado`, fechas y literalidad. No generar scores cualitativos ni inferir mejora porque una respuesta sea más extensa.

## 6. Siete umbrales y ruta de intervención

La fuente v5 propone un **mapa gerencial de tres franjas y siete estaciones**, no una escalera de madurez o radar. Cada estación expone estado seleccionado, evidencia/reflexión, última actualización y, si existe, comparación de revisiones reales.

| Franja [PROPUESTA v5] | Nº | Nombre [PROPUESTA v5, pendiente validar con demo] |
|---|---:|---|
| Funcional | 1 | Competencia → Consciencia |
| Funcional | 2 | Hacer → Pensar arquitectónicamente |
| Identitaria | 3 | Control → Influencia |
| Identitaria | 4 | Identidad profesional → Estratégica |
| Identitaria | 5 | Validación externa → Autoridad interna |
| Trascendente | 6 | Gestión del presente → Creación de futuro |
| Trascendente | 7 | Logro individual → Legado sistémico |

**Conflicto documentado:** la pantalla `siete_umbrales_arquit` del ZIP muestra otras denominaciones («Urgencia → Ritmo», «Certeza → Curiosidad», etc.). **No sustituir silenciosamente** los nombres históricos ni inventar equivalencias. En preflight cotejar el HTML v4 real y resolver un catálogo canónico validado; la agrupación visual 2/3/2 puede adoptarse sin afirmar una nueva psicometría.

Estados textuales sugeridos en v5: `Sin iniciar`, `En exploración`, `Acción experimentada`, `Cambio documentado`; `Actualizado` es marca temporal, **no grado superior**. Las siete intervenciones conservan tipo (`cognitivo`, `emocional`, `simbólico`, `estratégico`), acción y evidencia. No forzarlas como prerrequisito del informe de umbrales.

## 7. Cartas y reportes

**Cartas:** un editor para personal y otro para profesional; autosave de borrador, textos completos, fecha, revisión y sellado/confirmación si se aprueba. El ZIP muestra una carta sellada y otra en borrador: **[VISUAL]** la acción individual «Sellar carta» no autoriza el PDF final del módulo cuando falta la segunda. Se permite vista previa con marca `BORRADOR`.

**Informe Diamante — «Mi arquitectura estratégica»:** portada y metadatos, SVG con 10 facetas, tres exploraciones sin solapamiento, cinco preguntas/respuestas personales, cinco profesionales, fechas/versiones, opcional comparativo A/B, nota metodológica. **Nunca** solo diamante dibujado o JSON.

**Informe Umbrales — «Mapa de evolución»:** portada, agrupación visual 2/3/2, siete estados y reflexiones completas, fechas, cambios reales; anexo opcional de intervenciones si están completas y el usuario lo elige.

**Informe Cartas — «Cartas a mi yo futuro»:** portada y dos cartas completas, con saltos limpios, párrafos y firma solo si fue aportada; PDFs individuales pueden existir como opción, pero el informe final agrupado requiere 2/2.

Reportes finales: PDF con calidad para impresión A4, HTML imprimible accesible **[PROPUESTA]** y JSON de respaldo técnico, en ningún caso como sustituto del documento. Validar permisos desde servidor y registrar exportación; nada de URLs públicas de cartas.

## 8. Área administrativa

**[CONFIRMADO]** Login de administrador y consulta de **todos los registros actualmente conservados** en base de datos, con detalle real de respuestas y módulos, no solo conteos. Áreas: Resumen, Recepciones, Expediente, Entregables y Auditoría. Búsqueda y filtros por participante, módulo, estado, período, versión y actividad. Descargar informe desde expediente únicamente con autorización y auditoría.

La portada del panel en Stitch contiene cantidades y personas ficticias: deben ser datos semilla de visualización, **nunca** asumirse como datos reales. La opción «Dossier completo» es una referencia estética, no reemplaza los **tres informes autónomos**.

## 9. Backlog y prioridad (identificadores preservados)

| ID | Prioridad v5 | Entregable mínimo |
|---|---|---|
| ARQ-01 | P0 | Cuenta, autenticación y acceso propio |
| ARQ-02 | P0 | Persistencia multiusuario y autosave confiable |
| ARQ-03 | P0 | Completitud separada 13/13, 7/7, 2/2, 7/7 |
| ARQ-04 | P0 | Informe diamante completo e individual/comparativo |
| ARQ-05 | P0 | Dos diamantes, cierre y sustitución consentida |
| ARQ-06 | P1 | Mapa de umbrales y evolución temporal |
| ARQ-07 | P1 | Informe autónomo de cartas |
| ARQ-08 | P1 | Tres exploraciones sincronizadas por versión |
| ARQ-09 | P1 | Comparación literal A/B y eventos de umbrales |
| ARQ-10 | P0 | Revisión + cierre por entregable |
| ARQ-11 | P0 | Recepciones y expedientes del administrador |
| ARQ-12 | P2 | Seguimiento de siete intervenciones |
| ARQ-13 | P0 | Servicio seguro de tres tipos de PDF |
| ARQ-14 | P0 | Auditoría, atomicidad e idempotencia de renovación |

Las prioridades son **propuesta del backlog v5**, no evidencia de estimación, asignación o aprobación presupuestal.

## 10. Criterios de aceptación prioritarios

- **PRD-01**: una persona sin recorrido ve solo diamante inicial editable; la segunda posición está bloqueada.
- **PRD-02**: 10/10 decisiones con 2/3 exploraciones puede colorear las 10 facetas, pero **no** cerrar diamante (12/13).
- **PRD-03**: 13/13 sin confirmación no habilita informe final; confirmado crea snapshot inmutable con fecha, autor y versión.
- **PRD-04**: cambiar exploración de B no altera el snapshot de A, incluso tras recargar o abrir otra sesión.
- **PRD-05**: tras dos versiones cerradas se puede comparar; sin consentimiento no aparece tercera versión; cancelación inalterada.
- **PRD-06**: renovación aceptada deja v2 como A y nuevo v3 borrador en B, atómicamente, con auditoría e idempotencia.
- **PRD-07**: umbrales completos 7/7 habilitan solo su informe aunque cartas y diamante estén incompletos.
- **PRD-08**: cartas 2/2 habilitan solo el suyo; 1/2 nunca produce final de dos cartas.
- **PRD-09**: el PDF de diamante contiene las tres exploraciones y diez respuestas sin truncarse, junto al SVG y datos de versión.
- **PRD-10**: no hay comparación histórica de umbral si solo existe una edición; no mostrar «antes» inventado.
- **PRD-11**: participante A no puede ver datos de B; administrador autenticado ve registros retenidos autorizados y accesos auditados.
- **PRD-12**: el contenido reemplazado no reaparece por listado administrativo, salvo una política expresamente aprobada.
- **PRD-13**: la interfaz es usable por teclado y estados se leen sin depender exclusivamente del color.
- **PRD-14**: los diez HTML Stitch se tratan como maquetas; cualquier dato o acción no respaldado por v5 se etiqueta como propuesta o demostración.

## 11. Decisiones abiertas para refinamiento

| Decisión | Propuesta actual | Consecuencia de no resolver |
|---|---|---|
| 13/13 como requisito del Diamante | Adoptar 3+10 de v5 | Criterio de cierre y pruebas pendientes de ratificación |
| Catálogo nominal de siete umbrales | Comparar demo v4 vs títulos v5 vs Stitch, aprobar uno | No migrar datos con nombres distintos de forma insegura |
| Confirmar cierre de Umbrales y Cartas | Confirmación explícita igual que Diamante | Reglas editoriales de informe y nueva edición ambiguas |
| Política de retención y backups | No mantener texto reemplazado ocultamente; auditoría mínima | Riesgo de confidencialidad y expectativas falsas |
| Alcance de reportes individuales de cartas | Informe final 2/2 y borrador individual previo | Ambigüedad entre sellado individual y cierre del módulo |
| Identificadores y cesión de datos al administrador | Aviso claro y finalidad autorizada antes de capturar | Bloquea operación real con respuestas sensibles |
| Tecnología e infraestructura definitivas | Elegir en TRD y validar el repositorio real | No bloquea diseño; sí el despliegue de producción |

## 12. Fuentes y referencias visuales

- **Normativa:** `fuentes/ARQUITE_Especificacion_Funcional_y_Backlog_Actualizada_v5.md` (§2–12).
- **Visual:** `referencias_stitch/panorama_arquit`, `mi_diamante_arquit`, `siete_umbrales_arquit`, `cartas_al_futuro_arquit`, `informe_dossier_arquit`, `panel_administrador_arquit`, `acceso_directivo_simple_arquit`, `registro_simple_arquit`, `acceso_directivo_arquit`, `gu_a_de_desplegables_mi_diamante_siete_umbrales` (cada una contiene `screen.png` y `code.html`).
- **Sistema de diseño:** `referencias_stitch/warm_editorial_roadmap/DESIGN.md`.
- **Fundamento metodológico citado en v5:** https://rogerlmartin.com/thought-pillars/strategy. No extender sus afirmaciones a componentes propios ARQUITÉ.


## 13. Experiencia visual como criterio de calidad del producto

**[PROPUESTA]** La diferenciación de ARQUITÉ debe ser **visual y funcional**, no decorativa. El frontend recomendado (React 19.3 compatible, Vite 8, Tailwind CSS 4, CSS moderno, Motion selectivo y SVG nativo) permite construir un estudio editorial interactivo con dos comparaciones temporales reales y un mapa narrativo de siete umbrales. Se detallan arquitectura y tradeoffs en `02_TRD_Arquitectura_ARQUITE.md`, tokens/animaciones en `04_Design_Brief_UI_Tokens_ARQUITE.md` y fases de ejecución en `06_Plan_Implementacion_Antigravity_ARQUITE.md`.

**Valor esperado del diseño:** el participante distingue de un vistazo qué decisiones tienen respuesta, qué versión está fija o editable, qué cambió entre dos fechas y cuál informe puede descargar. Las animaciones deben reforzar este entendimiento sin convertir progreso textual en juicios de calidad, ni requerir WebGL/3D. Los HTML Stitch son referencias visuales; su lógica y datos ficticios no son contrato.

**Nuevo criterio PRD-15:** todas las vistas principales deben reproducir el sistema «Warm Editorial Roadmap» de Stitch (fondo cálido, titulares serif, navegación despejada, cards, teal/terracota), con contenido funcional de v5. Prohibido introducir una librería que imponga otro look por defecto.

**Nuevo criterio PRD-16:** cada interacción clave (editar campo, iluminar faceta, cerrar, comparar, actualizar umbral, descargar) dispone de feedback visible, accesible y consistente; al desactivar animaciones la función sigue completa.

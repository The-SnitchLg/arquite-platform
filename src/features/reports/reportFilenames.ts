/**
 * ARQUITÉ — Centralized PDF Filename Generator
 *
 * Implements Phase 4 standards:
 * - ARQUITE_Diamante_Estrategico_v{version}_{YYYY-MM-DD}.pdf
 * - ARQUITE_Diamante_Profesional_v{version}_{YYYY-MM-DD}.pdf
 * - ARQUITE_Siete_Umbrales_{YYYY-MM-DD}.pdf
 * - ARQUITE_Cartas_al_Futuro_{YYYY-MM-DD}.pdf
 *
 * Safe ASCII filenames, zero PII, standard ISO date.
 */

export interface ReportFilenameMeta {
  version?: number;
  date?: string | Date;
}

export function formatISODate(input?: string | Date): string {
  const d = input ? new Date(input) : new Date();
  if (isNaN(d.getTime())) {
    const fallback = new Date();
    return `${fallback.getFullYear()}-${String(fallback.getMonth() + 1).padStart(2, '0')}-${String(fallback.getDate()).padStart(2, '0')}`;
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getReportFilename(
  module: 'diamond' | 'diamond_pro' | 'thresholds' | 'letters',
  meta: ReportFilenameMeta = {}
): string {
  const dateStr = formatISODate(meta.date);

  switch (module) {
    case 'diamond': {
      const v = meta.version ?? 1;
      return `ARQUITE_Diamante_Estrategico_v${v}_${dateStr}.pdf`;
    }
    case 'diamond_pro': {
      const v = meta.version ?? 1;
      return `ARQUITE_Diamante_Profesional_v${v}_${dateStr}.pdf`;
    }
    case 'thresholds':
      return `ARQUITE_Siete_Umbrales_${dateStr}.pdf`;
    case 'letters':
      return `ARQUITE_Cartas_al_Futuro_${dateStr}.pdf`;
  }
}

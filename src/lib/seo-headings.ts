/**
 * Regras de SEO para headings e textos (admin).
 * Valores são sugestivos: aviso visual quando fora do ideal, mas não bloqueia salvar.
 */

export type SeoRole = 'H1' | 'H2' | 'H3' | 'meta' | 'paragrafo'

/** Ideais de caracteres por tipo (sugestivo; pode ser menor ou maior) */
export const SEO_CHAR_RANGES: Record<SeoRole, { min: number; max: number }> = {
  H1: { min: 30, max: 60 },
  H2: { min: 25, max: 60 },
  H3: { min: 20, max: 50 },
  meta: { min: 150, max: 160 },
  paragrafo: { min: 150, max: 2000 },
}

export function isOutOfSuggestedRange(
  role: SeoRole,
  length: number,
  valueRequired = true
): boolean {
  if (valueRequired && length === 0) return false
  const { min, max } = SEO_CHAR_RANGES[role]
  return length > 0 && (length < min || length > max)
}

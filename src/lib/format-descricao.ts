/**
 * Formatação de descrição de imóvel.
 *
 * As descrições chegam em formatos misturados:
 *  1. HTML do DWV: <p>/<ul>/<strong>, porém cheio de &nbsp; entre cada palavra
 *     (impede a quebra natural de linha e deixa o texto "esticado").
 *  2. Texto puro do DWV: blocos separados por \n\n e itens um por linha.
 *  3. Cadastros manuais: parágrafos com \n\n e listas com "- ".
 *
 * Como a página renderiza com dangerouslySetInnerHTML, os formatos 2 e 3
 * perdem todas as quebras (o HTML ignora \n) e viram um bloco único.
 *
 * Estas funções normalizam tudo na renderização, sem alterar o dado de origem.
 */

function escapeHtml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/** Início de linha que representa um item de lista: "- ", "* ", "• ", "–> ", "-> " */
const BULLET_RE = /^\s*(?:[-*•–]|->)\s+/

/** Converte texto puro (com \n) em HTML com parágrafos, listas e quebras. */
function textoPlanoParaHtml(entrada: string): string {
  const texto = entrada.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // Blocos separados por linha em branco
  const blocos = texto
    .split(/\n[ \t]*\n/)
    .map((b) => b.trim())
    .filter(Boolean)

  const saida: string[] = []

  for (const bloco of blocos) {
    const linhas = bloco
      .split('\n')
      .map((l) => l.replace(/[ \t]+$/, '').trim())
      .filter(Boolean)

    if (linhas.length === 0) continue

    const itensBullet = linhas.filter((l) => BULLET_RE.test(l))

    // Bloco de lista: pelo menos 2 itens e no máximo 1 linha de cabeçalho sem bullet
    if (itensBullet.length >= 2 && itensBullet.length >= linhas.length - 1) {
      const itens: string[] = []
      for (const l of linhas) {
        if (BULLET_RE.test(l)) {
          itens.push(`<li>${escapeHtml(l.replace(BULLET_RE, ''))}</li>`)
        } else {
          // Linha de cabeçalho antes da lista (ex.: "Destaques rápidos:")
          saida.push(`<p><strong>${escapeHtml(l.replace(/:$/, ''))}</strong></p>`)
        }
      }
      saida.push(`<ul>${itens.join('')}</ul>`)
      continue
    }

    // Parágrafo normal: cada \n vira <br>. "-> Título" vira subtítulo em negrito.
    const partes = linhas.map((l) => {
      const semSeta = l.replace(/^\s*->\s*/, '')
      if (semSeta !== l) return `<strong>${escapeHtml(semSeta)}</strong>`
      return escapeHtml(l)
    })
    saida.push(`<p>${partes.join('<br>')}</p>`)
  }

  return saida.join('')
}

/** Normaliza HTML já existente: remove &nbsp; e parágrafos vazios usados como espaçador. */
function normalizarHtml(html: string): string {
  return html
    .replace(/&nbsp;/gi, ' ') // espaço fixo -> normal (permite quebra de linha)
    .replace(/<p>\s*<\/p>/gi, '') // parágrafos vazios usados como espaçador
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

const HTML_BLOCO_RE = /<(p|ul|ol|li|br|h[1-6]|div|table)\b[^>]*>/i

/** Retorna HTML pronto para exibição, normalizando qualquer um dos formatos de entrada. */
export function formatarDescricaoHtml(raw?: string | null): string {
  if (!raw) return ''
  const s = String(raw).trim()
  if (!s) return ''
  return HTML_BLOCO_RE.test(s) ? normalizarHtml(s) : textoPlanoParaHtml(s)
}

/** Versão em texto puro (sem tags/&nbsp;) para meta tags, SEO e JSON-LD. */
export function descricaoTextoPlano(raw?: string | null, max?: number): string {
  if (!raw) return ''
  let s = String(raw)
    .replace(/<br\s*\/?>(?!\n)/gi, ' ')
    .replace(/<\/(p|li|h[1-6]|div)>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (max && s.length > max) {
    s = s.slice(0, max).replace(/\s+\S*$/, '').trim() + '…'
  }
  return s
}

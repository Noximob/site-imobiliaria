/**
 * GA4 – eventos centralizados.
 * Só envia se window.gtag existir (script carregado).
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function gtagEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || !window.gtag) return
  window.gtag('event', eventName, params)
}

/** Clique em link/call WhatsApp */
export function trackWhatsAppClick(page: string): void {
  gtagEvent('whatsapp_click', { page })
}

/** Formulário enviado com sucesso */
export function trackFormSubmit(formName: string): void {
  gtagEvent('form_submit', { form_name: formName })
}

/** Visualização da ficha de um imóvel (GA4 recommended event) */
export function trackViewItem(imovelId: string, slug: string, itemName: string): void {
  gtagEvent('view_item', {
    currency: 'BRL',
    value: undefined,
    items: [{ item_id: imovelId, item_name: itemName }],
  })
  gtagEvent('view_item_imovel', { imovel_id: imovelId, slug, item_name: itemName })
}

/** Adicionar ou remover dos favoritos */
export function trackFavorito(imovelId: string, added: boolean): void {
  gtagEvent(added ? 'add_to_favorites' : 'remove_from_favorites', { imovel_id: imovelId })
}

/** Contato a partir da ficha do imóvel (WhatsApp, e-mail ou telefone) */
export function trackImovelContato(method: 'whatsapp' | 'email' | 'telefone'): void {
  gtagEvent('imovel_contato', { method })
}

/** Uso de filtros na lista de imóveis */
export function trackFilterApply(params: { cidade?: string; tipo?: string; status?: string; quartos?: number; valor_min?: number; valor_max?: number }): void {
  gtagEvent('filter_apply', params)
}

/** Clique no imóvel na lista (card / Saber mais) – funil lista → ficha */
export function trackImovelClick(imovelId: string, slug: string, itemName: string): void {
  gtagEvent('select_content', { content_type: 'imovel', item_id: imovelId, item_name: itemName })
  gtagEvent('imovel_click', { imovel_id: imovelId, slug, item_name: itemName })
}

/** Troca de página na listagem (paginação) */
export function trackPagination(page: number): void {
  gtagEvent('list_pagination', { page })
}

/** Clique em rede social (Instagram, YouTube, etc.) */
export function trackSocialClick(platform: string): void {
  gtagEvent('social_click', { platform })
}

/**
 * Gera link do WhatsApp a partir de um número de telefone
 * @param phoneNumber - Número de telefone no formato (47) 99999-9999
 * @param message - Mensagem opcional para pré-preencher
 * @returns Link do WhatsApp
 */
export function getWhatsAppLink(phoneNumber: string, message?: string): string {
  // Remove todos os caracteres não numéricos
  const cleanNumber = phoneNumber.replace(/\D/g, '')
  
  // Se o número não começar com 55 (código do Brasil), adiciona
  const formattedNumber = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`
  
  let url = `https://wa.me/${formattedNumber}`
  
  // Adiciona mensagem se fornecida
  if (message) {
    url += `?text=${encodeURIComponent(message)}`
  }
  
  return url
}

/**
 * Extrai apenas os números de um texto de telefone
 * @param phoneText - Texto contendo o telefone
 * @returns Apenas os números
 */
export function extractPhoneNumber(phoneText: string): string {
  return phoneText.replace(/\D/g, '')
}

/**
 * Formata número para exibição
 * @param phoneNumber - Número limpo (apenas dígitos)
 * @returns Número formatado para exibição
 */
export function formatPhoneDisplay(phoneNumber: string): string {
  const cleanNumber = phoneNumber.replace(/\D/g, '')
  
  if (cleanNumber.length === 11) {
    return `(${cleanNumber.slice(0, 2)}) ${cleanNumber.slice(2, 7)}-${cleanNumber.slice(7)}`
  }
  
  if (cleanNumber.length === 13 && cleanNumber.startsWith('55')) {
    const withoutCountryCode = cleanNumber.slice(2)
    return `(${withoutCountryCode.slice(0, 2)}) ${withoutCountryCode.slice(2, 7)}-${withoutCountryCode.slice(7)}`
  }
  
  return phoneNumber
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, Youtube } from 'lucide-react'
import { getImageUrl } from '@/lib/github-images'
import { getText } from '@/lib/site-texts'
import { getWhatsAppLink } from '@/lib/whatsapp'
import { trackWhatsAppClick, trackSocialClick } from '@/lib/analytics'

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

export default function Footer() {
  const logoUrl = getImageUrl('logo-footer')
  const telefone = getText('footer.telefone')
  const textoAcompanhe = getText('footer.texto_acompanhe')
  
  // Coluna Imóveis
  const imoveisTitulo = getText('footer.coluna_imoveis.titulo')
  const imoveisVenda = getText('footer.coluna_imoveis.imoveis_venda')
  const empreendimentos = getText('footer.coluna_imoveis.empreendimentos')
  const favoritos = getText('footer.coluna_imoveis.favoritos')
  
  // Coluna Serviços
  const servicosTitulo = getText('footer.coluna_servicos.titulo')
  const anunciarImovel = getText('footer.coluna_servicos.anunciar_imovel')
  const encontreMeuImovel = getText('footer.coluna_servicos.encontre_meu_imovel')
  const comoComprar = getText('footer.coluna_servicos.como_comprar')
  
  // Coluna Institucional
  const institucionalTitulo = getText('footer.coluna_institucional.titulo')
  const quemSomos = getText('footer.coluna_institucional.quem_somos')
  const contato = getText('footer.coluna_institucional.contato')
  const trabalheConosco = getText('footer.coluna_institucional.trabalhe_conosco')
  
  // Coluna Localização
  const localizacaoTitulo = getText('footer.coluna_localizacao.titulo')
  const vivaPenha = getText('footer.coluna_localizacao.viva_penha')
  const vivaPicarras = getText('footer.coluna_localizacao.viva_picarras')
  const vivaBarraVelha = getText('footer.coluna_localizacao.viva_barra_velha')
  const blog = getText('footer.coluna_localizacao.blog')
  
  // Central de Atendimento
  const centralTitulo = getText('footer.central_atendimento.titulo')
  const creci = getText('footer.central_atendimento.creci')
  const endereco = getText('footer.central_atendimento.endereco')
  const cidade = getText('footer.central_atendimento.cidade')
  const telefoneCentral = getText('footer.central_atendimento.telefone_central')
  return (
    <footer className="bg-gray-900 text-white">
      {/* Rodapé Tradicional */}
      <div className="bg-gray-900 text-white">
        {/* Seção Superior - Contatos e Redes Sociais */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            {/* Telefone */}
            <a
              href={getWhatsAppLink(telefone)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('footer')}
              className="flex items-center justify-center md:justify-start gap-2 hover:text-green-400 transition-colors"
            >
              <svg className="w-5 h-5 text-green-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
              </svg>
              <span className="text-sm font-medium">{telefone}</span>
            </a>
            {/* Redes Sociais */}
            <div className="flex items-center justify-center gap-1 sm:gap-4">
              <span className="text-sm font-medium text-gray-300 mr-2 sm:mr-0">{textoAcompanhe}</span>
              <a href="https://www.instagram.com/noximoveis?igsh=cmVzYTFzNmZkNQ%3D%3D" target="_blank" rel="noopener noreferrer" onClick={() => trackSocialClick('instagram')} className="p-2 text-purple-400 hover:text-purple-300 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@noximoveis?_r=1&_t=ZS-93IL19xyQDN" target="_blank" rel="noopener noreferrer" onClick={() => trackSocialClick('tiktok')} className="p-2 text-purple-400 hover:text-purple-300 transition-colors" aria-label="TikTok">
                <TikTokIcon className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/share/1BtwHUDDAj/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" onClick={() => trackSocialClick('facebook')} className="p-2 text-purple-400 hover:text-purple-300 transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@NoxIm%C3%B3veis" target="_blank" rel="noopener noreferrer" onClick={() => trackSocialClick('youtube')} className="p-2 text-purple-400 hover:text-purple-300 transition-colors" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Linha Divisória */}
        <div className="border-t border-gray-700"></div>

        {/* Seção Principal - Links e Informações */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-6 sm:py-8">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Imóveis */}
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider text-purple-300">{imoveisTitulo}</h3>
              <ul className="space-y-1.5 sm:space-y-2">
                <li>
                  <Link href="/imoveis" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors">
                    {imoveisVenda}
                  </Link>
                </li>
                <li>
                  <Link href="/imoveis?status=lancamento" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors">
                    {empreendimentos}
                  </Link>
                </li>
                <li>
                  <Link href="/favoritos" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors">
                    {favoritos}
                  </Link>
                </li>
              </ul>
            </div>
            {/* Serviços */}
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider text-purple-300">{servicosTitulo}</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                  <Link href="/anunciar" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors">
                    {anunciarImovel}
                </Link>
              </li>
              <li>
                  <Link href="/imoveis" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors">
                    {encontreMeuImovel}
                </Link>
              </li>
              <li>
                  <Link href="/como-comprar" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors">
                    {comoComprar}
                </Link>
              </li>
            </ul>
          </div>

            {/* Institucional */}
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider text-purple-300">{institucionalTitulo}</h3>
              <ul className="space-y-1.5 sm:space-y-2">
                <li>
                  <Link href="/sobre" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors">
                    {quemSomos}
                  </Link>
                </li>
                <li>
                  <Link href="/contato" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors">
                    {contato}
                  </Link>
                </li>
                <li>
                  <Link href="/trabalhe-conosco" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors">
                    {trabalheConosco}
                  </Link>
                </li>
              </ul>
            </div>
            {/* Links Adicionais */}
            <div>
              <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider text-purple-300">{localizacaoTitulo}</h3>
              <ul className="space-y-1.5 sm:space-y-2">
                <li>
                  <Link href="/viva-penha" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors">
                    {vivaPenha}
                  </Link>
                </li>
                <li>
                  <Link href="/viva-balneario-picarras" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors">
                    {vivaPicarras}
                  </Link>
                </li>
                <li>
                  <Link href="/viva-barra-velha" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors">
                    {vivaBarraVelha}
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-300 hover:text-white text-xs sm:text-sm transition-colors">
                    {blog}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Linha Divisória */}
        <div className="border-t border-gray-700"></div>

        {/* Seção Inferior - Logo e Endereços */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-0 text-center lg:text-left">
            {/* Logo */}
            <div className="lg:mb-0 bg-transparent">
              <Image
                src={logoUrl}
                alt="Nox Imóveis"
                width={200}
                height={60}
                className="h-10 sm:h-12 w-auto bg-transparent"
                loading="lazy"
              />
            </div>
            {/* Central de Atendimento */}
            <div className="lg:text-right">
              <h4 className="font-semibold text-purple-400 mb-2 text-base sm:text-lg">{centralTitulo}</h4>
              <p className="text-gray-300 text-sm sm:text-base mb-1">{creci}</p>
              <p className="text-gray-300 text-sm sm:text-base mb-1">{endereco}</p>
              <p className="text-gray-300 text-sm sm:text-base mb-2">{cidade}</p>
              <a
                href={getWhatsAppLink(telefoneCentral)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('footer_central')}
                className="text-purple-400 font-semibold hover:text-green-400 transition-colors text-sm sm:text-base"
              >
                {telefoneCentral}
              </a>
            </div>
          </div>
        </div>

        {/* Faixa inferior: fundo branco, créditos (compacta) */}
        <div className="bg-white text-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-2 sm:py-2.5">
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center sm:justify-between gap-2 sm:gap-3 text-center sm:text-left">
              {/* Nox Imóveis | CRECI */}
              <p className="text-sm sm:text-base font-medium text-gray-800 flex items-center justify-center gap-2">
                <span>Nox Imóveis</span>
                <span className="w-px h-4 sm:h-5 bg-gray-400 shrink-0" aria-hidden />
                <span>CRECI 9839J</span>
              </p>
              {/* Site feito pelo time Alumma - clicável */}
              <a
                href="https://www.alumma.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base text-gray-600 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 hover:text-gray-800 transition-colors rounded-lg px-2 py-1 -m-1"
              >
                <span>Site feito pelo time</span>
                <Image
                  src="/imagens/alumma-logo.png"
                  alt="Alumma"
                  width={480}
                  height={144}
                  className="h-28 sm:h-32 w-auto inline-block align-middle"
                />
                <span className="hidden sm:inline text-gray-400">|</span>
                <span>Soluções para Imobiliárias de alta performance</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
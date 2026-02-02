import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Users, FileText, Home, Shield, CreditCard, Calculator, Phone, Mail, MapPin, Building, Award } from 'lucide-react'
import { getImageUrl } from '@/lib/github-images'
import { getText } from '@/lib/site-texts'
import { trackWhatsAppClick } from '@/lib/analytics'

const comoComprarImages = {
  apartamentoPenha: getImageUrl('apartamentos'),
  coberturaPicarras: getImageUrl('apartamento-cobertura-picarras'),
  lancamentosBarraVelha: getImageUrl('lancamentos-frente-mar-barra-velha'),
  frenteMar: getImageUrl('frente-mar'),
  anuncieImovel: getImageUrl('anuncie-nox-mulher')
}

export const metadata: Metadata = {
  title: 'Como Comprar um Imóvel - Guia Completo | Nox Imóveis',
  description: 'Aprenda como comprar um imóvel com segurança e tranquilidade. Guia completo com todos os passos, documentação necessária e dicas importantes.',
  keywords: 'como comprar imóvel, financiamento imobiliário, compra de casa, compra de apartamento, documentação imóvel, CRECI',
  authors: [{ name: 'Nox Imóveis' }],
  openGraph: {
    title: 'Como Comprar um Imóvel - Guia Completo | Nox Imóveis',
    description: 'Aprenda como comprar um imóvel com segurança e tranquilidade. Guia completo com todos os passos, documentação necessária e dicas importantes.',
    type: 'website',
    locale: 'pt_BR',
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Força revalidação a cada 24 horas
export const revalidate = 86400

export default async function ComoComprarPage() {
  // Carrega apenas as imagens necessárias para esta página (otimização de performance)
  const siteImages = {
    'topico-como-comprar': getImageUrl('topico-como-comprar'),
    'como-comprar-1': getImageUrl('como-comprar-1'),
    'como-comprar-2': getImageUrl('como-comprar-2'),
    'como-comprar-3': getImageUrl('como-comprar-3'),
    'como-comprar-4': getImageUrl('como-comprar-4'),
    'como-comprar-5': getImageUrl('como-comprar-5'),
  }
  
  return (
    <>
      {/* Pré-carregar imagem crítica */}
      <link rel="preload" as="image" href={siteImages['topico-como-comprar']} />
      
      <div className="min-h-screen bg-white">
      {/* Hero Section: no mobile empilha (texto em cima, cards embaixo); no desktop lado a lado */}
      <section className="relative text-white py-8 min-h-[280px] sm:min-h-[350px] flex items-center">
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `transparent url(${siteImages['topico-como-comprar']}) center/cover no-repeat`
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-4">
            {/* Texto: no mobile full width em cima */}
            <div className="text-white w-full md:w-1/2 text-center md:text-left">
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                  {getText('como_comprar.hero.titulo')}
                </h1>
              </div>
            </div>
            {/* Cards: no mobile embaixo, em linha; no desktop à direita */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-xs mx-auto md:max-w-none md:mx-0">
                <div className="text-center">
                  <div className="relative mb-2 sm:mb-3">
                    <div className="w-16 h-20 sm:w-24 sm:h-32 bg-white/20 backdrop-blur-sm rounded-lg mx-auto flex items-center justify-center border border-white/30">
                      <Users className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                    </div>
                  </div>
                  <h4 className="text-white font-semibold text-[10px] sm:text-xs">Especialista em</h4>
                  <p className="text-white/80 text-[10px] sm:text-xs">Vendas</p>
                </div>
                <div className="text-center">
                  <div className="relative mb-2 sm:mb-3">
                    <div className="w-16 h-20 sm:w-24 sm:h-32 bg-white/20 backdrop-blur-sm rounded-lg mx-auto flex items-center justify-center border border-white/30">
                      <Building className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                    </div>
                  </div>
                  <h4 className="text-white font-semibold text-[10px] sm:text-xs">Consultor em</h4>
                  <p className="text-white/80 text-[10px] sm:text-xs">Investimentos</p>
                </div>
                <div className="text-center">
                  <div className="relative mb-2 sm:mb-3">
                    <div className="w-16 h-20 sm:w-24 sm:h-32 bg-white/20 backdrop-blur-sm rounded-lg mx-auto flex items-center justify-center border border-white/30">
                      <Award className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                    </div>
                  </div>
                  <h4 className="text-white font-semibold text-[10px] sm:text-xs">Especialista em</h4>
                  <p className="text-white/80 text-[10px] sm:text-xs">Financiamentos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Como é Comprar: no mobile empilha (título + botão em cima, 4 passos embaixo) */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            {/* Título e Botão: no mobile full width em cima */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                {getText('como_comprar.como_funciona.titulo')}
              </h2>
              <div className="mt-4 sm:mt-6">
                <Link
                  href="/imoveis"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center text-sm sm:text-base w-full sm:w-auto justify-center"
                >
                  {getText('como_comprar.como_funciona.botao_buscar')}
                </Link>
              </div>
            </div>
            {/* 4 Passos: no mobile grid 2 colunas embaixo; no desktop à direita em linha */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-lg lg:max-w-none">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-300 mb-1 sm:mb-2">{getText('como_comprar.como_funciona.passo_1.numero')}</div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    {getText('como_comprar.como_funciona.passo_1.titulo')}
                  </h3>
                  <p className="text-xs text-gray-600 leading-snug">
                    {getText('como_comprar.como_funciona.passo_1.descricao')}
                  </p>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-300 mb-1 sm:mb-2">{getText('como_comprar.como_funciona.passo_2.numero')}</div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    {getText('como_comprar.como_funciona.passo_2.titulo')}
                  </h3>
                  <p className="text-xs text-gray-600 leading-snug">
                    {getText('como_comprar.como_funciona.passo_2.descricao')}
                  </p>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-300 mb-1 sm:mb-2">{getText('como_comprar.como_funciona.passo_3.numero')}</div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    {getText('como_comprar.como_funciona.passo_3.titulo')}
                  </h3>
                  <p className="text-xs text-gray-600 leading-snug">
                    {getText('como_comprar.como_funciona.passo_3.descricao')}
                  </p>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-300 mb-1 sm:mb-2">{getText('como_comprar.como_funciona.passo_4.numero')}</div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    {getText('como_comprar.como_funciona.passo_4.titulo')}
                  </h3>
                  <p className="text-xs text-gray-600 leading-snug">
                    {getText('como_comprar.como_funciona.passo_4.descricao')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Seu Imóvel na Praia */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cabeçalho da Seção */}
          <div className="text-center mb-8">
            <h2 className="text-blue-600 text-sm font-medium mb-1">{getText('como_comprar.imovel_praia.titulo')}</h2>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900">
              {getText('como_comprar.imovel_praia.subtitulo')}
            </h3>
          </div>

          {/* Cards das Cidades */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Penha */}
            <Link href="/imoveis?cidade=penha" className="relative group cursor-pointer">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src={comoComprarImages.apartamentoPenha}
                  alt="Imóveis em Penha"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-xs font-medium mb-1">Imóveis em</div>
                    <div className="text-lg font-bold">{getText('como_comprar.imovel_praia.botao_penha')}</div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Balneário Piçarras */}
            <Link href="/imoveis?cidade=balneario-picarras" className="relative group cursor-pointer">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src={comoComprarImages.coberturaPicarras}
                  alt="Imóveis em Balneário Piçarras"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-xs font-medium mb-1">Imóveis em</div>
                    <div className="text-lg font-bold">{getText('como_comprar.imovel_praia.botao_picarras')}</div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Barra Velha */}
            <Link href="/imoveis?cidade=barra-velha" className="relative group cursor-pointer">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src={comoComprarImages.lancamentosBarraVelha}
                  alt="Imóveis em Barra Velha"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-xs font-medium mb-1">Imóveis em</div>
                    <div className="text-lg font-bold">{getText('como_comprar.imovel_praia.botao_barra_velha')}</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Chamada para Ação */}
          <div className="text-center">
            <p className="text-gray-900 text-sm mb-4">
              {getText('como_comprar.consultoria.descricao')}
            </p>
            <a
              href="https://wa.me/5547997530113"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('como_comprar')}
              className="bg-green-500 hover:bg-green-600 text-black font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              {getText('como_comprar.consultoria.botao')}
            </a>
          </div>
        </div>
      </section>

      {/* Seção Localização */}
      <section className="py-8 bg-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pergunta */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-medium text-gray-700">
              {getText('como_comprar.localizacao.titulo')}
            </h2>
          </div>

          {/* Botões de Localização */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Link href="/imoveis?frenteMar=true" className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center text-sm shadow-lg hover:shadow-xl transform hover:scale-105">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {getText('como_comprar.localizacao.opcao_1')}
            </Link>
            
            <Link href="/imoveis" className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center text-sm shadow-lg hover:shadow-xl transform hover:scale-105">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {getText('como_comprar.localizacao.opcao_2')}
            </Link>
            
            <Link href="/imoveis?vistaMar=true" className="bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center text-sm shadow-lg hover:shadow-xl transform hover:scale-105">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {getText('como_comprar.localizacao.opcao_3')}
            </Link>
          </div>

          {/* Blocos de Conteúdo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Bloco Esquerdo - Investimento */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              {/* Imagem */}
              <div className="h-48 relative overflow-hidden">
                <Image
                  src={comoComprarImages.frenteMar}
                  alt="Praia - Investimento imobiliário"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              
              {/* Conteúdo */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6">
                <h3 className="text-white text-sm font-normal mb-1">
                  {getText('como_comprar.cta_investimento.titulo')}
                </h3>
                <h3 className="text-white text-lg font-bold mb-4">
                  {getText('como_comprar.cta_investimento.subtitulo')}
                </h3>
                <Link href="/imoveis" className="inline-block bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm shadow-lg hover:shadow-xl transform hover:scale-105">
                  {getText('como_comprar.cta_investimento.botao')}
                </Link>
              </div>
            </div>

            {/* Bloco Direito - Anuncie */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              {/* Imagem */}
              <div className="h-48 relative overflow-hidden">
                <Image
                  src={comoComprarImages.anuncieImovel}
                  alt="Equipe Nox Imóveis"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              
              {/* Conteúdo */}
              <div className="bg-gradient-to-br from-purple-800 to-purple-900 p-6">
                <h3 className="text-white text-sm font-normal mb-1">
                  {getText('como_comprar.anuncie.titulo')}
                </h3>
                <h3 className="text-white text-lg font-bold mb-4">
                  {getText('como_comprar.anuncie.subtitulo')}
                </h3>
                <Link href="/encontre-meu-imovel" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm shadow-lg hover:shadow-xl transform hover:scale-105">
                  {getText('como_comprar.anuncie.botao')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      </div>
    </>
  )
}

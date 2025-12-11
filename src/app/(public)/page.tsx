import Image from 'next/image'
import { Search } from 'lucide-react'
import SearchForm from '@/components/SearchForm'
import BlogSection from '@/components/BlogSection'
import TeamSection from '@/components/TeamSection'
import DepoimentosSection from '@/components/DepoimentosSection'
import { getImageUrl } from '@/lib/github-images'
import { getText } from '@/lib/site-texts'
import { getCorretoresAtivos } from '@/lib/corretores-data'
import { getDepoimentosAtivos } from '@/lib/depoimentos-data'
import { getAllImoveis } from '@/lib/imoveis-github'
import { formatPrice } from '@/lib/imoveis'
import Link from 'next/link'
import type { Metadata } from 'next'

// Revalida a cada 60 segundos para garantir atualizações rápidas
export const revalidate = 60

// Metadata otimizada para SEO
export const metadata: Metadata = {
  title: "Nox Imóveis - Imóveis em Penha, Balneário Piçarras e Barra Velha",
  description: "Encontre o imóvel dos seus sonhos em Penha, Balneário Piçarras e Barra Velha. Apartamentos, casas e terrenos com a melhor imobiliária da região.",
  keywords: "imóveis penha, imóveis balneário piçarras, imóveis barra velha, apartamentos, casas, terrenos, imobiliária, venda, aluguel",
  authors: [{ name: 'Nox Imóveis' }],
  openGraph: {
    title: "Nox Imóveis - Imóveis em Penha, Balneário Piçarras e Barra Velha",
    description: "Encontre o imóvel dos seus sonhos em Penha, Balneário Piçarras e Barra Velha. Apartamentos, casas e terrenos com a melhor imobiliária da região.",
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: '/imagens/banners/banner-home.png',
        width: 1920,
        height: 1080,
        alt: "Nox Imóveis - Imóveis em Penha, Balneário Piçarras e Barra Velha",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://noximoveis.com.br',
  },
}

export default async function HomePage() {
  // Buscar corretores ativos e depoimentos ativos
  const corretores = await getCorretoresAtivos()
  const depoimentos = await getDepoimentosAtivos()
  
  // Buscar imóveis da Seleção Nox (máximo 3)
  const todosImoveis = await getAllImoveis()
  
  // Debug temporário
  console.log('Total de imóveis:', todosImoveis.length)
  console.log('Imóveis com selecaoNox:', todosImoveis.filter(i => (i as any).selecaoNox).map(i => ({ id: i.id, titulo: i.titulo, publicado: i.publicado, selecaoNox: (i as any).selecaoNox })))
  
  const imoveisSelecaoNox = todosImoveis
    .filter(imovel => {
      if (!imovel.publicado) return false
      const selecaoNox = (imovel as any).selecaoNox
      const resultado = selecaoNox === true
      if (selecaoNox) {
        console.log('Imóvel encontrado para Seleção Nox:', imovel.titulo, 'selecaoNox:', selecaoNox)
      }
      return resultado
    })
    .slice(0, 3)
  
  console.log('Imóveis Seleção Nox encontrados:', imoveisSelecaoNox.length)

  // Carrega apenas as imagens necessárias para esta página (otimização de performance)
  const siteImages = {
    'banner-home': getImageUrl('banner-home'),
    'lancamentos-investidor': getImageUrl('lancamentos-investidor'),
    'frente-mar': getImageUrl('frente-mar'),
    'apartamentos': getImageUrl('apartamentos'),
    'picarras-cobertura': getImageUrl('apartamento-cobertura-picarras'),
    'picarras-lancamentos': getImageUrl('lancamentos-picarras'),
    'picarras-mobiliado': getImageUrl('mobiliado-picarras'),
    'picarras-vista-mar': getImageUrl('vista-mar-picarras'),
    'bv-em-construcao': getImageUrl('em-construcao-barra-velha'),
    'bv-imoveis-prontos': getImageUrl('imoveis-prontos-barra-velha'),
    'bv-lancamentos-frente-mar': getImageUrl('lancamentos-frente-mar-barra-velha'),
    'mobiliados': getImageUrl('mobiliados'),
    'imoveis-planta-1': getImageUrl('imoveis-na-planta-1'),
    'imoveis-planta-2': getImageUrl('imoveis-na-planta-2'),
    'imoveis-planta-3': getImageUrl('imoveis-na-planta-3'),
    'selecao-nox-1': getImageUrl('selecao-nox-1'),
    'selecao-nox-2': getImageUrl('selecao-nox-2'),
    'selecao-nox-3': getImageUrl('selecao-nox-3'),
    'anuncie-nox-mulher': getImageUrl('anuncie-nox-mulher'),
    'corretores-1': getImageUrl('corretores-1'),
    'corretores-2': getImageUrl('corretores-2'),
    'corretores-3': getImageUrl('corretores-3'),
    'corretores-4': getImageUrl('corretores-4'),
  }

  return (
    <>
      
      {/* Structured Data para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": "Nox Imóveis",
            "description": "Imobiliária especializada em imóveis em Penha, Balneário Piçarras e Barra Velha",
            "url": "https://noximoveis.com.br",
            "logo": "https://noximoveis.com.br/imagens/Logo.png",
            "image": "https://noximoveis.com.br/imagens/banners/banner-home.png",
            "telephone": "+5547997530113",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Penha",
              "addressRegion": "SC",
              "addressCountry": "BR"
            },
            "areaServed": [
              {
                "@type": "City",
                "name": "Penha"
              },
              {
                "@type": "City", 
                "name": "Balneário Piçarras"
              },
              {
                "@type": "City",
                "name": "Barra Velha"
              }
            ],
            "serviceType": "Real Estate Services",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Imóveis à Venda",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "RealEstateListing",
                    "name": "Apartamentos em Penha"
                  }
                },
                {
                  "@type": "Offer", 
                  "itemOffered": {
                    "@type": "RealEstateListing",
                    "name": "Casas em Balneário Piçarras"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "RealEstateListing", 
                    "name": "Terrenos em Barra Velha"
                  }
                }
              ]
            }
          })
        }}
      />
      
    <div className="min-h-screen">
      {/* Hero Section */}
        <section className="relative text-white py-20 min-h-[600px] flex items-center overflow-hidden bg-transparent">
          <Image
            src={siteImages['banner-home'] || '/imagens/banners/banner-home.png'}
            alt={`Banner principal - ${getText('home.banner.titulo')}`}
            title="Nox Imóveis - Encontre seu imóvel dos sonhos"
            fill
            priority
            quality={90}
            className="object-cover bg-transparent"
            sizes="100vw"
            placeholder="empty"
          />
        
          {/* Overlay removido - agora transparente */}
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              {getText('home.banner.titulo')}
            </h1>
            
            {/* Search Form */}
            <div className="max-w-4xl mx-auto">
              <SearchForm />
            </div>
          </div>
        </div>
      </section>

      {/* Seção Seleção Nox */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header da Seção */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {getText('home.selecao_nox.titulo')}
            </h2>
              <p className="text-sm text-gray-500 max-w-xl">
                {getText('home.selecao_nox.descricao')}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <a
                href="/imoveis"
                className="inline-flex items-center px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                {getText('home.selecao_nox.botao_buscar')}
                <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Grid de Imóveis */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imoveisSelecaoNox.length > 0 ? (
              imoveisSelecaoNox.map((imovel) => (
                <Link 
                  key={imovel.id}
                  href={`/imoveis/${imovel.slug}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <div className="h-64 relative">
                    {imovel.fotos && imovel.fotos.length > 0 ? (
                      <>
                        <Image 
                          src={imovel.fotos[0]} 
                          alt={imovel.titulo} 
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        {/* Tag Mobiliado se existir nas tags */}
                        {(imovel.tags && imovel.tags.some(tag => tag.toLowerCase().includes('mobiliado'))) && (
                          <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-semibold text-gray-900">
                            MOBILIADO
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Sem foto</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
                      {imovel.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {imovel.endereco.bairro}, {imovel.endereco.cidade}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(imovel.preco)}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              // Fallback se não houver imóveis selecionados
              <div className="col-span-3 text-center py-8 text-gray-500">
                <p>Nenhum imóvel selecionado para a Seleção Nox.</p>
                <p className="text-sm mt-2">Selecione até 3 imóveis na área do administrador.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Seção Cidades - Cards de Imóveis por Cidade */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título da Seção */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-blue-500">
              {getText('home.encontre_imovel.titulo')}
              </h2>
            </div>
          </div>

          {/* Cards das Cidades */}
          <div className="space-y-12">
            {/* Penha */}
            <div>
              <div className="flex items-center mb-4">
                <Search className="w-4 h-4 text-blue-500 mr-2 font-bold" />
                <h3 className="text-lg font-bold text-blue-500">{getText('home.encontre_imovel.penha.titulo')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer bg-transparent">
                  <Image 
                    src={siteImages['lancamentos-investidor'] || '/imagens/Cidades/Penha/Lançamentos Investidor.jpg'}
                    alt="Lançamentos de imóveis para investidores em Penha - Apartamentos e casas na planta" 
                    title="Lançamentos Investidor - Penha SC"
                    fill
                    className="object-cover bg-transparent"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    placeholder="empty"
                  />
                  <div className="absolute inset-0 bg-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">{getText('home.encontre_imovel.penha.lancamentos_investidor')}</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer bg-transparent">
                  <Image 
                    src={siteImages['frente-mar'] || '/imagens/Cidades/Penha/Frente Mar.jpg'}
                    alt="Apartamentos frente mar em Penha - Vista para o mar"
                    title="Frente Mar - Penha SC"
                    fill
                    className="object-cover bg-transparent"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    placeholder="empty"
                  />
                  <div className="absolute inset-0 bg-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">{getText('home.encontre_imovel.penha.frente_mar')}</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer bg-transparent">
                  <Image 
                    src={siteImages['mobiliados'] || '/imagens/Cidades/Penha/Mobiliados.jpg'}
                    alt="Apartamentos mobiliados em Penha - Prontos para morar"
                    title="Mobiliados - Penha SC"
                    fill
                    className="object-cover bg-transparent"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    placeholder="empty"
                  />
                  <div className="absolute inset-0 bg-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">{getText('home.encontre_imovel.penha.mobiliados')}</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer bg-transparent">
                  <Image 
                    src={siteImages['apartamentos'] || '/imagens/Cidades/Penha/Apartamentos.jpg'}
                    alt="Apartamentos à venda em Penha - Diversos tamanhos"
                    title="Apartamentos - Penha SC"
                    fill
                    className="object-cover bg-transparent"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    placeholder="empty"
                  />
                  <div className="absolute inset-0 bg-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">{getText('home.encontre_imovel.penha.apartamentos')}</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Piçarras */}
            <div>
              <div className="flex items-center mb-4">
                <Search className="w-4 h-4 text-blue-500 mr-2 font-bold" />
                <h3 className="text-lg font-bold text-blue-500">{getText('home.encontre_imovel.picarras.titulo')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer bg-transparent">
                  <Image 
                    src={siteImages['picarras-cobertura'] || '/imagens/Cidades/Piçarras/Apartamentos e Coberturas.jpg'}
                    alt="Apartamentos e coberturas em Balneário Piçarras - Alto padrão"
                    title="Apartamentos e Coberturas - Piçarras SC"
                    fill
                    className="object-cover bg-transparent"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    placeholder="empty"
                  />
                  <div className="absolute inset-0 bg-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">{getText('home.encontre_imovel.picarras.apartamentos_coberturas')}</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer bg-transparent">
                  <Image 
                    src={siteImages['picarras-mobiliado'] || '/imagens/Cidades/Piçarras/Mobiliados.jpg'}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    alt="Mobiliados" 
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">{getText('home.encontre_imovel.picarras.mobiliados')}</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer bg-transparent">
                  <Image 
                    src={siteImages['picarras-vista-mar'] || '/imagens/Cidades/Piçarras/Vista Mar.jpg'}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    alt="Vista Mar" 
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">{getText('home.encontre_imovel.picarras.vista_mar')}</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer bg-transparent">
                  <Image 
                    src={siteImages['picarras-lancamentos'] || '/imagens/Cidades/Piçarras/Lançamentos.jpg'}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    alt="Lançamentos" 
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">{getText('home.encontre_imovel.picarras.lancamentos')}</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra Velha */}
            <div>
              <div className="flex items-center mb-4">
                <Search className="w-4 h-4 text-blue-500 mr-2 font-bold" />
                <h3 className="text-lg font-bold text-blue-500">Barra Velha</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer bg-transparent">
                  <Image 
                    src={siteImages['bv-lancamentos-frente-mar'] || '/imagens/Cidades/Barra Velha/Lançamentos Frente Mar.jpg'}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt="Lançamentos Frente Mar" 
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Lançamentos Frente Mar</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer bg-transparent">
                  <Image 
                    src={siteImages['bv-em-construcao'] || '/imagens/Cidades/Barra Velha/Em Construção.jpg'}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt="Em Construção" 
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Em Construção</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer bg-transparent">
                  <Image 
                    src={siteImages['bv-imoveis-prontos'] || '/imagens/Cidades/Barra Velha/Imóveis Prontos.jpg'}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt="Imóveis Prontos" 
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Imóveis Prontos</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Lado Esquerdo - Pergunta e Botão */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                  {getText('home.cta_atendimento.titulo')}
                </h2>
              </div>
              
              <a
                href="https://wa.me/5547997530113"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>{getText('home.cta_atendimento.botao_atendimento')}</span>
              </a>
            </div>
            
            {/* Lado Direito - Lista de Benefícios */}
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{getText('home.cta_atendimento.beneficio_1.titulo')}</h3>
                  <p className="text-gray-600">{getText('home.cta_atendimento.beneficio_1.descricao')}</p>
              </div>
            </div>
            
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{getText('home.cta_atendimento.beneficio_2.titulo')}</h3>
                  <p className="text-gray-600">{getText('home.cta_atendimento.beneficio_2.descricao')}</p>
              </div>
            </div>
            
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{getText('home.cta_atendimento.beneficio_3.titulo')}</h3>
                  <p className="text-gray-600">{getText('home.cta_atendimento.beneficio_3.descricao')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Imóveis na Planta */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Lado Esquerdo - 3 Frames de Fotos em Colunas */}
            <div className="grid grid-cols-3 gap-4">
              {/* Frame 1 - Penha */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <Image 
                    src={siteImages['imoveis-planta-1'] || '/imagens/Imóveis na Planta/1.jpg'}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt="Imóveis na Planta - Penha" 
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            
              {/* Frame 2 - Piçarras */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <Image 
                    src={siteImages['imoveis-planta-2'] || '/imagens/Imóveis na Planta/2.jpg'}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt="Imóveis na Planta - Piçarras" 
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            
              {/* Frame 3 - Barra Velha */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <Image 
                    src={siteImages['imoveis-planta-3'] || '/imagens/Imóveis na Planta/3.jpg'}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    alt="Imóveis na Planta - Barra Velha" 
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            
            {/* Lado Direito - Texto e Botões */}
            <div className="text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                {getText('home.imoveis_na_planta.titulo')}
              </h2>
              
              <p className="text-base text-gray-600 mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
                {getText('home.imoveis_na_planta.descricao')}
              </p>
              
              <div className="flex flex-col lg:flex-row gap-3">
                <button className="px-4 py-2 border border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-600 hover:text-white transition-colors duration-200 text-sm">
                  {getText('home.imoveis_na_planta.botao_penha')}
                </button>
                
                <button className="px-4 py-2 border border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-600 hover:text-white transition-colors duration-200 text-sm">
                  {getText('home.imoveis_na_planta.botao_picarras')}
                </button>
                
                <button className="px-4 py-2 border border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-600 hover:text-white transition-colors duration-200 text-sm">
                  {getText('home.imoveis_na_planta.botao_barra_velha')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Seção Anuncie com a Nox */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Lado Esquerdo - Foto da Corretora */}
              <div className="relative h-64 lg:h-auto bg-transparent">
                <div className="absolute inset-0 bg-transparent">
                  <Image 
                    src={siteImages['anuncie-nox-mulher'] || '/imagens/Anuncie com a Nox/Mulher.jpg'}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    alt="Anuncie com a Nox" 
                    fill
                    className="object-cover bg-transparent"
                    loading="lazy"
                  />
                </div>
                {/* Ícone da chave */}
                <div className="absolute bottom-4 right-4 lg:right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                  </svg>
                </div>
              </div>

              {/* Lado Direito - Texto e Botão */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="text-white">
                  <p className="text-sm font-medium mb-2 opacity-90">
                    {getText('home.anuncie_nox.titulo')}
                  </p>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-6">
                    {getText('home.anuncie_nox.subtitulo')}
                  </h2>
                  
                  <button className="inline-flex items-center px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-200">
                    {getText('home.anuncie_nox.botao_avaliar')}
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Depoimentos - Dinâmica */}
      <DepoimentosSection depoimentos={depoimentos} />

             {/* Seção Conheça nossa equipe - Dinâmica */}
             <TeamSection corretores={corretores} />

      {/* Seção Blog */}
      <BlogSection />
                  </div>
    </>
  )
}
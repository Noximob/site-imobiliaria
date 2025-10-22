import { Suspense } from 'react'
import { Metadata } from 'next'
import { FiltrosImovel } from '@/types'
import FiltrosImoveis from '@/components/FiltrosImoveis'
import { Building } from 'lucide-react'

interface PageProps {
  searchParams: {
    cidade?: string
    bairro?: string
    precoMin?: string
    precoMax?: string
    quartos?: string
    banheiros?: string
    vagas?: string
    tipo?: string
    status?: string
    frenteMar?: string
    piscina?: string
    areaMin?: string
    areaMax?: string
  }
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const filtros = searchParams
  const temFiltros = Object.values(filtros).some(value => value)
  
  let title = 'Imóveis para Venda e Aluguel'
  let description = 'Encontre o imóvel ideal entre nossa seleção de casas, apartamentos e terrenos.'
  
  if (temFiltros) {
    const filtrosTexto = []
    if (filtros.cidade) filtrosTexto.push(filtros.cidade)
    if (filtros.bairro) filtrosTexto.push(filtros.bairro)
    if (filtros.tipo) filtrosTexto.push(filtros.tipo)
    if (filtros.status) filtrosTexto.push(filtros.status)
    
    title = `Imóveis ${filtrosTexto.join(', ')} - Encontre seu imóvel ideal`
    description = `Busque por imóveis ${filtrosTexto.join(', ')}. Encontre casas, apartamentos e terrenos com os melhores preços.`
  }
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}

export default async function ImoveisPage({ searchParams }: PageProps) {
  // Converter searchParams para FiltrosImovel
  const filtros: FiltrosImovel = {
    cidade: searchParams.cidade,
    bairro: searchParams.bairro,
    precoMin: searchParams.precoMin ? Number(searchParams.precoMin) : undefined,
    precoMax: searchParams.precoMax ? Number(searchParams.precoMax) : undefined,
    quartos: searchParams.quartos ? Number(searchParams.quartos) : undefined,
    banheiros: searchParams.banheiros ? Number(searchParams.banheiros) : undefined,
    vagas: searchParams.vagas ? Number(searchParams.vagas) : undefined,
    tipo: searchParams.tipo,
    status: searchParams.status,
    frenteMar: searchParams.frenteMar === 'true',
    piscina: searchParams.piscina === 'true',
    areaMin: searchParams.areaMin ? Number(searchParams.areaMin) : undefined,
    areaMax: searchParams.areaMax ? Number(searchParams.areaMax) : undefined,
  }

  // Para demonstração, sempre mostrar os mockups
  const mostrarMockups = true

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Imóveis à Venda
          </h1>
          <p className="text-lg text-gray-600">
            Encontramos 2 imóveis com seus critérios de busca
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtros */}
          <div className="lg:col-span-1">
            <FiltrosImoveis onFiltrosChange={(filtros) => {
              // Aqui você pode implementar a lógica de filtro
              console.log('Filtros aplicados:', filtros)
            }} />
          </div>

          {/* Lista de Imóveis */}
          <div className="lg:col-span-3">
            <Suspense fallback={<ImoveisLoading />}>
              {mostrarMockups ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Mockup 1 */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">Imagem do Imóvel</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Apartamento 3 quartos frente mar
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Avenida Atlântica, 1000 - Balneário Piçarras/SC
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      Cód.: 1234
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-yellow-600">
                        R$ 1.200.000
                      </span>
                      <button className="text-gray-400 hover:text-red-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span>3 Quartos</span>
                      <span>2 Suítes</span>
                      <span>2 Banheiros</span>
                      <span>2 Vagas</span>
                    </div>
                    <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                      SABER MAIS
                    </button>
                  </div>
                </div>

                {/* Mockup 2 */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">Imagem do Imóvel</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Cobertura 4 quartos vista mar
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Rua das Palmeiras, 500 - Barra Velha/SC
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      Cód.: 5678
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-yellow-600">
                        R$ 2.500.000
                      </span>
                      <button className="text-gray-400 hover:text-red-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span>4 Quartos</span>
                      <span>3 Suítes</span>
                      <span>3 Banheiros</span>
                      <span>3 Vagas</span>
                    </div>
                    <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                      SABER MAIS
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Nenhum imóvel encontrado
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Em breve teremos imóveis disponíveis para você.
                  </p>
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

function ImoveisLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="h-48 bg-gray-300 rounded-t-lg"></div>
          <div className="p-6">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
            <div className="h-6 bg-gray-300 rounded mb-4 w-1/2"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

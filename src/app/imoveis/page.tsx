import { Suspense } from 'react'
import { Metadata } from 'next'
import { searchImoveis } from '@/lib/imoveis'
import { FiltrosImovel } from '@/types'
import ImovelCard from '@/components/ImovelCard'
import FiltrosImoveis from '@/components/FiltrosImoveis'
import { Building, Search } from 'lucide-react'

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

  // Buscar imóveis com filtros
  const imoveis = await searchImoveis(filtros)
  const temFiltros = Object.values(filtros).some(value => value !== undefined && value !== '')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {temFiltros ? 'Imóveis Encontrados' : 'Todos os Imóveis'}
          </h1>
          <p className="text-lg text-gray-600">
            {imoveis.length} imóvel{imoveis.length !== 1 ? 'is' : ''} encontrado{imoveis.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtros */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Filtros
              </h2>
              <FiltrosImoveis filtrosIniciais={filtros} />
            </div>
          </div>

          {/* Lista de Imóveis */}
          <div className="lg:col-span-3">
            <Suspense fallback={<ImoveisLoading />}>
              {imoveis.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {imoveis.map((imovel) => (
                    <ImovelCard key={imovel.id} imovel={imovel} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Nenhum imóvel encontrado
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {temFiltros 
                      ? 'Tente ajustar os filtros para encontrar mais imóveis.'
                      : 'Em breve teremos imóveis disponíveis para você.'
                    }
                  </p>
                  {temFiltros && (
                    <a
                      href="/imoveis"
                      className="btn-primary inline-flex items-center space-x-2"
                    >
                      <Search className="w-4 h-4" />
                      <span>Limpar Filtros</span>
                    </a>
                  )}
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

'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import FiltrosImoveis from '@/components/FiltrosImoveis'
import { getAllImoveis, searchImoveis, formatPrice } from '@/lib/imoveis'
import { Imovel, FiltrosImovel } from '@/types'
import { Heart } from 'lucide-react'
import { toggleFavorito, isFavorito } from '@/lib/favoritos'

function ImoveisPageContent() {
  const searchParams = useSearchParams()
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [filtros, setFiltros] = useState<FiltrosImovel>({})
  const [filtrosIniciais, setFiltrosIniciais] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [, setFavoritosUpdate] = useState(0) // Para forçar re-render quando favoritos mudarem

  useEffect(() => {
    // Força overflow hidden no body apenas nesta página
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    
    // Listener para atualizar quando favoritos mudarem
    const handleFavoritosChange = () => {
      setFavoritosUpdate(prev => prev + 1)
    }
    
    window.addEventListener('favoritos-changed', handleFavoritosChange)
    
    // Cleanup: restaura overflow quando sair da página
    return () => {
      document.body.style.overflow = 'unset'
      document.documentElement.style.overflow = 'unset'
      window.removeEventListener('favoritos-changed', handleFavoritosChange)
    }
  }, [])

  // Ler query params da URL e aplicar filtros iniciais (sempre que a URL mudar)
  useEffect(() => {
    const params: any = {}
    
    // Campos básicos
    if (searchParams.get('cidade')) params.cidade = searchParams.get('cidade')
    if (searchParams.get('status')) params.status = searchParams.get('status')
    if (searchParams.get('tipo')) params.tipo = searchParams.get('tipo')
    
    // Campos numéricos
    const quartos = searchParams.getAll('quartos')
    if (quartos.length > 0) params.quartos = quartos
    if (searchParams.get('banheiros')) params.banheiros = searchParams.get('banheiros')
    if (searchParams.get('vagas')) params.vagas = searchParams.get('vagas')
    
    // Valores
    if (searchParams.get('valorMin')) params.valorMin = searchParams.get('valorMin')
    if (searchParams.get('valorMax')) params.valorMax = searchParams.get('valorMax')
    
    // Área
    if (searchParams.get('areaMin')) params.areaMin = searchParams.get('areaMin')
    if (searchParams.get('areaMax')) params.areaMax = searchParams.get('areaMax')
    
    // Comodidades
    if (searchParams.get('mobiliado') === 'true') params.mobiliado = true
    if (searchParams.get('vistaMar') === 'true') params.vistaMar = true
    if (searchParams.get('frenteMar') === 'true') params.frenteMar = true
    if (searchParams.get('quadraMar') === 'true') params.quadraMar = true
    if (searchParams.get('areaLazer') === 'true') params.areaLazer = true
    if (searchParams.get('homeClub') === 'true') params.homeClub = true
    
    // Sempre atualizar filtros iniciais quando a URL mudar
    setFiltrosIniciais(params)
  }, [searchParams])

  useEffect(() => {
    const loadImoveis = async () => {
      try {
        setIsLoading(true)
        let imoveisData: Imovel[]
        
        // Se houver filtros, usar searchImoveis, senão getAllImoveis
        if (Object.keys(filtros).length > 0 && Object.values(filtros).some(v => v !== '' && v !== undefined && v !== false)) {
          imoveisData = await searchImoveis(filtros)
        } else {
          imoveisData = await getAllImoveis()
        }
        
        setImoveis(imoveisData)
      } catch (error) {
        console.error('Erro ao carregar imóveis:', error)
        setImoveis([]) // Em caso de erro, definir array vazio para não ficar em loading infinito
      } finally {
        setIsLoading(false)
      }
    }
    
    // Adicionar um pequeno delay para evitar múltiplas chamadas muito rápidas
    const timeoutId = setTimeout(() => {
      loadImoveis()
    }, 100)
    
    return () => clearTimeout(timeoutId)
  }, [filtros])

  const handleFiltrosChange = (novosFiltros: any) => {
    // Função auxiliar para converter valores com "+" (ex: "4+" -> 4, "1+" -> 1)
    const parseFilterValue = (value: string): number | undefined => {
      if (!value) return undefined
      const numValue = parseInt(value.replace('+', ''))
      return isNaN(numValue) ? undefined : numValue
    }

    // Converter filtros do componente para o formato esperado
    const filtrosFormatados: FiltrosImovel = {
      status: novosFiltros.status || undefined,
      tipo: novosFiltros.tipo || undefined,
      cidade: novosFiltros.cidade || undefined,
      quartos: Array.isArray(novosFiltros.quartos) && novosFiltros.quartos.length > 0 
        ? novosFiltros.quartos.map((q: string) => parseFilterValue(q)).filter((q: number | undefined) => q !== undefined) as number[]
        : undefined,
      banheiros: parseFilterValue(novosFiltros.banheiros),
      vagas: parseFilterValue(novosFiltros.vagas),
      precoMin: novosFiltros.valorMin ? Number(novosFiltros.valorMin) : undefined,
      precoMax: novosFiltros.valorMax ? Number(novosFiltros.valorMax) : undefined,
      areaMin: novosFiltros.areaMin ? Number(novosFiltros.areaMin) : undefined,
      areaMax: novosFiltros.areaMax ? Number(novosFiltros.areaMax) : undefined,
      frenteMar: novosFiltros.frenteMar || undefined,
      mobiliado: novosFiltros.mobiliado || undefined,
      vistaMar: novosFiltros.vistaMar || undefined,
      quadraMar: novosFiltros.quadraMar || undefined,
      areaLazer: novosFiltros.areaLazer || undefined,
      homeClub: novosFiltros.homeClub || undefined,
    }
    
    setFiltros(filtrosFormatados)
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Conteúdo Principal com Duas Colunas */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar de Filtros - Lado Esquerdo - COM SCROLL */}
        <div className="w-80 bg-white shadow-lg overflow-y-auto">
          <FiltrosImoveis onFiltrosChange={handleFiltrosChange} filtrosIniciais={filtrosIniciais} />
        </div>

        {/* Área Principal - Lado Direito */}
        <div className="flex-1 flex flex-col">
          {/* Header Fixo dos Imóveis - FIXO COMO HEADER */}
          <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Imóveis à Venda</h1>
                <p className="text-xs text-gray-600 mt-1">Home &gt; Imóveis à Venda</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Ordenar
                </button>
                <button className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {isLoading 
                ? 'Carregando imóveis...' 
                : `Encontramos ${imoveis.length} ${imoveis.length === 1 ? 'imóvel' : 'imóveis'} com seus critérios de busca`
              }
            </p>
          </div>

          {/* Lista de Imóveis - COM SCROLL */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-6 py-8 pb-24">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <p className="mt-4 text-gray-600">Carregando imóveis...</p>
                </div>
              ) : imoveis.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Nenhum imóvel encontrado com os filtros selecionados.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {imoveis.map((imovel) => (
                    <div key={imovel.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex h-64">
                      <div className="w-64 h-full relative">
                        {imovel.fotos && imovel.fotos.length > 0 ? (
                          <Image
                            src={imovel.fotos[0]}
                            alt={imovel.titulo}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">Sem imagem</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                            {imovel.titulo}
                          </h3>
                          <p className="text-gray-600 text-xs mb-1">
                            {imovel.endereco.rua && `${imovel.endereco.rua}, `}
                            {imovel.endereco.numero && `${imovel.endereco.numero}, `}
                            {imovel.endereco.bairro && `${imovel.endereco.bairro} - `}
                            {imovel.endereco.cidade}/{imovel.endereco.estado}
                          </p>
                          <p className="text-gray-500 text-xs mb-3">
                            Cód.: {imovel.id}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-3">
                            {imovel.caracteristicas.frenteMar && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">Frente Mar</span>
                            )}
                            {imovel.caracteristicas.piscina && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">Piscina</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                            {imovel.caracteristicas.quartos > 0 && (
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                                </svg>
                                <span>{imovel.caracteristicas.quartos} {imovel.caracteristicas.quartos === 1 ? 'Quarto' : 'Quartos'}</span>
                              </div>
                            )}
                            {imovel.caracteristicas.banheiros > 0 && (
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span>{imovel.caracteristicas.banheiros} {imovel.caracteristicas.banheiros === 1 ? 'Banheiro' : 'Banheiros'}</span>
                              </div>
                            )}
                            {imovel.caracteristicas.vagas > 0 && (
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1H21v6H3V3h7.5z" />
                                </svg>
                                <span>{imovel.caracteristicas.vagas} {imovel.caracteristicas.vagas === 1 ? 'Vaga' : 'Vagas'}</span>
                              </div>
                            )}
                            {imovel.caracteristicas.area > 0 && (
                              <div className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4a2 2 0 012-2h12a2 2 0 012 2v4M4 8v8a2 2 0 002 2h12a2 2 0 002-2V8M4 8h16" />
                                </svg>
                                <span>{imovel.caracteristicas.area}m²</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <p className="text-lg font-bold text-purple-600">
                              {formatPrice(imovel.preco)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                toggleFavorito(imovel.id)
                              }}
                              className={`transition-colors ${
                                isFavorito(imovel.id) 
                                  ? 'text-red-500' 
                                  : 'text-gray-400 hover:text-red-500'
                              }`}
                            >
                              <Heart 
                                className={`w-5 h-5 ${isFavorito(imovel.id) ? 'fill-current' : ''}`} 
                              />
                            </button>
                            <Link 
                              href={`/imoveis/${imovel.slug}`}
                              className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-5 rounded-md transition-colors duration-200 text-sm"
                            >
                              SABER MAIS
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ImoveisPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <ImoveisPageContent />
    </Suspense>
  )
}
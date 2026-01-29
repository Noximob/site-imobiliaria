'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import FiltrosImoveis from '@/components/FiltrosImoveis'
import { getAllImoveis, searchImoveis, formatPrice } from '@/lib/imoveis'
import { Imovel, FiltrosImovel } from '@/types'
import { Heart, X } from 'lucide-react'
import { toggleFavorito, isFavorito } from '@/lib/favoritos'

function ImoveisPageContent() {
  const searchParams = useSearchParams()
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [filtros, setFiltros] = useState<FiltrosImovel>({})
  const [filtrosIniciais, setFiltrosIniciais] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [, setFavoritosUpdate] = useState(0) // Para forçar re-render quando favoritos mudarem
  const [currentPage, setCurrentPage] = useState(1)
  const [ordenacao, setOrdenacao] = useState<'sem-ordenacao' | 'menor-preco' | 'maior-preco' | 'mais-dormitorios' | 'menos-dormitorios'>('sem-ordenacao')
  const itemsPerPage = 10
  const [showFiltersMobile, setShowFiltersMobile] = useState(false)
  const [showOrdenacaoMobile, setShowOrdenacaoMobile] = useState(false)

  useEffect(() => {
    // Listener para atualizar quando favoritos mudarem
    const handleFavoritosChange = () => {
      setFavoritosUpdate(prev => prev + 1)
    }
    
    window.addEventListener('favoritos-changed', handleFavoritosChange)
    
    // Cleanup
    return () => {
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
    if (searchParams.get('areaLazer') === 'true') params.areaLazer = true
    
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
        
        // Aplicar ordenação
        let imoveisOrdenados = [...imoveisData]
        if (ordenacao !== 'sem-ordenacao') {
          imoveisOrdenados = imoveisOrdenados.sort((a, b) => {
            switch (ordenacao) {
              case 'menor-preco':
                return a.preco - b.preco
              case 'maior-preco':
                return b.preco - a.preco
              case 'mais-dormitorios':
                return b.caracteristicas.quartos - a.caracteristicas.quartos
              case 'menos-dormitorios':
                return a.caracteristicas.quartos - b.caracteristicas.quartos
              default:
                return 0
            }
          })
        }
        
        setImoveis(imoveisOrdenados)
        setCurrentPage(1) // Resetar para página 1 quando filtros mudarem
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
  }, [filtros, ordenacao])

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
      dataEntrega: Array.isArray(novosFiltros.dataEntrega) && novosFiltros.dataEntrega.length > 0
        ? novosFiltros.dataEntrega
        : undefined,
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
      areaLazer: novosFiltros.areaLazer || undefined,
    }
    
    setFiltros(filtrosFormatados)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden w-full max-w-full box-border">
      {/* Layout principal: sidebar + conteúdo em telas grandes; apenas conteúdo no mobile */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full min-w-0 box-border">
        {/* Sidebar de Filtros - Desktop apenas */}
        <div className="hidden lg:block w-80 flex-shrink-0 bg-white shadow-lg overflow-y-auto">
          <FiltrosImoveis onFiltrosChange={handleFiltrosChange} filtrosIniciais={filtrosIniciais} />
        </div>

        {/* Área Principal - centralizada e sem overflow no mobile */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          {/* Header / Barra superior */}
          <div className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3 flex-shrink-0 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-2 min-w-0">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">Imóveis à Venda</h1>
                <p className="text-xs text-gray-600 mt-1 hidden sm:block">Home &gt; Imóveis à Venda</p>
              </div>
              {/* Ordenação desktop */}
              <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value as any)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
                >
                  <option value="sem-ordenacao">Sem Ordenação</option>
                  <option value="menor-preco">Menor Preço</option>
                  <option value="maior-preco">Maior Preço</option>
                  <option value="mais-dormitorios">Mais Dormitórios</option>
                  <option value="menos-dormitorios">Menos Dormitórios</option>
                </select>
              </div>
            </div>

            {/* Barra de ações no mobile: Filtrar / Ordenar - cabem na tela */}
            <div className="mt-2 flex gap-2 sm:hidden min-w-0 w-full">
              <button
                type="button"
                onClick={() => setShowFiltersMobile(true)}
                className="flex-1 min-w-0 inline-flex items-center justify-center rounded-full bg-purple-500 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-600"
              >
                Filtrar
              </button>
              <button
                type="button"
                onClick={() => setShowOrdenacaoMobile(true)}
                className="flex-1 min-w-0 inline-flex items-center justify-center rounded-full border border-purple-500 px-3 py-2.5 text-sm font-semibold text-purple-600 bg-white hover:bg-purple-50"
              >
                Ordenar
              </button>
            </div>

            <p className="mt-2 text-sm text-gray-600 min-w-0">
              {isLoading 
                ? 'Carregando imóveis...' 
                : `Encontramos ${imoveis.length} ${imoveis.length === 1 ? 'imóvel' : 'imóveis'} com seus critérios de busca`
              }
            </p>
          </div>

          {/* Lista de Imóveis */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 w-full box-border">
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
                <>
                  <div className="space-y-8">
                    {imoveis
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((imovel) => (
                    <div key={imovel.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col sm:flex-row sm:h-64 min-w-0 w-full">
                      <div className="w-full sm:w-64 h-56 sm:h-full relative flex-shrink-0 min-w-0">
                        {imovel.fotos && imovel.fotos.length > 0 ? (
                          <Image
                            src={imovel.fotos[0]}
                            alt={imovel.titulo}
                            fill
                            className="object-cover sm:object-contain bg-gray-100"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">Sem imagem</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
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
                              target="_blank"
                              rel="noopener noreferrer"
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
                  
                  {/* Paginação */}
                  {imoveis.length > itemsPerPage && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Anterior
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.ceil(imoveis.length / itemsPerPage) }, (_, i) => i + 1)
                          .filter(page => {
                            // Mostrar primeira, última, atual e adjacentes
                            if (page === 1 || page === Math.ceil(imoveis.length / itemsPerPage)) return true
                            if (Math.abs(page - currentPage) <= 1) return true
                            return false
                          })
                          .map((page, index, array) => {
                            // Adicionar "..." entre páginas não adjacentes
                            const prevPage = array[index - 1]
                            const showEllipsis = prevPage && page - prevPage > 1
                            
                            return (
                              <div key={page} className="flex items-center gap-1">
                                {showEllipsis && (
                                  <span className="px-2 text-gray-500">...</span>
                                )}
                                <button
                                  onClick={() => setCurrentPage(page)}
                                  className={`px-3 py-2 rounded-lg transition-colors ${
                                    currentPage === page
                                      ? 'bg-purple-600 text-white'
                                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  {page}
                                </button>
                              </div>
                            )
                          })}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(imoveis.length / itemsPerPage), prev + 1))}
                        disabled={currentPage === Math.ceil(imoveis.length / itemsPerPage)}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Próxima
                      </button>
                      
                      <span className="text-sm text-gray-600 ml-4">
                        Página {currentPage} de {Math.ceil(imoveis.length / itemsPerPage)} 
                        ({imoveis.length} {imoveis.length === 1 ? 'imóvel' : 'imóveis'})
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay de Filtros - Mobile */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFiltersMobile(false)}
          />
          <div className="relative ml-auto h-full w-full max-w-md bg-white rounded-l-2xl shadow-xl flex flex-col pt-[env(safe-area-inset-top,0px)]">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 bg-white flex-shrink-0 rounded-tl-2xl">
              <h2 className="text-base font-semibold text-gray-900 flex-1 min-w-0">Filtrar imóveis</h2>
              <button
                type="button"
                onClick={() => setShowFiltersMobile(false)}
                className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 hover:text-gray-900 transition-colors shadow-sm"
                aria-label="Fechar filtros"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <FiltrosImoveis
                onFiltrosChange={(novos) => {
                  handleFiltrosChange(novos)
                }}
                filtrosIniciais={filtrosIniciais}
              />
            </div>
          </div>
        </div>
      )}

      {/* Overlay de Ordenação - Mobile */}
      {showOrdenacaoMobile && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowOrdenacaoMobile(false)}
          />
          <div className="relative mt-auto w-full bg-white rounded-t-2xl shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">Ordenar</h2>
              <button
                type="button"
                onClick={() => setShowOrdenacaoMobile(false)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
                aria-label="Fechar ordenação"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {[
                { value: 'sem-ordenacao', label: 'Sem ordenação' },
                { value: 'menor-preco', label: 'Menor preço' },
                { value: 'maior-preco', label: 'Maior preço' },
                { value: 'mais-dormitorios', label: 'Mais dormitórios' },
                { value: 'menos-dormitorios', label: 'Menos dormitórios' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setOrdenacao(opt.value as any)
                    setShowOrdenacaoMobile(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                    ordenacao === opt.value
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
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
'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import FiltrosImoveis from '@/components/FiltrosImoveis'
import { getAllImoveis, searchImoveis, formatPrice, getFotoPrincipal } from '@/lib/imoveis'
import { Imovel, FiltrosImovel } from '@/types'
import { Heart, X } from 'lucide-react'
import { toggleFavorito, isFavorito } from '@/lib/favoritos'
import { trackFavorito, trackFilterApply, trackImovelClick, trackPagination } from '@/lib/analytics'

const CIDADE_LABELS: Record<string, string> = {
  penha: 'Penha',
  'balneario-picarras': 'Balneário Piçarras',
  'barra-velha': 'Barra Velha',
}

const TIPO_LABELS: Record<string, string> = {
  apartamento: 'Apartamentos',
  casa: 'Casas',
  cobertura: 'Coberturas',
  terreno: 'Terrenos',
}

function getH1Text(f: { cidade?: string; tipo?: string; status?: string; frenteMar?: boolean; vistaMar?: boolean; mobiliado?: boolean }): string {
  const cidade = f.cidade ? (CIDADE_LABELS[f.cidade] || f.cidade) : null
  const tipo = f.tipo ? (TIPO_LABELS[f.tipo] || f.tipo) : null
  const lancamento = f.status === 'lancamento'
  const frenteMar = f.frenteMar === true
  const vistaMar = f.vistaMar === true
  const mobiliado = f.mobiliado === true
  const extras: string[] = []
  if (frenteMar) extras.push('Frente Mar')
  if (vistaMar) extras.push('Vista Mar')
  if (mobiliado) extras.push('Mobiliados')
  const extraStr = extras.length > 0 ? ` ${extras.join(' e ')}` : ''
  if (lancamento && cidade) return `Empreendimentos em ${cidade}${extraStr}`
  if (lancamento) return `Empreendimentos e Lançamentos${extraStr}`
  if (tipo && cidade) return `${tipo} em ${cidade}${extraStr}`
  if (tipo) return `${tipo} à Venda${extraStr}`
  if (cidade) return `Imóveis em ${cidade}${extraStr}`
  if (extraStr.trim()) return `Imóveis${extraStr}`
  return 'Imóveis à Venda'
}

function hasRelevantFilters(f: { cidade?: string; tipo?: string; status?: string; frenteMar?: boolean; vistaMar?: boolean; mobiliado?: boolean }): boolean {
  return !!(f.cidade || f.tipo || f.status || f.frenteMar || f.vistaMar || f.mobiliado)
}

function ImoveisPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [filtros, setFiltros] = useState<FiltrosImovel>({})
  const [filtrosIniciais, setFiltrosIniciais] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  const [, setFavoritosUpdate] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [ordenacao, setOrdenacao] = useState<'sem-ordenacao' | 'menor-preco' | 'maior-preco' | 'mais-dormitorios' | 'menos-dormitorios'>('sem-ordenacao')
  const itemsPerPage = 10
  const [showFiltersMobile, setShowFiltersMobile] = useState(false)
  const [showOrdenacaoMobile, setShowOrdenacaoMobile] = useState(false)
  const listScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleFavoritosChange = () => setFavoritosUpdate((prev) => prev + 1)
    window.addEventListener('favoritos-changed', handleFavoritosChange)
    return () => window.removeEventListener('favoritos-changed', handleFavoritosChange)
  }, [])

  useEffect(() => {
    const params: any = {}
    if (searchParams.get('cidade')) params.cidade = searchParams.get('cidade')
    if (searchParams.get('status')) params.status = searchParams.get('status')
    if (searchParams.get('tipo')) params.tipo = searchParams.get('tipo')
    const quartos = searchParams.getAll('quartos')
    if (quartos.length > 0) params.quartos = quartos
    if (searchParams.get('banheiros')) params.banheiros = searchParams.get('banheiros')
    if (searchParams.get('vagas')) params.vagas = searchParams.get('vagas')
    if (searchParams.get('valorMin')) params.valorMin = searchParams.get('valorMin')
    if (searchParams.get('valorMax')) params.valorMax = searchParams.get('valorMax')
    if (searchParams.get('areaMin')) params.areaMin = searchParams.get('areaMin')
    if (searchParams.get('areaMax')) params.areaMax = searchParams.get('areaMax')
    if (searchParams.get('mobiliado') === 'true') params.mobiliado = true
    if (searchParams.get('vistaMar') === 'true') params.vistaMar = true
    if (searchParams.get('frenteMar') === 'true') params.frenteMar = true
    if (searchParams.get('areaLazer') === 'true') params.areaLazer = true
    setFiltrosIniciais(params)
  }, [searchParams])

  useEffect(() => {
    const loadImoveis = async () => {
      try {
        setIsLoading(true)
        let imoveisData: Imovel[]
        if (Object.keys(filtros).length > 0 && Object.values(filtros).some((v) => v !== '' && v !== undefined && v !== false)) {
          imoveisData = await searchImoveis(filtros)
        } else {
          imoveisData = await getAllImoveis()
        }
        let imoveisOrdenados = [...imoveisData]
        if (ordenacao !== 'sem-ordenacao') {
          imoveisOrdenados = imoveisOrdenados.sort((a, b) => {
            switch (ordenacao) {
              case 'menor-preco': return a.preco - b.preco
              case 'maior-preco': return b.preco - a.preco
              case 'mais-dormitorios': return b.caracteristicas.quartos - a.caracteristicas.quartos
              case 'menos-dormitorios': return a.caracteristicas.quartos - b.caracteristicas.quartos
              default: return 0
            }
          })
        }
        setImoveis(imoveisOrdenados)
        setCurrentPage(1)
      } catch (error) {
        console.error('Erro ao carregar imóveis:', error)
        setImoveis([])
      } finally {
        setIsLoading(false)
      }
    }
    const timeoutId = setTimeout(() => loadImoveis(), 100)
    return () => clearTimeout(timeoutId)
  }, [filtros, ordenacao])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    listScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  const handleFiltrosChange = (novosFiltros: any) => {
    const parseFilterValue = (value: string): number | undefined => {
      if (!value) return undefined
      const numValue = parseInt(value.replace('+', ''))
      return isNaN(numValue) ? undefined : numValue
    }
    const filtrosFormatados: FiltrosImovel = {
      status: novosFiltros.status || undefined,
      tipo: novosFiltros.tipo || undefined,
      cidade: novosFiltros.cidade || undefined,
      dataEntrega: Array.isArray(novosFiltros.dataEntrega) && novosFiltros.dataEntrega.length > 0 ? novosFiltros.dataEntrega : undefined,
      quartos: Array.isArray(novosFiltros.quartos) && novosFiltros.quartos.length > 0 ? novosFiltros.quartos.map((q: string) => parseFilterValue(q)).filter((q: number | undefined) => q !== undefined) as number[] : undefined,
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
    const q = new URLSearchParams()
    if (novosFiltros.cidade) q.set('cidade', novosFiltros.cidade)
    if (novosFiltros.tipo) q.set('tipo', novosFiltros.tipo)
    if (novosFiltros.status) q.set('status', novosFiltros.status)
    if (novosFiltros.frenteMar) q.set('frenteMar', 'true')
    if (novosFiltros.vistaMar) q.set('vistaMar', 'true')
    if (novosFiltros.mobiliado) q.set('mobiliado', 'true')
    const query = q.toString()
    const url = query ? `${pathname}?${query}` : pathname
    router.replace(url, { scroll: false })
    trackFilterApply({
      cidade: filtrosFormatados.cidade,
      tipo: filtrosFormatados.tipo,
      status: filtrosFormatados.status,
      quartos: Array.isArray(filtrosFormatados.quartos) ? filtrosFormatados.quartos[0] : filtrosFormatados.quartos,
      valor_min: filtrosFormatados.precoMin,
      valor_max: filtrosFormatados.precoMax,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden w-full max-w-full box-border">
      <div className="flex-1 flex max-w-7xl mx-auto w-full min-w-0 box-border">
        <div className="hidden lg:block w-80 flex-shrink-0 bg-white shadow-lg overflow-y-auto">
          <FiltrosImoveis onFiltrosChange={handleFiltrosChange} filtrosIniciais={filtrosIniciais} />
        </div>
        <div className="flex-1 flex flex-col min-w-0 w-full">
          <div className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3 flex-shrink-0 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-2 min-w-0">
              <div className="min-w-0 flex-1">
                {(() => {
                  const active = hasRelevantFilters(filtros) ? filtros : filtrosIniciais
                  const h1Text = getH1Text(active)
                  const hasFilter = hasRelevantFilters(active)
                  const baseUrl = 'https://noximobiliaria.com.br'
                  const currentUrl = baseUrl + pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
                  const breadcrumbList = {
                    '@context': 'https://schema.org',
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl + '/' },
                      { '@type': 'ListItem', position: 2, name: 'Imóveis', item: baseUrl + '/imoveis/' },
                      ...(hasFilter ? [{ '@type': 'ListItem', position: 3, name: h1Text, item: currentUrl }] : []),
                    ],
                  }
                  return (
                    <>
                      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">{h1Text}</h1>
                      <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mt-1 hidden sm:block">
                        <ol className="flex flex-wrap items-center gap-1">
                          <li><Link href="/" className="text-purple-600 hover:underline">Home</Link></li>
                          <li><span className="mx-1">›</span></li>
                          <li><Link href="/imoveis/" className="text-purple-600 hover:underline">Imóveis</Link></li>
                          {hasFilter && (
                            <>
                              <li><span className="mx-1">›</span></li>
                              <li><span className="text-gray-900">{h1Text}</span></li>
                            </>
                          )}
                        </ol>
                      </nav>
                      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
                    </>
                  )
                })()}
              </div>
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
            <div className="mt-2 flex gap-2 sm:hidden min-w-0 w-full">
              <button type="button" onClick={() => setShowFiltersMobile(true)} className="flex-1 min-w-0 inline-flex items-center justify-center rounded-full bg-purple-500 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-600">Filtrar</button>
              <button type="button" onClick={() => setShowOrdenacaoMobile(true)} className="flex-1 min-w-0 inline-flex items-center justify-center rounded-full border border-purple-500 px-3 py-2.5 text-sm font-semibold text-purple-600 bg-white hover:bg-purple-50">Ordenar</button>
            </div>
            <p className="mt-2 text-sm text-gray-600 min-w-0">
              {isLoading ? 'Carregando imóveis...' : `Encontramos ${imoveis.length} ${imoveis.length === 1 ? 'imóvel' : 'imóveis'} com seus critérios de busca`}
            </p>
          </div>
          <div ref={listScrollRef} className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
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
                    {imoveis.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((imovel) => (
                      <div key={imovel.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col sm:flex-row sm:h-64 min-w-0 w-full">
                        <Link href={`/imoveis/${imovel.slug}/`} className="w-full sm:w-64 h-56 sm:h-full relative flex-shrink-0 min-w-0 block" onClick={() => trackImovelClick(imovel.id, imovel.slug, imovel.titulo)}>
                          {getFotoPrincipal(imovel) ? (
                            <Image src={getFotoPrincipal(imovel)!} alt={imovel.titulo} fill className="object-cover sm:object-contain bg-gray-100" unoptimized sizes="(max-width: 640px) 100vw, 256px" />
                          ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                              <span className="text-gray-500 text-sm">Sem imagem</span>
                            </div>
                          )}
                        </Link>
                        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
                          <div>
                            <Link href={`/imoveis/${imovel.slug}/`} onClick={() => trackImovelClick(imovel.id, imovel.slug, imovel.titulo)} className="block">
                              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-purple-600 transition-colors">{imovel.titulo}</h3>
                            </Link>
                            <p className="text-gray-600 text-xs mb-1">
                              {imovel.endereco.rua && `${imovel.endereco.rua}, `}
                              {imovel.endereco.numero && `${imovel.endereco.numero}, `}
                              {imovel.endereco.bairro && `${imovel.endereco.bairro} - `}
                              {imovel.endereco.cidade}/{imovel.endereco.estado}
                            </p>
                            <p className="text-gray-500 text-xs mb-3">Cód.: {imovel.id}</p>
                            <div className="flex items-center gap-2 mb-3">
                              {imovel.caracteristicas.frenteMar && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">Frente Mar</span>}
                              {imovel.caracteristicas.piscina && <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">Piscina</span>}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                              {Number(imovel.caracteristicas?.quartos) > 0 && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" /></svg>
                                  <span>{imovel.caracteristicas.quartos} {imovel.caracteristicas.quartos === 1 ? 'Quarto' : 'Quartos'}</span>
                                </div>
                              )}
                              {Number(imovel.caracteristicas?.banheiros) > 0 && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                  <span>{imovel.caracteristicas.banheiros} {imovel.caracteristicas.banheiros === 1 ? 'Banheiro' : 'Banheiros'}</span>
                                </div>
                              )}
                              {Number(imovel.caracteristicas?.vagas) > 0 && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1H21v6H3V3h7.5z" /></svg>
                                  <span>{imovel.caracteristicas.vagas} {imovel.caracteristicas.vagas === 1 ? 'Vaga' : 'Vagas'}</span>
                                </div>
                              )}
                              {Number(imovel.caracteristicas?.area) > 0 && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4a2 2 0 012-2h12a2 2 0 012 2v4M4 8v8a2 2 0 002 2h12a2 2 0 002-2V8M4 8h16" /></svg>
                                  <span>{imovel.caracteristicas.area}m²</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div>
                              <p className="text-lg font-bold text-purple-600">{formatPrice(imovel.preco)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); const added = toggleFavorito(imovel.id); trackFavorito(imovel.id, added) }}
                                className={`transition-colors ${isFavorito(imovel.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                              >
                                <Heart className={`w-5 h-5 ${isFavorito(imovel.id) ? 'fill-current' : ''}`} />
                              </button>
                              <Link href={`/imoveis/${imovel.slug}/`} onClick={() => trackImovelClick(imovel.id, imovel.slug, imovel.titulo)} className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-5 rounded-md transition-colors duration-200 text-sm">SABER MAIS</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {imoveis.length > itemsPerPage && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <button onClick={() => { const p = Math.max(1, currentPage - 1); setCurrentPage(p); trackPagination(p) }} disabled={currentPage === 1} className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Anterior</button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.ceil(imoveis.length / itemsPerPage) }, (_, i) => i + 1)
                          .filter((page) => page === 1 || page === Math.ceil(imoveis.length / itemsPerPage) || Math.abs(page - currentPage) <= 1)
                          .map((page, index, array) => {
                            const prevPage = array[index - 1]
                            const showEllipsis = prevPage && page - prevPage > 1
                            return (
                              <div key={page} className="flex items-center gap-1">
                                {showEllipsis && <span className="px-2 text-gray-500">...</span>}
                                <button onClick={() => { setCurrentPage(page); trackPagination(page) }} className={`px-3 py-2 rounded-lg transition-colors ${currentPage === page ? 'bg-purple-600 text-white' : 'bg-white border border-gray-300 hover:bg-gray-50'}`}>{page}</button>
                              </div>
                            )
                          })}
                      </div>
                      <button onClick={() => { const p = Math.min(Math.ceil(imoveis.length / itemsPerPage), currentPage + 1); setCurrentPage(p); trackPagination(p) }} disabled={currentPage === Math.ceil(imoveis.length / itemsPerPage)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Próxima</button>
                      <span className="text-sm text-gray-600 ml-4">Página {currentPage} de {Math.ceil(imoveis.length / itemsPerPage)} ({imoveis.length} {imoveis.length === 1 ? 'imóvel' : 'imóveis'})</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {showFiltersMobile && (
        <div className="fixed inset-0 z-40 flex lg:hidden overflow-hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFiltersMobile(false)} />
          <div className="relative ml-auto h-full w-full max-w-md bg-white rounded-l-2xl shadow-xl flex flex-col overflow-hidden" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
            <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ minHeight: 0 }}>
              <div className="flex items-center justify-between px-5 pt-20 pb-3 bg-white border-b border-gray-100 sticky top-0 z-10">
                <span className="text-lg font-semibold text-purple-600 tracking-tight">Filtro</span>
                <button type="button" onClick={() => setShowFiltersMobile(false)} className="flex items-center justify-center w-11 h-11 rounded-full bg-purple-500 text-white hover:bg-purple-600 active:opacity-90 shadow-sm" aria-label="Fechar filtros">
                  <X className="w-6 h-6" strokeWidth={2.5} />
                </button>
              </div>
              <FiltrosImoveis onFiltrosChange={(novos) => { handleFiltrosChange(novos) }} onApply={() => setShowFiltersMobile(false)} filtrosIniciais={filtrosIniciais} />
            </div>
          </div>
        </div>
      )}
      {showOrdenacaoMobile && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowOrdenacaoMobile(false)} />
          <div className="relative mt-auto w-full bg-white rounded-t-2xl shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">Ordenar</h2>
              <button type="button" onClick={() => setShowOrdenacaoMobile(false)} className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors" aria-label="Fechar ordenação">
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
                <button key={opt.value} type="button" onClick={() => { setOrdenacao(opt.value as any); setShowOrdenacaoMobile(false) }} className={`w-full text-left px-3 py-2 rounded-lg text-sm ${ordenacao === opt.value ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-800 hover:bg-gray-50'}`}>{opt.label}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ImoveisListagem() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Carregando...</p>
          </div>
        </div>
      }
    >
      <ImoveisPageContent />
    </Suspense>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { getImovelBySlug, getAllImoveis, formatPrice } from '@/lib/imoveis'
import { getWhatsAppLink } from '@/lib/whatsapp'
import { toggleFavorito, isFavorito } from '@/lib/favoritos'
import { trackViewItem, trackImovelContato, trackWhatsAppClick, trackFavorito } from '@/lib/analytics'
import { 
  MapPin, 
  Key,
  Heart,
  Check,
  MessageCircle,
  BedDouble,
  Droplet,
  Car,
  Maximize2
} from 'lucide-react'

export default function ImovelDetalhePage() {
  const params = useParams()
  const slug = params.slug as string
  const [imovel, setImovel] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavoritado, setIsFavoritado] = useState(false)
  const [hoveredPhotoIndex, setHoveredPhotoIndex] = useState<number | null>(null)
  const [contatoTipo, setContatoTipo] = useState<'telefone' | 'email' | 'whatsapp'>('email')
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: 'Olá, gostaria de receber mais informações sobre este imóvel. Aguardo contato, obrigado.'
  })

  useEffect(() => {
    const loadImovel = async () => {
      try {
        const imovelData = await getImovelBySlug(slug)
        if (!imovelData) {
          notFound()
          return
        }
        setImovel(imovelData)
        setIsFavoritado(isFavorito(imovelData.id))
        trackViewItem(imovelData.id, imovelData.slug || slug, imovelData.titulo || '')
      } catch (error) {
        console.error('Erro ao carregar imóvel:', error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }
    
    loadImovel()
  }, [slug])

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    trackImovelContato(contatoTipo)
    if (contatoTipo === 'whatsapp') {
      const message = encodeURIComponent(`${formData.mensagem}\n\nNome: ${formData.nome}\nEmail: ${formData.email}\nTelefone: ${formData.telefone}`)
      window.open(getWhatsAppLink(imovel?.contato?.whatsapp || '', message), '_blank')
    } else if (contatoTipo === 'email') {
      const subject = encodeURIComponent(`Interesse no imóvel: ${imovel?.titulo}`)
      const body = encodeURIComponent(`${formData.mensagem}\n\nNome: ${formData.nome}\nEmail: ${formData.email}\nTelefone: ${formData.telefone}`)
      window.open(`mailto:${imovel?.contato?.email || ''}?subject=${subject}&body=${body}`, '_blank')
    } else if (contatoTipo === 'telefone') {
      window.open(`tel:${imovel?.contato?.telefone || imovel?.contato?.whatsapp || ''}`, '_blank')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Carregando imóvel...</p>
        </div>
      </div>
    )
  }

  if (!imovel) {
    notFound()
    return null
  }

  const precoDesconto = imovel.precoOriginal && imovel.precoOriginal > imovel.preco
    ? imovel.precoOriginal - imovel.preco
    : 0

  // Montar galeria: 1 principal + 4 menores (igual DWV e imóveis manuais)
  const todasFotos = imovel.fotos || []
  const fotoPrincipalDWV = (imovel as any).fotoPrincipalDWV
  const fotosMenoresDWV = (imovel as any).fotosMenoresDWV || []
  const fotoPrincipalIndex = (imovel as any).fotoPrincipalIndex ?? 0

  let fotosParaExibir: string[]

  if (fotoPrincipalDWV) {
    // DWV: usar seleções salvas (principal + 4 menores)
    const menoresParaUsar = fotosMenoresDWV.length > 0
      ? fotosMenoresDWV
      : todasFotos.filter((f: string) => f !== fotoPrincipalDWV).slice(0, 4)
    fotosParaExibir = [fotoPrincipalDWV, ...menoresParaUsar]
    const fotosEscolhidas = new Set([fotoPrincipalDWV, ...menoresParaUsar])
    const fotosRestantes = todasFotos.filter((f: string) => !fotosEscolhidas.has(f))
    fotosParaExibir = [...fotosParaExibir, ...fotosRestantes]
  } else {
    // Imóveis manuais: principal = fotos[fotoPrincipalIndex], depois 4 menores (resto na ordem)
    // Assim fica igual ao DWV: primeira foto grande, grid 2x2 com as 4 seguintes
    if (todasFotos.length === 0) {
      fotosParaExibir = []
    } else {
      const idx = fotoPrincipalIndex >= 0 && fotoPrincipalIndex < todasFotos.length ? fotoPrincipalIndex : 0
      const principal = todasFotos[idx]
      const rest = todasFotos.filter((_: string, i: number) => i !== idx)
      const menores = rest.slice(0, 4)
      const resto = rest.slice(4)
      fotosParaExibir = [principal, ...menores, ...resto]
    }
  }

  // Características vêm apenas das tags/comodidades (interligadas com o filtro)
  // Não incluir outras características booleanas, apenas as tags
  const caracteristicasList: string[] = []

  const infraestruturaList = imovel.infraestrutura || []

  const cidadeNome =
    imovel.endereco?.cidade === 'barra-velha'
      ? 'Barra Velha'
      : imovel.endereco?.cidade === 'balneario-picarras'
        ? 'Balneário Piçarras'
        : imovel.endereco?.cidade === 'penha'
          ? 'Penha'
          : imovel.endereco?.cidade || 'Imóveis'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
            </li>
            <li><span className="mx-1">›</span></li>
            <li>
              <Link href="/imoveis" className="hover:text-purple-600 transition-colors">Imóveis</Link>
            </li>
            <li><span className="mx-1">›</span></li>
            <li>
              <Link href={`/imoveis?cidade=${imovel.endereco?.cidade || ''}`} className="hover:text-purple-600 transition-colors">{cidadeNome}</Link>
            </li>
            <li><span className="mx-1">›</span></li>
            <li className="text-gray-900 font-medium truncate max-w-[200px]" aria-current="page">{imovel.titulo}</li>
          </ol>
        </nav>

        {/* Informações do Imóvel - ACIMA da Galeria - Textos elegantes e menores */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Coluna Esquerda - Título, Endereço, Código */}
            <div className="flex-1">
              {/* Título Principal - Elegante e menor */}
              <h1 className="text-xl md:text-2xl font-light text-gray-900 mb-2 tracking-tight">
                {imovel.titulo}
              </h1>
              
              {/* Endereço - Texto fino e elegante */}
              <div className="flex items-center text-gray-500 mb-1.5">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                <span className="text-xs font-light">
                  {imovel.endereco.rua}, {imovel.endereco.numero}, {imovel.endereco.bairro} - {imovel.endereco.cidade}/{imovel.endereco.estado}
                </span>
              </div>
              
              {/* Código - Texto fino */}
              <div className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-purple-600" />
                <span className="font-light text-gray-700 text-xs">CÓDIGO: {imovel.id}</span>
              </div>
            </div>
            
            {/* Coluna Direita - Preço e Botão Favorito */}
            <div className="flex flex-col items-end gap-2">
              {/* Preço - Elegante */}
              <div className="text-right">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl md:text-2xl font-light text-red-600 tracking-tight">
                      {formatPrice(imovel.preco)}
                    </span>
                </div>
              </div>
              
              {/* Botão Favorito - Elegante */}
              <button 
                onClick={() => {
                  if (imovel) {
                    const novoEstado = toggleFavorito(imovel.id)
                    setIsFavoritado(novoEstado)
                    trackFavorito(imovel.id, novoEstado)
                  }
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors ${
                  isFavoritado ? 'border-red-300' : ''
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavoritado ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
                <span className={`text-xs font-light ${isFavoritado ? 'text-red-600' : 'text-gray-600'}`}>
                  Favorito
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Galeria - Mobile: principal (2/3) + 2 menores empilhadas (1/3). Desktop: principal (1/2) + grid 2x2 com 4 menores */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-3">
          {fotosParaExibir.length > 0 ? (
            <div
              className="grid grid-cols-[2fr_1fr] md:grid-cols-2 gap-1.5 p-1.5 min-h-0 h-[52vh] max-h-[340px] md:h-[70vh] md:max-h-none"
              onMouseLeave={() => setHoveredPhotoIndex(null)}
            >
              {/* Foto Principal - ocupa coluna esquerda inteira (mobile 2/3, desktop 1/2) */}
              <Link
                href={`/imoveis/${imovel.slug}/fotos?index=0`}
                className={`relative w-full h-full min-h-0 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 block ${
                  hoveredPhotoIndex === null || hoveredPhotoIndex === 0
                    ? 'opacity-100 scale-100'
                    : 'opacity-50 scale-95'
                }`}
                onMouseEnter={() => setHoveredPhotoIndex(0)}
              >
                <img
                  src={fotosParaExibir[0]}
                  alt={`${imovel.titulo} - Foto principal`}
                  fetchPriority="high"
                  width={800}
                  height={600}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </Link>

              {/* Coluna direita: mobile = 2 fotos empilhadas (1 e 2); desktop = grid 2x2 com 4 fotos */}
              <div className="grid grid-rows-2 grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-1.5 min-h-0 h-full">
                {[1, 2, 3, 4].map((i) => {
                  const temFoto = !!fotosParaExibir[i]
                  const ultimaCelulaComFoto = Math.min(4, Math.max(1, fotosParaExibir.length - 1))
                  const linkIndex = temFoto ? i : Math.min(i, fotosParaExibir.length - 1)
                  const mostrarNoMobile = i <= 2
                  const mostrarBotaoDesktop = i === ultimaCelulaComFoto && fotosParaExibir.length > 1
                  const mostrarBotaoMobile = i === 2 && fotosParaExibir.length > 1
                  const mostrarBotao = mostrarBotaoDesktop || mostrarBotaoMobile
                  return (
                    <Link
                      key={i}
                      href={`/imoveis/${imovel.slug}/fotos?index=${linkIndex}`}
                      className={`relative w-full min-h-0 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 block ${
                        hoveredPhotoIndex === null || hoveredPhotoIndex === i
                          ? 'opacity-100 scale-100'
                          : 'opacity-50 scale-95'
                      } ${mostrarNoMobile ? '' : 'hidden md:block'}`}
                      style={mostrarNoMobile ? undefined : { aspectRatio: '1' }}
                      onMouseEnter={() => setHoveredPhotoIndex(i)}
                    >
                      {temFoto ? (
                        <img
                          src={fotosParaExibir[i]}
                          alt={`${imovel.titulo} - Foto ${i + 1}`}
                          loading="lazy"
                          width={400}
                          height={300}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                      ) : mostrarBotaoDesktop && fotosParaExibir.length > 1 ? (
                        <img
                          src={fotosParaExibir[fotosParaExibir.length - 1]}
                          alt={`${imovel.titulo} - Foto`}
                          loading="lazy"
                          width={400}
                          height={300}
                          className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-50" />
                      )}
                      {mostrarBotao && (
                        <div className={`absolute bottom-2 right-2 z-20 pointer-events-auto ${mostrarBotaoMobile && mostrarBotaoDesktop ? '' : mostrarBotaoMobile ? 'md:hidden' : 'hidden md:block'}`}>
                          <div className="bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 shadow-lg">
                            <span>Visualizar Fotos</span>
                            {fotosParaExibir.length > 5 && (
                              <span className="text-xs text-gray-600">({fotosParaExibir.length})</span>
                            )}
                          </div>
                        </div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Sem imagens</span>
            </div>
          )}
        </div>

        {/* Estatísticas do Imóvel - Abaixo das Fotos */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-3">
          <div className="flex flex-wrap items-start gap-8 text-sm">
            {/* Código */}
            <div className="flex flex-col items-center gap-2 text-gray-700">
              <Key className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
              <span className="font-medium text-xs">{imovel.id.slice(-5).padStart(5, '0')}</span>
              <span className="text-xs text-gray-500">Código</span>
            </div>
            
            {/* Quartos - só exibe se > 0 */}
            {Number(imovel.caracteristicas?.quartos) > 0 && (
              <div className="flex flex-col items-center gap-2 text-gray-700">
                <BedDouble className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                <span className="font-medium text-xs">{imovel.caracteristicas.quartos}</span>
                <span className="text-xs text-gray-500">Quartos</span>
              </div>
            )}
            
            {/* Suítes - só exibe se > 0 */}
            {Number(imovel.caracteristicas?.suite) > 0 && (
              <div className="flex flex-col items-center gap-2 text-gray-700">
                <BedDouble className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                <span className="font-medium text-xs">{imovel.caracteristicas.suite}</span>
                <span className="text-xs text-gray-500">{imovel.caracteristicas.suite === 1 ? 'Suíte' : 'Suítes'}</span>
              </div>
            )}
            
            {/* Banheiros - só exibe se > 0 */}
            {Number(imovel.caracteristicas?.banheiros) > 0 && (
              <div className="flex flex-col items-center gap-2 text-gray-700">
                <Droplet className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                <span className="font-medium text-xs">{imovel.caracteristicas.banheiros}</span>
                <span className="text-xs text-gray-500">Banheiros</span>
              </div>
            )}
            
            {/* Vagas - só exibe se > 0 */}
            {Number(imovel.caracteristicas?.vagas) > 0 && (
              <div className="flex flex-col items-center gap-2 text-gray-700">
                <Car className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                <span className="font-medium text-xs">{imovel.caracteristicas.vagas}</span>
                <span className="text-xs text-gray-500">Vagas</span>
              </div>
            )}
            
            {/* Área - só exibe se > 0 */}
            {Number(imovel.caracteristicas?.area) > 0 && (
              <div className="flex flex-col items-center gap-2 text-gray-700">
                <Maximize2 className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                <span className="font-medium text-xs">{imovel.caracteristicas.area} M²</span>
                <span className="text-xs text-gray-500">Privativos</span>
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo Principal - Layout com Título, Características, Descrição à Esquerda e Formulário à Direita */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Conteúdo no estilo DWV: definições primeiro, traço, depois o que foi escrito */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* 1) Nome do imóvel — H2 pois o H1 único da página está no topo (título + endereço) */}
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                {imovel.titulo}
              </h2>
              
              {imovel.selecaoNox && (
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-100 border border-purple-300 text-purple-800 rounded-md text-sm font-medium">
                    Seleção Nox
                  </span>
                </div>
              )}

              {/* 2) Definições do imóvel — espelha a barra de ícones (código, área, suítes, quartos, banheiros, vagas); só itens > 0 */}
              <div className="space-y-2 mb-0">
                {imovel.id != null && (
                  <p className="text-gray-700">
                    - Código: {String(imovel.id).slice(-5).padStart(5, '0')}
                  </p>
                )}
                {Number(imovel.caracteristicas?.area) > 0 && (
                  <p className="text-gray-700">
                    - {imovel.caracteristicas.area}m² de área interna
                  </p>
                )}
                {Number(imovel.caracteristicas?.suite) > 0 && (
                  <p className="text-gray-700">
                    - {imovel.caracteristicas.suite} {imovel.caracteristicas.suite === 1 ? 'suíte' : 'suítes'}{imovel.caracteristicas.suite === 1 && imovel.tags?.includes('Master') ? ', sendo uma master com banheira' : ''}
                  </p>
                )}
                {Number(imovel.caracteristicas?.quartos) > 0 && (
                  <p className="text-gray-700">
                    - {imovel.caracteristicas.quartos} {imovel.caracteristicas.quartos === 1 ? 'quarto' : 'quartos'}
                  </p>
                )}
                {Number(imovel.caracteristicas?.banheiros) > 0 && (
                  <p className="text-gray-700">
                    - {imovel.caracteristicas.banheiros} {imovel.caracteristicas.banheiros === 1 ? 'banheiro' : 'banheiros'}
                  </p>
                )}
                {Number(imovel.caracteristicas?.vagas) > 0 && (
                  <p className="text-gray-700">
                    - {imovel.caracteristicas.vagas} {imovel.caracteristicas.vagas === 1 ? 'vaga de garagem' : 'vagas de garagem'}
                  </p>
                )}
                {imovel.caracteristicas.frenteMar && (
                  <p className="text-gray-700">
                    - Sacada ampla com vista para o mar
                  </p>
                )}
                {imovel.endereco.rua && (
                  <p className="text-gray-700">
                    - Condomínio {imovel.endereco.rua}, {imovel.endereco.numero} - {imovel.endereco.bairro}, {imovel.endereco.cidade} - {imovel.endereco.estado}
                  </p>
                )}
              </div>

              {/* 3) Separador visual (sigelo traço) */}
              <div className="my-6 border-t border-gray-300" aria-hidden />

              {/* 4) O que foi escrito sobre o imóvel (descrição) */}
              {imovel.descricao && (
                <div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {imovel.descricao}
                  </p>
                </div>
              )}
            </div>

            {/* Características - Apenas tags/comodidades (interligadas com o filtro) */}
            {imovel.tags && imovel.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Características</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {imovel.tags.map((tag: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 text-gray-700">
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                      <span className="text-base">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Infraestrutura */}
            {infraestruturaList.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Infraestrutura</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {infraestruturaList.map((item: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Localização - Mapa */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Localização</h2>
              <div className="mb-4">
                <div className="flex items-start gap-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <p className="text-base">
                    {imovel.endereco.rua && `${imovel.endereco.rua}, `}
                    {imovel.endereco.numero && `${imovel.endereco.numero}, `}
                    {imovel.endereco.bairro && `${imovel.endereco.bairro} - `}
                    {imovel.endereco.cidade}/{imovel.endereco.estado}
                  </p>
                </div>
              </div>
              {imovel.coordenadas ? (
                <div className="relative h-96 rounded-lg overflow-hidden bg-gray-200 border border-gray-300">
                  <iframe
                    src={`https://maps.google.com/maps?q=${imovel.coordenadas.lat},${imovel.coordenadas.lng}&hl=pt-BR&z=15&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              ) : (
                <div className="relative h-96 rounded-lg overflow-hidden bg-gray-200 border border-gray-300 flex items-center justify-center">
                  <p className="text-gray-500">Mapa não disponível</p>
                </div>
              )}
            </div>
          </div>

          {/* Coluna Direita - Formulário de Contato */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 sticky top-4">
          <h3 className="text-white text-lg font-semibold mb-4">RECEBER CONTATO POR:</h3>
          
          {/* Opções de Contato */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setContatoTipo('telefone')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                contatoTipo === 'telefone'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Telefone
            </button>
            <button
              onClick={() => setContatoTipo('email')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                contatoTipo === 'email'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setContatoTipo('whatsapp')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                contatoTipo === 'whatsapp'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              WhatsApp
            </button>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            <textarea
              value={formData.mensagem}
              onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-lg p-3 text-sm resize-none"
              rows={4}
              required
            />

            <input
              type="text"
              placeholder="Nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-lg p-3 text-sm"
              required
            />

            <input
              type="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-lg p-3 text-sm"
              required
            />

            <input
              type="tel"
              placeholder="Celular / WhatsApp"
              value={formData.telefone}
              onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              className="w-full bg-gray-800 text-white rounded-lg p-3 text-sm"
              required
            />

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              ENVIAR
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">OU</span>
              </div>
            </div>

            <a
              href={getWhatsAppLink(imovel.contato?.whatsapp || '', `Olá, gostaria de receber mais informações sobre este imóvel: ${imovel.titulo}`)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('imovel_detalhe_botao')}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Fale pelo WhatsApp
            </a>
          </form>
                </div>
              </div>
        </div>
      </div>
    </div>
  )
}





'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { getImovelBySlug, getAllImoveis, formatPrice, getFotoPrincipal } from '@/lib/imoveis'
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
  Maximize2,
  Building2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import type { Imovel } from '@/types'

/** Comodidades/características DWV (inglês ou código) → português. Chaves normalizadas: lowercase + underscore para busca case-insensitive. */
const TRADUCOES_DWV: Record<string, string> = {
  adult_pool: 'Piscina adulto',
  intercom: 'Interfone',
  gourmet_space: 'Área gourmet',
  toys_playroom: 'Brinquedoteca',
  bar: 'Bar',
  rooftop: 'Cobertura',
  entrance_hall_decorated_and_furnished: 'Hall de entrada decorado e mobiliado',
  bike_rack: 'Bicicletário',
  lounge: 'Salão de convivência',
  sauna: 'Sauna',
  playground: 'Playground',
  gym: 'Academia',
  whirpool_in_the_pool: 'Whirlpool na piscina',
  be_social: 'Área de convivência',
  whirlpool: 'Whirlpool',
  helipad: 'Heliporto',
  elevator: 'Elevador',
  elevador: 'Elevador',
  games_room: 'Sala de jogos',
  water_reuse: 'Reuso de água',
  individual_water_light_gas_meters: 'Medidores individuais de água, luz e gás',
  entrance_to_bathers_and_beach_box: 'Acesso a banhistas e box de praia',
  solarium: 'Solário',
  party_room: 'Salão de festas',
  spa: 'Spa',
  playroom: 'Brinquedoteca',
  termic_pool: 'Piscina térmica',
  child_pool: 'Piscina infantil',
  jacuzzi: 'Jacuzzi',
  pool: 'Piscina',
  security: 'Segurança 24h',
  concierge: 'Portaria',
  garden: 'Jardim',
  barbecue: 'Churrasqueira',
  barbecue_grill: 'Churrasqueira',
  pet_area: 'Área pet',
  sports_court: 'Quadra esportiva',
  running_track: 'Pista de caminhada',
  cinema: 'Cinema',
  library: 'Biblioteca',
  coworking: 'Coworking',
  laundry: 'Lavanderia',
  valet: 'Manobrista',
  desk: 'Escritório',
  porch: 'Varanda',
  closet: 'Closet',
  hot_water_infrastructure: 'Infraestrutura para água quente',
  gas_heating: 'Aquecimento a gás',
  social_bathroom: 'Lavabo',
  lavatory: 'Lavabo',
  porcelain: 'Porcelanato',
  air_conditioning_infrastructure: 'Infraestrutura para ar-condicionado',
  dining_room: 'Sala de jantar',
  living_room: 'Sala de estar',
  living: 'Sala de estar',
  individual_water_meter: 'Medidor de água individual',
  password_lock_entrance_door: 'Porta de entrada com fechadura digital',
  kitchen: 'Cozinha',
  cozinha: 'Cozinha',
  individual_gas: 'Gás individual',
  balcony: 'Varanda',
  varanda: 'Varanda',
  workmanship_on_plaster: 'Acabamento em gesso',
  service_area: 'Área de serviço',
  internet: 'Internet',
  escritório: 'Escritório',
  área_gourmet: 'Área gourmet',
  hall_de_entrada_decorado_e_mobiliado: 'Hall de entrada decorado e mobiliado',
  salão_de_festas: 'Salão de festas',
  piscina_infantil: 'Piscina infantil',
  salão_de_convivência: 'Salão de convivência',
}

function normalizarChave(s: string): string {
  return s.trim().replace(/\s+/g, '_').replace(/-/g, '_').toLowerCase()
}

function traduzirComodidade(raw: string): string {
  const trimmed = (raw || '').trim()
  if (!trimmed) return trimmed
  const key = normalizarChave(trimmed)
  const traducao = TRADUCOES_DWV[key]
  if (traducao) return traducao
  return trimmed.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function ImovelDetalhePage() {
  const params = useParams()
  const slug = params.slug as string
  const [imovel, setImovel] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavoritado, setIsFavoritado] = useState(false)
  const [hoveredPhotoIndex, setHoveredPhotoIndex] = useState<number | null>(null)
  const [mobilePhotoIndex, setMobilePhotoIndex] = useState(0)
  const [mobileCarouselAspect, setMobileCarouselAspect] = useState<number | null>(null)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [contatoTipo, setContatoTipo] = useState<'telefone' | 'email' | 'whatsapp'>('email')
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: 'Olá, gostaria de receber mais informações sobre este imóvel. Aguardo contato, obrigado.'
  })
  const [indicados, setIndicados] = useState<Imovel[]>([])
  const [indicadosIndex, setIndicadosIndex] = useState(0)
  const [, setFavoritosRefresh] = useState(0)

  useEffect(() => {
    setMobilePhotoIndex(0)
    setMobileCarouselAspect(null)
  }, [slug])

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

        // Carregar até 5 imóveis relacionados (mesma cidade e/ou mesmo tipo, excluindo o atual)
        const todos = await getAllImoveis()
        const outros = todos.filter((i: Imovel) => i.slug !== imovelData.slug && i.id !== imovelData.id)
        const cidadeAtual = imovelData.endereco?.cidade
        const tipoAtual = imovelData.tipo
        const ordenados = outros.sort((a: Imovel, b: Imovel) => {
          const scoreA = (a.endereco?.cidade === cidadeAtual ? 2 : 0) + (a.tipo === tipoAtual ? 1 : 0)
          const scoreB = (b.endereco?.cidade === cidadeAtual ? 2 : 0) + (b.tipo === tipoAtual ? 1 : 0)
          if (scoreB !== scoreA) return scoreB - scoreA
          return Math.abs((a.preco || 0) - (imovelData.preco || 0)) - Math.abs((b.preco || 0) - (imovelData.preco || 0))
        })
        setIndicados(ordenados.slice(0, 5))
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

  // Características: tags do DWV com overrides do admin (ocultar/adicionar)
  const tagsOcultas = (imovel as any).tagsOcultas || []
  const tagsAdicionais = (imovel as any).tagsAdicionais || []
  const tagsExibir = (imovel.tags || []).filter(
    (t: string) => !tagsOcultas.some((o: string) => o.trim().toLowerCase() === t.trim().toLowerCase())
  ).concat(tagsAdicionais)

  const infraestruturaOculta = (imovel as any).infraestruturaOculta || []
  const infraestruturaAdicional = (imovel as any).infraestruturaAdicional || []
  const infraestruturaList = ((imovel.infraestrutura || []).filter(
    (i: string) => !infraestruturaOculta.some((o: string) => o.trim().toLowerCase() === i.trim().toLowerCase())
  ) as string[]).concat(infraestruturaAdicional)

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-2">
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
        <div className="bg-white rounded-lg shadow-sm p-3 mb-2">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            {/* Coluna Esquerda - Título, Endereço, Código */}
            <div className="flex-1">
              {/* Título Principal - Elegante e menor */}
              <h1 className="text-xl md:text-2xl font-light text-gray-900 mb-1.5 tracking-tight">
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

        {/* Galeria: mobile = 1 hero + Ver fotos (harmônico, SEO); desktop = grid 1+4 */}
        <div className="bg-white rounded-lg shadow-sm mb-3 overflow-hidden">
          {fotosParaExibir.length > 0 ? (
            <>
              {/* Mobile: carrossel com setas leves + swipe; altura dinâmica conforme proporção da foto */}
              <div
                className="md:hidden relative w-full overflow-hidden bg-gray-50 touch-pan-y"
                style={{
                  aspectRatio: mobileCarouselAspect != null ? String(mobileCarouselAspect) : '4/3',
                  transition: 'aspect-ratio 0.3s ease',
                }}
                onTouchStart={(e) => setTouchStartX(e.targetTouches[0].clientX)}
                onTouchEnd={(e) => {
                  if (touchStartX == null || fotosParaExibir.length <= 1) return
                  const endX = e.changedTouches[0].clientX
                  const diff = touchStartX - endX
                  const minSwipe = 50
                  if (diff > minSwipe) {
                    setMobileCarouselAspect(null)
                    setMobilePhotoIndex((i) => (i + 1) % fotosParaExibir.length)
                  } else if (diff < -minSwipe) {
                    setMobileCarouselAspect(null)
                    setMobilePhotoIndex((i) => (i - 1 + fotosParaExibir.length) % fotosParaExibir.length)
                  }
                  setTouchStartX(null)
                }}
              >
                <Link
                  href={`/imoveis/${imovel.slug}/fotos?index=${mobilePhotoIndex}`}
                  className="block w-full h-full"
                >
                  <img
                    src={fotosParaExibir[mobilePhotoIndex]}
                    alt={`${imovel.titulo} - Foto ${mobilePhotoIndex + 1}`}
                    fetchPriority={mobilePhotoIndex === 0 ? 'high' : undefined}
                    loading={mobilePhotoIndex === 0 ? undefined : 'lazy'}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover object-center pointer-events-none"
                    onLoad={(e) => {
                      const el = e.currentTarget
                      if (el.naturalWidth && el.naturalHeight) {
                        setMobileCarouselAspect(el.naturalWidth / el.naturalHeight)
                      }
                    }}
                  />
                </Link>
                {fotosParaExibir.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setMobileCarouselAspect(null)
                        setMobilePhotoIndex((i) => (i - 1 + fotosParaExibir.length) % fotosParaExibir.length)
                      }}
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/25 text-white/50 hover:bg-white/35 hover:text-white/70 transition-colors"
                      aria-label="Foto anterior"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setMobileCarouselAspect(null)
                        setMobilePhotoIndex((i) => (i + 1) % fotosParaExibir.length)
                      }}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/25 text-white/50 hover:bg-white/35 hover:text-white/70 transition-colors"
                      aria-label="Próxima foto"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                {fotosParaExibir.length > 1 && (
                  <Link
                    href={`/imoveis/${imovel.slug}/fotos`}
                    className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-800 px-3 py-2 rounded-lg text-sm font-medium shadow-sm"
                  >
                    Ver fotos ({fotosParaExibir.length})
                  </Link>
                )}
              </div>

              {/* Desktop: grid esquerda (2fr) + 4 direita (3fr), hover e contain na principal */}
              <div
                className="hidden md:grid grid-cols-[2fr_3fr] gap-2 p-2 items-stretch"
                style={{ height: 'clamp(380px, 65vh, 580px)' }}
                onMouseLeave={() => setHoveredPhotoIndex(null)}
              >
                <Link
                  href={`/imoveis/${imovel.slug}/fotos?index=0`}
                  className={`flex w-full h-full min-h-0 items-center justify-center rounded-lg overflow-hidden bg-white transition-opacity duration-200 ${hoveredPhotoIndex != null && hoveredPhotoIndex !== 0 ? 'opacity-70' : 'opacity-100'}`}
                  onMouseEnter={() => setHoveredPhotoIndex(0)}
                >
                  <img
                    src={fotosParaExibir[0]}
                    alt={`${imovel.titulo} - Foto principal`}
                    fetchPriority="high"
                    width={800}
                    height={600}
                    className="max-w-full max-h-full w-auto h-auto object-contain object-center"
                  />
                </Link>
                <div className="grid grid-rows-2 grid-cols-2 gap-2 h-full min-h-0">
                  {[1, 2, 3, 4].map((i) => {
                    const temFoto = !!fotosParaExibir[i]
                    const ultimaCelulaComFoto = Math.min(4, Math.max(1, fotosParaExibir.length - 1))
                    const linkIndex = temFoto ? i : Math.min(i, fotosParaExibir.length - 1)
                    const mostrarBotaoDesktop = i === ultimaCelulaComFoto && fotosParaExibir.length > 1
                    return (
                      <Link
                        key={i}
                        href={`/imoveis/${imovel.slug}/fotos?index=${linkIndex}`}
                        className={`relative w-full min-h-0 rounded-lg overflow-hidden block transition-opacity duration-200 ${hoveredPhotoIndex != null && hoveredPhotoIndex !== i ? 'opacity-70' : 'opacity-100'}`}
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
                          <div className="absolute inset-0 bg-white" />
                        )}
                        {mostrarBotaoDesktop && (
                          <div className="absolute bottom-1.5 right-1.5 z-20">
                            <span className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-300/90 text-gray-800 px-3 py-1.5 rounded-md text-xs font-medium shadow-sm">
                              Ver fotos{fotosParaExibir.length > 1 ? ` (${fotosParaExibir.length})` : ''}
                            </span>
                          </div>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </>
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
              {/* Seção principal do imóvel (H1 já está no topo) */}
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                Sobre o imóvel
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

              {/* 4) O que foi escrito sobre o imóvel (descrição) — DWV envia HTML (p, strong, ul, li); renderizar como HTML e respeitar o quadro */}
              {imovel.descricao && (
                <div
                  className="prose prose-gray max-w-none text-gray-700 leading-relaxed break-words overflow-hidden [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1 [&_strong]:font-semibold"
                  style={{ wordBreak: 'break-word' }}
                  dangerouslySetInnerHTML={{ __html: imovel.descricao }}
                />
              )}
            </div>

            {/* Características - tags com overrides do admin (ocultas/adicionais) */}
            {tagsExibir.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Características</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tagsExibir.map((tag: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 text-gray-700">
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                      <span className="text-base">{traduzirComodidade(tag)}</span>
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
                      <span>{traduzirComodidade(item)}</span>
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
              <h2 className="text-xl font-semibold text-white mb-4">Entre em contato</h2>
              <h3 className="text-white text-sm font-semibold mb-3 uppercase tracking-wide">Receber contato por</h3>
          
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

        {/* Indicados para você - antes do footer */}
        {indicados.length > 0 && (
          <section className="mt-10 mb-6">
            <div className="bg-gray-100 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-purple-600" />
                Indicados para você
              </h2>
              <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                {/* Carrossel: setas + 3 cards */}
                <div className="flex-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIndicadosIndex((i) => (i === 0 ? indicados.length - 1 : i - 1))}
                    disabled={indicados.length <= 1}
                    className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex-1 flex justify-center min-w-0 overflow-hidden">
                    {indicados[indicadosIndex] && (() => {
                      const item = indicados[indicadosIndex]
                      const foto = getFotoPrincipal(item)
                      const favoritado = isFavorito(item.id)
                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col w-full max-w-sm"
                        >
                          <Link href={`/imoveis/${item.slug}`} className="block relative aspect-[4/3] bg-gray-200 overflow-hidden">
                            {foto ? (
                              <img
                                src={foto}
                                alt={item.titulo}
                                loading="lazy"
                                width={400}
                                height={300}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200" />
                            )}
                          </Link>
                          <div className="p-4 flex flex-col flex-1">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <Link href={`/imoveis/${item.slug}`}>
                                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-purple-600 transition-colors">
                                  {item.titulo}
                                </h3>
                              </Link>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  toggleFavorito(item.id)
                                  setFavoritosRefresh((n) => n + 1)
                                }}
                                className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                                aria-label="Favoritar"
                              >
                                <Heart className={`w-4 h-4 ${favoritado ? 'fill-red-500 text-red-500' : ''}`} />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">
                              {item.endereco?.rua}, {item.endereco?.numero}, {item.endereco?.bairro} - {item.endereco?.cidade}/{item.endereco?.estado}
                            </p>
                            <p className="text-xs text-gray-600 mb-2">Cód.: {String(item.id).slice(-5).padStart(5, '0')}</p>
                            <p className="text-sm font-semibold text-red-600 mb-2">{formatPrice(item.preco)}</p>
                            <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-4">
                              {Number(item.caracteristicas?.quartos) > 0 && (
                                <span className="flex items-center gap-0.5">
                                  <BedDouble className="w-3.5 h-3.5 text-purple-600" />
                                  {item.caracteristicas.quartos} Quartos
                                </span>
                              )}
                              {Number(item.caracteristicas?.suite) > 0 && (
                                <span className="flex items-center gap-0.5">
                                  <BedDouble className="w-3.5 h-3.5 text-purple-600" />
                                  {item.caracteristicas.suite} Suíte
                                </span>
                              )}
                              {Number(item.caracteristicas?.vagas) > 0 && (
                                <span className="flex items-center gap-0.5">
                                  <Car className="w-3.5 h-3.5 text-purple-600" />
                                  {item.caracteristicas.vagas} Vaga
                                </span>
                              )}
                              {Number(item.caracteristicas?.area) > 0 && (
                                <span className="flex items-center gap-0.5">
                                  <Maximize2 className="w-3.5 h-3.5 text-purple-600" />
                                  {item.caracteristicas.area}m²
                                </span>
                              )}
                            </div>
                            <Link
                              href={`/imoveis/${item.slug}`}
                              className="mt-auto w-full bg-orange-500 hover:bg-orange-600 text-white text-center font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors block"
                            >
                              Saber mais
                            </Link>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIndicadosIndex((i) => (i >= indicados.length - 1 ? 0 : i + 1))}
                    disabled={indicados.length <= 1}
                    className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Próximo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                {/* CTA lateral */}
                <div className="lg:w-72 flex-shrink-0 bg-gray-900 rounded-lg p-6 flex flex-col justify-center text-center lg:text-left">
                  <p className="text-white text-sm leading-relaxed mb-4">
                    Ainda não é o que procurava? Nós podemos encontrar um lugar que combina com você!
                  </p>
                  <Link
                    href="/encontre-meu-imovel"
                    className="inline-flex justify-center lg:justify-start bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-5 rounded-lg text-sm uppercase tracking-wide transition-colors"
                  >
                    Encontre meu imóvel
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}





'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import { notFound, useParams, useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { getImovelBySlug } from '@/lib/imoveis'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Grid } from 'lucide-react'

export default function FotosPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = params.slug as string
  const [imovel, setImovel] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Pegar índice inicial da query string
  const initialIndex = parseInt(searchParams.get('index') || '0', 10)
  const [fotoAtual, setFotoAtual] = useState(initialIndex)
  const [zoom, setZoom] = useState(1)
  const [mostrarMiniaturas, setMostrarMiniaturas] = useState(true)
  const thumbnailRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({})
  const touchStartX = useRef<number>(0)

  useEffect(() => {
    const loadImovel = async () => {
      try {
        const imovelData = await getImovelBySlug(slug)
        if (!imovelData) {
          notFound()
          return
        }
        setImovel(imovelData)
      } catch (error) {
        console.error('Erro ao carregar imóvel:', error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }
    
    loadImovel()
  }, [slug])

  // Calcular fotos ordenadas: mesma lógica da ficha (1 principal + 4 menores + resto)
  const fotosOrdenadas = useMemo(() => {
    if (!imovel || !imovel.fotos || imovel.fotos.length === 0) {
      return []
    }
    const todasFotos = imovel.fotos || []
    const fotoPrincipalDWV = imovel.fotoPrincipalDWV
    const fotosMenoresDWV = imovel.fotosMenoresDWV || []
    const fotoPrincipalIndex = imovel.fotoPrincipalIndex ?? 0

    if (fotoPrincipalDWV) {
      const menores = fotosMenoresDWV.length > 0
        ? fotosMenoresDWV
        : todasFotos.filter((f: string) => f !== fotoPrincipalDWV).slice(0, 4)
      const escolhidas = new Set([fotoPrincipalDWV, ...menores])
      const restantes = todasFotos.filter((f: string) => !escolhidas.has(f))
      return [fotoPrincipalDWV, ...menores, ...restantes]
    }
    // Imóveis manuais: principal primeiro, depois 4 menores, depois resto
    const idx = fotoPrincipalIndex >= 0 && fotoPrincipalIndex < todasFotos.length ? fotoPrincipalIndex : 0
    const principal = todasFotos[idx]
    const rest = todasFotos.filter((_: string, i: number) => i !== idx)
    return [principal, ...rest.slice(0, 4), ...rest.slice(4)]
  }, [imovel])

  // Atualizar fotoAtual quando initialIndex mudar ou quando fotos forem carregadas
  useEffect(() => {
    if (!isLoading && imovel && fotosOrdenadas.length > 0) {
      const index = parseInt(searchParams.get('index') || '0', 10)
      if (index >= 0 && index < fotosOrdenadas.length) {
        setFotoAtual(index)
      }
    }
  }, [isLoading, imovel, searchParams, fotosOrdenadas.length])

  // Garantir que fotoAtual está dentro do range válido
  const fotoAtualValida = useMemo(() => {
    if (fotosOrdenadas.length === 0) return 0
    return Math.min(fotoAtual, fotosOrdenadas.length - 1)
  }, [fotoAtual, fotosOrdenadas.length])

  const proximaFoto = () => {
    if (fotosOrdenadas.length === 0) return
    setFotoAtual((prev) => (prev + 1) % fotosOrdenadas.length)
    setZoom(1)
  }

  const fotoAnterior = () => {
    if (fotosOrdenadas.length === 0) return
    setFotoAtual((prev) => (prev - 1 + fotosOrdenadas.length) % fotosOrdenadas.length)
    setZoom(1)
  }

  const irParaFoto = (index: number) => {
    if (index >= 0 && index < fotosOrdenadas.length) {
      setFotoAtual(index)
      setZoom(1)
    }
  }

  const toggleZoom = () => {
    setZoom(prev => prev === 1 ? 2 : 1)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (fotosOrdenadas.length === 0) return
      
      if (e.key === 'ArrowLeft') {
        fotoAnterior()
      } else if (e.key === 'ArrowRight') {
        proximaFoto()
      } else if (e.key === 'Escape') {
        router.back()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [router, fotosOrdenadas.length])

  const MIN_SWIPE_PX = 50

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX
    const diff = touchStartX.current - endX
    if (Math.abs(diff) < MIN_SWIPE_PX || fotosOrdenadas.length <= 1) return
    if (diff > 0) proximaFoto()
    else fotoAnterior()
  }

  // Fazer scroll automático da miniatura ativa
  useEffect(() => {
    const thumbnailElement = thumbnailRefs.current[fotoAtualValida]
    if (thumbnailElement) {
      thumbnailElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, [fotoAtualValida])

  if (isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4 text-white">Carregando fotos...</p>
        </div>
      </div>
    )
  }

  if (!imovel || fotosOrdenadas.length === 0) {
    notFound()
    return null
  }

  // Obter tipo e localização do imóvel para o texto
  const tipoImovel = imovel.tipo === 'apartamento' ? 'Apartamento' : 
                     imovel.tipo === 'casa' ? 'Casa' : 
                     imovel.tipo === 'cobertura' ? 'Cobertura' : 'Imóvel'
  const localizacao = imovel.endereco?.bairro || imovel.endereco?.cidade || ''

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col overflow-hidden z-50">
      {/* Foto Principal - Horizontal em cima, ocupa quase toda a tela. Mobile: swipe para trocar foto. */}
      <div
        className="relative bg-gray-950 flex items-center justify-center transition-all duration-300 touch-pan-y"
        style={{ height: mostrarMiniaturas ? 'calc(100vh - 96px)' : '100vh' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {fotosOrdenadas[fotoAtualValida] && (
          <div className="relative w-full h-full">
            <Image
              src={fotosOrdenadas[fotoAtualValida]}
              alt={`${imovel.titulo} - Foto ${fotoAtualValida + 1}`}
              fill
              className="object-contain"
              style={{ transform: `scale(${zoom})` }}
              unoptimized
              priority
            />
          </div>
        )}

        {/* Contador no canto superior esquerdo */}
        <div className="absolute top-4 left-4 text-white text-sm font-medium z-20">
          {fotoAtualValida + 1} / {fotosOrdenadas.length}
        </div>

        {/* Controles no canto superior direito */}
        <div className="absolute top-4 right-4 flex gap-3 z-20">
          <button
            onClick={toggleZoom}
            className="text-white hover:opacity-70 transition-opacity"
            aria-label={zoom === 1 ? 'Ampliar' : 'Reduzir'}
          >
            {zoom === 1 ? <ZoomIn className="w-5 h-5" /> : <ZoomOut className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleFullscreen}
            className="text-white hover:opacity-70 transition-opacity"
            aria-label="Tela cheia"
          >
            <Maximize className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.back()}
            className="text-white hover:opacity-70 transition-opacity"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Botões de navegação laterais */}
        {fotosOrdenadas.length > 1 && (
          <>
            <button
              onClick={fotoAnterior}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:opacity-70 transition-opacity z-20"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={proximaFoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:opacity-70 transition-opacity z-20"
              aria-label="Próxima foto"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* Grid icon no canto inferior direito - Toggle miniaturas */}
        <button
          onClick={() => setMostrarMiniaturas(!mostrarMiniaturas)}
          className="absolute bottom-4 right-4 z-20 text-white/80 hover:text-white transition-opacity"
          aria-label={mostrarMiniaturas ? 'Ocultar miniaturas' : 'Mostrar miniaturas'}
        >
          <Grid className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails - Logo abaixo, sem espaçamento */}
      {fotosOrdenadas.length > 1 && mostrarMiniaturas && (
        <div className="bg-gray-950 flex-shrink-0 h-24 border-t border-gray-800">
          <div className="flex gap-2 overflow-x-auto h-full px-4 items-center" style={{ scrollbarWidth: 'thin', scrollbarColor: '#444 #1a1a1a' }}>
            {fotosOrdenadas.map((foto: string, index: number) => (
              <button
                key={index}
                ref={(el) => { thumbnailRefs.current[index] = el }}
                onClick={() => irParaFoto(index)}
                className={`flex-shrink-0 relative w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                  index === fotoAtualValida
                    ? 'border-red-500'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={foto}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

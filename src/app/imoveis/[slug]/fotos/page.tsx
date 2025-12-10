'use client'

import { useEffect, useState, useMemo } from 'react'
import { notFound, useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { getImovelBySlug } from '@/lib/imoveis'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Grid } from 'lucide-react'

export default function FotosPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [imovel, setImovel] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fotoAtual, setFotoAtual] = useState(0)
  const [zoom, setZoom] = useState(1)

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

  // Calcular fotos ordenadas usando useMemo
  const fotosOrdenadas = useMemo(() => {
    if (!imovel || !imovel.fotos || imovel.fotos.length === 0) {
      return []
    }
    
    const todasFotos = imovel.fotos || []
    const fotoPrincipalIndex = imovel.fotoPrincipalIndex ?? 0
    
    // Reorganizar fotos: foto principal primeiro
    let fotos = [...todasFotos]
    if (fotoPrincipalIndex > 0 && fotoPrincipalIndex < fotos.length) {
      const fotoPrincipal = fotos[fotoPrincipalIndex]
      fotos.splice(fotoPrincipalIndex, 1)
      fotos.unshift(fotoPrincipal)
    }
    
    return fotos
  }, [imovel])

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
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Foto Principal - Horizontal em cima, menor para caber thumbnails */}
      <div className="relative bg-gray-950 flex items-center justify-center" style={{ height: 'calc(100vh - 120px)' }}>
        {fotosOrdenadas[fotoAtualValida] && (
          <div className="relative w-full max-w-[90%]" style={{ aspectRatio: '16/9', maxHeight: 'calc(100vh - 120px)' }}>
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

        {/* Grid icon no canto inferior direito */}
        <div className="absolute bottom-4 right-4 z-20">
          <Grid className="w-5 h-5 text-white/80" />
        </div>
      </div>

      {/* Thumbnails - Logo abaixo, sem espaçamento */}
      {fotosOrdenadas.length > 1 && (
        <div className="bg-gray-950 flex-shrink-0 h-24 border-t border-gray-800">
          <div className="flex gap-2 overflow-x-auto h-full px-4 items-center" style={{ scrollbarWidth: 'thin', scrollbarColor: '#444 #1a1a1a' }}>
            {fotosOrdenadas.map((foto: string, index: number) => (
              <button
                key={index}
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

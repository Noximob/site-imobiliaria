'use client'

import { useEffect, useState, useMemo } from 'react'
import { notFound, useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { getImovelBySlug } from '@/lib/imoveis'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize } from 'lucide-react'

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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
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
      {/* Foto Principal - Em cima */}
      <div className="flex-1 flex items-center justify-center p-4 pb-20">
        <div className="relative w-full max-w-7xl h-full">
          <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
            {fotosOrdenadas[fotoAtualValida] && (
              <Image
                src={fotosOrdenadas[fotoAtualValida]}
                alt={`${imovel.titulo} - Foto ${fotoAtualValida + 1}`}
                fill
                className="object-contain"
                style={{ transform: `scale(${zoom})` }}
                unoptimized
              />
            )}

            {/* Contador no canto superior esquerdo */}
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded text-sm font-medium">
              {fotoAtualValida + 1} / {fotosOrdenadas.length}
            </div>

            {/* Controles no canto superior direito */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={toggleZoom}
                className="bg-black/70 hover:bg-black/90 text-white p-2 rounded transition-colors"
                aria-label={zoom === 1 ? 'Ampliar' : 'Reduzir'}
              >
                {zoom === 1 ? <ZoomIn className="w-5 h-5" /> : <ZoomOut className="w-5 h-5" />}
              </button>
              <button
                onClick={toggleFullscreen}
                className="bg-black/70 hover:bg-black/90 text-white p-2 rounded transition-colors"
                aria-label="Tela cheia"
              >
                <Maximize className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.back()}
                className="bg-black/70 hover:bg-black/90 text-white p-2 rounded transition-colors"
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors z-10"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={proximaFoto}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors z-10"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Texto na parte inferior da foto */}
            {localizacao && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 text-gray-900 px-4 py-2 rounded text-sm font-medium">
                {tipoImovel} à venda {localizacao ? `no ${localizacao}` : ''}:
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnails na parte inferior - Barra de rolagem */}
      {fotosOrdenadas.length > 1 && (
        <div className="bg-black/90 p-4 flex-shrink-0">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#666 #333' }}>
              {fotosOrdenadas.map((foto: string, index: number) => (
                <button
                  key={index}
                  onClick={() => irParaFoto(index)}
                  className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
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
        </div>
      )}
    </div>
  )
}

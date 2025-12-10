'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { getImovelBySlug } from '@/lib/imoveis'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'

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

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!imovel || !imovel.fotos) return
      
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
  }, [imovel, fotoAtual, router])

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

  if (!imovel || !imovel.fotos || imovel.fotos.length === 0) {
    notFound()
    return null
  }

  const todasFotos = imovel.fotos || []
  const fotoPrincipalIndex = (imovel as any).fotoPrincipalIndex ?? 0
  
  // Reorganizar fotos: foto principal primeiro
  let fotosOrdenadas = [...todasFotos]
  if (fotoPrincipalIndex > 0 && fotoPrincipalIndex < fotosOrdenadas.length) {
    const fotoPrincipal = fotosOrdenadas[fotoPrincipalIndex]
    fotosOrdenadas.splice(fotoPrincipalIndex, 1)
    fotosOrdenadas.unshift(fotoPrincipal)
  }

  const proximaFoto = () => {
    setFotoAtual((prev) => (prev + 1) % fotosOrdenadas.length)
    setZoom(1)
  }

  const fotoAnterior = () => {
    setFotoAtual((prev) => (prev - 1 + fotosOrdenadas.length) % fotosOrdenadas.length)
    setZoom(1)
  }

  const irParaFoto = (index: number) => {
    setFotoAtual(index)
    setZoom(1)
  }

  const toggleZoom = () => {
    setZoom(prev => prev === 1 ? 2 : 1)
  }

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Header com informações */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-white">
            <h1 className="text-lg font-semibold">{imovel.titulo}</h1>
            <p className="text-sm text-gray-300">
              {fotoAtual + 1} / {fotosOrdenadas.length}
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Foto Principal */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-7xl">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <Image
              src={fotosOrdenadas[fotoAtual]}
              alt={`${imovel.titulo} - Foto ${fotoAtual + 1}`}
              fill
              className="object-contain"
              style={{ transform: `scale(${zoom})` }}
              unoptimized
            />
          </div>

          {/* Botões de navegação */}
          {fotosOrdenadas.length > 1 && (
            <>
              <button
                onClick={fotoAnterior}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={proximaFoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                aria-label="Próxima foto"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Botão de zoom */}
          <button
            onClick={toggleZoom}
            className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
            aria-label={zoom === 1 ? 'Ampliar' : 'Reduzir'}
          >
            {zoom === 1 ? <ZoomIn className="w-6 h-6" /> : <ZoomOut className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Thumbnails na parte inferior */}
      {fotosOrdenadas.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {fotosOrdenadas.map((foto: string, index: number) => (
                <button
                  key={index}
                  onClick={() => irParaFoto(index)}
                  className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === fotoAtual
                      ? 'border-orange-500 scale-110'
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


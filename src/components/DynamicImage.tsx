'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getAllSiteImages } from '@/lib/site-images'

interface DynamicImageProps {
  imageId: string
  alt: string
  fill?: boolean
  className?: string
  priority?: boolean
  fallbackSrc?: string
  width?: number
  height?: number
}

export default function DynamicImage({
  imageId,
  alt,
  fill = false,
  className = '',
  priority = false,
  fallbackSrc,
  width,
  height,
}: DynamicImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadImage() {
      try {
        const allImages = await getAllSiteImages()
        const url = allImages[imageId]
        
        // Define a imagem APENAS UMA VEZ
        if (url) {
          setImageSrc(url)
        } else if (fallbackSrc) {
          setImageSrc(fallbackSrc)
        } else {
          setImageSrc('/imagens/placeholder.png')
        }
      } catch (error) {
        console.error(`Erro ao carregar imagem ${imageId}:`, error)
        setImageSrc(fallbackSrc || '/imagens/placeholder.png')
      } finally {
        setIsLoading(false)
      }
    }

    loadImage()
  }, [imageId, fallbackSrc])

  // Não renderiza nada até ter a URL definida
  if (!imageSrc) {
    return null
  }

  if (fill) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className={className}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width || 500}
      height={height || 300}
      className={className}
      priority={priority}
    />
  )
}


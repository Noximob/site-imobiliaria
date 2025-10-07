'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getSiteImage } from '@/lib/site-images'

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
  const [imageSrc, setImageSrc] = useState<string>(fallbackSrc || '/imagens/placeholder.png')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadImage() {
      try {
        const url = await getSiteImage(imageId)
        setImageSrc(url)
      } catch (error) {
        console.error(`Erro ao carregar imagem ${imageId}:`, error)
        if (fallbackSrc) {
          setImageSrc(fallbackSrc)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadImage()
  }, [imageId, fallbackSrc])

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


'use client'

import { useState, useEffect } from 'react'

interface PreloadedImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  priority?: boolean
}

export default function PreloadedImage({ 
  src, 
  alt, 
  className = '', 
  style = {},
  priority = false 
}: PreloadedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  useEffect(() => {
    // Pré-carregar a imagem
    const img = new Image()
    img.onload = () => {
      setImageSrc(src)
      setIsLoaded(true)
    }
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`)
      setImageSrc(src) // Fallback para src original
      setIsLoaded(true)
    }
    img.src = src
  }, [src])

  // Se é prioridade, renderiza imediatamente
  if (priority) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
      />
    )
  }

  // Se não carregou ainda, mostra placeholder transparente
  if (!isLoaded || !imageSrc) {
    return (
      <div 
        className={className}
        style={{
          ...style,
          backgroundColor: 'transparent',
          backgroundImage: 'none'
        }}
      />
    )
  }

  // Imagem carregada
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={style}
    />
  )
}

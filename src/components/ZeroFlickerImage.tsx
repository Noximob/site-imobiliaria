'use client'

import { useState, useEffect, useRef } from 'react'

interface ZeroFlickerImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  priority?: boolean
}

export default function ZeroFlickerImage({ 
  src, 
  alt, 
  className = '', 
  style = {},
  priority = false 
}: ZeroFlickerImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (priority) {
      // Para imagens prioritárias, carrega imediatamente
      const img = new Image()
      img.onload = () => {
        setImageSrc(src)
        setIsLoaded(true)
      }
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`)
        setImageSrc(src)
        setIsLoaded(true)
      }
      img.src = src
    } else {
      // Para outras imagens, carrega normalmente
      const img = new Image()
      img.onload = () => {
        setImageSrc(src)
        setIsLoaded(true)
      }
      img.onerror = () => {
        console.error(`Failed to load image: ${src}`)
        setImageSrc(src)
        setIsLoaded(true)
      }
      img.src = src
    }
  }, [src, priority])

  // Se não carregou ainda, mostra div com dimensões exatas
  if (!isLoaded || !imageSrc) {
    return (
      <div 
        className={className}
        style={{
          ...style,
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          // Força as dimensões exatas para evitar reflow
          minHeight: '100%',
          minWidth: '100%',
          // Evita qualquer placeholder visual
          opacity: 0,
          // Força renderização imediata
          visibility: 'hidden',
          // Força dimensões fixas
          width: '100%',
          height: '100%'
        }}
      />
    )
  }

  // Imagem carregada - renderiza com dimensões fixas
  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={className}
      style={{
        ...style,
        // Força dimensões fixas para evitar redimensionamento
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        // Transição suave
        opacity: 1,
        transition: 'opacity 0.1s ease-in-out',
        // Força renderização imediata
        backgroundColor: 'transparent',
        backgroundImage: 'none'
      }}
      onLoad={() => {
        // Garante que não há reflow após carregar
        setIsLoaded(true)
        if (imgRef.current) {
          imgRef.current.style.opacity = '1'
        }
      }}
    />
  )
}

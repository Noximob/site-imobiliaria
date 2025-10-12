'use client'

import { useState, useEffect } from 'react'
import { getTextAsync } from '@/lib/site-texts'

interface DynamicTextProps {
  path: string
  fallback?: string
  className?: string
}

export default function DynamicText({ path, fallback, className }: DynamicTextProps) {
  const [text, setText] = useState(fallback || `[Carregando...]`)

  useEffect(() => {
    const loadText = async () => {
      try {
        const dynamicText = await getTextAsync(path)
        setText(dynamicText)
      } catch (error) {
        console.warn(`Erro ao carregar texto ${path}:`, error)
        setText(fallback || `[Erro ao carregar]`)
      }
    }

    loadText()
  }, [path, fallback])

  return <span className={className}>{text}</span>
}

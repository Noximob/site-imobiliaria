'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import type { Depoimento } from '@/lib/depoimentos-data'

interface DepoimentosSectionProps {
  depoimentos: Depoimento[]
}

export default function DepoimentosSection({ depoimentos }: DepoimentosSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (depoimentos.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % depoimentos.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [depoimentos.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + depoimentos.length) % depoimentos.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % depoimentos.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (depoimentos.length === 0) {
    return null
  }

  const currentDepoimento = depoimentos[currentIndex]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            O que dizem nossos clientes
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-green-600 mx-auto"></div>
        </div>

        {/* Card do Depoimento */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-purple-200 relative">
            {/* Ícone de aspas decorativo */}
            <div className="absolute top-6 right-6 text-purple-100">
              <Quote className="w-16 h-16" />
            </div>

            {/* Conteúdo do depoimento - Centralizado */}
            <div className="text-center px-8 md:px-16">
              {/* Nome do cliente */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                {currentDepoimento.nome}
              </h3>

              {/* Comentário */}
              <blockquote className="text-gray-700 text-lg md:text-xl leading-relaxed italic mb-8">
                "{currentDepoimento.comentario}"
              </blockquote>
            </div>

            {/* Botões de navegação */}
            {depoimentos.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-purple-50 text-purple-600 p-3 rounded-full shadow-lg border border-purple-200 transition-all duration-200 hover:scale-110"
                  aria-label="Depoimento anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-purple-50 text-purple-600 p-3 rounded-full shadow-lg border border-purple-200 transition-all duration-200 hover:scale-110"
                  aria-label="Próximo depoimento"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Indicadores (bolinhas) */}
          {depoimentos.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {depoimentos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-purple-600 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir para depoimento ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

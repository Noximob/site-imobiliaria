'use client'

import React, { useState } from 'react'
import { Phone, Mail, Instagram, X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Corretor } from '@/lib/corretores-data'

interface TeamSectionProps {
  corretores: Corretor[]
}

export default function TeamSection({ corretores }: TeamSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const activeCorretores = corretores.filter(corretor => corretor.ativo)
  const itemsVisible = 4
  const maxIndex = Math.max(0, activeCorretores.length - itemsVisible)

  const handleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(prev => Math.min(prev + 1, maxIndex))
      setExpandedId(null)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => Math.max(prev - 1, 0))
      setExpandedId(null)
    }
  }

  const canGoNext = currentIndex < maxIndex
  const canGoPrev = currentIndex > 0

  if (activeCorretores.length === 0) {
    return null
  }

  const cardContent = (corretor: Corretor, isMobile?: boolean) => (
    <>
      <div className={`relative overflow-hidden bg-gray-100 ${isMobile ? 'h-72' : 'h-64'}`}>
        <img
          src={corretor.foto || '/placeholder-corretor.jpg'}
          alt={corretor.nome}
          loading="lazy"
          className="w-full h-full object-cover object-top"
        />
        {expandedId === corretor.id && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center overflow-y-auto">
            <div className="text-center text-white p-4 text-sm sm:text-base">
              <h3 className="text-lg font-semibold mb-1">{corretor.nome}</h3>
              <p className="text-sm mb-2">{corretor.cargo}</p>
              <p className="text-xs mb-3 opacity-90">CRECI: {corretor.creci}</p>
              <div className="space-y-2 text-left max-w-xs mx-auto">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <a href={`tel:${corretor.telefone}`} target="_blank" rel="noopener noreferrer" className="text-sm break-all">{corretor.telefone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <a href={`mailto:${corretor.email}`} target="_blank" rel="noopener noreferrer" className="text-sm break-all">{corretor.email}</a>
                </div>
                {corretor.instagram && (
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm break-all">{corretor.instagram}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate min-w-0">{corretor.nome}</h3>
          <button
            onClick={() => handleExpand(corretor.id)}
            className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
            aria-label={expandedId === corretor.id ? 'Fechar' : 'Ver detalhes'}
          >
            {expandedId === corretor.id ? <X className="w-4 h-4" /> : <span className="text-lg font-bold leading-none">+</span>}
          </button>
        </div>
      </div>
    </>
  )

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Conheça nossa equipe</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Profissionais qualificados e experientes para te ajudar a encontrar o imóvel ideal
          </p>
        </div>

        {/* Mobile: scroll por touch, cards maiores, sem setas */}
        <div className="md:hidden overflow-x-auto overflow-y-hidden -mx-4 px-4 scroll-smooth snap-x snap-mandatory touch-pan-x">
          <div className="flex gap-4 pb-2 min-w-0">
            {activeCorretores.map((corretor) => (
              <div
                key={corretor.id}
                className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex-shrink-0 snap-center snap-always w-[85vw] min-w-[280px] max-w-[320px]"
              >
                {cardContent(corretor, true)}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: carrossel com setas (igual ao original) */}
        <div className="hidden md:block">
          {activeCorretores.length > itemsVisible && (
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={handlePrev}
                disabled={!canGoPrev}
                className={`p-2 rounded-lg border transition-all ${
                  canGoPrev ? 'bg-gray-800 text-white border-gray-800 hover:bg-gray-700 cursor-pointer' : 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
                }`}
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className={`p-2 rounded-lg border transition-all ${
                  canGoNext ? 'bg-gray-800 text-white border-gray-800 hover:bg-gray-700 cursor-pointer' : 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
                }`}
                aria-label="Próximo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(calc(-${currentIndex} * (((100% - (1.5rem * ${itemsVisible - 1})) / ${itemsVisible}) + 1.5rem)))`,
                gap: '1.5rem'
              }}
            >
              {activeCorretores.map((corretor) => (
                <div
                  key={corretor.id}
                  className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex-shrink-0"
                  style={{
                    minWidth: `calc((100% - (1.5rem * ${itemsVisible - 1})) / ${itemsVisible})`,
                    maxWidth: `calc((100% - (1.5rem * ${itemsVisible - 1})) / ${itemsVisible})`,
                    width: `calc((100% - (1.5rem * ${itemsVisible - 1})) / ${itemsVisible})`
                  }}
                >
                  {cardContent(corretor)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

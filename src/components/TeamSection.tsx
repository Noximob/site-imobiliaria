'use client'

import React, { useState, useEffect } from 'react'
import { Phone, Mail, Instagram, X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Corretor } from '@/lib/corretores-data'

interface TeamSectionProps {
  corretores: Corretor[]
}

export default function TeamSection({ corretores }: TeamSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Filtrar apenas corretores ativos
  const activeCorretores = corretores.filter(corretor => corretor.ativo)
  
  // Calcular quantos grupos de 4 corretores existem
  const itemsPerPage = 4
  const totalPages = Math.ceil(activeCorretores.length / itemsPerPage)
  const maxIndex = Math.max(0, (totalPages - 1) * itemsPerPage)

  const handleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleNext = () => {
    if (currentIndex + itemsPerPage < activeCorretores.length) {
      setCurrentIndex(prev => Math.min(prev + itemsPerPage, maxIndex))
      setExpandedId(null)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => Math.max(prev - itemsPerPage, 0))
      setExpandedId(null)
    }
  }

  // Calcular quais corretores mostrar
  const visibleCorretores = activeCorretores.slice(currentIndex, currentIndex + itemsPerPage)
  const canGoNext = currentIndex + itemsPerPage < activeCorretores.length
  const canGoPrev = currentIndex > 0

  if (activeCorretores.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título com Setas de Navegação */}
        <div className="text-center mb-12 relative">
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Seta Esquerda */}
            {activeCorretores.length > itemsPerPage && (
              <button
                onClick={handlePrev}
                disabled={!canGoPrev}
                className={`p-2 rounded-lg border transition-all ${
                  canGoPrev
                    ? 'bg-gray-800 text-white border-gray-800 hover:bg-gray-700 cursor-pointer'
                    : 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
                }`}
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Conheça nossa equipe
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Profissionais qualificados e experientes para te ajudar a encontrar o imóvel ideal
              </p>
            </div>
            
            {/* Seta Direita */}
            {activeCorretores.length > itemsPerPage && (
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className={`p-2 rounded-lg border transition-all ${
                  canGoNext
                    ? 'bg-gray-800 text-white border-gray-800 hover:bg-gray-700 cursor-pointer'
                    : 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
                }`}
                aria-label="Próximo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Carrossel de Corretores */}
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`
            }}
          >
            {activeCorretores.map((corretor, index) => (
              <div
                key={corretor.id}
                className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex-shrink-0 px-3"
                style={{ width: `${100 / itemsPerPage}%` }}
              >
              {/* Foto do Corretor */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={corretor.foto || '/placeholder-corretor.jpg'}
                  alt={corretor.nome}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Overlay com informações (quando expandido) */}
                {expandedId === corretor.id && (
                  <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                      <h3 className="text-lg font-semibold mb-2">{corretor.nome}</h3>
                      <p className="text-sm mb-4">{corretor.cargo}</p>
                      <p className="text-xs mb-4">CRECI: {corretor.creci}</p>
                      
                      {/* Informações de contato */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{corretor.telefone}</span>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{corretor.email}</span>
                        </div>
                        
                        {corretor.instagram && (
                          <div className="flex items-center justify-center space-x-2">
                            <Instagram className="w-4 h-4" />
                            <span className="text-sm">{corretor.instagram}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Nome e botão */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {corretor.nome}
                  </h3>
                  <button
                    onClick={() => handleExpand(corretor.id)}
                    className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                  >
                    {expandedId === corretor.id ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <span className="text-lg font-bold">+</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

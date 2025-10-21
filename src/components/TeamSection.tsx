'use client'

import React, { useState, useEffect } from 'react'
import { Phone, Mail, Instagram, X } from 'lucide-react'
import type { Corretor } from '@/lib/corretores-data'

interface TeamSectionProps {
  corretores: Corretor[]
}

export default function TeamSection({ corretores }: TeamSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Filtrar apenas corretores ativos
  const activeCorretores = corretores.filter(corretor => corretor.ativo)

  const handleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeCorretores.length)
    setExpandedId(null)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeCorretores.length) % activeCorretores.length)
    setExpandedId(null)
  }

  if (activeCorretores.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Conheça nossa equipe
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Profissionais qualificados e experientes para te ajudar a encontrar o imóvel ideal
          </p>
        </div>

        {/* Grid de Corretores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeCorretores.map((corretor, index) => (
            <div
              key={corretor.id}
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
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
            </div>
          ))}
        </div>

        {/* Navegação (se houver mais de 4 corretores) */}
        {activeCorretores.length > 4 && (
          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={handlePrev}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Próximo
            </button>
          </div>
        )}

        {/* Indicador de posição */}
        {activeCorretores.length > 4 && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: Math.ceil(activeCorretores.length / 4) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * 4)}
                className={`w-2 h-2 rounded-full ${
                  Math.floor(currentIndex / 4) === index
                    ? 'bg-purple-600'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

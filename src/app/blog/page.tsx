'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { getAllArtigos } from '@/lib/blog-github'
import { Artigo } from '@/types'
import { getText } from '@/lib/site-texts'

export default function BlogPage() {
  const [artigos, setArtigos] = useState<Artigo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 6

  useEffect(() => {
    const loadArtigos = async () => {
      try {
        const artigosFirebase = await getAllArtigos()
        setArtigos(artigosFirebase)
      } catch (error) {
        console.error('Erro ao carregar artigos:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadArtigos()
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    })
  }

  // Filtrar apenas artigos publicados
  const publishedArtigos = artigos.filter(artigo => artigo.publicado === true)
  
  // Calcular paginação
  const totalPages = Math.ceil(publishedArtigos.length / articlesPerPage)
  const startIndex = (currentPage - 1) * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const currentArtigos = publishedArtigos.slice(startIndex, endIndex)


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-3"></div>
                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {getText('blog.hero.titulo')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {getText('blog.hero.subtitulo')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Informações da página */}
        <div className="mb-8">
          <p className="text-gray-600 text-center">
            Mostrando {currentArtigos.length} de {publishedArtigos.length} artigos
            {totalPages > 1 && ` • Página ${currentPage} de ${totalPages}`}
          </p>
        </div>

        {/* Grid de Artigos */}
        {currentArtigos.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum artigo encontrado
            </h3>
            <p className="text-gray-600">
              Em breve teremos artigos disponíveis.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentArtigos.map((artigo) => {
              const date = new Date(artigo.dataPublicacao)
              const day = date.getDate().toString().padStart(2, '0')
              const month = date.toLocaleDateString('pt-BR', { month: 'short' })
              
              return (
                <div key={artigo.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="relative h-48">
                    <Image 
                      src={artigo.imagem || '/placeholder-blog.jpg'} 
                      alt={artigo.titulo} 
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                    {/* Data Overlay */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-black text-white text-center px-2 py-1 text-sm font-bold">
                        {day}
                      </div>
                      <div className="bg-purple-600 text-white text-center px-2 py-1 text-xs font-bold">
                        {month}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-3">
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                        {artigo.categoria}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                      {artigo.titulo}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                      {artigo.resumo.length > 120 
                        ? `${artigo.resumo.substring(0, 120)}...` 
                        : artigo.resumo}
                    </p>
                    
                    {/* Meta informações */}
                    <div className="flex items-center text-gray-500 text-xs space-x-4 mb-4">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {artigo.autor}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(artigo.dataPublicacao)}
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {artigo.visualizacoes}
                      </div>
                    </div>

                    <Link 
                      href={`/blog/${artigo.slug}`}
                      className="text-purple-600 font-medium text-sm uppercase underline decoration-purple-600 decoration-2 underline-offset-4 hover:text-purple-700 transition-colors"
                    >
                      LEIA MAIS
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-2">
              {/* Botão Anterior */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </button>

              {/* Números das páginas */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    page === currentPage
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Botão Próximo */}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

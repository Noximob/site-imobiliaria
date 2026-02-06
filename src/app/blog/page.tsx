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

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://noximobiliaria.com.br/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://noximobiliaria.com.br/blog/' },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <ol className="flex items-center gap-1 text-sm text-gray-600">
          <li><Link href="/" className="text-purple-600 hover:underline">Home</Link></li>
          <li><span className="mx-1">›</span></li>
          <li><span className="text-gray-900">Blog</span></li>
        </ol>
      </nav>
      {/* Hero Section - Blog */}
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 py-10">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            {/* Badge */}
            <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              📝 Blog Nox Imóveis
            </div>
            
            {/* Título Principal */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {getText('blog.hero.titulo')}
            </h1>
            
            {/* Subtítulo */}
            <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto leading-relaxed mb-8">
              {getText('blog.hero.subtitulo')}
            </p>
            
            {/* Linha decorativa */}
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-green-400 mx-auto rounded-full"></div>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-purple-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-green-400/20 rounded-full blur-2xl"></div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Informações da página */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 text-center">
            {/* H2 estrutural para hierarquia do conteúdo do blog */}
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
              Últimos artigos do blog Nox Imóveis
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span className="text-gray-600 font-medium">
                Mostrando {currentArtigos.length} de {publishedArtigos.length} artigos
              </span>
              {totalPages > 1 && (
                <>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-500">
                    Página {currentPage} de {totalPages}
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Dicas e novidades do mercado imobiliário
            </p>
          </div>
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
                  <div className="relative h-48 w-full">
                    <Image 
                      src={artigo.imagem || '/placeholder-blog.jpg'} 
                      alt={artigo.titulo} 
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

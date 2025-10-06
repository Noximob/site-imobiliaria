'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, Eye, Search } from 'lucide-react'
import { getAllArtigos } from '@/lib/blog'
import { Artigo } from '@/types'

export default function BlogPage() {
  const [artigos, setArtigos] = useState<Artigo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    const loadArtigos = async () => {
      try {
        console.log('Carregando artigos...')
        const artigosFirebase = await getAllArtigos()
        console.log('Artigos carregados:', artigosFirebase.length)
        console.log('Artigos:', artigosFirebase)
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

  // Filtrar artigos
  const filteredArtigos = artigos.filter(artigo => {
    const matchesSearch = artigo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artigo.resumo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || artigo.categoria === selectedCategory
    const isPublished = artigo.publicado
    console.log('Filtrando artigo:', {
      titulo: artigo.titulo,
      publicado: artigo.publicado,
      matchesSearch,
      matchesCategory,
      isPublished,
      final: matchesSearch && matchesCategory && isPublished
    })
    return matchesSearch && matchesCategory && isPublished
  })

  console.log('Total artigos:', artigos.length)
  console.log('Artigos filtrados:', filteredArtigos.length)

  // Obter categorias únicas
  const categories = Array.from(new Set(artigos.map(artigo => artigo.categoria)))

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
              Blog Nox Imóveis
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dicas, novidades e informações sobre o mercado imobiliário para você tomar as melhores decisões.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Categoria */}
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Todas as categorias</option>
                {categories.map(categoria => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredArtigos.length} artigo{filteredArtigos.length !== 1 ? 's' : ''} encontrado{filteredArtigos.length !== 1 ? 's' : ''}
            {selectedCategory && ` em "${selectedCategory}"`}
            {searchTerm && ` para "${searchTerm}"`}
          </p>
        </div>

        {/* Grid de Artigos */}
        {filteredArtigos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum artigo encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros ou buscar por outros termos.
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
              }}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtigos.map((artigo) => {
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
      </div>
    </div>
  )
}

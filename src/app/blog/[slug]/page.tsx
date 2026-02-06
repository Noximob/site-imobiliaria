'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Eye, Share2 } from 'lucide-react'
import { getArtigoBySlug } from '@/lib/blog-github'
import { Artigo } from '@/types'

export default function ArtigoPage() {
  const [artigo, setArtigo] = useState<Artigo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const params = useParams()

  useEffect(() => {
    const loadArtigo = async () => {
      try {
        if (params.slug) {
          const artigoData = await getArtigoBySlug(params.slug as string)
          if (artigoData) {
            setArtigo(artigoData)
          } else {
            setError('Artigo não encontrado')
          }
        }
      } catch (error) {
        console.error('Erro ao carregar artigo:', error)
        setError('Erro ao carregar artigo')
      } finally {
        setIsLoading(false)
      }
    }
    loadArtigo()
  }, [params.slug])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-6"></div>
            <div className="h-64 bg-gray-300 rounded mb-6"></div>
            <div className="h-6 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !artigo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Artigo não encontrado'}
            </h1>
            <Link 
              href="/"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              ← Voltar para o início
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const date = new Date(artigo.dataPublicacao)
  const day = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleDateString('pt-BR', { month: 'short' })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header do Artigo */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-600 mb-4">
            <ol className="flex flex-wrap items-center gap-1">
              <li><Link href="/" className="text-purple-600 hover:underline">Home</Link></li>
              <li><span className="mx-1">›</span></li>
              <li><Link href="/blog/" className="text-purple-600 hover:underline">Blog</Link></li>
              <li><span className="mx-1">›</span></li>
              <li><span className="text-gray-900 line-clamp-1">{artigo.titulo}</span></li>
            </ol>
          </nav>
          <div className="flex items-center justify-between mb-6">
            <Link 
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Link>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <Share2 className="w-5 h-5 mr-2" />
                Compartilhar
              </button>
            </div>
          </div>

          {/* Categoria */}
          <div className="mb-4">
            <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full font-medium">
              {artigo.categoria}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {artigo.titulo}
          </h1>

          {/* Meta informações */}
          <div className="flex items-center text-gray-600 text-sm space-x-6">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {artigo.autor}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(artigo.dataPublicacao)}
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              {artigo.visualizacoes} visualizações
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo do Artigo */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* H2 estrutural para o corpo do artigo */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Sobre este artigo
        </h2>
        {/* Imagem Principal */}
        <div className="relative mb-8 rounded-lg overflow-hidden aspect-[4/3] md:aspect-[16/9]">
          <Image 
            src={artigo.imagem || '/placeholder-blog.jpg'} 
            alt={artigo.titulo} 
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 896px"
          />
          {/* Data Overlay */}
          <div className="absolute top-6 left-6">
            <div className="bg-black text-white text-center px-3 py-2 text-lg font-bold rounded">
              {day}
            </div>
            <div className="bg-purple-600 text-white text-center px-3 py-2 text-sm font-bold rounded">
              {month}
            </div>
          </div>
        </div>

        {/* Resumo */}
        <div className="bg-purple-50 border-l-4 border-purple-600 p-6 mb-8 rounded-r-lg">
          <p className="text-lg text-gray-700 leading-relaxed font-medium">
            {artigo.resumo}
          </p>
        </div>

        {/* Conteúdo */}
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {artigo.conteudo}
          </div>
        </div>

        {/* Tags */}
        {artigo.tags && artigo.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {artigo.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Encontrou o que procurava?
          </h3>
          <p className="text-purple-100 mb-6">
            Nossa equipe está pronta para ajudar você a encontrar o imóvel dos seus sonhos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contato"
              className="bg-white text-purple-600 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Falar com um corretor
            </Link>
            <Link 
              href="/imoveis"
              className="border-2 border-white text-white font-medium py-3 px-6 rounded-lg hover:bg-white hover:text-purple-600 transition-colors"
            >
              Ver imóveis disponíveis
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

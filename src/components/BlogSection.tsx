'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getAllArtigos } from '@/lib/blog'
import { Artigo } from '@/types'

export default function BlogSection() {
  const [artigos, setArtigos] = useState<Artigo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadArtigos = async () => {
      try {
        const artigosFirebase = await getAllArtigos()
        setArtigos(artigosFirebase.slice(0, 3)) // Mostrar apenas os 3 primeiros
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
      month: 'short'
    })
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 text-center">
            Se atualize nos últimos conteúdos do nosso blog
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
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
      </section>
    )
  }

  if (artigos.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 text-center">
            Se atualize nos últimos conteúdos do nosso blog
          </h2>
          
          <div className="text-center py-12">
            <p className="text-gray-600">Em breve teremos artigos disponíveis.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 text-center">
          Se atualize nos últimos conteúdos do nosso blog
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {artigos.map((artigo) => {
            const date = new Date(artigo.dataPublicacao)
            const day = date.getDate().toString().padStart(2, '0')
            const month = date.toLocaleDateString('pt-BR', { month: 'short' })
            
            return (
              <div key={artigo.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="relative aspect-[4/3]">
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
                    <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {artigo.categoria}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {artigo.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {artigo.resumo.length > 120 
                      ? `${artigo.resumo.substring(0, 120)}...` 
                      : artigo.resumo}
                  </p>
                  <Link 
                    href={`/blog/${artigo.slug}`}
                    className="text-gray-900 font-medium text-sm uppercase underline decoration-purple-600 decoration-2 underline-offset-4 hover:text-gray-700 transition-colors"
                  >
                    LEIA MAIS
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Botão Ver mais artigos */}
        <div className="text-center">
          <Link 
            href="/blog"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-block"
          >
            Ver mais artigos
          </Link>
        </div>
      </div>
    </section>
  )
}

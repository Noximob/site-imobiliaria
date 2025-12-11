'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { getAllImoveis, formatPrice } from '@/lib/imoveis'
import { getFavoritos, toggleFavorito, isFavorito } from '@/lib/favoritos'
import { Imovel } from '@/types'
import { MapPin, Bed, Bath, Car, Ruler } from 'lucide-react'

export default function FavoritosPage() {
  const [imoveisFavoritos, setImoveisFavoritos] = useState<Imovel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFavoritos = async () => {
      try {
        setIsLoading(true)
        const todosImoveis = await getAllImoveis()
        const favoritosIds = getFavoritos()
        const favoritos = todosImoveis.filter(imovel => favoritosIds.includes(imovel.id))
        setImoveisFavoritos(favoritos)
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error)
        setImoveisFavoritos([])
      } finally {
        setIsLoading(false)
      }
    }
    
    loadFavoritos()
    
    // Listener para atualizar quando favoritos mudarem
    const handleStorageChange = () => {
      loadFavoritos()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Verificar mudanças no localStorage periodicamente (para mesma aba)
    const interval = setInterval(() => {
      loadFavoritos()
    }, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const handleToggleFavorito = (imovelId: string) => {
    toggleFavorito(imovelId)
    setImoveisFavoritos(prev => prev.filter(imovel => imovel.id !== imovelId))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Meus Favoritos
          </h1>
          <p className="text-gray-600">
            {imoveisFavoritos.length === 0 
              ? 'Você ainda não tem imóveis favoritados'
              : `${imoveisFavoritos.length} ${imoveisFavoritos.length === 1 ? 'imóvel favoritado' : 'imóveis favoritados'}`
            }
          </p>
        </div>
      </div>

      {/* Lista de Imóveis */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Carregando favoritos...</p>
          </div>
        ) : imoveisFavoritos.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Nenhum favorito ainda
            </h2>
            <p className="text-gray-600 mb-6">
              Comece a explorar nossos imóveis e marque seus favoritos!
            </p>
            <Link
              href="/imoveis"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Ver Imóveis
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {imoveisFavoritos.map((imovel) => {
              const primeiraFoto = imovel.fotos[0] || '/placeholder-imovel.jpg'
              
              return (
                <div key={imovel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/imoveis/${imovel.slug}`}>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={primeiraFoto}
                        alt={imovel.titulo}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          imovel.status === 'prontos' 
                            ? 'bg-green-100 text-green-800' 
                            : imovel.status === 'lancamento'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {imovel.status === 'prontos' ? 'Pronto' : 
                           imovel.status === 'lancamento' ? 'Lançamento' : 'Em Construção'}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleToggleFavorito(imovel.id)
                          }}
                          className="bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
                        >
                          <Heart className="w-5 h-5 text-red-500 fill-current" />
                        </button>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <Link href={`/imoveis/${imovel.slug}`}>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 transition-colors">
                        {imovel.titulo}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {imovel.endereco.bairro}, {imovel.endereco.cidade}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-purple-600">
                        {formatPrice(imovel.preco)}
                      </span>
                      <span className="text-sm text-gray-500 capitalize">
                        {imovel.tipo}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          <span>{imovel.caracteristicas.quartos}</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          <span>{imovel.caracteristicas.banheiros}</span>
                        </div>
                        <div className="flex items-center">
                          <Car className="w-4 h-4 mr-1" />
                          <span>{imovel.caracteristicas.vagas}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Ruler className="w-4 h-4 mr-1" />
                        <span>{imovel.caracteristicas.area}m²</span>
                      </div>
                    </div>
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

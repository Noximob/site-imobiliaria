'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { getAllImoveis, formatPrice, getFotoPrincipal } from '@/lib/imoveis'
import { getFavoritos, toggleFavorito, isFavorito } from '@/lib/favoritos'
import { trackFavorito } from '@/lib/analytics'
import { Imovel } from '@/types'
import { MapPin, Bed, Bath, Car, Ruler } from 'lucide-react'

export default function FavoritosPage() {
  const [imoveisFavoritos, setImoveisFavoritos] = useState<Imovel[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    loadFavoritos()
    
    // Listener para atualizar quando favoritos mudarem em outra aba
    const handleStorageChange = () => {
      loadFavoritos()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Listener customizado para mudanças na mesma aba
    const handleFavoritosChange = () => {
      loadFavoritos()
    }
    
    window.addEventListener('favoritos-changed', handleFavoritosChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('favoritos-changed', handleFavoritosChange)
    }
  }, [])

  const handleToggleFavorito = (imovelId: string) => {
    const added = toggleFavorito(imovelId)
    trackFavorito(imovelId, added)
    // Atualizar lista imediatamente
    setImoveisFavoritos(prev => prev.filter(imovel => imovel.id !== imovelId))
    // Disparar evento para outras partes da aplicação
    window.dispatchEvent(new Event('favoritos-changed'))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="w-8 h-8 md:w-10 md:h-10 fill-current" />
            <h1 className="text-3xl md:text-4xl font-bold">
              Meus Favoritos
            </h1>
          </div>
          <p className="text-purple-100 text-lg">
            {isLoading 
              ? 'Carregando...'
              : imoveisFavoritos.length === 0 
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
              const primeiraFoto = getFotoPrincipal(imovel) || '/placeholder-imovel.jpg'
              
              return (
                <div key={imovel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <Link 
                    href={`/imoveis/${imovel.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={primeiraFoto}
                        alt={imovel.titulo}
                        fill
                        className="object-contain hover:scale-105 transition-transform duration-300 bg-gray-100"
                        loading="lazy"
                        unoptimized
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
                    <Link 
                      href={`/imoveis/${imovel.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
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

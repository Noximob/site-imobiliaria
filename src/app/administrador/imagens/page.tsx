'use client'

import { useState } from 'react'
import { ArrowLeft, Upload, Image as ImageIcon, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

export default function AdminImagens() {
  const [images, setImages] = useState([
    {
      id: 1,
      name: 'banner-home.png',
      url: '/imagens/banners/banner-home.png',
      category: 'Banners',
      size: '2.3 MB',
      uploadedAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'apartamento-cobertura.png',
      url: '/imagens/Encontre Imovel/Piçarras/Apartamento-Cobertura.png',
      category: 'Imóveis',
      size: '1.8 MB',
      uploadedAt: '2024-01-14'
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['Todas', 'Banners', 'Imóveis', 'Corretores', 'Blog']

  const filteredImages = images.filter(image => {
    const matchesCategory = selectedCategory === 'Todas' || image.category === selectedCategory
    const matchesSearch = image.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link 
                href="/administrador"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <ImageIcon className="w-8 h-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Gerenciar Imagens
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upload de Imagens
          </h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Arraste e solte suas imagens aqui ou clique para selecionar
            </p>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
              Selecionar Arquivos
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Formatos suportados: JPG, PNG, WebP (máx. 10MB)
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Nome da imagem..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Imagens ({filteredImages.length})
            </h3>
          </div>
          
          <div className="p-6">
            {filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma imagem encontrada</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((image) => (
                  <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gray-100 relative">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                          <button className="p-2 bg-white rounded-full text-gray-600 hover:text-gray-800">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-white rounded-full text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-gray-900 truncate">
                        {image.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {image.category} • {image.size}
                      </p>
                      <p className="text-xs text-gray-400">
                        {image.uploadedAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

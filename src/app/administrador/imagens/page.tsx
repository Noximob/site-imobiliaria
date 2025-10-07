'use client'

import { useState, useRef } from 'react'
import { ArrowLeft, Upload, Image as ImageIcon, Save, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface SiteImage {
  id: string
  description: string
  currentPath: string
  recommendedSize: string
  category: string
}

const siteImages: SiteImage[] = [
  // Banners
  { id: 'banner-home', description: 'Banner da Página Principal', currentPath: '/imagens/banners/banner-home.png', recommendedSize: '1920x600px', category: 'Banners' },
  
  // Logos
  { id: 'logo', description: 'Logo Principal', currentPath: '/imagens/Logo.png', recommendedSize: '200x80px', category: 'Logo' },
  { id: 'logo1', description: 'Logo Alternativo', currentPath: '/imagens/Logo1.png', recommendedSize: '200x80px', category: 'Logo' },
  
  // Como Comprar
  { id: 'como-comprar-topico', description: 'Tópico Como Comprar', currentPath: '/imagens/Como Comprar/Topico Como Comprar.png', recommendedSize: '800x400px', category: 'Como Comprar' },
  { id: 'como-comprar-1', description: 'Como Comprar - Passo 1', currentPath: '/imagens/Como Comprar/1.png', recommendedSize: '400x400px', category: 'Como Comprar' },
  { id: 'como-comprar-2', description: 'Como Comprar - Passo 2', currentPath: '/imagens/Como Comprar/2.png', recommendedSize: '400x400px', category: 'Como Comprar' },
  { id: 'como-comprar-3', description: 'Como Comprar - Passo 3', currentPath: '/imagens/Como Comprar/3.png', recommendedSize: '400x400px', category: 'Como Comprar' },
  { id: 'como-comprar-4', description: 'Como Comprar - Passo 4', currentPath: '/imagens/Como Comprar/4.png', recommendedSize: '400x400px', category: 'Como Comprar' },
  { id: 'como-comprar-5', description: 'Como Comprar - Passo 5', currentPath: '/imagens/Como Comprar/5.png', recommendedSize: '400x400px', category: 'Como Comprar' },
  
  // Anunciar Imóvel
  { id: 'anunciar-imovel', description: 'Anunciar Imóvel', currentPath: '/imagens/Anunciar Imovel/Anunciar Imovel.png', recommendedSize: '1200x800px', category: 'Páginas' },
  
  // Anuncie Nox
  { id: 'anuncie-nox-mulher', description: 'Anuncie Nox - Mulher', currentPath: '/imagens/Anuncie Nox/Mulher.png', recommendedSize: '800x1000px', category: 'Páginas' },
  
  // Contato
  { id: 'contato', description: 'Página de Contato', currentPath: '/imagens/Contato/Contato.png', recommendedSize: '1200x800px', category: 'Páginas' },
  
  // Trabalhe Conosco
  { id: 'trabalhe-conosco', description: 'Trabalhe Conosco', currentPath: '/imagens/Trabalhe Conosco/Trabalhe Conosco.png', recommendedSize: '1200x800px', category: 'Páginas' },
  
  // Encontre Meu Imóvel
  { id: 'encontre-imovel-equipe', description: 'Encontre Imóvel - Equipe', currentPath: '/imagens/Encontre Meu Imovel/Equipe.png', recommendedSize: '1200x600px', category: 'Páginas' },
  
  // Corretores
  { id: 'corretor-1', description: 'Corretor 1', currentPath: '/imagens/Corretores/1.png', recommendedSize: '400x400px', category: 'Corretores' },
  { id: 'corretor-2', description: 'Corretor 2', currentPath: '/imagens/Corretores/2.png', recommendedSize: '400x400px', category: 'Corretores' },
  { id: 'corretor-3', description: 'Corretor 3', currentPath: '/imagens/Corretores/3.png', recommendedSize: '400x400px', category: 'Corretores' },
  { id: 'corretor-4', description: 'Corretor 4', currentPath: '/imagens/Corretores/4.png', recommendedSize: '400x400px', category: 'Corretores' },
  
  // Encontre Imóvel - Categorias
  { id: 'apartamentos', description: 'Categoria - Apartamentos', currentPath: '/imagens/Encontre Imovel/Apartamentos.png', recommendedSize: '600x400px', category: 'Categorias' },
  { id: 'frente-mar', description: 'Categoria - Frente Mar', currentPath: '/imagens/Encontre Imovel/Frente-Mar.png', recommendedSize: '600x400px', category: 'Categorias' },
  { id: 'lancamentos-investidor', description: 'Categoria - Lançamentos Investidor', currentPath: '/imagens/Encontre Imovel/Lançamentos-Investidor.png', recommendedSize: '600x400px', category: 'Categorias' },
  { id: 'mobiliados', description: 'Categoria - Mobiliados', currentPath: '/imagens/Encontre Imovel/Mobiliados.png', recommendedSize: '600x400px', category: 'Categorias' },
  
  // Barra Velha
  { id: 'bv-em-construcao', description: 'Barra Velha - Em Construção', currentPath: '/imagens/Encontre Imovel/Barra Velha/Em Construção.png', recommendedSize: '600x400px', category: 'Barra Velha' },
  { id: 'bv-imoveis-prontos', description: 'Barra Velha - Imóveis Prontos', currentPath: '/imagens/Encontre Imovel/Barra Velha/Imoveis Prontos.png', recommendedSize: '600x400px', category: 'Barra Velha' },
  { id: 'bv-lancamentos-frente-mar', description: 'Barra Velha - Lançamentos Frente Mar', currentPath: '/imagens/Encontre Imovel/Barra Velha/Lançamentos Frente mar.png', recommendedSize: '600x400px', category: 'Barra Velha' },
  
  // Piçarras
  { id: 'picarras-cobertura', description: 'Piçarras - Apartamento Cobertura', currentPath: '/imagens/Encontre Imovel/Piçarras/Apartamento-Cobertura.png', recommendedSize: '600x400px', category: 'Piçarras' },
  { id: 'picarras-lancamentos', description: 'Piçarras - Lançamentos', currentPath: '/imagens/Encontre Imovel/Piçarras/Lançamentos.png', recommendedSize: '600x400px', category: 'Piçarras' },
  { id: 'picarras-mobiliado', description: 'Piçarras - Mobiliado', currentPath: '/imagens/Encontre Imovel/Piçarras/Mobiliado.png', recommendedSize: '600x400px', category: 'Piçarras' },
  { id: 'picarras-vista-mar', description: 'Piçarras - Vista Mar', currentPath: '/imagens/Encontre Imovel/Piçarras/Vista-Mar.png', recommendedSize: '600x400px', category: 'Piçarras' },
  
  // Imóveis na Planta
  { id: 'imoveis-planta-1', description: 'Imóveis na Planta - Imagem 1', currentPath: '/imagens/Imoveis na Planta/1.png', recommendedSize: '800x600px', category: 'Imóveis na Planta' },
  { id: 'imoveis-planta-2', description: 'Imóveis na Planta - Imagem 2', currentPath: '/imagens/Imoveis na Planta/2.png', recommendedSize: '800x600px', category: 'Imóveis na Planta' },
  { id: 'imoveis-planta-3', description: 'Imóveis na Planta - Imagem 3', currentPath: '/imagens/Imoveis na Planta/3.png', recommendedSize: '800x600px', category: 'Imóveis na Planta' },
  
  // Seleção Nox
  { id: 'selecao-nox-1', description: 'Seleção Nox - Imagem 1', currentPath: '/imagens/Seleção Nox/1.jpg', recommendedSize: '800x600px', category: 'Seleção Nox' },
  { id: 'selecao-nox-2', description: 'Seleção Nox - Imagem 2', currentPath: '/imagens/Seleção Nox/2.jpg', recommendedSize: '800x600px', category: 'Seleção Nox' },
  { id: 'selecao-nox-3', description: 'Seleção Nox - Imagem 3', currentPath: '/imagens/Seleção Nox/3.jpg', recommendedSize: '800x600px', category: 'Seleção Nox' },
]

export default function AdminImagens() {
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({})
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({})
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  const categories = ['Todas', ...Array.from(new Set(siteImages.map(img => img.category)))]

  const filteredImages = siteImages.filter(image => {
    const matchesCategory = selectedCategory === 'Todas' || image.category === selectedCategory
    const matchesSearch = image.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleFileSelect = (imageId: string, file: File) => {
    setSelectedFiles(prev => ({ ...prev, [imageId]: file }))
    
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrls(prev => ({ ...prev, [imageId]: e.target?.result as string }))
    }
    reader.readAsDataURL(file)
  }

  const handleSaveImage = async (imageId: string) => {
    const file = selectedFiles[imageId]
    if (!file) {
      alert('Selecione uma imagem primeiro')
      return
    }

    // TODO: Implementar upload para o servidor
    alert('Funcionalidade de upload será implementada em breve!')
  }

  const handleResetImage = (imageId: string) => {
    setSelectedFiles(prev => {
      const newFiles = { ...prev }
      delete newFiles[imageId]
      return newFiles
    })
    setPreviewUrls(prev => {
      const newUrls = { ...prev }
      delete newUrls[imageId]
      return newUrls
    })
    if (fileInputRefs.current[imageId]) {
      fileInputRefs.current[imageId]!.value = ''
    }
  }

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
              <ImageIcon className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Gerenciar Imagens do Site
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Instruções:</strong> Para cada imagem, você verá a versão atual em miniatura. 
            Clique em "Selecionar Nova Imagem" para escolher uma nova foto. 
            Respeite os tamanhos recomendados para melhor qualidade.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Imagem
              </label>
              <input
                type="text"
                placeholder="Digite o nome da imagem..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="sm:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Categoria
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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

        {/* Images List */}
        <div className="space-y-4">
          {filteredImages.map((image) => (
            <div key={image.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Imagem Atual */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase">
                    Imagem Atual
                  </h3>
                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    <div className="relative w-full h-48">
                      <Image
                        src={image.currentPath}
                        alt={image.description}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {image.description}
                  </p>
                </div>

                {/* Informações e Nova Imagem */}
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      {image.description}
                    </h2>
                    <p className="text-sm text-gray-600">
                      <strong>Categoria:</strong> {image.category}
                    </p>
                    <p className="text-sm text-purple-600 font-medium">
                      <strong>Tamanho Recomendado:</strong> {image.recommendedSize}
                    </p>
                  </div>

                  {/* Preview da Nova Imagem */}
                  {previewUrls[image.id] && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-gray-700 uppercase">
                        Pré-visualização da Nova Imagem
                      </h3>
                      <div className="border-2 border-green-300 rounded-lg overflow-hidden bg-gray-50">
                        <div className="relative w-full h-48">
                          <Image
                            src={previewUrls[image.id]}
                            alt="Preview"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex flex-wrap gap-3">
                    <label className="flex-1 min-w-[200px]">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={(el) => (fileInputRefs.current[image.id] = el)}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileSelect(image.id, file)
                        }}
                      />
                      <div className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {selectedFiles[image.id] ? 'Trocar Imagem' : 'Selecionar Nova Imagem'}
                        </span>
                      </div>
                    </label>

                    {selectedFiles[image.id] && (
                      <>
                        <button
                          onClick={() => handleSaveImage(image.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          <span className="text-sm font-medium">Salvar</span>
                        </button>
                        <button
                          onClick={() => handleResetImage(image.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span className="text-sm font-medium">Cancelar</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredImages.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma imagem encontrada com esses filtros</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

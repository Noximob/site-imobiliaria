'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Upload, Image as ImageIcon, Save, RefreshCw, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getAllSiteImages, uploadSiteImage, siteImagesConfig } from '@/lib/site-images'

interface SiteImage {
  id: string
  description: string
  currentPath: string
  recommendedSize: string
  category: string
  subcategory?: string
}

export default function AdminImagens() {
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({})
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({})
  const [siteImages, setSiteImages] = useState<SiteImage[]>([])
  const [firebaseImages, setFirebaseImages] = useState<{ [key: string]: string }>({})
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  // Carregar imagens do Firebase
  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      const fbImages = await getAllSiteImages()
      setFirebaseImages(fbImages)
      
      // Criar lista de imagens com URLs do Firebase ou local
      const imagesWithUrls = siteImagesConfig.map(img => ({
        id: img.id,
        description: img.description,
        currentPath: fbImages[img.id] || img.localPath,
        recommendedSize: img.recommendedSize,
        category: img.category,
        subcategory: img.subcategory,
      }))
      
      setSiteImages(imagesWithUrls)
    } catch (error) {
      console.error('Erro ao carregar imagens:', error)
      // Fallback para imagens locais
      setSiteImages(siteImagesConfig.map(img => ({
        id: img.id,
        description: img.description,
        currentPath: img.localPath,
        recommendedSize: img.recommendedSize,
        category: img.category,
        subcategory: img.subcategory,
      })))
    }
  }

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

    const imageConfig = siteImagesConfig.find(img => img.id === imageId)
    if (!imageConfig) {
      alert('Configuração da imagem não encontrada')
      return
    }

    setIsLoading(prev => ({ ...prev, [imageId]: true }))

    try {
      const downloadURL = await uploadSiteImage(imageId, file)
      
      // Atualizar a lista de imagens
      setSiteImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, currentPath: downloadURL } : img
      ))
      
      // Limpar seleção
      handleResetImage(imageId)
      
      alert('Imagem atualizada com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar imagem:', error)
      alert('Erro ao salvar imagem. Tente novamente.')
    } finally {
      setIsLoading(prev => ({ ...prev, [imageId]: false }))
    }
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
                      {image.subcategory && ` > ${image.subcategory}`}
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
                        ref={(el) => {
                          fileInputRefs.current[image.id] = el
                        }}
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
                          disabled={isLoading[image.id]}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {isLoading[image.id] ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm font-medium">Salvando...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              <span className="text-sm font-medium">Salvar</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleResetImage(image.id)}
                          disabled={isLoading[image.id]}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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

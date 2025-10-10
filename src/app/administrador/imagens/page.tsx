'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Upload, Image as ImageIcon, Save, RefreshCw, Loader2, CheckCircle, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { siteImagesConfig } from '@/lib/github-images'

interface SiteImage {
  id: string
  description: string
  currentPath: string
  recommendedSize: string
  category: string
  subcategory?: string
}

interface PendingImage {
  imageId: string
  file: File
  previewUrl: string
}

interface PendingDelete {
  imageId: string
  description: string
}

export default function AdminImagens() {
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [searchTerm, setSearchTerm] = useState('')
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([])
  const [pendingDeletes, setPendingDeletes] = useState<PendingDelete[]>([])
  const [siteImages, setSiteImages] = useState<SiteImage[]>([])
  const [isPublishing, setIsPublishing] = useState(false)
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  // Carregar imagens
  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      // Buscar imagens reais do GitHub
      const response = await fetch('/api/list-github-images')
      let githubImages: { [key: string]: string } = {}
      
      if (response.ok) {
        githubImages = await response.json()
      }
      
      const imagesWithUrls = siteImagesConfig.map(img => ({
        id: img.id,
        description: img.description,
        currentPath: githubImages[img.id] || img.localPath, // Usar imagem real se existir
        recommendedSize: img.recommendedSize,
        category: img.category,
        subcategory: img.subcategory,
      }))
      
      setSiteImages(imagesWithUrls)
    } catch (error) {
      console.error('Erro ao carregar imagens:', error)
      // Fallback para configuração estática
      const imagesWithUrls = siteImagesConfig.map(img => ({
        id: img.id,
        description: img.description,
        currentPath: img.localPath,
        recommendedSize: img.recommendedSize,
        category: img.category,
        subcategory: img.subcategory,
      }))
      setSiteImages(imagesWithUrls)
    }
  }

  const categories = ['Todas', ...Array.from(new Set(siteImages.map(img => img.category)))]

  const filteredImages = siteImages.filter(image => {
    const matchesCategory = selectedCategory === 'Todas' || image.category === selectedCategory
    const matchesSearch = image.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleFileSelect = (imageId: string, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string
      
      // Adicionar ou atualizar imagem pendente
      setPendingImages(prev => {
        const existing = prev.findIndex(p => p.imageId === imageId)
        if (existing >= 0) {
          const updated = [...prev]
          updated[existing] = { imageId, file, previewUrl }
          return updated
        }
        return [...prev, { imageId, file, previewUrl }]
      })
    }
    reader.readAsDataURL(file)
  }

  const handleRemovePending = (imageId: string) => {
    setPendingImages(prev => prev.filter(p => p.imageId !== imageId))
    
    // Limpar input file
    if (fileInputRefs.current[imageId]) {
      fileInputRefs.current[imageId]!.value = ''
    }
  }

  const handlePublishAll = async () => {
    if (pendingImages.length === 0) {
      alert('Nenhuma imagem para publicar')
      return
    }

    if (!confirm(`Você vai publicar ${pendingImages.length} imagem(ns). O site será atualizado em ~2 minutos. Deseja continuar?`)) {
      return
    }

    setIsPublishing(true)

    try {
      // Upload de todas as imagens em batch
      const formData = new FormData()
      
      pendingImages.forEach(({ imageId, file }) => {
        formData.append('files', file)
        formData.append('imageIds', imageId)
      })
      
      const response = await fetch('/api/upload-batch-github', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Erro no upload em batch')
      }
      
      const result = await response.json()

      // Limpar imagens pendentes
      setPendingImages([])
      
      // Limpar inputs
      Object.values(fileInputRefs.current).forEach(input => {
        if (input) input.value = ''
      })

      // Recarregar imagens para mostrar as novas
      await loadImages()

      alert(`✅ ${pendingImages.length} imagem(ns) publicada(s) com sucesso!\n\n🔄 O site será atualizado automaticamente em ~2 minutos.\n\n🖼️ As imagens já aparecem no admin!`)
      
    } catch (error) {
      console.error('Erro ao publicar imagens:', error)
      alert('❌ Erro ao publicar algumas imagens. Tente novamente.')
    } finally {
      setIsPublishing(false)
    }
  }

  const getPendingImage = (imageId: string) => {
    return pendingImages.find(p => p.imageId === imageId)
  }

  const isPendingDelete = (imageId: string) => {
    return pendingDeletes.some(p => p.imageId === imageId)
  }

  const handleMarkForDelete = (imageId: string, description: string) => {
    // Adicionar à lista de pendentes para deletar
    setPendingDeletes(prev => {
      if (prev.find(p => p.imageId === imageId)) {
        return prev // Já está na lista
      }
      return [...prev, { imageId, description }]
    })
  }

  const handleCancelDelete = (imageId: string) => {
    setPendingDeletes(prev => prev.filter(p => p.imageId !== imageId))
  }

  const handlePublishDeletes = async () => {
    if (pendingDeletes.length === 0) {
      alert('Nenhuma imagem para apagar')
      return
    }

    if (!confirm(`Você vai apagar ${pendingDeletes.length} imagem(ns). O site será atualizado em ~2 minutos. Deseja continuar?`)) {
      return
    }

    setIsPublishing(true)

    try {
      const imageIds = pendingDeletes.map(d => d.imageId)
      
      const response = await fetch('/api/delete-batch-github', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageIds })
      })

      if (!response.ok) {
        throw new Error('Erro ao apagar imagens')
      }

      const result = await response.json()

      // Limpar lista de pendentes
      setPendingDeletes([])

      // Recarregar imagens
      await loadImages()

      alert(`✅ ${pendingDeletes.length} imagem(ns) apagada(s) com sucesso!\n\n🔄 O site será atualizado automaticamente em ~2 minutos.`)
      
    } catch (error) {
      console.error('Erro ao apagar imagens:', error)
      alert('❌ Erro ao apagar algumas imagens. Tente novamente.')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/administrador"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Voltar</span>
            </Link>
            
            <div className="flex items-center">
              <ImageIcon className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Gerenciar Imagens do Site
              </h1>
            </div>
            
            <button
              onClick={loadImages}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão Publicar Uploads - Fixo no topo */}
        {pendingImages.length > 0 && (
          <div className="bg-purple-50 border-2 border-purple-400 rounded-lg p-4 mb-6 sticky top-4 z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-800 mb-1">
                  📸 {pendingImages.length} imagem(ns) pronta(s) para publicar
                </p>
                <p className="text-xs text-purple-700">
                  Clique em "Publicar Alterações" para enviar todas de uma vez (~2min de rebuild)
                </p>
              </div>
              <button
                onClick={handlePublishAll}
                disabled={isPublishing}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Publicando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Publicar Alterações</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Botão Publicar Deletes - Fixo no topo */}
        {pendingDeletes.length > 0 && (
          <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 mb-6 sticky top-4 z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-red-800 mb-1">
                  🗑️ {pendingDeletes.length} imagem(ns) marcada(s) para apagar
                </p>
                <p className="text-xs text-red-700">
                  Clique em "Apagar Selecionadas" para remover todas de uma vez (~2min de rebuild)
                </p>
              </div>
              <button
                onClick={handlePublishDeletes}
                disabled={isPublishing}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Apagando...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    <span>Apagar Selecionadas</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>📋 Como usar:</strong> Selecione as imagens que deseja trocar. 
            Você pode escolher várias imagens de uma vez. 
            Quando terminar, clique em "Publicar Alterações" para enviar todas de uma vez (1 único rebuild de ~2min).
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => {
            const pending = getPendingImage(image.id)
            const markedForDelete = isPendingDelete(image.id)
            
            return (
              <div key={image.id} className={`bg-white rounded-lg shadow-md overflow-hidden ${markedForDelete ? 'ring-2 ring-red-500' : ''}`}>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{image.description}</h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {image.category} {image.subcategory && `• ${image.subcategory}`}
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    Tamanho recomendado: {image.recommendedSize}
                  </p>

                  {/* Preview */}
                  <div className="mb-4">
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      {pending ? (
                        <>
                          <Image
                            src={pending.previewUrl}
                            alt="Nova imagem"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                            NOVA
                          </div>
                        </>
                      ) : markedForDelete ? (
                        <>
                          <Image
                            src={image.currentPath}
                            alt={image.description}
                            fill
                            className="object-cover opacity-50"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg">
                              🗑️ SERÁ APAGADA
                            </div>
                          </div>
                        </>
                      ) : image.currentPath && image.currentPath !== '/imagens/placeholder.png' ? (
                        <>
                          <Image
                            src={image.currentPath}
                            alt={image.description}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                            ATUAL
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ImageIcon className="w-16 h-16" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {pending ? (
                      <>
                        <button
                          onClick={() => handleRemovePending(image.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Cancelar
                        </button>
                      </>
                    ) : markedForDelete ? (
                      <>
                        <button
                          onClick={() => handleCancelDelete(image.id)}
                          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Cancelar Exclusão
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => fileInputRefs.current[image.id]?.click()}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Selecionar
                        </button>
                        
                        {image.currentPath && image.currentPath !== '/imagens/placeholder.png' && (
                          <button
                            onClick={() => handleMarkForDelete(image.id, image.description)}
                            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center"
                            title="Marcar para apagar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {/* Hidden File Input */}
                  <input
                    ref={(el) => {
                      fileInputRefs.current[image.id] = el
                    }}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileSelect(image.id, file)
                    }}
                    className="hidden"
                  />
                </div>
              </div>
            )
          })}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhuma imagem encontrada</p>
          </div>
        )}
      </main>
    </div>
  )
}

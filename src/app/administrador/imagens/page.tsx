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
      
      // IMPORTANTE: Usar APENAS o caminho retornado pelo GitHub (com extensão real)
      // Se não existir no GitHub, currentPath será undefined (não usar fallback do config)
      const imagesWithUrls = siteImagesConfig.map(img => ({
        id: img.id,
        description: img.description,
        currentPath: githubImages[img.id] || undefined, // SEM fallback - usar apenas o que existe no GitHub
        recommendedSize: img.recommendedSize,
        category: img.category,
        subcategory: img.subcategory,
      }))
      
      setSiteImages(imagesWithUrls)
    } catch (error) {
      console.error('Erro ao carregar imagens:', error)
      // Em caso de erro, não usar fallback - deixar currentPath como undefined
      const imagesWithUrls = siteImagesConfig.map(img => ({
        id: img.id,
        description: img.description,
        currentPath: undefined, // Não usar fallback
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
    if (pendingImages.length === 0 && pendingDeletes.length === 0) {
      alert('Nenhuma alteração para publicar')
      return
    }

    const uploadCount = pendingImages.length
    const deleteCount = pendingDeletes.length
    let confirmMessage = ''
    
    if (uploadCount > 0 && deleteCount > 0) {
      confirmMessage = `Você vai publicar ${uploadCount} imagem(ns) nova(s) e apagar ${deleteCount} imagem(ns). O site será atualizado em ~2 minutos. Deseja continuar?`
    } else if (uploadCount > 0) {
      confirmMessage = `Você vai publicar ${uploadCount} imagem(ns). O site será atualizado em ~2 minutos. Deseja continuar?`
    } else {
      confirmMessage = `Você vai apagar ${deleteCount} imagem(ns). O site será atualizado em ~2 minutos. Deseja continuar?`
    }

    if (!confirm(confirmMessage)) {
      return
    }

    setIsPublishing(true)

    try {
      // Usar API unificada que faz tudo em 1 único commit
      const formData = new FormData()
      
      // Adicionar uploads
      pendingImages.forEach(({ imageId, file }) => {
        formData.append('files', file)
        formData.append('imageIds', imageId)
      })
      
      // Adicionar deletes
      pendingDeletes.forEach(({ imageId }) => {
        formData.append('deleteIds', imageId)
      })
      
      const response = await fetch('/api/batch-images-github', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Erro no batch unificado')
      }
      
      const result = await response.json()

      // Limpar tudo
      setPendingImages([])
      setPendingDeletes([])
      
      // Limpar inputs
      Object.values(fileInputRefs.current).forEach(input => {
        if (input) input.value = ''
      })

      // Recarregar imagens
      await loadImages()

      let successMessage = '✅ Alterações publicadas com sucesso!\n\n🔄 O site será atualizado automaticamente em ~2 minutos.'
      
      if (uploadCount > 0 && deleteCount > 0) {
        successMessage = `✅ ${uploadCount} imagem(ns) publicada(s) e ${deleteCount} imagem(ns) apagada(s) com sucesso!\n\n🔄 O site será atualizado automaticamente em ~2 minutos.`
      } else if (uploadCount > 0) {
        successMessage = `✅ ${uploadCount} imagem(ns) publicada(s) com sucesso!\n\n🔄 O site será atualizado automaticamente em ~2 minutos.`
      } else {
        successMessage = `✅ ${deleteCount} imagem(ns) apagada(s) com sucesso!\n\n🔄 O site será atualizado automaticamente em ~2 minutos.`
      }

      alert(successMessage)
      
    } catch (error) {
      console.error('Erro ao publicar alterações:', error)
      alert('❌ Erro ao publicar algumas alterações. Tente novamente.')
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

  // Função para extrair extensão do arquivo
  const getFileExtension = (fileOrUrl: File | string): string => {
    if (typeof fileOrUrl === 'string') {
      // É uma URL ou caminho - remover query parameters e hash primeiro
      let cleanPath = fileOrUrl.split('?')[0].split('#')[0]
      
      // Encontrar a última extensão válida (após o último ponto)
      const lastDot = cleanPath.lastIndexOf('.')
      if (lastDot > 0 && lastDot < cleanPath.length - 1) {
        const ext = cleanPath.substring(lastDot + 1).toLowerCase()
        // Validar que é uma extensão válida (apenas letras e números, 2-5 caracteres)
        // Inclui extensões como: jpg, png, gif, webp, avif, svg, etc.
        if (/^[a-z0-9]{2,5}$/.test(ext)) {
          return `.${ext}`
        }
      }
      return ''
    } else {
      // É um File object
      const name = fileOrUrl.name
      const lastDot = name.lastIndexOf('.')
      return lastDot > 0 ? name.substring(lastDot).toLowerCase() : ''
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
        {/* Botão Unificado para Todas as Alterações */}
        {(pendingImages.length > 0 || pendingDeletes.length > 0) && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-400 rounded-lg p-4 mb-6 sticky top-4 z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-800 mb-1">
                  📝 Alterações Pendentes
                </p>
                <p className="text-xs text-purple-700">
                  {pendingImages.length > 0 && pendingDeletes.length > 0 ? (
                    <>
                      📸 {pendingImages.length} imagem(ns) para publicar • 🗑️ {pendingDeletes.length} imagem(ns) para apagar
                    </>
                  ) : pendingImages.length > 0 ? (
                    <>
                      📸 {pendingImages.length} imagem(ns) pronta(s) para publicar
                    </>
                  ) : (
                    <>
                      🗑️ {pendingDeletes.length} imagem(ns) marcada(s) para apagar
                    </>
                  )}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  Clique em "Publicar Todas as Alterações" para enviar tudo de uma vez (1 único rebuild de ~2min)
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
                    <span>Publicar Todas as Alterações</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>📋 Como usar:</strong> Selecione as imagens que deseja trocar ou apagar. 
            Você pode escolher várias imagens de uma vez e fazer uploads e exclusões juntos. 
            Quando terminar, clique em "Publicar Todas as Alterações" para enviar tudo de uma vez (1 único rebuild de ~2min).
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
                            loading="lazy"
                          />
                          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                            <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                              NOVA
                            </div>
                            <div className="bg-gray-800 bg-opacity-75 text-white text-xs font-medium px-2 py-1 rounded">
                              {getFileExtension(pending.file)}
                            </div>
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
                          {image.currentPath && image.currentPath !== '/imagens/placeholder.png' && (
                            <div className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-75 text-white text-xs font-medium px-2 py-1 rounded">
                              {getFileExtension(image.currentPath)}
                            </div>
                          )}
                        </>
                      ) : image.currentPath && image.currentPath !== '/imagens/placeholder.png' ? (
                        <>
                          <Image
                            src={image.currentPath}
                            alt={image.description}
                            fill
                            className="object-cover"
                            loading="lazy"
                            unoptimized
                          />
                          <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                            <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                              ATUAL
                            </div>
                            <div className="bg-gray-800 bg-opacity-75 text-white text-xs font-medium px-2 py-1 rounded">
                              {getFileExtension(image.currentPath)}
                            </div>
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

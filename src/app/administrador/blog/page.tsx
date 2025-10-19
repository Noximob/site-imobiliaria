'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, BookOpen, Plus, X, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { createArtigoWithImage, getAllArtigos, generateSlug, updateArtigoWithImage, deleteArtigo } from '@/lib/blog-github'
import { Artigo } from '@/types'

export default function AdminBlog() {
  const [artigos, setArtigos] = useState<Artigo[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingArtigo, setEditingArtigo] = useState<Artigo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [novoArtigo, setNovoArtigo] = useState({
    titulo: '',
    resumo: '',
    conteudo: '',
    categoria: '',
    autor: 'Equipe Nox',
    publicado: true
  })
  const [imagemFile, setImagemFile] = useState<File | null>(null)
  const [imagemPreview, setImagemPreview] = useState<string | null>(null)

  // Carregar artigos do GitHub
  useEffect(() => {
    const loadArtigos = async () => {
      try {
        const artigosGithub = await getAllArtigos()
        setArtigos(artigosGithub)
      } catch (error) {
        console.error('Erro ao carregar artigos:', error)
      }
    }
    loadArtigos()
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagemFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagemPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEdit = (artigo: Artigo) => {
    setEditingArtigo(artigo)
    setNovoArtigo({
      titulo: artigo.titulo,
      resumo: artigo.resumo,
      conteudo: artigo.conteudo,
      categoria: artigo.categoria,
      autor: artigo.autor,
      publicado: artigo.publicado
    })
    setImagemFile(null)
    setImagemPreview(null)
    setShowCreateForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este artigo?')) {
      try {
        await deleteArtigo(id)
        const artigosAtualizados = await getAllArtigos()
        setArtigos(artigosAtualizados)
        alert('Artigo excluído com sucesso!')
      } catch (error) {
        console.error('Erro ao excluir artigo:', error)
        alert('Erro ao excluir artigo: ' + error)
      }
    }
  }

  const resetForm = () => {
    setNovoArtigo({
      titulo: '',
      resumo: '',
      conteudo: '',
      categoria: '',
      autor: 'Equipe Nox',
      publicado: true
    })
    setImagemFile(null)
    setImagemPreview(null)
    setEditingArtigo(null)
    setShowCreateForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoArtigo.titulo || !novoArtigo.resumo || !novoArtigo.categoria || !novoArtigo.autor) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    // Para criação, imagem é obrigatória. Para edição, é opcional
    if (!editingArtigo && !imagemFile) {
      alert('Selecione uma imagem')
      return
    }

    setIsLoading(true)
    try {
      if (editingArtigo) {
        // Editar artigo existente
        const artigoData = {
          titulo: novoArtigo.titulo,
          slug: generateSlug(novoArtigo.titulo),
          resumo: novoArtigo.resumo,
          conteudo: novoArtigo.conteudo,
          autor: novoArtigo.autor,
          categoria: novoArtigo.categoria,
          tags: [],
          publicado: novoArtigo.publicado,
        }

        await updateArtigoWithImage(editingArtigo.id, artigoData, imagemFile || undefined)
        alert('Artigo atualizado com sucesso!')
      } else {
        // Criar novo artigo
        const artigoData = {
          titulo: novoArtigo.titulo,
          slug: generateSlug(novoArtigo.titulo),
          resumo: novoArtigo.resumo,
          conteudo: novoArtigo.conteudo,
          autor: novoArtigo.autor,
          categoria: novoArtigo.categoria,
          tags: [],
          publicado: novoArtigo.publicado,
          dataPublicacao: new Date()
        }

        await createArtigoWithImage(artigoData, imagemFile!)
        alert('Artigo criado com sucesso!')
      }
      
      // Recarregar artigos do Firebase
      const artigosAtualizados = await getAllArtigos()
      setArtigos(artigosAtualizados)
      
      // Resetar formulário
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar artigo:', error)
      alert('Erro ao salvar artigo: ' + error)
    } finally {
      setIsLoading(false)
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
              <BookOpen className="w-8 h-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Gerenciar Blog
              </h1>
            </div>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Artigo
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Formulário de Criação */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingArtigo ? 'Editar Artigo' : 'Criar Novo Artigo'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={novoArtigo.titulo}
                    onChange={(e) => setNovoArtigo({...novoArtigo, titulo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Digite o título do artigo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <input
                    type="text"
                    value={novoArtigo.categoria}
                    onChange={(e) => setNovoArtigo({...novoArtigo, categoria: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Ex: Dicas, Mercado, Financiamento..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Autor *
                  </label>
                  <input
                    type="text"
                    value={novoArtigo.autor}
                    onChange={(e) => setNovoArtigo({...novoArtigo, autor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Nome do autor"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resumo *
                </label>
                <textarea
                  value={novoArtigo.resumo}
                  onChange={(e) => setNovoArtigo({...novoArtigo, resumo: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Breve descrição do artigo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conteúdo
                </label>
                <textarea
                  value={novoArtigo.conteudo}
                  onChange={(e) => setNovoArtigo({...novoArtigo, conteudo: e.target.value})}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Conteúdo completo do artigo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagem {!editingArtigo && '*'}
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Tamanho sugerido: <span className="font-medium">1200 x 900px</span> (proporção 4:3). A imagem será otimizada automaticamente.
                  {editingArtigo && ' Deixe em branco para manter a imagem atual.'}
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required={!editingArtigo}
                />
                {(imagemPreview || (editingArtigo && editingArtigo.imagem)) && (
                  <div className="mt-4">
                    <img
                      src={imagemPreview || editingArtigo?.imagem || ''}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="publicado"
                  checked={novoArtigo.publicado}
                  onChange={(e) => setNovoArtigo({...novoArtigo, publicado: e.target.checked})}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="publicado" className="ml-2 block text-sm text-gray-900">
                  Publicar imediatamente
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Salvando...' : (editingArtigo ? 'Atualizar Artigo' : 'Salvar Artigo')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Artigos */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Artigos ({artigos.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {artigos.map((artigo) => (
              <div key={artigo.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {artigo.titulo}
                      </h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        artigo.publicado 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {artigo.publicado ? 'Publicado' : 'Rascunho'}
                      </span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {artigo.categoria}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">
                      {artigo.resumo}
                    </p>
                    <div className="text-sm text-gray-500">
                      {formatDate(artigo.dataPublicacao)} • {artigo.visualizacoes} visualizações
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button 
                      onClick={() => handleEdit(artigo)}
                      className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-md transition-colors"
                      title="Editar artigo"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(artigo.id)}
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                      title="Excluir artigo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

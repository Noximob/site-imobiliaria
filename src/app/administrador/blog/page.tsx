'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, BookOpen, Plus, Edit, Trash2, Eye, Calendar, User, X, Save } from 'lucide-react'
import Link from 'next/link'
import { Artigo } from '@/types'
import { createArtigoWithImage, generateSlug, getAllArtigos } from '@/lib/blog'

export default function AdminBlog() {
  const [artigos, setArtigos] = useState<Artigo[]>([])

  const [searchTerm, setSearchTerm] = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState('todas')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [novoArtigo, setNovoArtigo] = useState({
    titulo: '',
    resumo: '',
    conteudo: '',
    autor: 'Equipe Nox',
    categoria: 'Dicas',
    tags: '',
    publicado: true
  })
  const [imagemFile, setImagemFile] = useState<File | null>(null)
  const [imagemPreview, setImagemPreview] = useState<string | null>(null)

  const categorias = ['todas', 'Dicas', 'Mercado', 'Financiamento', 'Decoração']

  // Carregar artigos do Firebase quando a página carregar
  useEffect(() => {
    const loadArtigos = async () => {
      try {
        const artigosFirebase = await getAllArtigos()
        setArtigos(artigosFirebase)
      } catch (error) {
        console.error('Erro ao carregar artigos:', error)
      }
    }
    loadArtigos()
  }, [])

  const filteredArtigos = artigos.filter(artigo => {
    const matchesSearch = artigo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artigo.resumo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = categoriaFilter === 'todas' || artigo.categoria === categoriaFilter
    const matchesStatus = statusFilter === 'todos' || 
                         (statusFilter === 'publicados' && artigo.publicado) ||
                         (statusFilter === 'rascunhos' && !artigo.publicado)
    return matchesSearch && matchesCategoria && matchesStatus
  })

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('pt-BR')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoArtigo.titulo || !novoArtigo.resumo || !novoArtigo.conteudo || !imagemFile) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    setIsLoading(true)
    try {
      const artigoData = {
        titulo: novoArtigo.titulo,
        slug: generateSlug(novoArtigo.titulo),
        resumo: novoArtigo.resumo,
        conteudo: novoArtigo.conteudo,
        autor: novoArtigo.autor,
        categoria: novoArtigo.categoria,
        tags: novoArtigo.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        publicado: novoArtigo.publicado,
        dataPublicacao: new Date()
      }

      const id = await createArtigoWithImage(artigoData, imagemFile)
      
      // Recarregar lista de artigos do Firebase
      const artigosAtualizados = await getAllArtigos()
      setArtigos(artigosAtualizados)
      
      // Resetar formulário
      setNovoArtigo({
        titulo: '',
        resumo: '',
        conteudo: '',
        autor: 'Equipe Nox',
        categoria: 'Dicas',
        tags: '',
        publicado: true
      })
      setImagemFile(null)
      setImagemPreview(null)
      setShowCreateModal(false)
      
      alert('Artigo criado com sucesso!')
    } catch (error) {
      console.error('Erro ao criar artigo:', error)
      alert('Erro ao criar artigo: ' + error)
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
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Artigo
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{artigos.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Publicados</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {artigos.filter(a => a.publicado).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Rascunhos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {artigos.filter(a => !a.publicado).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Visualizações</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {artigos.reduce((total, artigo) => total + artigo.visualizacoes, 0)}
                </p>
              </div>
            </div>
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
                placeholder="Título, resumo..."
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
                value={categoriaFilter}
                onChange={(e) => setCategoriaFilter(e.target.value)}
              >
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>
                    {categoria === 'todas' ? 'Todas' : categoria}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="publicados">Publicados</option>
                <option value="rascunhos">Rascunhos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Artigos List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Artigos ({filteredArtigos.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredArtigos.map((artigo) => (
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
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {artigo.autor}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(artigo.dataPublicacao)}
                      </div>
                      <div>
                        {artigo.visualizacoes} visualizações
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-md transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal de Criação */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Criar Novo Artigo
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                    Categoria
                  </label>
                  <select
                    value={novoArtigo.categoria}
                    onChange={(e) => setNovoArtigo({...novoArtigo, categoria: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Dicas">Dicas</option>
                    <option value="Mercado">Mercado</option>
                    <option value="Financiamento">Financiamento</option>
                    <option value="Decoração">Decoração</option>
                  </select>
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
                  Conteúdo *
                </label>
                <textarea
                  value={novoArtigo.conteudo}
                  onChange={(e) => setNovoArtigo({...novoArtigo, conteudo: e.target.value})}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Conteúdo completo do artigo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagem *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                {imagemPreview && (
                  <div className="mt-4">
                    <img
                      src={imagemPreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    value={novoArtigo.tags}
                    onChange={(e) => setNovoArtigo({...novoArtigo, tags: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="imóveis, dicas, mercado"
                  />
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
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Artigo
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

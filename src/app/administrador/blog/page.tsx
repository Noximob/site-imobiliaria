'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, BookOpen, Plus, X, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { createArtigo, getAllArtigos, generateSlug } from '@/lib/blog'

export default function AdminBlog() {
  const [artigos, setArtigos] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [novoArtigo, setNovoArtigo] = useState({
    titulo: '',
    resumo: '',
    conteudo: '',
    categoria: 'Dicas',
    publicado: true
  })

  // Carregar artigos do Firebase
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoArtigo.titulo || !novoArtigo.resumo) {
      alert('Preencha título e resumo')
      return
    }

    setIsLoading(true)
    try {
      const artigoData = {
        titulo: novoArtigo.titulo,
        slug: generateSlug(novoArtigo.titulo),
        resumo: novoArtigo.resumo,
        conteudo: novoArtigo.conteudo,
        imagem: '', // Por enquanto sem imagem
        autor: 'Equipe Nox',
        categoria: novoArtigo.categoria,
        tags: [],
        publicado: novoArtigo.publicado,
        dataPublicacao: new Date()
      }

      await createArtigo(artigoData)
      
      // Recarregar artigos do Firebase
      const artigosAtualizados = await getAllArtigos()
      setArtigos(artigosAtualizados)
      
      // Resetar formulário
      setNovoArtigo({
        titulo: '',
        resumo: '',
        conteudo: '',
        categoria: 'Dicas',
        publicado: true
      })
      setShowCreateForm(false)
      
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
                Criar Novo Artigo
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
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
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Salvando...' : 'Salvar Artigo'}
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
    </div>
  )
}

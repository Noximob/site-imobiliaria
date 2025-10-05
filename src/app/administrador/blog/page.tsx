'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Plus, Edit, Trash2, Eye, Calendar, User } from 'lucide-react'
import Link from 'next/link'

export default function AdminBlog() {
  const [artigos, setArtigos] = useState([
    {
      id: '1',
      titulo: 'Dicas para Comprar seu Primeiro Imóvel',
      slug: 'dicas-para-comprar-primeiro-imovel',
      resumo: 'Guia completo com todas as informações necessárias para quem está comprando o primeiro imóvel.',
      autor: 'Equipe Nox',
      publicado: true,
      dataPublicacao: '2024-01-15',
      visualizacoes: 1250,
      categoria: 'Dicas'
    },
    {
      id: '2',
      titulo: 'Tendências do Mercado Imobiliário 2024',
      slug: 'tendencias-mercado-imobiliario-2024',
      resumo: 'Análise das principais tendências e projeções para o mercado imobiliário neste ano.',
      autor: 'Equipe Nox',
      publicado: true,
      dataPublicacao: '2024-01-10',
      visualizacoes: 890,
      categoria: 'Mercado'
    },
    {
      id: '3',
      titulo: 'Como Escolher o Bairro Ideal',
      slug: 'como-escolher-bairro-ideal',
      resumo: 'Fatores importantes a considerar na hora de escolher onde morar.',
      autor: 'Equipe Nox',
      publicado: false,
      dataPublicacao: '2024-01-20',
      visualizacoes: 0,
      categoria: 'Dicas'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState('todas')
  const [statusFilter, setStatusFilter] = useState('todos')

  const categorias = ['todas', 'Dicas', 'Mercado', 'Financiamento', 'Decoração']

  const filteredArtigos = artigos.filter(artigo => {
    const matchesSearch = artigo.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         artigo.resumo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = categoriaFilter === 'todas' || artigo.categoria === categoriaFilter
    const matchesStatus = statusFilter === 'todos' || 
                         (statusFilter === 'publicados' && artigo.publicado) ||
                         (statusFilter === 'rascunhos' && !artigo.publicado)
    return matchesSearch && matchesCategoria && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
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
            <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center">
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
    </div>
  )
}

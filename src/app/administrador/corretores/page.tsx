'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Edit, Trash2, Upload, X, Save } from 'lucide-react'

interface Corretor {
  id: string
  nome: string
  cargo: string
  creci: string
  telefone: string
  instagram?: string
  email: string
  foto: string
  ativo: boolean
  createdAt: string
  updatedAt: string
}

interface CorretorFormData {
  nome: string
  cargo: string
  creci: string
  telefone: string
  instagram: string
  email: string
  foto: string
  ativo: boolean
}

export default function CorretoresAdmin() {
  const router = useRouter()
  const [corretores, setCorretores] = useState<Corretor[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CorretorFormData>({
    nome: '',
    cargo: 'Corretor(a) de imóveis',
    creci: '',
    telefone: '',
    instagram: '',
    email: '',
    foto: '',
    ativo: true
  })
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Carregar corretores
  const loadCorretores = async () => {
    try {
      const response = await fetch('/api/corretores')
      const data = await response.json()
      setCorretores(data)
    } catch (error) {
      console.error('Erro ao carregar corretores:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCorretores()
  }, [])

  // Upload de foto
  const handlePhotoUpload = async (file: File, corretorId?: string) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (corretorId) {
        formData.append('corretorId', corretorId)
      } else {
        formData.append('corretorId', Date.now().toString())
      }

      const response = await fetch('/api/upload-corretor-foto', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (result.success) {
        setFormData(prev => ({ ...prev, foto: result.imageUrl }))
        return result.imageUrl
      } else {
        throw new Error(result.error || 'Erro no upload')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload da foto')
      return null
    } finally {
      setUploading(false)
    }
  }

  // Salvar corretor
  const handleSave = async () => {
    if (!formData.nome || !formData.creci || !formData.telefone || !formData.email) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    try {
      if (editingId) {
        // Atualizar
        await fetch('/api/corretores', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, id: editingId })
        })
      } else {
        // Criar
        await fetch('/api/corretores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }

      await loadCorretores()
      resetForm()
      alert('Corretor salvo com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar corretor')
    }
  }

  // Editar corretor
  const handleEdit = (corretor: Corretor) => {
    setFormData({
      nome: corretor.nome,
      cargo: corretor.cargo,
      creci: corretor.creci,
      telefone: corretor.telefone,
      instagram: corretor.instagram || '',
      email: corretor.email,
      foto: corretor.foto,
      ativo: corretor.ativo
    })
    setEditingId(corretor.id)
    setIsEditing(true)
  }

  // Deletar corretor
  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja deletar ${nome}?`)) return

    try {
      await fetch(`/api/corretores?id=${id}`, { method: 'DELETE' })
      await loadCorretores()
      alert('Corretor deletado com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar:', error)
      alert('Erro ao deletar corretor')
    }
  }

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      nome: '',
      cargo: 'Corretor(a) de imóveis',
      creci: '',
      telefone: '',
      instagram: '',
      email: '',
      foto: '',
      ativo: true
    })
    setIsEditing(false)
    setEditingId(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando corretores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/administrador')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Gerenciar Corretores</h1>
            </div>
            <button
              onClick={resetForm}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Corretor
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {isEditing ? 'Editar Corretor' : 'Adicionar Corretor'}
              </h2>

              <div className="space-y-4">
                {/* Foto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto
                  </label>
                  <div className="flex items-center space-x-4">
                    {formData.foto && (
                      <img
                        src={formData.foto}
                        alt="Preview"
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            await handlePhotoUpload(file)
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 flex items-center text-sm"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? 'Enviando...' : 'Escolher Foto'}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Tamanho recomendado: 400x500px
                  </p>
                </div>

                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ex: João Silva"
                  />
                </div>

                {/* Cargo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo *
                  </label>
                  <input
                    type="text"
                    value={formData.cargo}
                    onChange={(e) => setFormData(prev => ({ ...prev, cargo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ex: Corretor de imóveis"
                  />
                </div>

                {/* CRECI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CRECI *
                  </label>
                  <input
                    type="text"
                    value={formData.creci}
                    onChange={(e) => setFormData(prev => ({ ...prev, creci: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ex: 12345"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone *
                  </label>
                  <input
                    type="text"
                    value={formData.telefone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ex: (47) 99999-9999"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instagram
                  </label>
                  <input
                    type="text"
                    value={formData.instagram}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ex: @joaosilva"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ex: joao@noximob.com.br"
                  />
                </div>

                {/* Ativo */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={formData.ativo}
                    onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="ativo" className="ml-2 block text-sm text-gray-700">
                    Ativo
                  </label>
                </div>

                {/* Botões */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 flex items-center justify-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Atualizar' : 'Salvar'}
                  </button>
                  {isEditing && (
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Corretores */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Corretores ({corretores.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {corretores.length === 0 ? (
                  <div className="px-6 py-8 text-center text-gray-500">
                    <p>Nenhum corretor cadastrado</p>
                    <p className="text-sm">Adicione o primeiro corretor usando o formulário ao lado</p>
                  </div>
                ) : (
                  corretores.map((corretor) => (
                    <div key={corretor.id} className="px-6 py-4 flex items-center space-x-4">
                      <img
                        src={corretor.foto || '/placeholder-corretor.jpg'}
                        alt={corretor.nome}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {corretor.nome}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {corretor.cargo} • CRECI: {corretor.creci}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {corretor.telefone} • {corretor.email}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          corretor.ativo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {corretor.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                        <button
                          onClick={() => handleEdit(corretor)}
                          className="p-2 text-gray-400 hover:text-purple-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(corretor.id, corretor.nome)}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Loader2, XCircle, CheckCircle, MessageSquare } from 'lucide-react'
import { useDepoimentos } from '@/lib/depoimentos'
import type { Depoimento } from '@/lib/depoimentos-data'

interface DepoimentoFormData {
  nome: string
  comentario: string
  ativo: boolean
}

export default function DepoimentosAdminPage() {
  const { depoimentos, loading, error, refreshDepoimentos } = useDepoimentos()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentDepoimento, setCurrentDepoimento] = useState<DepoimentoFormData | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const validateForm = (data: DepoimentoFormData): Record<string, string> => {
    const errors: Record<string, string> = {}

    if (!data.nome.trim()) {
      errors.nome = 'Nome é obrigatório'
    } else if (data.nome.trim().length < 2) {
      errors.nome = 'Nome deve ter pelo menos 2 caracteres'
    }

    if (!data.comentario.trim()) {
      errors.comentario = 'Comentário é obrigatório'
    } else if (data.comentario.trim().length < 10) {
      errors.comentario = 'Comentário deve ter pelo menos 10 caracteres'
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentDepoimento) return

    const errors = validateForm(currentDepoimento)
    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const url = '/api/depoimentos'
      const method = currentDepoimento.nome ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentDepoimento),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar depoimento')
      }

      await refreshDepoimentos()
      setIsModalOpen(false)
      setCurrentDepoimento(null)
      setFormErrors({})
    } catch (error) {
      console.error('Erro ao salvar depoimento:', error)
      alert('Erro ao salvar depoimento. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (depoimento: Depoimento) => {
    setCurrentDepoimento({
      nome: depoimento.nome,
      comentario: depoimento.comentario,
      ativo: depoimento.ativo
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o depoimento de ${nome}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/depoimentos?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir depoimento')
      }

      await refreshDepoimentos()
    } catch (error) {
      console.error('Erro ao excluir depoimento:', error)
      alert('Erro ao excluir depoimento. Tente novamente.')
    }
  }

  const handleAddNew = () => {
    setCurrentDepoimento({
      nome: '',
      comentario: '',
      ativo: true
    })
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando depoimentos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Erro ao carregar depoimentos</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <MessageSquare className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">
            Gerenciar Depoimentos
          </h1>
        </div>
        <p className="text-gray-600">
          Gerencie os depoimentos dos clientes que aparecem na página principal.
        </p>
      </div>

      {/* Botão Adicionar */}
      <div className="mb-6">
        <button
          onClick={handleAddNew}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Depoimento
        </button>
      </div>

      {/* Lista de Depoimentos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {depoimentos.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum depoimento encontrado</p>
            <p className="text-gray-400 text-sm mt-2">
              Clique em "Adicionar Depoimento" para começar
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {depoimentos.map((depoimento) => (
              <div key={depoimento.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">
                        {depoimento.nome}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        depoimento.ativo
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {depoimento.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      "{depoimento.comentario.length > 100 
                        ? `${depoimento.comentario.substring(0, 100)}...` 
                        : depoimento.comentario}"
                    </p>
                    <p className="text-xs text-gray-400">
                      Criado em: {new Date(depoimento.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(depoimento)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Editar depoimento"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(depoimento.id, depoimento.nome)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Excluir depoimento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Adição/Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {currentDepoimento?.nome ? 'Editar Depoimento' : 'Adicionar Novo Depoimento'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  value={currentDepoimento?.nome || ''}
                  onChange={(e) => setCurrentDepoimento(prev => 
                    prev ? { ...prev, nome: e.target.value } : null
                  )}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    formErrors.nome ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: João Silva"
                />
                {formErrors.nome && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.nome}</p>
                )}
              </div>

              {/* Comentário */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comentário *
                </label>
                <textarea
                  value={currentDepoimento?.comentario || ''}
                  onChange={(e) => setCurrentDepoimento(prev => 
                    prev ? { ...prev, comentario: e.target.value } : null
                  )}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    formErrors.comentario ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: A Nox Imóveis me ajudou a encontrar o imóvel perfeito..."
                />
                {formErrors.comentario && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.comentario}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {currentDepoimento?.comentario.length || 0} caracteres
                </p>
              </div>

              {/* Status Ativo */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ativo"
                  checked={currentDepoimento?.ativo || false}
                  onChange={(e) => setCurrentDepoimento(prev => 
                    prev ? { ...prev, ativo: e.target.checked } : null
                  )}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="ativo" className="ml-2 block text-sm text-gray-700">
                  Depoimento ativo (aparece no site)
                </label>
              </div>

              {/* Botões */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setCurrentDepoimento(null)
                    setFormErrors({})
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="w-5 h-5 mr-2" />
                  )}
                  {currentDepoimento?.nome ? 'Salvar Alterações' : 'Adicionar Depoimento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

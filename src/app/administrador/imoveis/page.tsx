'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Building, Edit, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/imoveis'

interface ImovelAdmin {
  id: string
  titulo: string
  preco: number
  tipo: string
  status: string
  cidade: string
  publicado: boolean
  fonteDWV?: boolean
}

export default function AdminImoveis() {
  const [imoveis, setImoveis] = useState<ImovelAdmin[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadImoveis = async () => {
      try {
        const response = await fetch('/api/imoveis-github', {
          cache: 'no-store'
        })
        
        if (!response.ok) {
          console.error('Erro ao buscar imóveis')
          return
        }

        const data = await response.json()
        // Converter para formato simplificado
        const imoveisFormatados = data.map((imovel: any) => ({
          id: imovel.id,
          titulo: imovel.titulo || 'Sem título',
          preco: imovel.preco || 0,
          tipo: imovel.tipo || 'apartamento',
          status: imovel.status || 'lancamento',
          cidade: imovel.endereco?.cidade || 'penha',
          publicado: imovel.publicado !== false,
          fonteDWV: imovel.fonteDWV || false,
        }))
        
        // Ordenar por data de criação (mais recentes primeiro)
        imoveisFormatados.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt || 0).getTime()
          const dateB = new Date(b.createdAt || 0).getTime()
          return dateB - dateA
        })
        
        setImoveis(imoveisFormatados)
      } catch (error) {
        console.error('Erro ao carregar imóveis:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadImoveis()
  }, [])

  const getTipoLabel = (tipo: string) => {
    const tipos: { [key: string]: string } = {
      'apartamento': 'Apartamento',
      'casa': 'Casa',
      'terreno': 'Terreno',
      'comercial': 'Comercial',
      'cobertura': 'Cobertura',
    }
    return tipos[tipo] || tipo
  }

  const getStatusLabel = (status: string) => {
    const statusLabels: { [key: string]: string } = {
      'lancamento': 'Lançamento',
      'em-construcao': 'Em Construção',
      'prontos': 'Prontos',
    }
    return statusLabels[status] || status
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/administrador"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Voltar</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building className="w-6 h-6" />
                Gerenciar Imóveis
              </h1>
            </div>
            <Link
              href="/administrador/imoveis/novo"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm"
            >
              <Building className="w-4 h-4" />
              Novo Imóvel
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Carregando imóveis...</p>
          </div>
        ) : imoveis.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600 mb-4">Nenhum imóvel encontrado.</p>
            <Link
              href="/administrador/imoveis/novo"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              <Building className="w-5 h-5" />
              Adicionar Primeiro Imóvel
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                Lista de Imóveis ({imoveis.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {imoveis.map((imovel) => (
                <div
                  key={imovel.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-base font-medium text-gray-900 truncate">
                          {imovel.titulo}
                        </h3>
                        {imovel.fonteDWV && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            DWV
                          </span>
                        )}
                        {!imovel.publicado && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            Rascunho
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-semibold text-purple-600">
                          {formatPrice(imovel.preco)}
                        </span>
                        <span>•</span>
                        <span>{getTipoLabel(imovel.tipo)}</span>
                        <span>•</span>
                        <span>{getStatusLabel(imovel.status)}</span>
                        <span>•</span>
                        <span className="capitalize">{imovel.cidade.replace('-', ' ')}</span>
                        <span>•</span>
                        <span className="text-xs text-gray-500">ID: {imovel.id}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/administrador/imoveis/${imovel.id}/editar`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
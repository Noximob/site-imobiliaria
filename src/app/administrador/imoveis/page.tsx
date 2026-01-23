'use client'

import { ArrowLeft, Building } from 'lucide-react'
import Link from 'next/link'

export default function AdminImoveis() {
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
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/administrador/imoveis/novo"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            <Building className="w-5 h-5" />
            Adicionar Novo Imóvel
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-amber-100 mb-6">
              <Building className="h-12 w-12 text-amber-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Lista de Imóveis
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              A listagem de imóveis será implementada em breve.
            </p>
            <p className="text-sm text-gray-500">
              Por enquanto, use o botão acima para adicionar novos imóveis.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
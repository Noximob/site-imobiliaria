'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Home, Building, List, Filter } from 'lucide-react'

export default function SearchForm() {
  const router = useRouter()
  const [filtros, setFiltros] = useState({
    tipo: '',
    cidade: '',
    status: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Construir query string com filtros
    const params = new URLSearchParams()
    
    Object.entries(filtros).forEach(([key, value]) => {
      if (value) {
        params.append(key, value)
      }
    })
    
    // Redirecionar para página de imóveis com filtros
    router.push(`/imoveis?${params.toString()}`)
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltros(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="w-full">
      {/* Formulário Principal - 3 campos horizontais */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-4 mb-4">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* TIPO */}
          <div className="flex-1">
            <select
              name="tipo"
              value={filtros.tipo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              <option value="">TIPO</option>
              <option value="apartamento">Apartamento</option>
              <option value="cobertura">Cobertura/Diferenciado</option>
              <option value="comercial">Salas Comerciais</option>
            </select>
          </div>

          {/* CIDADE */}
          <div className="flex-1">
            <select
              name="cidade"
              value={filtros.cidade}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              <option value="">CIDADE</option>
              <option value="penha">Penha</option>
              <option value="balneario-picarras">Balneário Piçarras</option>
              <option value="barra-velha">Barra Velha</option>
            </select>
          </div>

          {/* STATUS */}
          <div className="flex-1">
            <select
              name="status"
              value={filtros.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              <option value="">STATUS</option>
              <option value="lancamento">Lançamento/em construção</option>
              <option value="prontos">Imóveis Prontos</option>
            </select>
          </div>

          {/* Botão BUSCAR */}
          <div className="flex-shrink-0">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2 text-sm"
            >
              <Search className="w-5 h-5" />
              <span>BUSCAR</span>
            </button>
          </div>
        </div>
      </form>

      {/* Botões de Busca Adicional - 3 botões horizontais */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {/* Avançado */}
        <button className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors duration-200">
          <Filter className="w-5 h-5" />
          <span>Avançado</span>
        </button>

        {/* Por código */}
        <button className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors duration-200">
          <List className="w-5 h-5" />
          <span>Por código</span>
        </button>

        {/* Empreendimentos */}
        <button className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors duration-200">
          <Building className="w-5 h-5" />
          <span>Empreendimentos</span>
        </button>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Home, Building, List, Filter } from 'lucide-react'

export default function SearchForm() {
  const router = useRouter()
  const [filtros, setFiltros] = useState({
    tipo: '',
    cidade: '',
    bairro: ''
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
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* TIPO */}
          <div className="flex-1">
            <select
              name="tipo"
              value={filtros.tipo}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">TIPO</option>
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
              <option value="terreno">Terreno</option>
              <option value="comercial">Comercial</option>
            </select>
          </div>

          {/* CIDADE */}
          <div className="flex-1">
            <select
              name="cidade"
              value={filtros.cidade}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">CIDADE</option>
              <option value="penha">Penha</option>
              <option value="picarras">Piçarras</option>
              <option value="barra-velha">Barra Velha</option>
            </select>
          </div>

          {/* BAIRRO OU EMPREENDIMENTO */}
          <div className="flex-1">
            <select
              name="bairro"
              value={filtros.bairro}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">BAIRRO OU EMPREENDIMENTO</option>
              <option value="centro">Centro</option>
              <option value="praia">Praia</option>
              <option value="residencial">Residencial</option>
            </select>
          </div>

          {/* Botão BUSCAR */}
          <div className="flex-shrink-0">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2"
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

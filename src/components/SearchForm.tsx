'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Home, DollarSign } from 'lucide-react'

export default function SearchForm() {
  const router = useRouter()
  const [filtros, setFiltros] = useState({
    cidade: '',
    bairro: '',
    precoMin: '',
    precoMax: '',
    quartos: '',
    tipo: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Cidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cidade
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="cidade"
              value={filtros.cidade}
              onChange={handleChange}
              placeholder="Digite a cidade"
              className="input pl-10"
            />
          </div>
        </div>

        {/* Bairro */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bairro
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              name="bairro"
              value={filtros.bairro}
              onChange={handleChange}
              placeholder="Digite o bairro"
              className="input pl-10"
            />
          </div>
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo
          </label>
          <div className="relative">
            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              name="tipo"
              value={filtros.tipo}
              onChange={handleChange}
              className="input pl-10"
            >
              <option value="">Todos os tipos</option>
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
              <option value="terreno">Terreno</option>
              <option value="comercial">Comercial</option>
            </select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={filtros.status}
            onChange={handleChange}
            className="input"
          >
            <option value="">Venda e Aluguel</option>
            <option value="venda">Venda</option>
            <option value="aluguel">Aluguel</option>
            <option value="venda-aluguel">Venda e Aluguel</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Preço Mínimo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preço Mínimo
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="number"
              name="precoMin"
              value={filtros.precoMin}
              onChange={handleChange}
              placeholder="R$ 0"
              className="input pl-10"
            />
          </div>
        </div>

        {/* Preço Máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preço Máximo
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="number"
              name="precoMax"
              value={filtros.precoMax}
              onChange={handleChange}
              placeholder="R$ 1.000.000"
              className="input pl-10"
            />
          </div>
        </div>

        {/* Quartos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quartos
          </label>
          <select
            name="quartos"
            value={filtros.quartos}
            onChange={handleChange}
            className="input"
          >
            <option value="">Qualquer</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="btn-primary inline-flex items-center space-x-2 px-8 py-3 text-lg"
        >
          <Search className="w-5 h-5" />
          <span>Buscar Imóveis</span>
        </button>
      </div>
    </form>
  )
}

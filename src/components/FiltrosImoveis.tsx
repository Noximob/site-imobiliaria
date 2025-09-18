'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FiltrosImovel } from '@/types'
import { Search, X } from 'lucide-react'

interface FiltrosImoveisProps {
  filtrosIniciais: FiltrosImovel
}

export default function FiltrosImoveis({ filtrosIniciais }: FiltrosImoveisProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filtros, setFiltros] = useState<FiltrosImovel>(filtrosIniciais)

  useEffect(() => {
    setFiltros(filtrosIniciais)
  }, [filtrosIniciais])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    
    setFiltros(prev => ({
      ...prev,
      [name]: newValue
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    
    Object.entries(filtros).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== false) {
        params.append(key, String(value))
      }
    })
    
    router.push(`/imoveis?${params.toString()}`)
  }

  const clearFilters = () => {
    setFiltros({})
    router.push('/imoveis')
  }

  const hasActiveFilters = Object.values(filtros).some(value => 
    value !== undefined && value !== '' && value !== false
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cidade */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cidade
        </label>
        <input
          type="text"
          name="cidade"
          value={filtros.cidade || ''}
          onChange={handleChange}
          placeholder="Ex: Balneário Camboriú"
          className="input"
        />
      </div>

      {/* Bairro */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bairro
        </label>
        <input
          type="text"
          name="bairro"
          value={filtros.bairro || ''}
          onChange={handleChange}
          placeholder="Ex: Centro"
          className="input"
        />
      </div>

      {/* Tipo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo
        </label>
        <select
          name="tipo"
          value={filtros.tipo || ''}
          onChange={handleChange}
          className="input"
        >
          <option value="">Todos os tipos</option>
          <option value="casa">Casa</option>
          <option value="apartamento">Apartamento</option>
          <option value="terreno">Terreno</option>
          <option value="comercial">Comercial</option>
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          name="status"
          value={filtros.status || ''}
          onChange={handleChange}
          className="input"
        >
          <option value="">Venda e Aluguel</option>
          <option value="venda">Venda</option>
          <option value="aluguel">Aluguel</option>
          <option value="venda-aluguel">Venda e Aluguel</option>
        </select>
      </div>

      {/* Preço */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Faixa de Preço
        </label>
        <div className="space-y-3">
          <input
            type="number"
            name="precoMin"
            value={filtros.precoMin || ''}
            onChange={handleChange}
            placeholder="Preço mínimo"
            className="input"
          />
          <input
            type="number"
            name="precoMax"
            value={filtros.precoMax || ''}
            onChange={handleChange}
            placeholder="Preço máximo"
            className="input"
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
          value={filtros.quartos || ''}
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

      {/* Banheiros */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Banheiros
        </label>
        <select
          name="banheiros"
          value={filtros.banheiros || ''}
          onChange={handleChange}
          className="input"
        >
          <option value="">Qualquer</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      {/* Vagas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vagas
        </label>
        <select
          name="vagas"
          value={filtros.vagas || ''}
          onChange={handleChange}
          className="input"
        >
          <option value="">Qualquer</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      {/* Área */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Área (m²)
        </label>
        <div className="space-y-3">
          <input
            type="number"
            name="areaMin"
            value={filtros.areaMin || ''}
            onChange={handleChange}
            placeholder="Área mínima"
            className="input"
          />
          <input
            type="number"
            name="areaMax"
            value={filtros.areaMax || ''}
            onChange={handleChange}
            placeholder="Área máxima"
            className="input"
          />
        </div>
      </div>

      {/* Características Especiais */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Características
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="frenteMar"
              checked={filtros.frenteMar || false}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Frente Mar</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              name="piscina"
              checked={filtros.piscina || false}
              onChange={handleChange}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700">Piscina</span>
          </label>
        </div>
      </div>

      {/* Botões */}
      <div className="space-y-3">
        <button
          type="submit"
          className="w-full btn-primary flex items-center justify-center space-x-2"
        >
          <Search className="w-4 h-4" />
          <span>Filtrar</span>
        </button>
        
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="w-full btn-secondary flex items-center justify-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Limpar Filtros</span>
          </button>
        )}
      </div>
    </form>
  )
}

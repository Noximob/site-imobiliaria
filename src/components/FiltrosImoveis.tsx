'use client'

import { useState } from 'react'

interface FiltrosImoveisProps {
  onFiltrosChange?: (filtros: any) => void
}

export default function FiltrosImoveis({ onFiltrosChange }: FiltrosImoveisProps) {
  const [filtros, setFiltros] = useState({
    status: '',
    tipo: '',
    cidade: '',
    quartos: '',
    suites: '',
    banheiros: '',
    vagas: '',
    valorMin: '',
    valorMax: '',
    mobiliado: false,
    frenteMar: false,
    vistaMar: false,
    quadraMar: false,
    areaLazer: false
  })

  const handleInputChange = (field: string, value: any) => {
    const newFiltros = { ...filtros, [field]: value }
    setFiltros(newFiltros)
    onFiltrosChange?.(newFiltros)
  }

  const handleToggle = (field: string) => {
    const newFiltros = { ...filtros, [field]: !filtros[field as keyof typeof filtros] }
    setFiltros(newFiltros)
    onFiltrosChange?.(newFiltros)
  }

  const limparFiltros = () => {
    const filtrosLimpos = {
      status: '',
      tipo: '',
      cidade: '',
      quartos: '',
      suites: '',
      banheiros: '',
      vagas: '',
      valorMin: '',
      valorMax: '',
      mobiliado: false,
      frenteMar: false,
      vistaMar: false,
      quadraMar: false,
      areaLazer: false
    }
    setFiltros(filtrosLimpos)
    onFiltrosChange?.(filtrosLimpos)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Filtros</h3>
      
      {/* Dropdowns */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select 
            value={filtros.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Selecione</option>
            <option value="prontos">Imóveis Prontos</option>
            <option value="lancamento">Lançamento/em construção</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
          <select 
            value={filtros.tipo}
            onChange={(e) => handleInputChange('tipo', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Selecione</option>
            <option value="apartamento">Apartamento</option>
            <option value="cobertura">Cobertura/Diferenciado</option>
            <option value="comercial">Salas Comerciais</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
          <select 
            value={filtros.cidade}
            onChange={(e) => handleInputChange('cidade', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Selecione</option>
            <option value="penha">Penha</option>
            <option value="barra-velha">Barra Velha</option>
            <option value="balneario-picarras">Balneário Piçarras</option>
          </select>
        </div>
      </div>

      {/* Filtros numéricos */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quartos</label>
          <div className="flex gap-2">
            {['1', '2', '3', '4+'].map((qtd) => (
              <button
                key={qtd}
                onClick={() => handleInputChange('quartos', filtros.quartos === qtd ? '' : qtd)}
                className={`px-4 py-2 rounded-lg border ${
                  filtros.quartos === qtd 
                    ? 'bg-yellow-500 text-white border-yellow-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-yellow-500'
                }`}
              >
                {qtd}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Suítes</label>
          <div className="flex gap-2">
            {['1+', '2+', '3+', '4+'].map((qtd) => (
              <button
                key={qtd}
                onClick={() => handleInputChange('suites', filtros.suites === qtd ? '' : qtd)}
                className={`px-4 py-2 rounded-lg border ${
                  filtros.suites === qtd 
                    ? 'bg-yellow-500 text-white border-yellow-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-yellow-500'
                }`}
              >
                {qtd}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Banheiros</label>
          <div className="flex gap-2">
            {['1+', '2+', '3+', '4+'].map((qtd) => (
              <button
                key={qtd}
                onClick={() => handleInputChange('banheiros', filtros.banheiros === qtd ? '' : qtd)}
                className={`px-4 py-2 rounded-lg border ${
                  filtros.banheiros === qtd 
                    ? 'bg-yellow-500 text-white border-yellow-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-yellow-500'
                }`}
              >
                {qtd}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vagas</label>
          <div className="flex gap-2">
            {['1+', '2+', '3+', '4+'].map((qtd) => (
              <button
                key={qtd}
                onClick={() => handleInputChange('vagas', filtros.vagas === qtd ? '' : qtd)}
                className={`px-4 py-2 rounded-lg border ${
                  filtros.vagas === qtd 
                    ? 'bg-yellow-500 text-white border-yellow-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-yellow-500'
                }`}
              >
                {qtd}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Valores */}
      <div className="space-y-4 mb-6">
        <h4 className="text-lg font-semibold text-gray-800">Valores</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">De</label>
            <input
              type="number"
              value={filtros.valorMin}
              onChange={(e) => handleInputChange('valorMin', e.target.value)}
              placeholder="R$ 0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Até</label>
            <input
              type="number"
              value={filtros.valorMax}
              onChange={(e) => handleInputChange('valorMax', e.target.value)}
              placeholder="R$ 0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Comodidades */}
      <div className="space-y-4 mb-6">
        <h4 className="text-lg font-semibold text-gray-800">Comodidades</h4>
        <div className="space-y-3">
          {[
            { key: 'mobiliado', label: 'Mobiliado' },
            { key: 'frenteMar', label: 'Frente Mar' },
            { key: 'vistaMar', label: 'Vista Mar' },
            { key: 'quadraMar', label: 'Quadra Mar' },
            { key: 'areaLazer', label: 'Área de Lazer' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={filtros[key as keyof typeof filtros] as boolean}
                onChange={() => handleToggle(key)}
                className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Botões */}
      <div className="space-y-3">
        <button
          onClick={() => onFiltrosChange?.(filtros)}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          FILTRAR
        </button>
        
        <button
          onClick={limparFiltros}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  )
}
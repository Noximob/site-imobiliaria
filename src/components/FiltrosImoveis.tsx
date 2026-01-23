'use client'

import { useState, useEffect, useRef } from 'react'

interface FiltrosImoveisProps {
  onFiltrosChange?: (filtros: any) => void
  filtrosIniciais?: any
}

export default function FiltrosImoveis({ onFiltrosChange, filtrosIniciais }: FiltrosImoveisProps) {
  const [filtros, setFiltros] = useState({
    status: '',
    tipo: '',
    cidade: '',
    dataEntrega: [] as (string | number)[],
    quartos: [] as string[],
    banheiros: '',
    vagas: '',
    valorMin: '',
    valorMax: '',
    mobiliado: false,
    frenteMar: false,
    vistaMar: false,
    areaLazer: false,
    homeClub: false
  })

  // Aplicar filtros iniciais quando vierem da URL (sempre que mudarem)
  useEffect(() => {
    if (filtrosIniciais && Object.keys(filtrosIniciais).length > 0) {
      const novosFiltros = {
        status: filtrosIniciais.status || '',
        tipo: filtrosIniciais.tipo || '',
        cidade: filtrosIniciais.cidade || '',
        dataEntrega: Array.isArray(filtrosIniciais.dataEntrega) ? filtrosIniciais.dataEntrega : [],
        quartos: Array.isArray(filtrosIniciais.quartos) ? filtrosIniciais.quartos : [],
        banheiros: filtrosIniciais.banheiros || '',
        vagas: filtrosIniciais.vagas || '',
        valorMin: filtrosIniciais.valorMin || '',
        valorMax: filtrosIniciais.valorMax || '',
        areaMin: filtrosIniciais.areaMin || '',
        areaMax: filtrosIniciais.areaMax || '',
        mobiliado: filtrosIniciais.mobiliado || false,
        frenteMar: filtrosIniciais.frenteMar || false,
        vistaMar: filtrosIniciais.vistaMar || false,
        areaLazer: filtrosIniciais.areaLazer || false,
        homeClub: filtrosIniciais.homeClub || false
      }
      setFiltros(novosFiltros)
      onFiltrosChange?.(novosFiltros)
    } else if (filtrosIniciais && Object.keys(filtrosIniciais).length === 0) {
      // Se filtrosIniciais estiver vazio, limpar filtros
      const filtrosLimpos = {
        status: '',
        tipo: '',
        cidade: '',
        dataEntrega: [] as (string | number)[],
        quartos: [] as string[],
        banheiros: '',
        vagas: '',
        valorMin: '',
        valorMax: '',
        areaMin: '',
        areaMax: '',
        mobiliado: false,
        frenteMar: false,
        vistaMar: false,
        areaLazer: false,
        homeClub: false
      }
      setFiltros(filtrosLimpos)
      onFiltrosChange?.(filtrosLimpos)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtrosIniciais])

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
      dataEntrega: [] as (string | number)[],
      quartos: [] as string[],
      banheiros: '',
      vagas: '',
      valorMin: '',
      valorMax: '',
      mobiliado: false,
      frenteMar: false,
      vistaMar: false,
      areaLazer: false,
      homeClub: false
    }
    setFiltros(filtrosLimpos)
    onFiltrosChange?.(filtrosLimpos)
  }

  return (
    <div className="p-6 w-full">
      
      {/* Dropdowns */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select 
            value={filtros.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="prontos">Imóveis Prontos</option>
            <option value="lancamento">Lançamento/em construção</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
          <select 
            value={filtros.tipo}
            onChange={(e) => handleInputChange('tipo', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todos</option>
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todos</option>
            <option value="penha">Penha</option>
            <option value="barra-velha">Barra Velha</option>
            <option value="balneario-picarras">Balneário Piçarras</option>
          </select>
        </div>

        {/* Data de Entrega */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Data de Entrega</label>
          <div className="space-y-2">
            {/* Checkbox Entregues */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filtros.dataEntrega.includes('entregues')}
                onChange={(e) => {
                  const newDataEntrega = e.target.checked
                    ? [...filtros.dataEntrega, 'entregues']
                    : filtros.dataEntrega.filter(d => d !== 'entregues')
                  handleInputChange('dataEntrega', newDataEntrega)
                }}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Entregues</span>
            </label>
            
            {/* Anos */}
            <div className="flex flex-wrap gap-2">
              {[2026, 2027, 2028, 2029, 2030, 2031].map((ano) => {
                const isSelected = filtros.dataEntrega.includes(ano)
                return (
                  <button
                    key={ano}
                    type="button"
                    onClick={() => {
                      const newDataEntrega = isSelected
                        ? filtros.dataEntrega.filter(d => d !== ano)
                        : [...filtros.dataEntrega, ano]
                      handleInputChange('dataEntrega', newDataEntrega)
                    }}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                      isSelected
                        ? 'bg-purple-500 text-white border-purple-500' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500'
                    }`}
                  >
                    {ano}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Filtros numéricos */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quartos</label>
          <div className="flex gap-2">
            {['1', '2', '3', '4+'].map((qtd) => {
              const isSelected = filtros.quartos.includes(qtd)
              return (
                <button
                  key={qtd}
                  type="button"
                  onClick={() => {
                    const newQuartos = isSelected
                      ? filtros.quartos.filter(q => q !== qtd)
                      : [...filtros.quartos, qtd]
                    handleInputChange('quartos', newQuartos)
                  }}
                  className={`px-4 py-2 rounded-lg border ${
                    isSelected
                      ? 'bg-purple-500 text-white border-purple-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500'
                  }`}
                >
                  {qtd}
                </button>
              )
            })}
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
                    ? 'bg-purple-500 text-white border-purple-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500'
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
                    ? 'bg-purple-500 text-white border-purple-500' 
                    : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500'
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Até</label>
            <input
              type="number"
              value={filtros.valorMax}
              onChange={(e) => handleInputChange('valorMax', e.target.value)}
              placeholder="R$ 0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            { key: 'areaLazer', label: 'Área de Lazer' },
            { key: 'homeClub', label: 'Home Club completo' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={filtros[key as keyof typeof filtros] as boolean}
                onChange={() => handleToggle(key)}
                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
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
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
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
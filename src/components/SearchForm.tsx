'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Home, Building, List, Filter } from 'lucide-react'

export default function SearchForm() {
  const router = useRouter()
  const [mostrarAvancado, setMostrarAvancado] = useState(false)
  const [filtros, setFiltros] = useState({
    tipo: '',
    cidade: '',
    status: '',
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
    quadraMar: false,
    areaLazer: false,
    homeClub: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Construir query string com filtros
    const params = new URLSearchParams()
    
    // Campos básicos
    if (filtros.tipo) params.append('tipo', filtros.tipo)
    if (filtros.cidade) params.append('cidade', filtros.cidade)
    if (filtros.status) params.append('status', filtros.status)
    
    // Campos numéricos
    if (filtros.quartos.length > 0) {
      filtros.quartos.forEach(q => params.append('quartos', q))
    }
    if (filtros.banheiros) params.append('banheiros', filtros.banheiros)
    if (filtros.vagas) params.append('vagas', filtros.vagas)
    
    // Valores
    if (filtros.valorMin) params.append('valorMin', filtros.valorMin)
    if (filtros.valorMax) params.append('valorMax', filtros.valorMax)
    
    // Área
    if (filtros.areaMin) params.append('areaMin', filtros.areaMin)
    if (filtros.areaMax) params.append('areaMax', filtros.areaMax)
    
    // Comodidades (booleanos)
    if (filtros.mobiliado) params.append('mobiliado', 'true')
    if (filtros.frenteMar) params.append('frenteMar', 'true')
    if (filtros.vistaMar) params.append('vistaMar', 'true')
    if (filtros.quadraMar) params.append('quadraMar', 'true')
    if (filtros.areaLazer) params.append('areaLazer', 'true')
    if (filtros.homeClub) params.append('homeClub', 'true')
    
    // Redirecionar para página de imóveis com filtros
    router.push(`/imoveis?${params.toString()}`)
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFiltros(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleToggle = (field: 'mobiliado' | 'frenteMar' | 'vistaMar' | 'quadraMar' | 'areaLazer' | 'homeClub') => {
    setFiltros(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleQuartosToggle = (qtd: string) => {
    setFiltros(prev => {
      const isSelected = prev.quartos.includes(qtd)
      return {
        ...prev,
        quartos: isSelected
          ? prev.quartos.filter(q => q !== qtd)
          : [...prev.quartos, qtd]
      }
    })
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

      {/* Formulário Avançado - Expansível */}
      {mostrarAvancado && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4 transition-all duration-300">
          {/* Quartos, Banheiros, Vagas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Quartos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Quartos</label>
              <div className="flex gap-2 flex-wrap">
                {['1', '2', '3', '4+'].map((qtd) => {
                  const isSelected = filtros.quartos.includes(qtd)
                  return (
                    <button
                      key={qtd}
                      type="button"
                      onClick={() => handleQuartosToggle(qtd)}
                      className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500'
                      }`}
                    >
                      {qtd}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Banheiros */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Banheiros</label>
              <div className="flex gap-2 flex-wrap">
                {['1+', '2+', '3+', '4+'].map((qtd) => (
                  <button
                    key={qtd}
                    type="button"
                    onClick={() => setFiltros(prev => ({ ...prev, banheiros: prev.banheiros === qtd ? '' : qtd }))}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      filtros.banheiros === qtd 
                        ? 'bg-purple-600 text-white border-purple-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500'
                    }`}
                  >
                    {qtd}
                  </button>
                ))}
              </div>
            </div>

            {/* Vagas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Vagas</label>
              <div className="flex gap-2 flex-wrap">
                {['1+', '2+', '3+', '4+'].map((qtd) => (
                  <button
                    key={qtd}
                    type="button"
                    onClick={() => setFiltros(prev => ({ ...prev, vagas: prev.vagas === qtd ? '' : qtd }))}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      filtros.vagas === qtd 
                        ? 'bg-purple-600 text-white border-purple-600' 
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Valores</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  name="valorMin"
                  value={filtros.valorMin}
                  onChange={handleChange}
                  placeholder="Valor mínimo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <input
                  type="number"
                  name="valorMax"
                  value={filtros.valorMax}
                  onChange={handleChange}
                  placeholder="Valor máximo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Área */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Área (m²)</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  name="areaMin"
                  value={filtros.areaMin}
                  onChange={handleChange}
                  placeholder="Área mínima"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <input
                  type="number"
                  name="areaMax"
                  value={filtros.areaMax}
                  onChange={handleChange}
                  placeholder="Área máxima"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Comodidades - Toggles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Comodidades</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Mobiliado */}
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                <span className="text-sm text-gray-700">Mobiliado</span>
                <button
                  type="button"
                  onClick={() => handleToggle('mobiliado')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    filtros.mobiliado ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      filtros.mobiliado ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Frente Mar */}
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                <span className="text-sm text-gray-700">Frente Mar</span>
                <button
                  type="button"
                  onClick={() => handleToggle('frenteMar')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    filtros.frenteMar ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      filtros.frenteMar ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Vista Mar */}
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                <span className="text-sm text-gray-700">Vista Mar</span>
                <button
                  type="button"
                  onClick={() => handleToggle('vistaMar')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    filtros.vistaMar ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      filtros.vistaMar ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Quadra Mar */}
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                <span className="text-sm text-gray-700">Quadra Mar</span>
                <button
                  type="button"
                  onClick={() => handleToggle('quadraMar')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    filtros.quadraMar ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      filtros.quadraMar ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Área de Lazer */}
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                <span className="text-sm text-gray-700">Área de Lazer</span>
                <button
                  type="button"
                  onClick={() => handleToggle('areaLazer')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    filtros.areaLazer ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      filtros.areaLazer ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Home Club */}
              <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                <span className="text-sm text-gray-700">Home Club</span>
                <button
                  type="button"
                  onClick={() => handleToggle('homeClub')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    filtros.homeClub ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      filtros.homeClub ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botões de Busca Adicional - 3 botões horizontais */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {/* Avançado */}
        <button 
          type="button"
          onClick={() => setMostrarAvancado(!mostrarAvancado)}
          className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors duration-200"
        >
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

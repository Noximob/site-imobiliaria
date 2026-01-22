'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Home, Building, List, Filter, ArrowLeft } from 'lucide-react'

export default function SearchForm() {
  const router = useRouter()
  const [mostrarAvancado, setMostrarAvancado] = useState(false)
  const [modoCodigo, setModoCodigo] = useState(false)
  const [codigoImovel, setCodigoImovel] = useState('')
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
    dataEntrega: [] as (string | number)[],
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
    
    // Data de Entrega
    if (filtros.dataEntrega && filtros.dataEntrega.length > 0) {
      filtros.dataEntrega.forEach(d => {
        if (typeof d === 'string') {
          params.append('dataEntrega', d)
        } else {
          params.append('dataEntrega', d.toString())
        }
      })
    }
    
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

  const handleBuscarPorCodigo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!codigoImovel.trim()) return

    // Buscar imóvel pelo código (últimos 5 dígitos do ID)
    try {
      const response = await fetch('/api/imoveis-github')
      if (!response.ok) return
      
      const imoveis = await response.json()
      const codigoFormatado = codigoImovel.trim().padStart(5, '0')
      
      // Procurar imóvel cujo ID termina com o código digitado
      const imovelEncontrado = imoveis.find((imovel: any) => {
        const ultimos5Digitos = imovel.id.slice(-5).padStart(5, '0')
        return ultimos5Digitos === codigoFormatado && imovel.publicado
      })

      if (imovelEncontrado) {
        router.push(`/imoveis/${imovelEncontrado.slug}`)
      } else {
        // Se não encontrou, redirecionar para página de imóveis com mensagem
        router.push(`/imoveis?codigo=${codigoFormatado}&naoEncontrado=true`)
      }
    } catch (error) {
      console.error('Erro ao buscar imóvel por código:', error)
    }
  }

  // Se estiver no modo código, mostrar apenas o input de código
  if (modoCodigo) {
    return (
      <div className="w-full">
        <form onSubmit={handleBuscarPorCodigo} className="transition-all duration-300">
          <div className="flex flex-col lg:flex-row gap-3 items-center">
            <div className="flex-1 w-full">
              <input
                type="text"
                value={codigoImovel}
                onChange={(e) => setCodigoImovel(e.target.value)}
                placeholder="Digite o Código do Imóvel"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                autoFocus
              />
            </div>
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2 text-sm"
              >
                <Search className="w-5 h-5" />
                <span>BUSCAR</span>
              </button>
            </div>
          </div>
        </form>
        
        {/* Link para voltar */}
        <button
          type="button"
          onClick={() => {
            setModoCodigo(false)
            setCodigoImovel('')
          }}
          className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors duration-200 text-sm mt-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para busca</span>
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Formulário Principal - 3 campos horizontais */}
      <form onSubmit={handleSubmit} className="transition-all duration-300">
        <div className="flex flex-col lg:flex-row gap-3 mb-4">
          {/* TIPO */}
          <div className="flex-1">
            <select
              name="tipo"
              value={filtros.tipo}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
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
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2 text-sm"
            >
              <Search className="w-5 h-5" />
              <span>BUSCAR</span>
            </button>
          </div>
        </div>

        {/* Formulário Avançado - Expansível embaixo */}
        {mostrarAvancado && (
          <div className="pt-4 transition-all duration-300">
          {/* Quartos, Banheiros, Vagas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            {/* Quartos */}
            <div>
              <label className="block text-sm text-white font-bold mb-2">Quartos</label>
              <div className="flex gap-2">
                {['1', '2', '3', '4+'].map((qtd) => {
                  const isSelected = filtros.quartos.includes(qtd)
                  return (
                    <button
                      key={qtd}
                      type="button"
                      onClick={() => handleQuartosToggle(qtd)}
                      className={`px-3 py-1.5 rounded border text-sm transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
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
              <label className="block text-sm text-white font-bold mb-2">Banheiros</label>
              <div className="flex gap-2">
                {['1+', '2+', '3+', '4+'].map((qtd) => (
                  <button
                    key={qtd}
                    type="button"
                    onClick={() => setFiltros(prev => ({ ...prev, banheiros: prev.banheiros === qtd ? '' : qtd }))}
                    className={`px-3 py-1.5 rounded border text-sm transition-all ${
                      filtros.banheiros === qtd 
                        ? 'bg-purple-600 text-white border-purple-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    {qtd}
                  </button>
                ))}
              </div>
            </div>

            {/* Vagas */}
            <div>
              <label className="block text-sm text-white font-bold mb-2">Vagas</label>
              <div className="flex gap-2">
                {['1+', '2+', '3+', '4+'].map((qtd) => (
                  <button
                    key={qtd}
                    type="button"
                    onClick={() => setFiltros(prev => ({ ...prev, vagas: prev.vagas === qtd ? '' : qtd }))}
                    className={`px-3 py-1.5 rounded border text-sm transition-all ${
                      filtros.vagas === qtd 
                        ? 'bg-purple-600 text-white border-purple-600' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    {qtd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Valores e Área */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Valores */}
            <div>
              <label className="block text-sm text-white font-bold mb-2">Valores</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="valorMin"
                  value={filtros.valorMin}
                  onChange={handleChange}
                  placeholder="Mín"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
                <input
                  type="number"
                  name="valorMax"
                  value={filtros.valorMax}
                  onChange={handleChange}
                  placeholder="Máx"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
              </div>
            </div>

            {/* Área */}
            <div>
              <label className="block text-sm text-white font-bold mb-2">Área (m²)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="areaMin"
                  value={filtros.areaMin}
                  onChange={handleChange}
                  placeholder="Mín"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
                <input
                  type="number"
                  name="areaMax"
                  value={filtros.areaMax}
                  onChange={handleChange}
                  placeholder="Máx"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Data de Entrega e Comodidades - Mesma linha */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            {/* Data de Entrega - Lado Esquerdo */}
            <div>
              <label className="block text-sm text-white font-bold mb-3">Data de Entrega</label>
              <div className="flex flex-wrap items-center gap-2">
                {/* Checkbox Entregues */}
                <button
                  type="button"
                  onClick={() => {
                    const temEntregues = filtros.dataEntrega.includes('entregues')
                    setFiltros(prev => ({
                      ...prev,
                      dataEntrega: temEntregues
                        ? prev.dataEntrega.filter(d => d !== 'entregues')
                        : [...prev.dataEntrega, 'entregues']
                    }))
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded border text-sm transition-all ${
                    filtros.dataEntrega.includes('entregues')
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filtros.dataEntrega.includes('entregues')}
                    onChange={() => {}}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span>Entregues</span>
                </button>
                
                {/* Anos */}
                {[2026, 2027, 2028, 2029, 2030, 2031].map((ano) => {
                  const isSelected = filtros.dataEntrega.includes(ano)
                  return (
                    <button
                      key={ano}
                      type="button"
                      onClick={() => {
                        setFiltros(prev => ({
                          ...prev,
                          dataEntrega: isSelected
                            ? prev.dataEntrega.filter(d => d !== ano)
                            : [...prev.dataEntrega, ano]
                        }))
                      }}
                      className={`px-3 py-1.5 rounded border text-sm transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      {ano}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Comodidades - Lado Direito */}
            <div>
              <label className="block text-sm text-white font-bold mb-3 text-center lg:text-left">Comodidades</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-items-center lg:justify-items-start">
              <div className="flex items-center gap-2 w-full justify-center md:justify-start">
                <span className="text-sm text-white font-bold">Mobiliado</span>
                <button
                  type="button"
                  onClick={() => handleToggle('mobiliado')}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
                    filtros.mobiliado ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      filtros.mobiliado ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 w-full justify-center md:justify-start">
                <span className="text-sm text-white font-bold">Frente Mar</span>
                <button
                  type="button"
                  onClick={() => handleToggle('frenteMar')}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
                    filtros.frenteMar ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      filtros.frenteMar ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 w-full justify-center md:justify-start">
                <span className="text-sm text-white font-bold">Vista Mar</span>
                <button
                  type="button"
                  onClick={() => handleToggle('vistaMar')}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
                    filtros.vistaMar ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      filtros.vistaMar ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 w-full justify-center md:justify-start">
                <span className="text-sm text-white font-bold">Quadra Mar</span>
                <button
                  type="button"
                  onClick={() => handleToggle('quadraMar')}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
                    filtros.quadraMar ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      filtros.quadraMar ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 w-full justify-center md:justify-start">
                <span className="text-sm text-white font-bold">Área de Lazer</span>
                <button
                  type="button"
                  onClick={() => handleToggle('areaLazer')}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
                    filtros.areaLazer ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      filtros.areaLazer ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 w-full justify-center md:justify-start">
                <span className="text-sm text-white font-bold">Home Club</span>
                <button
                  type="button"
                  onClick={() => handleToggle('homeClub')}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
                    filtros.homeClub ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      filtros.homeClub ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Botões de Busca Adicional - 2 botões horizontais */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
        {/* Avançado */}
        <button 
          type="button"
          onClick={() => setMostrarAvancado(!mostrarAvancado)}
          className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors duration-200 text-sm"
        >
          <Filter className="w-4 h-4" />
          <span>Avançado</span>
        </button>

        {/* Por código */}
        <button 
          type="button"
          onClick={() => setModoCodigo(true)}
          className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors duration-200 text-sm"
        >
          <List className="w-4 h-4" />
          <span>Por código</span>
        </button>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Check, Loader2, Image as ImageIcon, X, Plus } from 'lucide-react'
import Link from 'next/link'

export default function EditarFotosImovelDWV() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const [imovel, setImovel] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Seleções de fotos
  const [fotoPrincipal, setFotoPrincipal] = useState<string | null>(null)
  const [fotosMenores, setFotosMenores] = useState<string[]>([])

  // Data de Entrega e Comodidades (para integrar com o filtro do site)
  const [status, setStatus] = useState<'prontos' | 'lancamento' | 'em-construcao'>('lancamento')
  const [dataEntrega, setDataEntrega] = useState<string>('')
  const [comodidades, setComodidades] = useState({ mobiliado: false, frenteMar: false, vistaMar: false, areaLazer: false })

  // Filtros do site: Status, Tipo, Cidade (dropdowns) + Quartos, Banheiros, Vagas (botões) — preenchidos automaticamente do DWV
  const [tipo, setTipo] = useState<string>('apartamento')
  const [cidade, setCidade] = useState<string>('penha')
  const [quartos, setQuartos] = useState<string>('')
  const [banheiros, setBanheiros] = useState<string>('')
  const [vagas, setVagas] = useState<string>('')

  // Características e infraestrutura (edição do que vem do DWV: ocultar ou adicionar)
  const [tagsOcultas, setTagsOcultas] = useState<string[]>([])
  const [tagsAdicionais, setTagsAdicionais] = useState<string[]>([])
  const [novaTag, setNovaTag] = useState('')
  const [infraestruturaOculta, setInfraestruturaOculta] = useState<string[]>([])
  const [infraestruturaAdicional, setInfraestruturaAdicional] = useState<string[]>([])
  const [novaInfra, setNovaInfra] = useState('')

  // Função para extrair extensão da URL
  const getFileExtension = (url: string): string => {
    // Remover query parameters e hash primeiro
    let cleanPath = url.split('?')[0].split('#')[0]
    
    // Encontrar a última extensão válida (após o último ponto)
    const lastDot = cleanPath.lastIndexOf('.')
    if (lastDot > 0 && lastDot < cleanPath.length - 1) {
      const ext = cleanPath.substring(lastDot + 1).toLowerCase()
      // Validar que é uma extensão válida (apenas letras e números, 2-5 caracteres)
      if (/^[a-z0-9]{2,5}$/.test(ext)) {
        return `.${ext}`
      }
    }
    return ''
  }

  useEffect(() => {
    const loadImovel = async () => {
      try {
        const response = await fetch('/api/imoveis-github', {
          cache: 'no-store'
        })
        
        if (!response.ok) {
          throw new Error('Erro ao buscar imóveis')
        }

        const imoveis = await response.json()
        const imovelEncontrado = imoveis.find((i: any) => i.id === id)
        
        if (!imovelEncontrado) {
          throw new Error('Imóvel não encontrado')
        }

        if (!imovelEncontrado.fonteDWV) {
          throw new Error('Este imóvel não é do DWV. Use a edição completa para alterar fotos.')
        }

        setImovel(imovelEncontrado)
        setStatus(imovelEncontrado.status || 'lancamento')
        setDataEntrega(imovelEncontrado.dataEntrega || '')
        const tags = imovelEncontrado.tags || []
        setComodidades({
          mobiliado: tags.some((t: string) => /mobiliad[oa]/i.test(t)),
          frenteMar: tags.some((t: string) => /frente\s*mar|beira\s*mar/i.test(t)),
          vistaMar: tags.some((t: string) => /vista\s*(para\s*o\s*)?mar/i.test(t)),
          areaLazer: tags.some((t: string) => /área\s*de\s*lazer|area\s*de\s*lazer|home\s*club|clube\s*completo/i.test(t)),
        })
        // Preencher filtros do site a partir dos dados do DWV
        setTipo(imovelEncontrado.tipo || 'apartamento')
        setCidade(imovelEncontrado.endereco?.cidade || 'penha')
        const q = imovelEncontrado.caracteristicas?.quartos
        setQuartos(q != null && q > 0 ? (q >= 4 ? '4' : String(q)) : '')
        const b = imovelEncontrado.caracteristicas?.banheiros
        setBanheiros(b != null && b > 0 ? (b >= 4 ? '4' : String(b)) : '')
        const v = imovelEncontrado.caracteristicas?.vagas
        setVagas(v != null && v > 0 ? (v >= 4 ? '4' : String(v)) : '')
        // Carregar seleções existentes ou usar padrão
        const todasFotos = imovelEncontrado.fotos || []
        setFotoPrincipal(imovelEncontrado.fotoPrincipalDWV || todasFotos[0] || null)
        setFotosMenores(imovelEncontrado.fotosMenoresDWV || todasFotos.slice(1, 5) || [])
        // Overrides de características/infra (editáveis no admin)
        setTagsOcultas(imovelEncontrado.tagsOcultas || [])
        setTagsAdicionais(imovelEncontrado.tagsAdicionais || [])
        setInfraestruturaOculta(imovelEncontrado.infraestruturaOculta || [])
        setInfraestruturaAdicional(imovelEncontrado.infraestruturaAdicional || [])
      } catch (error: any) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadImovel()
  }, [id])

  const handleSelectPrincipal = (foto: string) => {
    // Se a foto já está nas menores, remover
    const novasMenores = fotosMenores.filter(f => f !== foto)
    setFotosMenores(novasMenores)
    setFotoPrincipal(foto)
  }

  const handleToggleMenor = (foto: string) => {
    // Não permitir selecionar a foto principal como menor
    if (foto === fotoPrincipal) return

    if (fotosMenores.includes(foto)) {
      // Remover
      setFotosMenores(fotosMenores.filter(f => f !== foto))
    } else {
      // Adicionar (máximo 4)
      if (fotosMenores.length < 4) {
        setFotosMenores([...fotosMenores, foto])
      } else {
        alert('Máximo de 4 fotos menores permitidas')
      }
    }
  }

  const handleSave = async () => {
    if (!fotoPrincipal) {
      alert('Selecione uma foto principal')
      return
    }

    if (fotosMenores.length === 0) {
      alert('Selecione pelo menos 1 foto menor')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      // Buscar imóvel completo
      const response = await fetch('/api/imoveis-github', {
        cache: 'no-store'
      })
      const imoveis = await response.json()
      const imovelCompleto = imoveis.find((i: any) => i.id === id)

      if (!imovelCompleto) {
        throw new Error('Imóvel não encontrado')
      }

      // Comodidades -> tags (para o filtro do site)
      const comodidadesTags: string[] = []
      if (comodidades.frenteMar) comodidadesTags.push('Frente Mar')
      if (comodidades.mobiliado) comodidadesTags.push('Mobiliado')
      if (comodidades.vistaMar) comodidadesTags.push('Vista Mar')
      if (comodidades.areaLazer) comodidadesTags.push('Área de Lazer')
      const tagsExistentes = (imovelCompleto.tags || []).filter(
        (t: string) => !/mobiliad[oa]|frente\s*mar|beira\s*mar|vista\s*(para\s*o\s*)?mar|área\s*de\s*lazer|area\s*de\s*lazer|home\s*club|clube\s*completo/i.test(t)
      )
      const tags = [...tagsExistentes, ...comodidadesTags]

      const imovelAtualizado = {
        ...imovelCompleto,
        status,
        tipo: tipo || imovelCompleto.tipo,
        endereco: { ...imovelCompleto.endereco, cidade: cidade || imovelCompleto.endereco?.cidade },
        caracteristicas: {
          ...imovelCompleto.caracteristicas,
          quartos: parseInt(quartos, 10) || 0,
          banheiros: parseInt(banheiros, 10) || 0,
          vagas: parseInt(vagas, 10) || 0,
        },
        dataEntrega: dataEntrega || undefined,
        tags,
        tagsOcultas: tagsOcultas.length > 0 ? tagsOcultas : undefined,
        tagsAdicionais: tagsAdicionais.length > 0 ? tagsAdicionais : undefined,
        infraestruturaOculta: infraestruturaOculta.length > 0 ? infraestruturaOculta : undefined,
        infraestruturaAdicional: infraestruturaAdicional.length > 0 ? infraestruturaAdicional : undefined,
        fotoPrincipalDWV: fotoPrincipal,
        fotosMenoresDWV: fotosMenores,
        updatedAt: new Date().toISOString(),
      }

      // Salvar via API PUT
      const saveResponse = await fetch('/api/imoveis-github', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          imovel: imovelAtualizado,
        }),
      })

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json()
        throw new Error(errorData.error || 'Erro ao salvar')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/administrador/imoveis')
      }, 2000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando imóvel...</p>
        </div>
      </div>
    )
  }

  if (error && !imovel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">{error}</p>
            <Link
              href="/administrador/imoveis"
              className="mt-4 inline-block text-red-600 hover:text-red-800"
            >
              ← Voltar para lista
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const todasFotos = imovel?.fotos || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/administrador/imoveis"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Voltar</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Editar Fotos do Imóvel</h1>
                <p className="text-sm text-gray-600 mt-1">{imovel?.titulo}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Explicação */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">ℹ️ Por que editar fotos aqui?</h2>
          <p className="text-sm text-blue-800">
            No DWV você consegue escolher a foto principal, mas não as 4 fotos menores que aparecem 
            na página de detalhes do imóvel. Use esta ferramenta para selecionar quais fotos aparecerão 
            na galeria principal do imóvel.
          </p>
        </div>

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            ✅ Fotos salvas com sucesso! Redirecionando...
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            ❌ {error}
          </div>
        )}

        {/* Filtros do site: Status, Tipo, Cidade (dropdowns) + Quartos, Banheiros, Vagas (botões) — preenchidos automaticamente do DWV */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros do site</h2>
          <p className="text-sm text-gray-600 mb-4">Estes campos definem como o imóvel aparece nos filtros. São preenchidos automaticamente com os dados do DWV.</p>
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={status === 'prontos' ? 'prontos' : 'lancamento'}
                  onChange={(e) => setStatus(e.target.value === 'prontos' ? 'prontos' : 'lancamento')}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="prontos">Imóveis Prontos</option>
                  <option value="lancamento">Lançamento/em construção</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="apartamento">Apartamento</option>
                  <option value="cobertura">Cobertura/Diferenciado</option>
                  <option value="comercial">Salas Comerciais</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <select
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="penha">Penha</option>
                  <option value="barra-velha">Barra Velha</option>
                  <option value="balneario-picarras">Balneário Piçarras</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quartos</label>
              <div className="flex gap-2">
                {(['1', '2', '3', '4+'] as const).map((qtd) => {
                  const value = qtd === '4+' ? '4' : qtd
                  const isSelected = quartos === value
                  return (
                    <button
                      key={qtd}
                      type="button"
                      onClick={() => setQuartos(isSelected ? '' : value)}
                      className={`px-4 py-2 rounded-lg border text-sm ${isSelected ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500'}`}
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
                {['1+', '2+', '3+', '4+'].map((qtd) => {
                  const value = qtd.replace('+', '')
                  const isSelected = banheiros === value
                  return (
                    <button
                      key={qtd}
                      type="button"
                      onClick={() => setBanheiros(isSelected ? '' : value)}
                      className={`px-4 py-2 rounded-lg border text-sm ${isSelected ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500'}`}
                    >
                      {qtd}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vagas</label>
              <div className="flex gap-2">
                {['1+', '2+', '3+', '4+'].map((qtd) => {
                  const value = qtd.replace('+', '')
                  const isSelected = vagas === value
                  return (
                    <button
                      key={qtd}
                      type="button"
                      onClick={() => setVagas(isSelected ? '' : value)}
                      className={`px-4 py-2 rounded-lg border text-sm ${isSelected ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500'}`}
                    >
                      {qtd}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Data de Entrega e Comodidades (integrar com filtro do site) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Data de Entrega</h2>
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={status === 'prontos'}
                onChange={(e) => setStatus(e.target.checked ? 'prontos' : 'lancamento')}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Prontos</span>
            </label>
            {status !== 'prontos' && (
              <div className="mb-2">
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'lancamento' | 'em-construcao')}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="lancamento">Lançamento</option>
                  <option value="em-construcao">Em Construção</option>
                </select>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {[2026, 2027, 2028, 2029, 2030, 2031].map((ano) => {
                const selected = dataEntrega && (dataEntrega.startsWith(String(ano)) || dataEntrega === String(ano))
                return (
                  <button
                    key={ano}
                    type="button"
                    onClick={() => setDataEntrega(selected ? '' : `${ano}-01-01`)}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                      selected ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500'
                    }`}
                  >
                    {ano}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Comodidades</h2>
            <p className="text-sm text-gray-600 mb-3">Marque para o imóvel aparecer no filtro do site.</p>
            <div className="flex flex-wrap gap-4">
              {[
                { key: 'mobiliado', label: 'Mobiliado' },
                { key: 'frenteMar', label: 'Frente Mar' },
                { key: 'vistaMar', label: 'Vista Mar' },
                { key: 'areaLazer', label: 'Área de Lazer' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={comodidades[key as keyof typeof comodidades]}
                    onChange={(e) => setComodidades(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Características (tags do DWV): ocultar ou adicionar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Características (do DWV)</h2>
            <p className="text-sm text-gray-600 mb-4">Oculte itens que não devem aparecer no site ou adicione novos. O sync do DWV não remove suas alterações.</p>
            {imovel && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visíveis no site (clique em Ocultar para esconder)</label>
                  <div className="flex flex-wrap gap-2">
                    {(imovel.tags || []).filter((t: string) => !tagsOcultas.some(o => o.trim().toLowerCase() === t.trim().toLowerCase())).map((tag: string, idx: number) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
                        {tag}
                        <button type="button" onClick={() => setTagsOcultas(prev => [...prev, tag])} className="p-0.5 rounded hover:bg-purple-200" title="Ocultar no site">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                    {tagsAdicionais.map((tag: string, idx: number) => (
                      <span key={`add-${idx}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-50 text-green-800 border border-green-200">
                        {tag}
                        <button type="button" onClick={() => setTagsAdicionais(prev => prev.filter((_, i) => i !== idx))} className="p-0.5 rounded hover:bg-green-200" title="Remover">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <input
                    type="text"
                    value={novaTag}
                    onChange={(e) => setNovaTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), novaTag.trim() && setTagsAdicionais(prev => [...prev, novaTag.trim()]) && setNovaTag(''))}
                    placeholder="Nova característica"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-48"
                  />
                  <button type="button" onClick={() => { if (novaTag.trim()) { setTagsAdicionais(prev => [...prev, novaTag.trim()]); setNovaTag('') } }} className="inline-flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
                    <Plus className="w-4 h-4" /> Adicionar
                  </button>
                </div>
                {tagsOcultas.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-500">Ocultas no site (clique para exibir de novo): </span>
                    {tagsOcultas.map((tag: string, idx: number) => (
                      <button key={idx} type="button" onClick={() => setTagsOcultas(prev => prev.filter((_, i) => i !== idx))} className="mr-2 mt-1 text-sm text-gray-500 underline hover:text-purple-600">
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Infraestrutura (do DWV): ocultar ou adicionar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Infraestrutura (do DWV)</h2>
            <p className="text-sm text-gray-600 mb-4">Oculte itens ou adicione novos. O sync do DWV não remove suas alterações.</p>
            {imovel && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visíveis no site</label>
                  <div className="flex flex-wrap gap-2">
                    {(imovel.infraestrutura || []).filter((i: string) => !infraestruturaOculta.some(o => o.trim().toLowerCase() === i.trim().toLowerCase())).map((item: string, idx: number) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-50 text-orange-800 border border-orange-200">
                        {item}
                        <button type="button" onClick={() => setInfraestruturaOculta(prev => [...prev, item])} className="p-0.5 rounded hover:bg-orange-200" title="Ocultar no site">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                    {infraestruturaAdicional.map((item: string, idx: number) => (
                      <span key={`add-${idx}`} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-50 text-green-800 border border-green-200">
                        {item}
                        <button type="button" onClick={() => setInfraestruturaAdicional(prev => prev.filter((_, i) => i !== idx))} className="p-0.5 rounded hover:bg-green-200" title="Remover">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <input
                    type="text"
                    value={novaInfra}
                    onChange={(e) => setNovaInfra(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), novaInfra.trim() && setInfraestruturaAdicional(prev => [...prev, novaInfra.trim()]) && setNovaInfra(''))}
                    placeholder="Novo item de infraestrutura"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-48"
                  />
                  <button type="button" onClick={() => { if (novaInfra.trim()) { setInfraestruturaAdicional(prev => [...prev, novaInfra.trim()]); setNovaInfra('') } }} className="inline-flex items-center gap-1 px-3 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700">
                    <Plus className="w-4 h-4" /> Adicionar
                  </button>
                </div>
                {infraestruturaOculta.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-500">Ocultas no site: </span>
                    {infraestruturaOculta.map((item: string, idx: number) => (
                      <button key={idx} type="button" onClick={() => setInfraestruturaOculta(prev => prev.filter((_, i) => i !== idx))} className="mr-2 mt-1 text-sm text-gray-500 underline hover:text-purple-600">
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {todasFotos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Este imóvel não possui fotos.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Foto Principal */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Foto Principal
                {fotoPrincipal && (
                  <span className="ml-2 text-sm font-normal text-green-600">✓ Selecionada</span>
                )}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Clique em uma foto para definir como principal (aparece grande à esquerda)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {todasFotos.map((foto: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleSelectPrincipal(foto)}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      fotoPrincipal === foto
                        ? 'border-purple-600 ring-4 ring-purple-200'
                        : 'border-gray-300 hover:border-purple-400'
                    }`}
                  >
                    <img
                      src={foto}
                      alt={`Foto ${index + 1}`}
                      width={320}
                      height={240}
                      className="w-full h-full object-cover"
                    />
                    {fotoPrincipal === foto && (
                      <div className="absolute inset-0 bg-purple-600 bg-opacity-20 flex items-center justify-center">
                        <div className="bg-purple-600 text-white rounded-full p-2">
                          <Check className="w-6 h-6" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      {fotoPrincipal === foto && (
                        <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded">
                          Principal
                        </span>
                      )}
                      <span className="bg-gray-800 bg-opacity-75 text-white text-xs font-medium px-2 py-1 rounded">
                        {getFileExtension(foto)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fotos Menores */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Fotos Menores ({fotosMenores.length}/4)
                {fotosMenores.length === 4 && (
                  <span className="ml-2 text-sm font-normal text-green-600">✓ Completo</span>
                )}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Clique nas fotos para selecionar as 4 menores (aparecem em grid 2x2 à direita)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {todasFotos.map((foto: string, index: number) => {
                  const isPrincipal = foto === fotoPrincipal
                  const isMenor = fotosMenores.includes(foto)
                  const podeSelecionar = !isPrincipal && (isMenor || fotosMenores.length < 4)

                  return (
                    <button
                      key={index}
                      onClick={() => handleToggleMenor(foto)}
                      disabled={isPrincipal || (!isMenor && fotosMenores.length >= 4)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        isPrincipal
                          ? 'border-gray-200 opacity-50 cursor-not-allowed'
                          : isMenor
                          ? 'border-blue-600 ring-4 ring-blue-200'
                          : fotosMenores.length >= 4
                          ? 'border-gray-200 opacity-50 cursor-not-allowed'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      <img
                        src={foto}
                        alt={`Foto ${index + 1}`}
                        width={320}
                        height={180}
                        className="w-full h-full object-cover"
                      />
                      {isPrincipal && (
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">Principal</span>
                        </div>
                      )}
                      {isMenor && (
                        <div className="absolute inset-0 bg-blue-600 bg-opacity-20 flex items-center justify-center">
                          <div className="bg-blue-600 text-white rounded-full p-2">
                            <Check className="w-6 h-6" />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        {isMenor && (
                          <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                            Menor {fotosMenores.indexOf(foto) + 1}
                          </span>
                        )}
                        <span className="bg-gray-800 bg-opacity-75 text-white text-xs font-medium px-2 py-1 rounded">
                          {getFileExtension(foto)}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Preview */}
            {(fotoPrincipal || fotosMenores.length > 0) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Como aparecerá na página de detalhes do imóvel
                </p>
                <div 
                  className="grid grid-cols-2 gap-1.5 p-1.5 bg-gray-50 rounded-lg"
                  style={{ minHeight: '70vh', height: '70vh', maxHeight: '70vh' }}
                >
                  {/* Foto Principal - Coluna Esquerda */}
                  {fotoPrincipal ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <img
                        src={fotoPrincipal}
                        alt="Principal"
                        width={800}
                        height={600}
                        className="w-full h-full object-cover"
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Selecione foto principal</span>
                    </div>
                  )}
                  
                  {/* Fotos Menores - Coluna Direita em Grid 2x2 */}
                  <div 
                    className="grid grid-cols-2 grid-rows-2 gap-1.5"
                    style={{ 
                      height: '100%',
                      maxHeight: '100%',
                      display: 'grid',
                      gridTemplateRows: 'calc(50% - 0.375rem) calc(50% - 0.375rem)',
                      gridTemplateColumns: 'calc(50% - 0.375rem) calc(50% - 0.375rem)'
                    }}
                  >
                    {[0, 1, 2, 3].map((index) => {
                      const foto = fotosMenores[index]
                      return foto ? (
                        <div
                          key={index}
                          className="relative w-full h-full rounded-lg overflow-hidden"
                          style={{ height: '100%', width: '100%', overflow: 'hidden', position: 'relative' }}
                        >
                          <img
                            src={foto}
                            alt={`Menor ${index + 1}`}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover"
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                          />
                        </div>
                      ) : (
                        <div
                          key={index}
                          className="w-full h-full bg-gray-200 rounded-lg"
                          style={{ minHeight: 0 }}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={isSaving || !fotoPrincipal || fotosMenores.length === 0}
                className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Seleções'
                )}
              </button>
              <Link
                href="/administrador/imoveis"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

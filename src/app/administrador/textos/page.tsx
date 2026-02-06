'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, FileText, Save, RefreshCw, Loader2, CheckCircle, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { getAllSections, getTextsBySection, getTextMetadata, type SiteText, type HeadingType } from '@/lib/site-texts'
import { SEO_CHAR_RANGES, isOutOfSuggestedRange } from '@/lib/seo-headings'

/** Por seção e chave: qual papel SEO (H1/H2/H3). Limites ideais vêm de SEO_CHAR_RANGES. */
const HEADING_RULES: Record<string, Record<string, { headingType: HeadingType }>> = {
  home: {
    'banner.titulo': { headingType: 'H1' },
    'selecao_nox.titulo': { headingType: 'H2' },
    'encontre_imovel.titulo': { headingType: 'H2' },
    'encontre_imovel.penha.titulo': { headingType: 'H3' },
    'encontre_imovel.picarras.titulo': { headingType: 'H3' },
    'encontre_imovel.barra_velha.titulo': { headingType: 'H3' },
  },
  blog: {
    'hero.titulo': { headingType: 'H1' },
  },
  contato: {
    'hero.titulo': { headingType: 'H1' },
  },
  como_comprar: {
    'hero.titulo': { headingType: 'H1' },
    'como_funciona.titulo': { headingType: 'H2' },
    'imovel_praia.titulo': { headingType: 'H2' },
    'localizacao.titulo': { headingType: 'H2' },
  },
  encontre_meu_imovel: {
    'hero.titulo': { headingType: 'H1' },
    'como_funciona.passo_1.titulo': { headingType: 'H3' },
    'como_funciona.passo_2.titulo': { headingType: 'H3' },
    'como_funciona.passo_3.titulo': { headingType: 'H3' },
    'como_funciona.passo_4.titulo': { headingType: 'H3' },
    'cta_contato.titulo': { headingType: 'H2' },
  },
  trabalhe_conosco: {
    'hero.titulo': { headingType: 'H1' },
    'valores.valor_1.titulo': { headingType: 'H3' },
    'valores.valor_2.titulo': { headingType: 'H3' },
    'valores.valor_3.titulo': { headingType: 'H3' },
    'formulario.titulo': { headingType: 'H2' },
  },
  anunciar: {
    'hero.titulo': { headingType: 'H1' },
    'introducao.titulo': { headingType: 'H2' },
    'vantagens.titulo': { headingType: 'H2' },
  },
  viva_penha: {
    'hero.titulo': { headingType: 'H1' },
    'introducao.titulo': { headingType: 'H2' },
    'o_que_fazer.titulo': { headingType: 'H2' },
    'beneficios.infraestrutura.titulo': { headingType: 'H3' },
    'beneficios.atracoes.titulo': { headingType: 'H3' },
    'beneficios.seguranca.titulo': { headingType: 'H3' },
    'beneficios.diversidade.titulo': { headingType: 'H3' },
  },
  viva_balneario_picarras: {
    'hero.titulo': { headingType: 'H1' },
    'introducao.titulo': { headingType: 'H2' },
    'o_que_fazer.titulo': { headingType: 'H2' },
  },
  viva_barra_velha: {
    'hero.titulo': { headingType: 'H1' },
    'introducao.titulo': { headingType: 'H2' },
    'o_que_fazer.titulo': { headingType: 'H2' },
  },
  quem_somos: {
    'hero.titulo': { headingType: 'H1' },
    'nossa_historia.titulo': { headingType: 'H2' },
  },
}

interface PendingTextChange {
  path: string
  value: string
  originalValue: string
  metadata: SiteText
}

export default function AdminTextos() {
  const [selectedSection, setSelectedSection] = useState('Header')
  const [searchTerm, setSearchTerm] = useState('')
  const [pendingChanges, setPendingChanges] = useState<PendingTextChange[]>([])
  const [isPublishing, setIsPublishing] = useState(false)
  const [sections, setSections] = useState<string[]>([])
  const [texts, setTexts] = useState<{ [key: string]: SiteText }>({})

  // Carregar dados iniciais
  useEffect(() => {
    loadInitialData()
  }, [])

  // Função para buscar textos do GitHub
  const loadTextsFromGitHub = async () => {
    try {
      const response = await fetch('/api/update-texts-github')
      if (response.ok) {
        const githubTexts = await response.json()
        // Atualizar dados locais com os do GitHub
        setTexts(getTextsBySection(selectedSection))
      }
    } catch (error) {
      console.error('Erro ao carregar textos do GitHub:', error)
    }
  }

  // Carregar textos quando a seção muda
  useEffect(() => {
    loadTexts(selectedSection)
  }, [selectedSection])

  const loadInitialData = async () => {
    try {
      // Buscar seções disponíveis
      const availableSections = getAllSections()
      setSections(availableSections)
      
      // Carregar textos da seção inicial
      const initialTexts = getTextsBySection(selectedSection)
      setTexts(initialTexts)
      
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error)
    }
  }

  const loadTexts = async (section: string) => {
    try {
      const sectionTexts = getTextsBySection(section)
      setTexts(sectionTexts)
    } catch (error) {
      console.error('Erro ao carregar textos:', error)
    }
  }

  const filteredTexts = Object.entries(texts).filter(([key, text]) => {
    const matchesSearch = text.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         text.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         key.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleTextChange = (path: string, newValue: string, metadata: SiteText) => {
    // Remover mudança anterior se existir
    setPendingChanges(prev => prev.filter(change => change.path !== path))
    
    // Adicionar nova mudança se o valor mudou
    if (newValue !== metadata.value) {
      setPendingChanges(prev => [...prev, {
        path,
        value: newValue,
        originalValue: metadata.value,
        metadata
      }])
    }
  }

  const handleCancelChange = (path: string) => {
    setPendingChanges(prev => prev.filter(change => change.path !== path))
  }

  const handlePublishChanges = async () => {
    if (pendingChanges.length === 0) {
      alert('Nenhuma mudança para publicar')
      return
    }

    if (!confirm(`Você vai atualizar ${pendingChanges.length} texto(s). O site será atualizado em ~2 minutos. Deseja continuar?`)) {
      return
    }

    setIsPublishing(true)

    try {
      const changes = pendingChanges.map(change => ({
        path: change.path,
        value: change.value
      }))
      
      const response = await fetch('/api/update-texts-github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ changes })
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar textos')
      }

      const result = await response.json()

      // Limpar mudanças pendentes
      setPendingChanges([])

      // Recarregar textos da seção atual
      await loadTexts(selectedSection)

      alert(`✅ ${pendingChanges.length} texto(s) atualizado(s) com sucesso!\n\n🔄 O site será atualizado automaticamente em ~2 minutos.`)
      
    } catch (error) {
      console.error('Erro ao publicar textos:', error)
      alert('❌ Erro ao atualizar alguns textos. Tente novamente.')
    } finally {
      setIsPublishing(false)
    }
  }

  const getPendingChange = (path: string) => {
    return pendingChanges.find(change => change.path === path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/administrador"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Voltar</span>
            </Link>
            
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Gerenciar Textos do Site
              </h1>
            </div>
            
            <button
              onClick={() => loadTextsFromGitHub()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Atualizar do GitHub
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão Publicar - Fixo no topo */}
        {pendingChanges.length > 0 && (
          <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-4 mb-6 sticky top-4 z-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-1">
                  📝 {pendingChanges.length} texto(s) pronto(s) para publicar
                </p>
                <p className="text-xs text-blue-700">
                  Clique em "Publicar Alterações" para enviar todas de uma vez (~2min de rebuild)
                </p>
              </div>
              <button
                onClick={handlePublishChanges}
                disabled={isPublishing}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Publicando...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Publicar Alterações</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>📋 Como usar:</strong> Edite os textos que deseja alterar. 
            Você pode editar vários textos de uma vez. 
            Quando terminar, clique em "Publicar Alterações" para enviar todas de uma vez (1 único rebuild de ~2min).
          </p>
        </div>

        {/* O que é H1, H2, H3 e Parágrafo (SEO) */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-amber-900 mb-2">📌 H1, H2, H3 e Parágrafo no site</p>
          <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
            <li><strong>H1</strong> — Título principal da página. Só 1 por página. Palavra-chave principal. Ideal: 30–60 caracteres.</li>
            <li><strong>H2</strong> — Seções principais do conteúdo. Vários por página. Ideal: 25–60 caracteres.</li>
            <li><strong>H3</strong> — Sub-seções dentro de um H2. Ideal: 20–50 caracteres.</li>
            <li><strong>Parágrafo</strong> — Texto normal (&lt;p&gt;). Headings são rótulos de seção, não blocos de conteúdo.</li>
          </ul>
          <p className="text-xs text-amber-700 mt-2">Se o texto sair do ideal de caracteres, a caixa fica em amarelo (sugestivo; você pode salvar normalmente).</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Texto
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Digite o nome do texto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seção
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sections.map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Texts List */}
        <div className="space-y-4">
          {filteredTexts.map(([key, text]) => {
            const pendingChange = getPendingChange(key)
            const currentValue = pendingChange ? pendingChange.value : text.value
            const headingRule = HEADING_RULES[selectedSection]?.[key]
            const headingType = (text.headingType ?? headingRule?.headingType) as keyof typeof SEO_CHAR_RANGES | undefined
            const role = headingType && headingType in SEO_CHAR_RANGES ? headingType : null
            const range = role ? SEO_CHAR_RANGES[role as keyof typeof SEO_CHAR_RANGES] : null
            const foraDoIdeal = role && isOutOfSuggestedRange(role as 'H1'|'H2'|'H3', currentValue.length)

            return (
              <div key={key} className={`bg-white rounded-lg shadow-md p-6 ${pendingChange ? 'ring-2 ring-blue-500' : ''}`}>
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Info */}
                  <div className="lg:w-1/3">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-semibold text-gray-900">{text.label}</h3>
                      {role && (
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          title={role === 'paragrafo' ? 'Texto de parágrafo na página' : `Exibido como ${role} na página`}
                        >
                          {role}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Seção:</strong> {text.section}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Tipo:</strong> {text.type}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      {range ? (
                        <>
                          <strong>Ideal (sugestivo):</strong> {range.min}–{range.max} caracteres
                        </>
                      ) : (
                        <>
                          <strong>Máximo no sistema:</strong> {text.maxLength} caracteres
                        </>
                      )}
                    </p>
                    {text.hint && (
                      <p className="text-xs text-gray-500 italic">{text.hint}</p>
                    )}
                  </div>

                  {/* Editor */}
                  <div className="lg:w-2/3">
                    <div className="space-y-3">
                      {/* Valor atual */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Valor Atual
                        </label>
                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border">
                          {text.value || <em className="text-gray-400">Vazio</em>}
                        </div>
                      </div>

                      {/* Editor */}
                      <div className={foraDoIdeal ? 'rounded-lg border-2 border-amber-400 bg-amber-50/60 p-3' : ''}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Novo Valor
                        </label>
                        <textarea
                          value={currentValue}
                          onChange={(e) => handleTextChange(key, e.target.value, text)}
                          placeholder={range ? `Ideal: ${range.min}–${range.max} caracteres (sugestivo)...` : `Digite o novo valor (máx. ${text.maxLength})...`}
                          maxLength={text.maxLength}
                          rows={3}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${foraDoIdeal ? 'border-amber-500' : 'border-gray-300'}`}
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          {range ? `Ideal: ${range.min}–${range.max} caracteres (sugestivo).` : `Máximo: ${text.maxLength} caracteres.`}
                        </p>
                        <div className="flex justify-between items-center mt-1 flex-wrap gap-1">
                          <span className={`text-xs ${foraDoIdeal ? 'text-amber-700 font-medium' : 'text-gray-500'}`}>
                            {currentValue.length}{range ? '' : `/${text.maxLength}`} caracteres
                            {foraDoIdeal && range && (
                              <span className="ml-1">
                                — fora do ideal ({currentValue.length < range.min ? 'abaixo de ' + range.min : 'acima de ' + range.max})
                              </span>
                            )}
                          </span>
                          {pendingChange && (
                            <span className="text-xs text-blue-600 font-medium">
                              Modificado
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      {pendingChange && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCancelChange(key)}
                            className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredTexts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum texto encontrado</p>
          </div>
        )}
      </main>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, FileText, Save, RefreshCw, Loader2, CheckCircle, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { getAllSections, getTextsBySection, getTextMetadata, type SiteText, type HeadingType } from '@/lib/site-texts'
import { SEO_CHAR_RANGES, isOutOfSuggestedRange, type SeoRole } from '@/lib/seo-headings'

/** Por seção e chave: qual papel SEO (H1/H2/H3/H4/label). Alinhado ao uso real nas páginas. */
const HEADING_RULES: Record<string, Record<string, { headingType: HeadingType }>> = {
  header: {
    'telefone': { headingType: 'label' },
    'menu_imoveis_penha': { headingType: 'label' },
    'menu_imoveis_picarras': { headingType: 'label' },
    'menu_imoveis_barra_velha': { headingType: 'label' },
  },
  footer: {
    'telefone': { headingType: 'label' },
    'texto_acompanhe': { headingType: 'label' },
    'copyright': { headingType: 'label' },
    'coluna_imoveis.titulo': { headingType: 'H3' },
    'coluna_imoveis.imoveis_venda': { headingType: 'label' },
    'coluna_imoveis.empreendimentos': { headingType: 'label' },
    'coluna_imoveis.favoritos': { headingType: 'label' },
    'coluna_servicos.titulo': { headingType: 'H3' },
    'coluna_servicos.anunciar_imovel': { headingType: 'label' },
    'coluna_servicos.encontre_meu_imovel': { headingType: 'label' },
    'coluna_servicos.como_comprar': { headingType: 'label' },
    'coluna_servicos.simular_financiamento': { headingType: 'label' },
    'coluna_institucional.titulo': { headingType: 'H3' },
    'coluna_institucional.quem_somos': { headingType: 'label' },
    'coluna_institucional.contato': { headingType: 'label' },
    'coluna_institucional.trabalhe_conosco': { headingType: 'label' },
    'coluna_localizacao.titulo': { headingType: 'H3' },
    'coluna_localizacao.viva_penha': { headingType: 'label' },
    'coluna_localizacao.viva_picarras': { headingType: 'label' },
    'coluna_localizacao.viva_barra_velha': { headingType: 'label' },
    'coluna_localizacao.blog': { headingType: 'label' },
    'central_atendimento.titulo': { headingType: 'H4' },
    'central_atendimento.creci': { headingType: 'label' },
    'central_atendimento.endereco': { headingType: 'label' },
    'central_atendimento.cidade': { headingType: 'label' },
    'central_atendimento.telefone_central': { headingType: 'label' },
    'central_atendimento.creci_sc': { headingType: 'label' },
  },
  home: {
    'banner.titulo': { headingType: 'H1' },
    'selecao_nox.titulo': { headingType: 'H2' },
    'encontre_imovel.titulo': { headingType: 'H2' },
    'encontre_imovel.penha.titulo': { headingType: 'H3' },
    'encontre_imovel.picarras.titulo': { headingType: 'H3' },
    'encontre_imovel.barra_velha.titulo': { headingType: 'H3' },
    'cta_atendimento.beneficio_1.titulo': { headingType: 'H3' },
    'cta_atendimento.beneficio_2.titulo': { headingType: 'H3' },
    'cta_atendimento.beneficio_3.titulo': { headingType: 'H3' },
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
    'imovel_praia.subtitulo': { headingType: 'H2' },
    'localizacao.titulo': { headingType: 'H2' },
    'como_funciona.passo_1.titulo': { headingType: 'H3' },
    'como_funciona.passo_2.titulo': { headingType: 'H3' },
    'como_funciona.passo_3.titulo': { headingType: 'H3' },
    'como_funciona.passo_4.titulo': { headingType: 'H3' },
    'cta_investimento.titulo': { headingType: 'H3' },
    'cta_investimento.subtitulo': { headingType: 'H3' },
    'anuncie.titulo': { headingType: 'H3' },
    'anuncie.subtitulo': { headingType: 'H3' },
  },
  encontre_meu_imovel: {
    'hero.titulo': { headingType: 'H1' },
    'como_funciona.titulo': { headingType: 'H2' },
    'cta_contato.titulo': { headingType: 'H2' },
    'como_funciona.passo_1.titulo': { headingType: 'H3' },
    'como_funciona.passo_2.titulo': { headingType: 'H3' },
    'como_funciona.passo_3.titulo': { headingType: 'H3' },
    'como_funciona.passo_4.titulo': { headingType: 'H3' },
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
    'vantagens.vantagem_1.titulo': { headingType: 'H3' },
    'vantagens.vantagem_2.titulo': { headingType: 'H3' },
    'vantagens.vantagem_3.titulo': { headingType: 'H3' },
    'vantagens.vantagem_4.titulo': { headingType: 'H3' },
  },
  viva_penha: {
    'hero.titulo': { headingType: 'H1' },
    'introducao.titulo': { headingType: 'H2' },
    'o_que_fazer.titulo': { headingType: 'H2' },
    'o_que_fazer.atracao_1': { headingType: 'H3' },
    'o_que_fazer.atracao_2': { headingType: 'H3' },
    'o_que_fazer.atracao_3': { headingType: 'H3' },
    'o_que_fazer.atracao_4': { headingType: 'H3' },
    'o_que_fazer.atracao_5': { headingType: 'H3' },
    'beneficios.infraestrutura.titulo': { headingType: 'H3' },
    'beneficios.atracoes.titulo': { headingType: 'H3' },
    'beneficios.seguranca.titulo': { headingType: 'H3' },
    'beneficios.diversidade.titulo': { headingType: 'H3' },
    'vantagens_investir.mercado_imobiliario.titulo': { headingType: 'H3' },
    'vantagens_investir.localizacao.titulo': { headingType: 'H3' },
    'vantagens_investir.qualidade_vida.titulo': { headingType: 'H3' },
    'vantagens_investir.turismo.titulo': { headingType: 'H3' },
    'cta_investimento.titulo': { headingType: 'H3' },
    'anuncie.titulo': { headingType: 'H3' },
    'anuncie.subtitulo': { headingType: 'H3' },
  },
  viva_balneario_picarras: {
    'hero.titulo': { headingType: 'H1' },
    'introducao.titulo': { headingType: 'H2' },
    'o_que_fazer.titulo': { headingType: 'H2' },
    'o_que_fazer.atracao_1': { headingType: 'H3' },
    'o_que_fazer.atracao_2': { headingType: 'H3' },
    'o_que_fazer.atracao_3': { headingType: 'H3' },
    'o_que_fazer.atracao_4': { headingType: 'H3' },
    'o_que_fazer.atracao_5': { headingType: 'H3' },
    'beneficios.infraestrutura.titulo': { headingType: 'H3' },
    'beneficios.atracoes.titulo': { headingType: 'H3' },
    'beneficios.seguranca.titulo': { headingType: 'H3' },
    'beneficios.diversidade.titulo': { headingType: 'H3' },
    'vantagens_investir.mercado_imobiliario.titulo': { headingType: 'H3' },
    'vantagens_investir.localizacao.titulo': { headingType: 'H3' },
    'vantagens_investir.qualidade_vida.titulo': { headingType: 'H3' },
    'vantagens_investir.turismo.titulo': { headingType: 'H3' },
    'cta_investimento.titulo': { headingType: 'H3' },
    'anuncie.titulo': { headingType: 'H3' },
    'anuncie.subtitulo': { headingType: 'H3' },
  },
  viva_barra_velha: {
    'hero.titulo': { headingType: 'H1' },
    'introducao.titulo': { headingType: 'H2' },
    'o_que_fazer.titulo': { headingType: 'H2' },
    'o_que_fazer.atracao_1': { headingType: 'H3' },
    'o_que_fazer.atracao_2': { headingType: 'H3' },
    'o_que_fazer.atracao_3': { headingType: 'H3' },
    'o_que_fazer.atracao_4': { headingType: 'H3' },
    'o_que_fazer.atracao_5': { headingType: 'H3' },
    'beneficios.infraestrutura.titulo': { headingType: 'H3' },
    'beneficios.atracoes.titulo': { headingType: 'H3' },
    'beneficios.seguranca.titulo': { headingType: 'H3' },
    'beneficios.diversidade.titulo': { headingType: 'H3' },
    'vantagens_investir.mercado_imobiliario.titulo': { headingType: 'H3' },
    'vantagens_investir.localizacao.titulo': { headingType: 'H3' },
    'vantagens_investir.qualidade_vida.titulo': { headingType: 'H3' },
    'vantagens_investir.turismo.titulo': { headingType: 'H3' },
    'cta_investimento.titulo': { headingType: 'H3' },
    'anuncie.titulo': { headingType: 'H3' },
    'anuncie.subtitulo': { headingType: 'H3' },
  },
  quem_somos: {
    'hero.titulo': { headingType: 'H1' },
    'nossa_historia.titulo': { headingType: 'H2' },
    'cta_trabalhe.titulo': { headingType: 'H2' },
    'missao_visao_valores.missao.titulo': { headingType: 'H3' },
    'missao_visao_valores.visao.titulo': { headingType: 'H3' },
    'missao_visao_valores.valores.titulo': { headingType: 'H3' },
  },
  'Guia Imóvel na Planta': {
    'hub.hero_label': { headingType: 'label' },
    'hub.hero_titulo': { headingType: 'H1' },
    'hub.hero_subtitulo': { headingType: 'label' },
    'hub.paragrafo_1': { headingType: 'paragrafo' },
    'hub.paragrafo_2': { headingType: 'paragrafo' },
    'hub.paragrafo_3': { headingType: 'paragrafo' },
    'hub.paragrafo_4': { headingType: 'paragrafo' },
    'hub.indice_titulo': { headingType: 'H2' },
    'hub.indice_subtitulo': { headingType: 'label' },
    'hub.perguntas_respostas_label': { headingType: 'label' },
    'hub.no_site_titulo': { headingType: 'H2' },
    'hub.link_ver_lancamentos': { headingType: 'label' },
    'hub.link_como_comprar_imovel': { headingType: 'label' },
    'hub.link_encontre_meu_imovel': { headingType: 'label' },
    'temas.tema_como_comprar': { headingType: 'label' },
    'temas.tema_fluxo': { headingType: 'label' },
    'temas.tema_fgts': { headingType: 'label' },
    'temas.tema_investir': { headingType: 'label' },
    'temas.tema_frente_mar': { headingType: 'label' },
    'temas.tema_seguranca': { headingType: 'label' },
  },
  'FAQ Imóvel na Planta': {
    'hero_titulo': { headingType: 'H1' },
    'hero_subtitulo': { headingType: 'label' },
    'hero_sublabel': { headingType: 'label' },
    'cta_texto': { headingType: 'label' },
    'cta_botao': { headingType: 'label' },
    'outros_temas_label': { headingType: 'label' },
    'link_como_comprar': { headingType: 'label' },
    'link_seguranca': { headingType: 'label' },
    'link_pagamento': { headingType: 'label' },
    'pergunta_1': { headingType: 'H3' },
    'pergunta_2': { headingType: 'H3' },
    'pergunta_3': { headingType: 'H3' },
    'pergunta_4': { headingType: 'H3' },
    'pergunta_5': { headingType: 'H3' },
    'pergunta_6': { headingType: 'H3' },
    'pergunta_7': { headingType: 'H3' },
    'pergunta_8': { headingType: 'H3' },
    'pergunta_9': { headingType: 'H3' },
    'pergunta_10': { headingType: 'H3' },
    'pergunta_11': { headingType: 'H3' },
    'pergunta_12': { headingType: 'H3' },
    'resposta_1': { headingType: 'paragrafo' },
    'resposta_2': { headingType: 'paragrafo' },
    'resposta_3': { headingType: 'paragrafo' },
    'resposta_4': { headingType: 'paragrafo' },
    'resposta_5': { headingType: 'paragrafo' },
    'resposta_6': { headingType: 'paragrafo' },
    'resposta_7': { headingType: 'paragrafo' },
    'resposta_8': { headingType: 'paragrafo' },
    'resposta_9': { headingType: 'paragrafo' },
    'resposta_10': { headingType: 'paragrafo' },
    'resposta_11': { headingType: 'paragrafo' },
    'resposta_12': { headingType: 'paragrafo' },
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

        {/* Papéis de texto (SEO e UI) — do header ao footer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm font-semibold text-amber-900 mb-2">📌 Papéis dos textos no site (header, páginas, footer)</p>
          <ul className="text-xs text-amber-800 space-y-1 list-disc list-inside">
            <li><strong>H1</strong> — Título principal da página. Só 1 por página. Ideal: 30–60 caracteres.</li>
            <li><strong>H2</strong> — Seções principais. Ideal: 25–60 caracteres.</li>
            <li><strong>H3</strong> — Sub-seções. Ideal: 20–50 caracteres.</li>
            <li><strong>H4</strong> — Títulos menores (ex.: rodapé). Ideal: 15–40 caracteres.</li>
            <li><strong>Label</strong> — Menus, links, botões, textos curtos. Ideal: 5–50 caracteres.</li>
            <li><strong>Parágrafo</strong> — Texto em bloco (&lt;p&gt;). Ideal: 150–2000 caracteres.</li>
          </ul>
          <p className="text-xs text-amber-700 mt-2">Se o texto sair do ideal, a caixa fica em amarelo (sugestivo; você pode salvar normalmente).</p>
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
            // Chaves vêm como "secao.sub.titulo"; HEADING_RULES usa só a parte relativa "sub.titulo"
            const relativeKey = key.startsWith(selectedSection + '.') ? key.slice(selectedSection.length + 1) : key
            const headingRule = HEADING_RULES[selectedSection]?.[relativeKey]
            const headingType = (text.headingType ?? headingRule?.headingType) as keyof typeof SEO_CHAR_RANGES | undefined
            // Sempre exibir papel e ideal: se não tiver regra, usar "label" para todas as abas se comportarem igual
            const role: keyof typeof SEO_CHAR_RANGES = (headingType && headingType in SEO_CHAR_RANGES ? headingType : 'label') as keyof typeof SEO_CHAR_RANGES
            const range = SEO_CHAR_RANGES[role]
            const foraDoIdeal = isOutOfSuggestedRange(role as SeoRole, currentValue.length)

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
                      <strong>Ideal (sugestivo):</strong> {range.min}–{range.max} caracteres
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
                          placeholder={`Ideal: ${range.min}–${range.max} caracteres (sugestivo)...`}
                          rows={3}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${foraDoIdeal ? 'border-amber-500' : 'border-gray-300'}`}
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          Ideal: {range.min}–{range.max} caracteres (sugestivo).
                        </p>
                        <div className="flex justify-between items-center mt-1 flex-wrap gap-1">
                          <span className={`text-xs ${foraDoIdeal ? 'text-amber-700 font-medium' : 'text-gray-500'}`}>
                            {currentValue.length} caracteres
                            {foraDoIdeal && (
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
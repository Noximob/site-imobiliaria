'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Building, Plus, X, Edit, Trash2, Image as ImageIcon, Star } from 'lucide-react'
import Link from 'next/link'
import { createImovelWithFotos, getAllImoveis, generateSlug, updateImovelWithFotos, deleteImovel } from '@/lib/imoveis-github'
import { Imovel } from '@/types'
import { formatPrice } from '@/lib/imoveis'
import { getDWVImovelFotos } from '@/lib/dwv-api'

export default function AdminImoveis() {
  const [imoveis, setImoveis] = useState<Imovel[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingImovel, setEditingImovel] = useState<Imovel | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [novoImovel, setNovoImovel] = useState({
    titulo: '',
    descricao: '',
    preco: 0,
    precoOriginal: 0,
    tipo: 'apartamento' as 'apartamento' | 'cobertura' | 'comercial',
    status: 'prontos' as 'prontos' | 'lancamento' | 'em-construcao',
    endereco: {
      cidade: '',
      bairro: '',
      rua: '',
      numero: '',
      cep: '',
      estado: 'SC'
    },
    caracteristicas: {
      quartos: 0,
      banheiros: 0,
      vagas: 0,
      area: 0,
      areaTerreno: 0,
      suite: 0,
      frenteMar: false,
      piscina: false,
      churrasqueira: false,
      academia: false,
      portaria: false,
      elevador: false,
      varanda: false,
      sacada: false,
      extras: [] as string[]
    },
    infraestrutura: [] as string[],
    tags: [] as string[],
    coordenadas: {
      lat: 0,
      lng: 0
    },
    visualizacoes: 0,
    contato: {
      whatsapp: '(47) 99753-0113'
    },
    publicado: true
  })
  // Lista fixa de comodidades (exatamente como no filtro + Home Club completo)
  const comodidadesDisponiveis = [
    'Mobiliado',
    'Frente Mar',
    'Vista Mar',
    'Quadra Mar',
    'Área de Lazer',
    'Home Club completo'
  ]
  
  const [comodidadesSelecionadas, setComodidadesSelecionadas] = useState<string[]>([])
  const [statusImovel, setStatusImovel] = useState<'prontos' | 'lancamento' | ''>('')
  const [fotosFiles, setFotosFiles] = useState<File[]>([])
  const [fotosPreviews, setFotosPreviews] = useState<string[]>([])
  const [fotosExistentes, setFotosExistentes] = useState<string[]>([]) // Fotos já salvas
  const [fotoPrincipalIndex, setFotoPrincipalIndex] = useState<number>(0)
  const [maisFotosFiles, setMaisFotosFiles] = useState<File[]>([]) // Fotos extras para galeria
  const [maisFotosPreviews, setMaisFotosPreviews] = useState<string[]>([]) // Preview das fotos extras
  const [fotosDWV, setFotosDWV] = useState<Array<{ url: string, hasMedium: boolean }>>([]) // Todas as fotos disponíveis do DWV
  const [carregandoFotosDWV, setCarregandoFotosDWV] = useState(false)
  // Seleção simples do DWV
  const [fotoPrincipalDWV, setFotoPrincipalDWV] = useState<string | null>(null) // URL da foto principal escolhida do DWV
  const [fotosMenoresDWV, setFotosMenoresDWV] = useState<string[]>([]) // URLs das 4 fotos menores escolhidas do DWV
  const [aspectRatios, setAspectRatios] = useState<Record<string, number>>({}) // Cache de aspect ratios das fotos
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [tipoFilter, setTipoFilter] = useState('todos')

  // Carregar imóveis do GitHub
  useEffect(() => {
    const loadImoveis = async () => {
      try {
        const imoveisGithub = await getAllImoveis()
        setImoveis(imoveisGithub)
      } catch (error) {
        console.error('Erro ao carregar imóveis:', error)
      }
    }
    loadImoveis()
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR')
  }

  // Função para detectar aspect ratio de uma imagem (fotos horizontais/quadradas são ideais para 4 menores)
  const detectarAspectRatio = (url: string): Promise<number> => {
    return new Promise((resolve) => {
      // Se já temos no cache, retornar
      if (aspectRatios[url]) {
        resolve(aspectRatios[url])
        return
      }
      
      const img = new Image()
      img.onload = () => {
        const ratio = img.width / img.height
        setAspectRatios(prev => ({ ...prev, [url]: ratio }))
        resolve(ratio)
      }
      img.onerror = () => {
        // Se der erro, assumir ratio 1 (quadrado)
        resolve(1)
      }
      img.src = url
    })
  }

  // Verificar se foto é ideal para 4 menores (horizontal ou quadrada: ratio >= 1)
  const isIdealParaMenores = (fotoDWV: { url: string, hasMedium: boolean }): boolean => {
    // Se tem medium size, geralmente é mais horizontal
    if (fotoDWV.hasMedium) return true
    
    // Verificar aspect ratio se já foi detectado
    const ratio = aspectRatios[fotoDWV.url]
    if (ratio !== undefined) {
      return ratio >= 1 // Horizontal ou quadrada
    }
    
    // Se ainda não detectou, iniciar detecção em background
    detectarAspectRatio(fotoDWV.url)
    
    return false
  }

  const handleFotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      // Adicionar novas fotos às existentes (não substituir)
      setFotosFiles(prev => [...prev, ...files])
      const readers = files.map(file => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        return new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string)
        })
      })
      
      Promise.all(readers).then(previews => {
        setFotosPreviews(prev => [...prev, ...previews])
      })
    }
  }

  const handleMaisFotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      // Adicionar fotos extras para galeria
      setMaisFotosFiles(prev => [...prev, ...files])
      const readers = files.map(file => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        return new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string)
        })
      })
      
      Promise.all(readers).then(previews => {
        setMaisFotosPreviews(prev => [...prev, ...previews])
      })
    }
  }

  const removeMaisFoto = (index: number) => {
    const newFotos = [...maisFotosFiles]
    const newPreviews = [...maisFotosPreviews]
    newFotos.splice(index, 1)
    newPreviews.splice(index, 1)
    setMaisFotosFiles(newFotos)
    setMaisFotosPreviews(newPreviews)
  }

  const removeFoto = (index: number, isExistente: boolean) => {
    if (isExistente) {
      // Remover foto existente
      const novasFotos = [...fotosExistentes]
      novasFotos.splice(index, 1)
      setFotosExistentes(novasFotos)
      // Ajustar índice da foto principal se necessário
      if (fotoPrincipalIndex === index) {
        setFotoPrincipalIndex(0)
      } else if (fotoPrincipalIndex > index) {
        setFotoPrincipalIndex(fotoPrincipalIndex - 1)
      }
    } else {
      // Remover foto nova (preview)
      const indexNovo = index - fotosExistentes.length
      const newFotos = [...fotosFiles]
      const newPreviews = [...fotosPreviews]
      newFotos.splice(indexNovo, 1)
      newPreviews.splice(indexNovo, 1)
      setFotosFiles(newFotos)
      setFotosPreviews(newPreviews)
    }
  }

  const definirFotoPrincipal = (index: number) => {
    setFotoPrincipalIndex(index)
  }

  const reordenarFoto = (indexAtual: number, novaPosicao: number) => {
    const todasFotos = [...fotosExistentes, ...fotosPreviews]
    if (indexAtual === novaPosicao) return
    
    const fotoMovida = todasFotos[indexAtual]
    const novasFotos = [...todasFotos]
    novasFotos.splice(indexAtual, 1)
    novasFotos.splice(novaPosicao, 0, fotoMovida)
    
    // Separar novamente entre existentes e novas
    const novasExistentes = novasFotos.filter(f => fotosExistentes.includes(f))
    const novasPreviews = novasFotos.filter(f => !fotosExistentes.includes(f))
    
    setFotosExistentes(novasExistentes)
    setFotosPreviews(novasPreviews)
    
    // Ajustar índice da foto principal
    if (fotoPrincipalIndex === indexAtual) {
      setFotoPrincipalIndex(novaPosicao)
    } else if (fotoPrincipalIndex === novaPosicao) {
      setFotoPrincipalIndex(indexAtual)
    }
  }

  const handleEdit = async (imovel: Imovel) => {
    setEditingImovel(imovel)
    setNovoImovel({
      titulo: imovel.titulo,
      descricao: imovel.descricao,
      preco: imovel.preco,
      precoOriginal: (imovel as any).precoOriginal || 0,
      tipo: (imovel.tipo === 'apartamento' || imovel.tipo === 'cobertura' || imovel.tipo === 'comercial') 
        ? imovel.tipo 
        : 'apartamento' as 'apartamento' | 'cobertura' | 'comercial',
      status: imovel.status,
      endereco: { ...imovel.endereco },
      caracteristicas: { 
        ...imovel.caracteristicas,
        areaTerreno: imovel.caracteristicas.areaTerreno || 0,
        suite: (imovel.caracteristicas as any).suite || 0,
        extras: (imovel.caracteristicas as any).extras || []
      },
      infraestrutura: (imovel as any).infraestrutura || [],
      tags: (imovel as any).tags || [],
      coordenadas: imovel.coordenadas || { lat: 0, lng: 0 },
      visualizacoes: (imovel as any).visualizacoes || 0,
      contato: {
        ...imovel.contato
      },
      publicado: imovel.publicado
    })
    // Carregar comodidades do imóvel
    const comodidadesCarregadas: string[] = []
    if ((imovel as any).tags) {
      // Verificar quais comodidades estão nas tags
      comodidadesDisponiveis.forEach(comodidade => {
        if ((imovel as any).tags.includes(comodidade)) {
          comodidadesCarregadas.push(comodidade)
        }
      })
    }
    // Verificar também nas características booleanas (compatibilidade)
    if (imovel.caracteristicas.frenteMar && !comodidadesCarregadas.includes('Frente Mar')) {
      comodidadesCarregadas.push('Frente Mar')
    }
    setComodidadesSelecionadas(comodidadesCarregadas)
    
    // Carregar status do imóvel (prontos/lancamento) - agora é o status principal
    const statusValue = imovel.status || (imovel as any).statusImovel || 'prontos'
    setStatusImovel(statusValue as 'prontos' | 'lancamento' | '')
    
    // Separar fotos principais (primeiras 5) das extras (restantes)
    const todasFotosExistentes = imovel.fotos || []
    const fotosPrincipais = todasFotosExistentes.slice(0, 5)
    const fotosExtrasExistentes = todasFotosExistentes.slice(5)
    
    setFotosFiles([])
    setFotosPreviews([])
    setFotosExistentes(fotosPrincipais)
    setFotoPrincipalIndex((imovel as any).fotoPrincipalIndex || 0)
    setMaisFotosFiles([])
    setMaisFotosPreviews(fotosExtrasExistentes) // Carregar fotos extras existentes como previews
    
    // Se é imóvel do DWV, buscar todas as fotos disponíveis da API
    const dwvId = (imovel as any).dwvId
    if (dwvId) {
      setCarregandoFotosDWV(true)
      try {
        const todasFotosDWV = await getDWVImovelFotos(dwvId)
        setFotosDWV(todasFotosDWV)
        
        // Carregar seleções salvas do DWV
        const principalSalva = (imovel as any).fotoPrincipalDWV || null
        const menoresSalvas = (imovel as any).fotosMenoresDWV || []
        setFotoPrincipalDWV(principalSalva)
        setFotosMenoresDWV(menoresSalvas)
      } catch (error) {
        console.error('Erro ao buscar fotos do DWV:', error)
        setFotosDWV([])
      } finally {
        setCarregandoFotosDWV(false)
      }
    } else {
      setFotosDWV([])
      setFotoPrincipalDWV(null)
      setFotosMenoresDWV([])
    }
    
    setShowCreateForm(true)
  }

  const handleToggleSelecaoNox = async (imovel: Imovel) => {
    if (!confirm(`Deseja ${(imovel as any).selecaoNox ? 'remover' : 'adicionar'} este imóvel da Seleção Nox?`)) {
      return
    }

    try {
      // Verificar se já existem 3 imóveis selecionados
      const imoveisSelecionados = imoveis.filter(i => (i as any).selecaoNox === true).length
      const novoValor = !(imovel as any).selecaoNox
      
      if (novoValor && imoveisSelecionados >= 3) {
        alert('Você já selecionou 3 imóveis para a Seleção Nox. Desmarque um imóvel antes de selecionar este.')
        return
      }

      // Atualizar apenas o campo selecaoNox - garantir que seja boolean
      await updateImovelWithFotos(imovel.id, {
        ...imovel,
        selecaoNox: Boolean(novoValor)
      }, undefined)

      // Recarregar lista de imóveis (incluindo não publicados para admin)
      const imoveisAtualizados = await getAllImoveis(true)
      setImoveis(imoveisAtualizados)
      alert(`Imóvel ${novoValor ? 'adicionado' : 'removido'} da Seleção Nox com sucesso!`)
    } catch (error) {
      console.error('Erro ao atualizar seleção Nox:', error)
      alert('Erro ao atualizar seleção Nox. Tente novamente.')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este imóvel?')) {
      try {
        await deleteImovel(id)
        const imoveisAtualizados = await getAllImoveis()
        setImoveis(imoveisAtualizados)
        alert('Imóvel excluído com sucesso!')
      } catch (error: any) {
        console.error('Erro ao excluir imóvel:', error)
        alert('Erro ao excluir imóvel: ' + (error.message || error))
      }
    }
  }

  const resetForm = () => {
    setNovoImovel({
      titulo: '',
      descricao: '',
      preco: 0,
      precoOriginal: 0,
      tipo: 'apartamento',
      status: 'prontos',
      endereco: {
        cidade: '',
        bairro: '',
        rua: '',
        numero: '',
        cep: '',
        estado: 'SC'
      },
      caracteristicas: {
        quartos: 0,
        banheiros: 0,
        vagas: 0,
        area: 0,
        areaTerreno: 0,
        suite: 0,
        frenteMar: false,
        piscina: false,
        churrasqueira: false,
        academia: false,
        portaria: false,
        elevador: false,
        varanda: false,
        sacada: false,
        extras: []
      },
      infraestrutura: [],
      tags: [],
      coordenadas: { lat: 0, lng: 0 },
      visualizacoes: 0,
      contato: {
        whatsapp: '(47) 99753-0113'
      },
      publicado: true
    })
    setComodidadesSelecionadas([])
    setStatusImovel('')
    setFotosFiles([])
    setFotosPreviews([])
    setFotosExistentes([])
    setFotoPrincipalIndex(0)
    setMaisFotosFiles([])
    setMaisFotosPreviews([])
    setFotoPrincipalDWV(null)
    setFotosMenoresDWV([])
    setEditingImovel(null)
    setShowCreateForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!novoImovel.titulo || !novoImovel.descricao || !novoImovel.endereco.cidade) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    // Para criação, pelo menos uma foto é obrigatória
    if (!editingImovel && fotosFiles.length === 0) {
      alert('Selecione pelo menos uma foto')
      return
    }

    setIsLoading(true)
    try {
      // Processar comodidades selecionadas
      const tagsList = comodidadesSelecionadas.filter(tag => tag.length > 0)

      // Mapear comodidades para booleanas (compatibilidade com site principal)
      const frenteMar = tagsList.includes('Frente Mar')
      const mobiliado = tagsList.includes('Mobiliado')
      const vistaMar = tagsList.includes('Vista Mar')
      const quadraMar = tagsList.includes('Quadra Mar')
      const areaLazer = tagsList.includes('Área de Lazer')
      const homeClub = tagsList.includes('Home Club completo')

      // Organizar fotos: se for imóvel do DWV com seleções, usar essas seleções
      let fotosOrdenadas: string[] = []
      
      if (fotoPrincipalDWV && fotosDWV.length > 0) {
        // Imóvel do DWV com seleções: organizar principal + menores selecionadas + resto
        fotosOrdenadas = [fotoPrincipalDWV, ...fotosMenoresDWV]
        
        // Adicionar fotos restantes do DWV (que não foram escolhidas)
        const fotosEscolhidas = new Set([fotoPrincipalDWV, ...fotosMenoresDWV])
        const fotosRestantesDWV = fotosDWV
          .map(f => f.url)
          .filter(url => !fotosEscolhidas.has(url))
        fotosOrdenadas = [...fotosOrdenadas, ...fotosRestantesDWV]
      } else if (fotoPrincipalDWV) {
        // Se só tem principal mas não tem menores ainda, usar só a principal + resto
        fotosOrdenadas = [fotoPrincipalDWV]
        const fotosRestantesDWV = fotosDWV
          .map(f => f.url)
          .filter(url => url !== fotoPrincipalDWV)
        fotosOrdenadas = [...fotosOrdenadas, ...fotosRestantesDWV]
      } else {
        // Lógica antiga para imóveis não-DWV ou sem seleções
        const todasFotos = [...fotosExistentes, ...fotosPreviews]
        fotosOrdenadas = [...todasFotos]
        
        // Se há foto principal definida e não está na primeira posição, mover para o início
        if (fotoPrincipalIndex > 0 && fotoPrincipalIndex < fotosOrdenadas.length) {
          const fotoPrincipal = fotosOrdenadas[fotoPrincipalIndex]
          fotosOrdenadas.splice(fotoPrincipalIndex, 1)
          fotosOrdenadas.unshift(fotoPrincipal)
        }
      }

      // Adicionar fotos extras ao final (só aparecem na galeria)
      fotosOrdenadas = [...fotosOrdenadas, ...maisFotosPreviews]

      const imovelData = {
        titulo: novoImovel.titulo,
        slug: generateSlug(novoImovel.titulo),
        descricao: novoImovel.descricao,
        preco: novoImovel.preco,
        precoOriginal: novoImovel.precoOriginal > 0 ? novoImovel.precoOriginal : undefined,
        tipo: novoImovel.tipo,
        status: statusImovel || 'prontos',
        endereco: novoImovel.endereco,
        caracteristicas: {
          ...novoImovel.caracteristicas,
          frenteMar,
          piscina: false,
          churrasqueira: false,
          academia: false,
          portaria: false,
          elevador: false,
          varanda: false,
          sacada: false,
          extras: undefined
        },
        infraestrutura: undefined,
        tags: tagsList.length > 0 ? tagsList : undefined,
        coordenadas: novoImovel.coordenadas.lat !== 0 && novoImovel.coordenadas.lng !== 0 
          ? novoImovel.coordenadas 
          : undefined,
        visualizacoes: novoImovel.visualizacoes || 0,
        contato: novoImovel.contato,
        publicado: novoImovel.publicado,
        fotoPrincipalIndex: 0,
        fotos: fotosOrdenadas,
        // Salvar seleções do DWV
        fotoPrincipalDWV: fotoPrincipalDWV || undefined,
        fotosMenoresDWV: fotosMenoresDWV.length > 0 ? fotosMenoresDWV : undefined
      }

      if (editingImovel) {
        // Editar imóvel existente - enviar novas fotos principais + fotos extras
        const todasFotosNovas = [...fotosFiles, ...maisFotosFiles]
        await updateImovelWithFotos(editingImovel.id, imovelData, todasFotosNovas.length > 0 ? todasFotosNovas : undefined)
        alert('Imóvel atualizado com sucesso!')
      } else {
        // Criar novo imóvel - todas as fotos são novas (principais + extras)
        const todasFotosNovas = [...fotosFiles, ...maisFotosFiles]
        await createImovelWithFotos(imovelData, todasFotosNovas)
        alert('Imóvel criado com sucesso!')
      }
      
      // Recarregar imóveis do GitHub
      const imoveisAtualizados = await getAllImoveis()
      setImoveis(imoveisAtualizados)
      
      // Resetar formulário
      resetForm()
    } catch (error: any) {
      console.error('Erro ao salvar imóvel:', error)
      alert('Erro ao salvar imóvel: ' + (error.message || error))
    } finally {
      setIsLoading(false)
    }
  }

  const filteredImoveis = imoveis.filter(imovel => {
    const matchesSearch = imovel.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         imovel.endereco.cidade.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || imovel.status === statusFilter
    const matchesTipo = tipoFilter === 'todos' || imovel.tipo === tipoFilter
    return matchesSearch && matchesStatus && matchesTipo
  })

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link 
                href="/administrador"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Building className="w-8 h-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Gerenciar Imóveis
              </h1>
            </div>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Imóvel
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{imoveis.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Building className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Publicados</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {imoveis.filter(i => i.publicado).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Building className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Rascunhos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {imoveis.filter(i => !i.publicado).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Lançamentos</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {imoveis.filter(i => i.status === 'lancamento').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
                <input
                  type="text"
                  placeholder="Título, cidade..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="prontos">Imóveis Prontos</option>
                <option value="lancamento">Lançamento/em construção</option>
              </select>
            </div>
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={tipoFilter}
                onChange={(e) => setTipoFilter(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="apartamento">Apartamento</option>
                <option value="casa">Casa</option>
                <option value="terreno">Terreno</option>
                <option value="comercial">Comercial</option>
              </select>
            </div>
          </div>
        </div>

        {/* Formulário de Criação */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingImovel ? 'Editar Imóvel' : 'Criar Novo Imóvel'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Básicas */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={novoImovel.titulo}
                      onChange={(e) => setNovoImovel({...novoImovel, titulo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Ex: Apartamento Frente Mar"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço (R$) *
                    </label>
                    <input
                      type="number"
                      value={novoImovel.preco || ''}
                      onChange={(e) => setNovoImovel({...novoImovel, preco: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Original (R$) - Para desconto
                    </label>
                    <input
                      type="number"
                      value={novoImovel.precoOriginal || ''}
                      onChange={(e) => setNovoImovel({...novoImovel, precoOriginal: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0 (opcional)"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Deixe em branco se não houver desconto</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo *
                    </label>
                    <select
                      value={novoImovel.tipo}
                      onChange={(e) => setNovoImovel({...novoImovel, tipo: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="apartamento">Apartamento</option>
                      <option value="cobertura">Cobertura/Diferenciado</option>
                      <option value="comercial">Salas Comerciais</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={statusImovel}
                      onChange={(e) => setStatusImovel(e.target.value as 'prontos' | 'lancamento' | '')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="prontos">Imóveis Prontos</option>
                      <option value="lancamento">Lançamento/em construção</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição *
                    </label>
                    <textarea
                      value={novoImovel.descricao}
                      onChange={(e) => setNovoImovel({...novoImovel, descricao: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Descrição completa do imóvel"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade *
                    </label>
                    <select
                      value={novoImovel.endereco.cidade}
                      onChange={(e) => setNovoImovel({
                        ...novoImovel, 
                        endereco: {...novoImovel.endereco, cidade: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Selecione</option>
                      <option value="penha">Penha</option>
                      <option value="barra-velha">Barra Velha</option>
                      <option value="balneario-picarras">Balneário Piçarras</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bairro
                    </label>
                    <input
                      type="text"
                      value={novoImovel.endereco.bairro}
                      onChange={(e) => setNovoImovel({
                        ...novoImovel, 
                        endereco: {...novoImovel.endereco, bairro: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Ex: Centro"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rua
                    </label>
                    <input
                      type="text"
                      value={novoImovel.endereco.rua}
                      onChange={(e) => setNovoImovel({
                        ...novoImovel, 
                        endereco: {...novoImovel.endereco, rua: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Nome da rua"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número
                    </label>
                    <input
                      type="text"
                      value={novoImovel.endereco.numero}
                      onChange={(e) => setNovoImovel({
                        ...novoImovel, 
                        endereco: {...novoImovel.endereco, numero: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Número"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CEP
                    </label>
                    <input
                      type="text"
                      value={novoImovel.endereco.cep}
                      onChange={(e) => setNovoImovel({
                        ...novoImovel, 
                        endereco: {...novoImovel.endereco, cep: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="00000-000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <input
                      type="text"
                      value={novoImovel.endereco.estado}
                      onChange={(e) => setNovoImovel({
                        ...novoImovel, 
                        endereco: {...novoImovel.endereco, estado: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="SC"
                    />
                  </div>
                </div>
              </div>

              {/* Características do Imóvel */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Características do Imóvel</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quartos
                    </label>
                    <input
                      type="number"
                      value={novoImovel.caracteristicas.quartos || ''}
                      onChange={(e) => setNovoImovel({
                        ...novoImovel, 
                        caracteristicas: {...novoImovel.caracteristicas, quartos: Number(e.target.value)}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banheiros
                    </label>
                    <input
                      type="number"
                      value={novoImovel.caracteristicas.banheiros || ''}
                      onChange={(e) => setNovoImovel({
                        ...novoImovel, 
                        caracteristicas: {...novoImovel.caracteristicas, banheiros: Number(e.target.value)}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vagas
                    </label>
                    <input
                      type="number"
                      value={novoImovel.caracteristicas.vagas || ''}
                      onChange={(e) => setNovoImovel({
                        ...novoImovel, 
                        caracteristicas: {...novoImovel.caracteristicas, vagas: Number(e.target.value)}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Área (m²)
                    </label>
                    <input
                      type="number"
                      value={novoImovel.caracteristicas.area || ''}
                      onChange={(e) => setNovoImovel({
                        ...novoImovel, 
                        caracteristicas: {...novoImovel.caracteristicas, area: Number(e.target.value)}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Área do Terreno (m²)
                    </label>
                    <input
                      type="number"
                      value={novoImovel.caracteristicas.areaTerreno || ''}
                      onChange={(e) => setNovoImovel({
                        ...novoImovel, 
                        caracteristicas: {...novoImovel.caracteristicas, areaTerreno: Number(e.target.value)}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Comodidades */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Comodidades</h3>
                <div className="space-y-3">
                  {comodidadesDisponiveis.map((comodidade) => (
                    <label key={comodidade} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={comodidadesSelecionadas.includes(comodidade)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setComodidadesSelecionadas([...comodidadesSelecionadas, comodidade])
                          } else {
                            setComodidadesSelecionadas(comodidadesSelecionadas.filter(c => c !== comodidade))
                          }
                        }}
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-gray-700">{comodidade}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Coordenadas para Mapa */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Localização no Mapa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={novoImovel.coordenadas.lat || ''}
                      onChange={(e) => setNovoImovel({
                        ...novoImovel,
                        coordenadas: { ...novoImovel.coordenadas, lat: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Ex: -26.7700"
                    />
                    <p className="text-xs text-gray-500 mt-1">Coordenada para exibir no mapa</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={novoImovel.coordenadas.lng || ''}
                      onChange={(e) => setNovoImovel({
                        ...novoImovel,
                        coordenadas: { ...novoImovel.coordenadas, lng: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Ex: -48.6800"
                    />
                    <p className="text-xs text-gray-500 mt-1">Coordenada para exibir no mapa</p>
                  </div>
                </div>
              </div>

              {/* Contato */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Contato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      WhatsApp *
                    </label>
                    <input
                      type="text"
                      value={novoImovel.contato.whatsapp}
                      onChange={(e) => setNovoImovel({
                        ...novoImovel, 
                        contato: {...novoImovel.contato, whatsapp: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="(47) 99753-0113"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Fotos */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Fotos</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adicionar Novas Fotos {!editingImovel && '*'}
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    {editingImovel 
                      ? 'Selecione novas fotos para adicionar às existentes. As fotos antigas serão preservadas. As primeiras 5 fotos aparecem na página principal, todas aparecem na galeria completa.'
                      : 'Selecione uma ou mais fotos do imóvel. A primeira foto será a principal. As primeiras 5 fotos aparecem na página principal, todas aparecem na galeria completa.'}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFotosChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required={!editingImovel && fotosExistentes.length === 0 && fotosPreviews.length === 0}
                  />
                  
                  {/* Seção: Fotos do DWV - SIMPLES E DIRETO */}
                  {fotosDWV.length > 0 && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">
                        📷 Escolher Fotos do DWV ({fotosDWV.length} fotos disponíveis)
                      </h4>
                      
                      {/* Preview do que está selecionado */}
                      <div className="mb-4 p-3 bg-white rounded-lg border-2 border-purple-200">
                        <div className="grid grid-cols-2 gap-2" style={{ height: '200px' }}>
                          {/* Principal */}
                          <div className="relative rounded overflow-hidden border-2 border-purple-600">
                            {fotoPrincipalDWV ? (
                              <img src={fotoPrincipalDWV} alt="Principal" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <span className="text-xs text-gray-400">Principal</span>
                              </div>
                            )}
                          </div>
                          {/* 4 Menores */}
                          <div className="grid grid-cols-2 grid-rows-2 gap-1">
                            {[0, 1, 2, 3].map((pos) => {
                              const url = fotosMenoresDWV[pos]
                              return (
                                <div key={pos} className="relative rounded overflow-hidden border border-green-500">
                                  {url ? (
                                    <img src={url} alt={`Menor ${pos + 1}`} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                      <span className="text-xs text-gray-400">{pos + 1}</span>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        {(!fotoPrincipalDWV || fotosMenoresDWV.length < 4) && (
                          <p className="text-xs text-amber-600 mt-2 text-center">
                            ⚠️ {!fotoPrincipalDWV ? 'Selecione uma foto principal' : `Faltam ${4 - fotosMenoresDWV.length} foto(s)`}
                          </p>
                        )}
                      </div>
                      
                      {/* Galeria do DWV */}
                      {carregandoFotosDWV ? (
                        <p className="text-xs text-gray-500">Carregando fotos do DWV...</p>
                      ) : (
                        <>
                          <p className="text-xs text-gray-600 mb-3">
                            <strong>Clique:</strong> Trocar Principal | <strong>Shift+Clique:</strong> Trocar nas 4 Menores
                            <br />
                            <span className="text-blue-600">Fotos com borda azul são ideais para as 4 menores (horizontais)</span>
                          </p>
                          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto">
                            {fotosDWV.map((fotoDWV, index) => {
                              const isPrincipal = fotoPrincipalDWV === fotoDWV.url
                              const isMenor = fotosMenoresDWV.includes(fotoDWV.url)
                              const posMenor = isMenor ? fotosMenoresDWV.indexOf(fotoDWV.url) + 1 : 0
                              const isIdeal = isIdealParaMenores(fotoDWV)
                              
                              return (
                                <div
                                  key={index}
                                  onClick={(e) => {
                                    if (e.shiftKey) {
                                      // Shift+Clique: trocar nas 4 menores
                                      if (isMenor) {
                                        // Se já está nas menores, remover
                                        setFotosMenoresDWV(prev => prev.filter(url => url !== fotoDWV.url))
                                      } else {
                                        // Adicionar (substitui primeira se já tiver 4)
                                        if (fotosMenoresDWV.length < 4) {
                                          setFotosMenoresDWV(prev => [...prev, fotoDWV.url])
                                        } else {
                                          setFotosMenoresDWV(prev => [fotoDWV.url, ...prev.slice(1)])
                                        }
                                      }
                                    } else {
                                      // Clique normal: trocar principal
                                      setFotoPrincipalDWV(fotoDWV.url)
                                      if (isMenor) {
                                        setFotosMenoresDWV(prev => prev.filter(url => url !== fotoDWV.url))
                                      }
                                    }
                                  }}
                                  className={`relative cursor-pointer border-2 rounded overflow-hidden transition-all ${
                                    isPrincipal ? 'border-purple-600 ring-2 ring-purple-300' :
                                    isMenor ? 'border-green-500 ring-1 ring-green-300' :
                                    isIdeal ? 'border-blue-400 ring-1 ring-blue-200' :
                                    'border-gray-300 hover:border-gray-400'
                                  }`}
                                >
                                  <img
                                    src={fotoDWV.url}
                                    alt={`Foto ${index + 1}`}
                                    className="w-full h-20 object-cover"
                                    onLoad={() => detectarAspectRatio(fotoDWV.url)}
                                  />
                                  {isPrincipal && (
                                    <div className="absolute top-0 left-0 bg-purple-600 text-white text-xs px-1 py-0.5 rounded-br font-medium">
                                      Principal
                                    </div>
                                  )}
                                  {isMenor && !isPrincipal && (
                                    <div className="absolute top-0 left-0 bg-green-600 text-white text-xs px-1 py-0.5 rounded-br font-medium">
                                      {posMenor}/4
                                    </div>
                                  )}
                                  {isIdeal && !isPrincipal && !isMenor && (
                                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1 py-0.5 rounded-bl font-medium">
                                      ⭐
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Grid de todas as fotos (existentes + novas) */}
                  {(fotosExistentes.length > 0 || fotosPreviews.length > 0) && (
                    <div className="mt-4 space-y-6">
                      {/* Seção: Foto Principal */}
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          📸 Foto Principal (Grande - Em Cima)
                        </h4>
                        <p className="text-xs text-gray-600 mb-3">
                          Esta foto aparecerá grande na parte superior da página do imóvel.
                        </p>
                        {fotoPrincipalIndex >= 0 && fotoPrincipalIndex < fotosExistentes.length + fotosPreviews.length ? (
                          <div className="relative group border-2 border-purple-600 ring-2 ring-purple-300 rounded-lg overflow-hidden max-w-xs">
                            <img
                              src={[...fotosExistentes, ...fotosPreviews][fotoPrincipalIndex]}
                              alt="Foto Principal"
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                              Principal
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-amber-600">⚠️ Selecione uma foto principal abaixo.</p>
                        )}
                      </div>

                      {/* Seção: Todas as Fotos Disponíveis */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          📚 Todas as Fotos Disponíveis ({fotosExistentes.length + fotosPreviews.length})
                        </h4>
                        <p className="text-xs text-gray-500 mb-3">
                          A primeira foto será a principal (grande). As próximas 4 aparecerão no grid 2x2. Reordene as fotos arrastando ou use os botões para definir a principal.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[...fotosExistentes, ...fotosPreviews].map((foto, index) => {
                            const isPrincipal = index === fotoPrincipalIndex
                            const isExistente = index < fotosExistentes.length
                            
                            return (
                              <div 
                                key={index} 
                                className={`relative group border-2 rounded-md overflow-hidden ${
                                  isPrincipal ? 'border-purple-600 ring-2 ring-purple-300' : 
                                  index >= 1 && index < 5 ? 'border-green-500 ring-2 ring-green-300' : 
                                  'border-gray-200'
                                }`}
                              >
                                <img
                                  src={foto}
                                  alt={`Foto ${index + 1}`}
                                  className="w-full h-32 object-cover"
                                />
                                {isPrincipal && (
                                  <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded font-medium">
                                    Principal
                                  </div>
                                )}
                                {!isPrincipal && index >= 1 && index < 5 && (
                                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-medium">
                                    4 Menores ({index})
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 flex-wrap">
                                  {!isPrincipal && (
                                    <button
                                      type="button"
                                      onClick={() => definirFotoPrincipal(index)}
                                      className="opacity-0 group-hover:opacity-100 bg-purple-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-purple-700 transition-opacity"
                                      title="Definir como foto principal"
                                    >
                                      Principal
                                    </button>
                                  )}
                                  {!isPrincipal && index >= 1 && index < 5 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        // Remover das 4 menores e mover para extras
                                        const todasFotos = [...fotosExistentes, ...fotosPreviews]
                                        const fotoRemovida = todasFotos[index]
                                        
                                        // Remover da posição atual
                                        const novasFotos = todasFotos.filter((_, i) => i !== index)
                                        
                                        // Separar entre existentes e previews
                                        const novasExistentes = novasFotos.filter(f => fotosExistentes.includes(f))
                                        const novasPreviews = novasFotos.filter(f => !fotosExistentes.includes(f))
                                        
                                        setFotosExistentes(novasExistentes)
                                        setFotosPreviews(novasPreviews)
                                        
                                        // Mover para extras
                                        if (fotoRemovida) {
                                          setMaisFotosPreviews(prev => [...prev, fotoRemovida])
                                        }
                                      }}
                                      className="opacity-0 group-hover:opacity-100 bg-orange-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-orange-700 transition-opacity"
                                      title="Remover das 4 menores e mover para extras"
                                    >
                                      → Extras
                                    </button>
                                  )}
                                  {!isPrincipal && index >= 5 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        // Mover foto para as 4 menores (posições 1-4)
                                        // Se já tiver 4 menores, substituir a primeira e mover a substituída para extras
                                        const todasFotos = [...fotosExistentes, ...fotosPreviews]
                                        const fotoAtual = todasFotos[index]
                                        
                                        // Se já tiver 4 fotos nas posições 1-4 (após principal)
                                        if (todasFotos.length > 4) {
                                          // Pegar a primeira das 4 menores (índice 1, pois 0 é a principal)
                                          const fotoSubstituida = todasFotos[1]
                                          
                                          // Remover a foto atual da posição atual
                                          const novasFotos = todasFotos.filter((_, i) => i !== index)
                                          
                                          // Remover a primeira das menores
                                          novasFotos.splice(1, 1)
                                          
                                          // Adicionar a nova foto na posição 1 (primeira das 4 menores)
                                          novasFotos.splice(1, 0, fotoAtual)
                                          
                                          // Separar entre existentes e previews
                                          const novasExistentes = novasFotos.filter(f => fotosExistentes.includes(f))
                                          const novasPreviews = novasFotos.filter(f => !fotosExistentes.includes(f))
                                          
                                          setFotosExistentes(novasExistentes)
                                          setFotosPreviews(novasPreviews)
                                          
                                          // Mover a foto substituída para extras
                                          if (fotoSubstituida) {
                                            setMaisFotosPreviews(prev => [...prev, fotoSubstituida])
                                          }
                                        } else {
                                          // Se não tiver 4 ainda, apenas reorganizar para colocar na posição correta
                                          const novasFotos = [...todasFotos]
                                          novasFotos.splice(index, 1)
                                          
                                          // Garantir que tenha pelo menos 5 fotos (1 principal + 4 menores)
                                          if (novasFotos.length < 5) {
                                            novasFotos.splice(1, 0, fotoAtual)
                                          } else {
                                            novasFotos.splice(1, 0, fotoAtual)
                                          }
                                          
                                          const novasExistentes = novasFotos.filter(f => fotosExistentes.includes(f))
                                          const novasPreviews = novasFotos.filter(f => !fotosExistentes.includes(f))
                                          
                                          setFotosExistentes(novasExistentes)
                                          setFotosPreviews(novasPreviews)
                                        }
                                      }}
                                      className="opacity-0 group-hover:opacity-100 bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-green-700 transition-opacity"
                                      title="Mover para as 4 menores (substitui a primeira se já tiver 4)"
                                    >
                                      → 4 Menores
                                    </button>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Mais Fotos (Galeria) */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4">Mais Fotos (Galeria)</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adicionar Fotos Extras
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Estas fotos aparecerão apenas na galeria completa (barra de rolagem), não na página principal do imóvel.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMaisFotosChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  
                  {/* Grid de fotos extras */}
                  {maisFotosPreviews.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">
                        Fotos Extras ({maisFotosPreviews.length})
                      </p>
                      <p className="text-xs text-gray-600 mb-3">
                        Estas fotos aparecerão apenas na galeria completa (barra de rolagem), não na página principal do imóvel.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {maisFotosPreviews.map((foto, index) => {
                          return (
                            <div 
                              key={index} 
                              className="relative group border-2 border-gray-200 rounded-md overflow-hidden"
                            >
                              <img
                                src={foto}
                                alt={`Foto extra ${index + 1}`}
                                className="w-full h-32 object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Mover para as 4 menores (substitui a primeira se já tiver 4)
                                    const todasFotos = [...fotosExistentes, ...fotosPreviews]
                                    
                                    if (todasFotos.length >= 4) {
                                      // Pegar a primeira das 4 menores (índice 1)
                                      const fotoSubstituida = todasFotos[1]
                                      
                                      // Remover a primeira das menores
                                      const novasFotos = [...todasFotos]
                                      novasFotos.splice(1, 1)
                                      
                                      // Adicionar a nova foto na posição 1
                                      novasFotos.splice(1, 0, foto)
                                      
                                      // Separar entre existentes e previews
                                      const novasExistentes = novasFotos.filter(f => fotosExistentes.includes(f))
                                      const novasPreviews = novasFotos.filter(f => !fotosExistentes.includes(f))
                                      
                                      setFotosExistentes(novasExistentes)
                                      setFotosPreviews(novasPreviews)
                                      
                                      // Mover a foto substituída para extras
                                      if (fotoSubstituida) {
                                        setMaisFotosPreviews(prev => [...prev, fotoSubstituida])
                                      }
                                    } else {
                                      // Se não tiver 4 ainda, adicionar normalmente
                                      setFotosPreviews(prev => [...prev, foto])
                                    }
                                    
                                    removeMaisFoto(index)
                                  }}
                                  className="opacity-0 group-hover:opacity-100 bg-green-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-green-700 transition-opacity"
                                  title="Mover para as 4 menores (substitui a primeira se já tiver 4)"
                                >
                                  → 4 Menores
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Mover para fotos principais (adicionar no final)
                                    setFotosPreviews(prev => [...prev, foto])
                                    removeMaisFoto(index)
                                  }}
                                  className="opacity-0 group-hover:opacity-100 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 transition-opacity"
                                  title="Mover para fotos principais"
                                >
                                  → Principais
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeMaisFoto(index)}
                                  className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-opacity"
                                  title="Remover foto"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Visualizações e Publicação */}
              <div className="border-b border-gray-200 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visualizações (inicial)
                    </label>
                    <input
                      type="number"
                      value={novoImovel.visualizacoes || ''}
                      onChange={(e) => setNovoImovel({...novoImovel, visualizacoes: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Número inicial de visualizações</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="publicado"
                      checked={novoImovel.publicado}
                      onChange={(e) => setNovoImovel({...novoImovel, publicado: e.target.checked})}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="publicado" className="ml-2 block text-sm text-gray-900">
                      Publicar imediatamente
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Salvando...' : (editingImovel ? 'Atualizar Imóvel' : 'Salvar Imóvel')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Imóveis */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Imóveis ({filteredImoveis.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredImoveis.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Nenhum imóvel encontrado.
              </div>
            ) : (
              filteredImoveis.map((imovel) => (
                <div key={imovel.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {imovel.titulo}
                        </h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        imovel.publicado 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {imovel.publicado ? 'Publicado' : 'Rascunho'}
                      </span>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {imovel.status}
                        </span>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          {imovel.tipo}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">
                        {imovel.descricao}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-2">
                        <span>{imovel.endereco.cidade}, {imovel.endereco.bairro}</span>
                        <span>{imovel.caracteristicas.quartos} quartos</span>
                        <span>{imovel.caracteristicas.banheiros} banheiros</span>
                        <span>{imovel.caracteristicas.area}m²</span>
                        <span className="font-semibold text-primary-600">{formatPrice(imovel.preco)}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDate(imovel.createdAt)}
                        {imovel.fotos && imovel.fotos.length > 0 && (
                          <span className="ml-2">
                            • {imovel.fotos.length} {imovel.fotos.length === 1 ? 'foto' : 'fotos'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {imovel.fotos && imovel.fotos.length > 0 && (
                        <img
                          src={imovel.fotos[0]}
                          alt={imovel.titulo}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      )}
                      <div className="flex flex-col space-y-2">
                        <button 
                          onClick={() => handleEdit(imovel)}
                          className="p-2 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded-md transition-colors"
                          title="Editar imóvel"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleSelecaoNox(imovel)}
                          className={`p-2 rounded-md transition-colors ${
                            (imovel as any).selecaoNox
                              ? 'text-yellow-600 hover:text-yellow-900 hover:bg-yellow-50 bg-yellow-50'
                              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                          }`}
                          title={(imovel as any).selecaoNox ? 'Remover da Seleção Nox' : 'Adicionar à Seleção Nox'}
                        >
                          <Star className={`w-4 h-4 ${(imovel as any).selecaoNox ? 'fill-current' : ''}`} />
                        </button>
                        <button 
                          onClick={() => handleDelete(imovel.id)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-md transition-colors"
                          title="Excluir imóvel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

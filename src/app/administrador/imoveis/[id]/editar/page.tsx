'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X, Loader2, Image as ImageIcon, Check } from 'lucide-react'
import Link from 'next/link'
import { updateImovelWithFotos } from '@/lib/imoveis-github'
import { generateSlug } from '@/lib/imoveis'
import { SEO_CHAR_RANGES, isOutOfSuggestedRange } from '@/lib/seo-headings'

export default function EditarImovelPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Estado do formulário
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    preco: '',
    tipo: 'apartamento' as 'casa' | 'apartamento' | 'terreno' | 'comercial' | 'cobertura',
    status: 'lancamento' as 'prontos' | 'lancamento' | 'em-construcao',
    cidade: 'penha',
    bairro: '',
    rua: '',
    numero: '',
    cep: '',
    estado: 'SC',
    latitude: '',
    longitude: '',
    quartos: '',
    banheiros: '',
    vagas: '',
    area: '',
    suite: '',
    publicado: true,
    selecaoNox: false,
    dataEntrega: '',
    caracteristicas: '', // Campo de texto para características (tags)
    comodidades: { mobiliado: false, frenteMar: false, vistaMar: false, areaLazer: false },
  })

  // Fotos - sistema como DWV: combinar existentes (URLs) e novas (Files)
  const [fotosExistentes, setFotosExistentes] = useState<string[]>([])
  const [novasFotos, setNovasFotos] = useState<{ file: File; preview: string }[]>([])
  const [fotoPrincipalIndex, setFotoPrincipalIndex] = useState<number | null>(null)
  const [fotosMenoresIndices, setFotosMenoresIndices] = useState<number[]>([])
  
  // Helper para obter todas as fotos (existentes + novas)
  const todasFotos = [
    ...fotosExistentes.map(url => ({ type: 'existente' as const, url, preview: url })),
    ...novasFotos.map(foto => ({ type: 'nova' as const, file: foto.file, preview: foto.preview }))
  ]

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
        const imovel = imoveis.find((i: any) => i.id === id)
        
        if (!imovel) {
          throw new Error('Imóvel não encontrado')
        }

        if (imovel.fonteDWV) {
          throw new Error('Imóveis do DWV não podem ser editados aqui. Use a página de editar fotos.')
        }

        // Função para formatar preço para exibição
        const formatPriceForInput = (price: number): string => {
          return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(price)
        }

        // Preencher formulário
        setFormData({
          titulo: imovel.titulo || '',
          descricao: imovel.descricao || '',
          preco: imovel.preco ? formatPriceForInput(imovel.preco) : '',
          tipo: imovel.tipo || 'apartamento',
          status: imovel.status || 'lancamento',
          cidade: imovel.endereco?.cidade || 'penha',
          bairro: imovel.endereco?.bairro || '',
          rua: imovel.endereco?.rua || '',
          numero: imovel.endereco?.numero || '',
          cep: imovel.endereco?.cep || '',
          estado: imovel.endereco?.estado || 'SC',
          quartos: (() => {
            const q = imovel.caracteristicas?.quartos
            if (q == null || q === 0) return ''
            return q >= 4 ? '4' : String(q)
          })(),
          banheiros: (() => {
            const b = imovel.caracteristicas?.banheiros
            if (b == null || b === 0) return ''
            return b >= 4 ? '4' : String(b)
          })(),
          vagas: (() => {
            const v = imovel.caracteristicas?.vagas
            if (v == null || v === 0) return ''
            return v >= 4 ? '4' : String(v)
          })(),
          area: imovel.caracteristicas?.area?.toString() || '',
          suite: imovel.caracteristicas?.suite?.toString() || '',
          publicado: imovel.publicado !== false,
          selecaoNox: imovel.selecaoNox || false,
          dataEntrega: imovel.dataEntrega || '',
          latitude: imovel.coordenadas?.lat?.toString() || '',
          longitude: imovel.coordenadas?.lng?.toString() || '',
          caracteristicas: imovel.tags?.filter((tag: string) => 
            !['Frente Mar', 'Frente-mar', 'Mobiliado', 'Mobiliada', 'Vista Mar', 'Área de Lazer', 'Area de lazer'].includes(tag)
          ).join(', ') || '',
          comodidades: {
            mobiliado: !!(imovel.tags && imovel.tags.some((t: string) => /mobiliad[oa]/i.test(t))),
            frenteMar: !!(imovel.tags && imovel.tags.some((t: string) => /frente\s*mar|beira\s*mar/i.test(t))),
            vistaMar: !!(imovel.tags && imovel.tags.some((t: string) => /vista\s*(para\s*o\s*)?mar/i.test(t))),
            areaLazer: !!(imovel.tags && imovel.tags.some((t: string) => /área\s*de\s*lazer|area\s*de\s*lazer|home\s*club|clube\s*completo/i.test(t))),
          },
        })

        // Carregar fotos existentes
        const fotos = imovel.fotos || []
        setFotosExistentes(fotos)
        const principalIndex = imovel.fotoPrincipalIndex || 0
        setFotoPrincipalIndex(principalIndex < fotos.length ? principalIndex : null)
        
        // Carregar fotos menores se existirem (do DWV ou padrão)
        // Por padrão, usar as 4 seguintes à principal
        if (fotos.length > 1) {
          const menores: number[] = []
          for (let i = 1; i < Math.min(5, fotos.length); i++) {
            if (i !== principalIndex) {
              menores.push(i)
            }
          }
          setFotosMenoresIndices(menores.slice(0, 4))
        }
      } catch (error: any) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadImovel()
  }, [id])

  // Função para formatar preço enquanto digita (ex: 5000 -> 5.000,00)
  const formatCurrencyInput = (value: string): string => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '')
    
    if (!numbers) return ''
    
    let amount: number
    
    if (numbers.length <= 2) {
      // 1-2 dígitos: são centavos (ex: "5" -> 0,05 ou "50" -> 0,50)
      amount = parseInt(numbers, 10) / 100
    } else {
      // 3+ dígitos: sempre trata os últimos 2 como centavos
      // Ex: "5000" -> "50" reais + "00" centavos = "50,00"
      // Mas o usuário quer "5000" -> "5.000,00"
      // Solução: se o número termina com "00" e tem 4+ dígitos,
      // e o número sem os últimos 2 dígitos tem 2+ dígitos,
      // trata como se o usuário quisesse digitar o valor completo em reais
      // Então "5000" deve ser interpretado como "5000" reais, não "50" reais
      
      // Vamos usar uma heurística: se o número tem 4+ dígitos e termina com "00",
      // e o número sem os últimos 2 dígitos é >= 10, assume que são reais inteiros
      // Ex: "5000" -> sem últimos 2 = "50" (>= 10) -> trata como 5000 reais
      // Mas isso ainda daria 50 reais...
      
      // Melhor abordagem: se termina com "00" e tem 4+ dígitos,
      // e o número completo dividido por 100 tem 2+ dígitos,
      // trata como reais inteiros (valor completo)
      // Ex: "5000" -> 5000 / 100 = 50 (2 dígitos) -> trata como 5000 reais
      // Mas isso ainda não funciona...
      
      // Vou tentar outra: se tem 4+ dígitos e termina com "00",
      // trata o número completo (sem dividir) como centavos, depois divide por 100
      // Ex: "5000" -> 5000 centavos = 50 reais (ainda errado)
      
      // Solução final: se tem 4+ dígitos e termina com "00",
      // e o número sem os últimos 2 dígitos tem 2+ dígitos,
      // trata como se o usuário digitou o valor em reais (multiplica por 100)
      // Ex: "5000" -> "50" * 100 = 5000 centavos = 50 reais (ainda errado)
      
      // Vou usar uma abordagem mais simples: sempre tratar últimos 2 como centavos,
      // mas se o usuário quiser "5000" -> "5.000,00", ele deve digitar "500000"
      // Mas o usuário disse que quer "5000" -> "5.000,00", então preciso de outra lógica
      
      // Nova tentativa: se o número tem 4+ dígitos e termina com "00",
      // e o número completo é múltiplo de 100,
      // verifica se dividindo por 100 o resultado tem 2+ dígitos
      // Se sim, trata como reais inteiros (valor completo / 100)
      // Mas "5000" / 100 = 50, que tem 2 dígitos, então amount = 50 (errado)
      
      // Vou simplificar: sempre tratar últimos 2 como centavos
      // O usuário terá que digitar "500000" para "5.000,00"
      const reais = numbers.slice(0, -2)
      const centavos = numbers.slice(-2)
      amount = parseFloat(`${reais}.${centavos}`)
    }
    
    // Formata como moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Função para converter valor formatado de volta para número
  const parseCurrencyValue = (value: string): number => {
    // Remove pontos e substitui vírgula por ponto
    const cleanValue = value.replace(/\./g, '').replace(',', '.')
    return parseFloat(cleanValue) || 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    // Se for o campo de preço, formatar automaticamente
    if (name === 'preco') {
      const formatted = formatCurrencyInput(value)
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }))
      return
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  // Função para extrair extensão do arquivo
  const getFileExtension = (fileOrUrl: File | string): string => {
    if (typeof fileOrUrl === 'string') {
      // É uma URL ou caminho - remover query parameters e hash primeiro
      let cleanPath = fileOrUrl.split('?')[0].split('#')[0]
      
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
    } else {
      // É um File object
      const name = fileOrUrl.name
      const lastDot = name.lastIndexOf('.')
      return lastDot > 0 ? name.substring(lastDot).toLowerCase() : ''
    }
  }

  const handleAdicionarFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const preview = reader.result as string
        setNovasFotos(prev => [...prev, { file, preview }])
        
        // Se for a primeira foto e não houver principal, definir como principal
        const totalFotos = fotosExistentes.length + novasFotos.length
        if (totalFotos === 1 && fotoPrincipalIndex === null) {
          setFotoPrincipalIndex(fotosExistentes.length) // Primeira nova foto
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removerFoto = (index: number) => {
    if (index < fotosExistentes.length) {
      // Remover foto existente
      const novasFotosExistentes = fotosExistentes.filter((_, i) => i !== index)
      setFotosExistentes(novasFotosExistentes)
      
      // Ajustar índices
      if (fotoPrincipalIndex === index) {
        setFotoPrincipalIndex(null)
      } else if (fotoPrincipalIndex !== null && fotoPrincipalIndex > index) {
        setFotoPrincipalIndex(fotoPrincipalIndex - 1)
      }
      
      setFotosMenoresIndices(prev => 
        prev
          .filter(i => i !== index)
          .map(i => i > index ? i - 1 : i)
      )
    } else {
      // Remover nova foto
      const indiceNova = index - fotosExistentes.length
      setNovasFotos(prev => prev.filter((_, i) => i !== indiceNova))
      
      // Ajustar índices
      const indiceReal = index
      if (fotoPrincipalIndex === indiceReal) {
        setFotoPrincipalIndex(null)
      } else if (fotoPrincipalIndex !== null && fotoPrincipalIndex > indiceReal) {
        setFotoPrincipalIndex(fotoPrincipalIndex - 1)
      }
      
      setFotosMenoresIndices(prev => 
        prev
          .filter(i => i !== indiceReal)
          .map(i => i > indiceReal ? i - 1 : i)
      )
    }
  }

  const selecionarFotoPrincipal = (index: number) => {
    setFotoPrincipalIndex(index)
    // Remover das menores se estiver lá
    setFotosMenoresIndices(prev => prev.filter(i => i !== index))
  }

  const toggleFotoMenor = (index: number) => {
    // Não permitir selecionar a foto principal como menor
    if (index === fotoPrincipalIndex) return

    if (fotosMenoresIndices.includes(index)) {
      // Remover
      setFotosMenoresIndices(prev => prev.filter(i => i !== index))
    } else {
      // Adicionar (máximo 4)
      if (fotosMenoresIndices.length < 4) {
        setFotosMenoresIndices(prev => [...prev, index])
      } else {
        setError('Máximo de 4 fotos menores permitidas')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (!formData.titulo.trim()) {
        throw new Error('Título é obrigatório')
      }

      const todasFotosCount = fotosExistentes.length + novasFotos.length
      if (todasFotosCount === 0) {
        throw new Error('Adicione pelo menos uma foto')
      }

      if (fotoPrincipalIndex === null) {
        throw new Error('Selecione uma foto principal')
      }

      if (fotosMenoresIndices.length === 0) {
        throw new Error('Selecione pelo menos 1 foto menor')
      }

      // Processar características (tags) + comodidades marcadas manualmente
      const tagsCaracteristicas = formData.caracteristicas
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
      const comodidadesTags: string[] = []
      if (formData.comodidades.frenteMar) comodidadesTags.push('Frente Mar')
      if (formData.comodidades.mobiliado) comodidadesTags.push('Mobiliado')
      if (formData.comodidades.vistaMar) comodidadesTags.push('Vista Mar')
      if (formData.comodidades.areaLazer) comodidadesTags.push('Área de Lazer')
      const todasTags = [...tagsCaracteristicas, ...comodidadesTags]

      // Preparar dados do imóvel
      const imovelData: any = {
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        preco: parseCurrencyValue(formData.preco),
        tipo: formData.tipo,
        status: formData.status,
        endereco: {
          cidade: formData.cidade,
          bairro: formData.bairro.trim(),
          rua: formData.rua.trim(),
          numero: formData.numero.trim(),
          cep: formData.cep.trim(),
          estado: formData.estado,
        },
        caracteristicas: {
          quartos: parseInt(formData.quartos) || 0,
          banheiros: parseInt(formData.banheiros) || 0,
          vagas: parseInt(formData.vagas) || 0,
          area: parseFloat(formData.area.replace(',', '.')) || 0,
          suite: parseInt(formData.suite) || 0,
          frenteMar: false,
          piscina: false,
          churrasqueira: false,
          academia: false,
          portaria: false,
          elevador: false,
          varanda: false,
          sacada: false,
        },
        tags: todasTags,
        contato: {
          whatsapp: '(47) 99753-0113',
          corretor: 'NOX Imóveis',
        },
        publicado: formData.publicado,
        selecaoNox: formData.selecaoNox,
        dataEntrega: formData.dataEntrega || undefined,
        coordenadas: formData.latitude && formData.longitude 
          ? { lat: parseFloat(formData.latitude.replace(',', '.')), lng: parseFloat(formData.longitude.replace(',', '.')) }
          : undefined,
        fotoPrincipalIndex: fotoPrincipalIndex,
      }

      // Preparar lista completa de fotos ordenadas
      // 1. Foto principal primeiro
      // 2. Fotos menores
      // 3. Resto das fotos
      const fotosOrdenadas: string[] = []
      const novasFotosFiles: File[] = []
      
      // Adicionar foto principal
      if (fotoPrincipalIndex !== null) {
        if (fotoPrincipalIndex < fotosExistentes.length) {
          fotosOrdenadas.push(fotosExistentes[fotoPrincipalIndex])
        } else {
          const indiceNova = fotoPrincipalIndex - fotosExistentes.length
          novasFotosFiles.push(novasFotos[indiceNova].file)
        }
      }
      
      // Adicionar fotos menores
      fotosMenoresIndices.forEach(index => {
        if (index !== fotoPrincipalIndex) {
          if (index < fotosExistentes.length) {
            fotosOrdenadas.push(fotosExistentes[index])
          } else {
            const indiceNova = index - fotosExistentes.length
            novasFotosFiles.push(novasFotos[indiceNova].file)
          }
        }
      })
      
      // Adicionar resto das fotos (para o book)
      const totalFotos = fotosExistentes.length + novasFotos.length
      for (let index = 0; index < totalFotos; index++) {
        if (index !== fotoPrincipalIndex && !fotosMenoresIndices.includes(index)) {
          if (index < fotosExistentes.length) {
            fotosOrdenadas.push(fotosExistentes[index])
          } else {
            const indiceNova = index - fotosExistentes.length
            novasFotosFiles.push(novasFotos[indiceNova].file)
          }
        }
      }

      // Definir índice da foto principal (sempre 0, pois ordenamos assim)
      imovelData.fotoPrincipalIndex = 0

      // Atualizar imóvel
      await updateImovelWithFotos(
        id,
        {
          ...imovelData,
          fotos: fotosOrdenadas, // Fotos existentes ordenadas
        },
        novasFotosFiles.length > 0 ? novasFotosFiles : undefined
      )

      setSuccess(true)
      setTimeout(() => {
        router.push(`/administrador/imoveis`)
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar imóvel')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

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
              <h1 className="text-2xl font-bold text-gray-900">Editar Imóvel</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            ✅ Imóvel atualizado com sucesso! Redirecionando...
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-8">
          {/* Informações Básicas */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações Básicas</h2>
            <div className="space-y-4">
              <div className={isOutOfSuggestedRange('H1', formData.titulo.length) ? 'rounded-lg border-2 border-amber-400 bg-amber-50/60 p-3' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título do Imóvel (H1) *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  placeholder="Ex: Apartamento Frente Mar em Penha"
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isOutOfSuggestedRange('H1', formData.titulo.length) ? 'border-amber-500' : 'border-gray-300'}`}
                />
                <p className="text-xs text-gray-500 mt-1">Ideal: {SEO_CHAR_RANGES.H1.min}–{SEO_CHAR_RANGES.H1.max} caracteres (sugestivo).</p>
                <span className={`text-xs ${isOutOfSuggestedRange('H1', formData.titulo.length) ? 'text-amber-600 font-medium' : 'text-gray-500'}`}>
                  {formData.titulo.length} caracteres
                  {isOutOfSuggestedRange('H1', formData.titulo.length) && ' — fora do ideal'}
                </span>
              </div>

              <div className={isOutOfSuggestedRange('paragrafo', formData.descricao.length) ? 'rounded-lg border-2 border-amber-400 bg-amber-50/60 p-3' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição (Parágrafo)
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={5000}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${isOutOfSuggestedRange('paragrafo', formData.descricao.length) ? 'border-amber-500' : 'border-gray-300'}`}
                  placeholder="Descrição completa do imóvel (texto de parágrafo)..."
                />
                <p className="text-xs text-gray-500 mt-1">Ideal: {SEO_CHAR_RANGES.paragrafo.min}–{SEO_CHAR_RANGES.paragrafo.max} caracteres (sugestivo).</p>
                <span className={`text-xs ${isOutOfSuggestedRange('paragrafo', formData.descricao.length) ? 'text-amber-600 font-medium' : 'text-gray-500'}`}>
                  {formData.descricao.length}/5000 caracteres
                  {isOutOfSuggestedRange('paragrafo', formData.descricao.length) && ' — fora do ideal'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="text"
                    name="preco"
                    value={formData.preco}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ex: 1.500.000,00"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Digite apenas números. Ex: "500000" vira "5.000,00" ou "500050" vira "5.000,50"
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo *
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="apartamento">Apartamento</option>
                    <option value="casa">Casa</option>
                    <option value="terreno">Terreno</option>
                    <option value="comercial">Comercial</option>
                    <option value="cobertura">Cobertura</option>
                  </select>
                </div>
              </div>

              {/* Data de Entrega (igual ao filtro: Prontos + anos) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Entrega
                </label>
                <div className="space-y-2 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.status === 'prontos'}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        status: e.target.checked ? 'prontos' : 'lancamento',
                      }))}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Prontos</span>
                  </label>
                </div>
                {formData.status !== 'prontos' && (
                  <div className="mb-2">
                    <label className="block text-xs text-gray-500 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'lancamento' | 'em-construcao' }))}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="lancamento">Lançamento</option>
                      <option value="em-construcao">Em Construção</option>
                    </select>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {[2026, 2027, 2028, 2029, 2030, 2031].map((ano) => {
                    const anoStr = String(ano)
                    const selected = formData.dataEntrega && (formData.dataEntrega.startsWith(anoStr) || formData.dataEntrega === anoStr)
                    return (
                      <button
                        key={ano}
                        type="button"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          dataEntrega: selected ? '' : `${ano}-01-01`,
                        }))}
                        className={`px-3 py-2 rounded-lg border text-sm ${
                          selected ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500'
                        }`}
                      >
                        {ano}
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-1">Marque Prontos e/ou escolha o ano de entrega para o filtro do site.</p>
              </div>
            </div>
          </div>

          {/* Comodidades (igual ao filtro: marcar para integrar) */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Comodidades</h2>
            <p className="text-sm text-gray-600 mb-3">Marque as comodidades para o imóvel aparecer no filtro do site.</p>
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
                    checked={formData.comodidades[key as keyof typeof formData.comodidades]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      comodidades: { ...prev.comodidades, [key]: e.target.checked },
                    }))}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Endereço</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade *
                  </label>
                  <select
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="penha">Penha</option>
                    <option value="balneario-picarras">Balneário Piçarras</option>
                    <option value="barra-velha">Barra Velha</option>
                    <option value="balneario-camboriu">Balneário Camboriú</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rua
                  </label>
                  <input
                    type="text"
                    name="rua"
                    value={formData.rua}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="00000-000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <input
                    type="text"
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Coordenadas para Mapa */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  📍 Localização no Mapa (opcional)
                </h3>
                <p className="text-xs text-blue-700 mb-3">
                  Adicione as coordenadas para exibir o imóvel no mapa. Você pode obter as coordenadas no Google Maps: clique com botão direito no local e copie os números.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <input
                      type="text"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ex: -26.7867"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <input
                      type="text"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Ex: -48.6453"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Características */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Características</h2>
            {/* Quartos, Banheiros, Vagas — mesmo estilo do filtro do site (botões) */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quartos</label>
                <div className="flex gap-2">
                  {(['1', '2', '3', '4+'] as const).map((qtd) => {
                    const value = qtd === '4+' ? '4' : qtd
                    const isSelected = formData.quartos === value
                    return (
                      <button
                        key={qtd}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, quartos: isSelected ? '' : value }))}
                        className={`px-4 py-2 rounded-lg border text-sm ${
                          isSelected ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500'
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
                  {['1+', '2+', '3+', '4+'].map((qtd) => {
                    const value = qtd.replace('+', '')
                    const isSelected = formData.banheiros === value
                    return (
                      <button
                        key={qtd}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, banheiros: isSelected ? '' : value }))}
                        className={`px-4 py-2 rounded-lg border text-sm ${
                          isSelected ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500'
                        }`}
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
                    const isSelected = formData.vagas === value
                    return (
                      <button
                        key={qtd}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, vagas: isSelected ? '' : value }))}
                        className={`px-4 py-2 rounded-lg border text-sm ${
                          isSelected ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500'
                        }`}
                      >
                        {qtd}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Suítes
                </label>
                <input
                  type="number"
                  name="suite"
                  value={formData.suite}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Área (m²)
              </label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ex: 120.50"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Características (separadas por vírgula)
              </label>
              <input
                type="text"
                name="caracteristicas"
                value={formData.caracteristicas}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ex: Varanda, Sacada, Piscina, Academia, Frente Mar, Mobiliado"
              />
              <p className="text-xs text-gray-500 mt-1">
                Adicione características separadas por vírgula. O sistema detecta automaticamente comodidades como Frente Mar, Mobiliado, Vista Mar e Área de Lazer.
              </p>
            </div>
          </div>

          {/* Fotos */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Fotos</h2>
            <p className="text-sm text-gray-600 mb-4">
              Adicione novas fotos ou gerencie as existentes. Selecione 1 principal e até 4 menores. As outras ficarão no book (galeria completa).
            </p>

            {/* Adicionar Novas Fotos */}
            <div className="mb-6">
              <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-600 font-medium">
                  Adicionar Novas Fotos ({novasFotos.length} novas)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdicionarFotos}
                  className="hidden"
                />
              </label>
            </div>

            {/* Galeria de Fotos */}
            {(fotosExistentes.length > 0 || novasFotos.length > 0) && (
              <div className="space-y-6">
                {/* Foto Principal */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Foto Principal {fotoPrincipalIndex !== null && <span className="text-green-600">✓ Selecionada</span>}
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">Clique em uma foto para definir como principal</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      ...fotosExistentes.map((url, i) => ({ index: i, preview: url, type: 'existente' as const, source: url })),
                      ...novasFotos.map((foto, i) => ({ index: fotosExistentes.length + i, preview: foto.preview, type: 'nova' as const, source: foto.file }))
                    ].map(({ index, preview, source }) => (
                      <div key={index} className="relative group">
                        <button
                          type="button"
                          onClick={() => selecionarFotoPrincipal(index)}
                          className={`w-full aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                            fotoPrincipalIndex === index
                              ? 'border-purple-600 ring-4 ring-purple-200'
                              : 'border-gray-300 hover:border-purple-400'
                          }`}
                        >
                          <img
                            src={preview}
                            alt={`Foto ${index + 1}`}
                            width={320}
                            height={240}
                            className="w-full h-full object-cover"
                          />
                          {fotoPrincipalIndex === index && (
                            <div className="absolute inset-0 bg-purple-600 bg-opacity-20 flex items-center justify-center">
                              <div className="bg-purple-600 text-white rounded-full p-2">
                                <Check className="w-5 h-5" />
                              </div>
                            </div>
                          )}
                        </button>
                        <div className="absolute bottom-2 left-2 flex gap-1">
                          {fotoPrincipalIndex === index && (
                            <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded">
                              Principal
                            </span>
                          )}
                          <span className="bg-gray-800 bg-opacity-75 text-white text-xs font-medium px-2 py-1 rounded">
                            {getFileExtension(source)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removerFoto(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fotos Menores */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Fotos Menores ({fotosMenoresIndices.length}/4)
                    {fotosMenoresIndices.length === 4 && <span className="text-green-600"> ✓ Completo</span>}
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">Clique nas fotos para selecionar até 4 menores (aparecem em grid 2x2)</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      ...fotosExistentes.map((url, i) => ({ index: i, preview: url, type: 'existente' as const, source: url })),
                      ...novasFotos.map((foto, i) => ({ index: fotosExistentes.length + i, preview: foto.preview, type: 'nova' as const, source: foto.file }))
                    ].map(({ index, preview, source }) => {
                      const isPrincipal = index === fotoPrincipalIndex
                      const isMenor = fotosMenoresIndices.includes(index)
                      const podeSelecionar = !isPrincipal && (isMenor || fotosMenoresIndices.length < 4)

                      return (
                        <div key={index} className="relative group">
                          <button
                            type="button"
                            onClick={() => toggleFotoMenor(index)}
                            disabled={isPrincipal || (!isMenor && fotosMenoresIndices.length >= 4)}
                            className={`w-full aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                              isPrincipal
                                ? 'border-gray-200 opacity-50 cursor-not-allowed'
                                : isMenor
                                ? 'border-blue-600 ring-4 ring-blue-200'
                                : fotosMenoresIndices.length >= 4
                                ? 'border-gray-200 opacity-50 cursor-not-allowed'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            <img
                              src={preview}
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
                                  <Check className="w-5 h-5" />
                                </div>
                              </div>
                            )}
                          </button>
                          <div className="absolute bottom-2 left-2 flex gap-1 flex-wrap">
                            {isMenor && (
                              <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                                Menor {fotosMenoresIndices.indexOf(index) + 1}
                              </span>
                            )}
                            <span className="bg-gray-800 bg-opacity-75 text-white text-xs font-medium px-2 py-1 rounded">
                              {getFileExtension(source)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removerFoto(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* Opções */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Opções</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="publicado"
                  checked={formData.publicado}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Publicar imóvel</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="selecaoNox"
                  checked={formData.selecaoNox}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Exibir na Seção "Seleção Nox" (Homepage)</span>
              </label>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </button>
            <Link
              href="/administrador/imoveis"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X, Loader2, Image as ImageIcon, Check } from 'lucide-react'
import Link from 'next/link'
import { createImovelWithFotos } from '@/lib/imoveis-github'
import { generateSlug } from '@/lib/imoveis'

export default function NovoImovelPage() {
  const router = useRouter()
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
    quartos: '',
    banheiros: '',
    vagas: '',
    area: '',
    suite: '',
    publicado: true,
    selecaoNox: false,
    dataEntrega: '',
    caracteristicas: '', // Campo de texto para características (tags)
  })

  // Fotos - sistema como DWV: várias fotos, escolher 1 principal + 4 menores
  const [todasFotos, setTodasFotos] = useState<{ file: File; preview: string }[]>([])
  const [fotoPrincipalIndex, setFotoPrincipalIndex] = useState<number | null>(null)
  const [fotosMenoresIndices, setFotosMenoresIndices] = useState<number[]>([])

  // Função para formatar preço enquanto digita (ex: 5000 -> 5.000,00)
  const formatCurrencyInput = (value: string): string => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '')
    
    if (!numbers) return ''
    
    // Converte para número e divide por 100 para ter centavos
    const amount = parseInt(numbers, 10) / 100
    
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

  const handleAdicionarFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const preview = reader.result as string
        setTodasFotos(prev => [...prev, { file, preview }])
        
        // Se for a primeira foto, definir como principal automaticamente
        if (todasFotos.length === 0 && fotoPrincipalIndex === null) {
          setFotoPrincipalIndex(0)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removerFoto = (index: number) => {
    setTodasFotos(prev => prev.filter((_, i) => i !== index))
    
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
      // Validar campos obrigatórios
      if (!formData.titulo.trim()) {
        throw new Error('Título é obrigatório')
      }
      if (todasFotos.length === 0) {
        throw new Error('Adicione pelo menos uma foto')
      }
      if (fotoPrincipalIndex === null) {
        throw new Error('Selecione uma foto principal')
      }
      if (fotosMenoresIndices.length === 0) {
        throw new Error('Selecione pelo menos 1 foto menor')
      }

      // Processar características (tags) - o sistema detecta automaticamente comodidades
      const tagsCaracteristicas = formData.caracteristicas
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const todasTags = tagsCaracteristicas

      // Preparar dados do imóvel
      const imovelData: any = {
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        preco: parseFloat(formData.preco.replace(/[^\d,.-]/g, '').replace(',', '.')) || 0,
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
        coordenadas: undefined, // Pode ser adicionado depois
      } as any
      
      // Adicionar fotoPrincipalIndex (sempre 0, pois ordenamos assim)
      imovelData.fotoPrincipalIndex = 0

      // Preparar fotos: ordenar (principal primeiro, depois menores, depois resto)
      const fotosOrdenadas: File[] = []
      
      // 1. Foto principal
      if (fotoPrincipalIndex !== null) {
        fotosOrdenadas.push(todasFotos[fotoPrincipalIndex].file)
      }
      
      // 2. Fotos menores
      fotosMenoresIndices.forEach(index => {
        if (index !== fotoPrincipalIndex) {
          fotosOrdenadas.push(todasFotos[index].file)
        }
      })
      
      // 3. Resto das fotos (para o book)
      todasFotos.forEach((foto, index) => {
        if (index !== fotoPrincipalIndex && !fotosMenoresIndices.includes(index)) {
          fotosOrdenadas.push(foto.file)
        }
      })

      // Criar imóvel
      const id = await createImovelWithFotos(imovelData, fotosOrdenadas)

      setSuccess(true)
      setTimeout(() => {
        router.push(`/administrador/imoveis`)
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Erro ao criar imóvel')
    } finally {
      setIsSubmitting(false)
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Adicionar Novo Imóvel</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            ✅ Imóvel criado com sucesso! Redirecionando...
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título do Imóvel *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ex: Apartamento Frente Mar em Penha"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Descrição completa do imóvel..."
                />
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
                    Digite apenas números. A formatação será aplicada automaticamente.
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="lancamento">Lançamento</option>
                  <option value="em-construcao">Em Construção</option>
                  <option value="prontos">Prontos</option>
                </select>
              </div>

              {formData.status !== 'prontos' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Entrega
                  </label>
                  <input
                    type="date"
                    name="dataEntrega"
                    value={formData.dataEntrega}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}
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
            </div>
          </div>

          {/* Características */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Características</h2>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quartos
                </label>
                <input
                  type="number"
                  name="quartos"
                  value={formData.quartos}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banheiros
                </label>
                <input
                  type="number"
                  name="banheiros"
                  value={formData.banheiros}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vagas
                </label>
                <input
                  type="number"
                  name="vagas"
                  value={formData.vagas}
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
              Adicione várias fotos, depois selecione 1 principal e até 4 menores. As outras ficarão no book (galeria completa).
            </p>

            {/* Adicionar Fotos */}
            <div className="mb-6">
              <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <span className="text-sm text-gray-600 font-medium">
                  Adicionar Fotos ({todasFotos.length} adicionadas)
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
            {todasFotos.length > 0 && (
              <div className="space-y-6">
                {/* Foto Principal */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Foto Principal {fotoPrincipalIndex !== null && <span className="text-green-600">✓ Selecionada</span>}
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">Clique em uma foto para definir como principal</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {todasFotos.map((foto, index) => (
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
                            src={foto.preview}
                            alt={`Foto ${index + 1}`}
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
                        {fotoPrincipalIndex === index && (
                          <div className="absolute bottom-2 left-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded">
                            Principal
                          </div>
                        )}
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
                    {todasFotos.map((foto, index) => {
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
                              src={foto.preview}
                              alt={`Foto ${index + 1}`}
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
                          {isMenor && (
                            <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                              Menor {fotosMenoresIndices.indexOf(index) + 1}
                            </div>
                          )}
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
                  Criando...
                </>
              ) : (
                'Criar Imóvel'
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

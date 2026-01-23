'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Upload, X, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { updateImovelWithFotos } from '@/lib/imoveis-github'
import { generateSlug } from '@/lib/imoveis'

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
    quartos: '',
    banheiros: '',
    vagas: '',
    area: '',
    suite: '',
    frenteMar: false,
    mobiliado: false,
    vistaMar: false,
    areaLazer: false,
    whatsapp: '(47) 99753-0113',
    corretor: '',
    email: '',
    publicado: true,
    selecaoNox: false,
    dataEntrega: '',
    caracteristicas: '', // Campo de texto para características (tags)
  })

  // Fotos existentes e novas
  const [fotosExistentes, setFotosExistentes] = useState<string[]>([])
  const [fotoPrincipalIndex, setFotoPrincipalIndex] = useState(0)
  const [fotoPrincipalFile, setFotoPrincipalFile] = useState<File | null>(null)
  const [fotosSecundariasFiles, setFotosSecundariasFiles] = useState<File[]>([])
  const [previewPrincipal, setPreviewPrincipal] = useState<string | null>(null)
  const [previewSecundarias, setPreviewSecundarias] = useState<string[]>([])

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

        // Preencher formulário
        setFormData({
          titulo: imovel.titulo || '',
          descricao: imovel.descricao || '',
          preco: imovel.preco?.toString() || '',
          tipo: imovel.tipo || 'apartamento',
          status: imovel.status || 'lancamento',
          cidade: imovel.endereco?.cidade || 'penha',
          bairro: imovel.endereco?.bairro || '',
          rua: imovel.endereco?.rua || '',
          numero: imovel.endereco?.numero || '',
          cep: imovel.endereco?.cep || '',
          estado: imovel.endereco?.estado || 'SC',
          quartos: imovel.caracteristicas?.quartos?.toString() || '',
          banheiros: imovel.caracteristicas?.banheiros?.toString() || '',
          vagas: imovel.caracteristicas?.vagas?.toString() || '',
          area: imovel.caracteristicas?.area?.toString() || '',
          suite: imovel.caracteristicas?.suite?.toString() || '',
          frenteMar: imovel.tags?.includes('Frente Mar') || false,
          mobiliado: imovel.tags?.includes('Mobiliado') || false,
          vistaMar: imovel.tags?.includes('Vista Mar') || false,
          areaLazer: imovel.tags?.includes('Área de Lazer') || false,
          whatsapp: imovel.contato?.whatsapp || '(47) 99753-0113',
          corretor: imovel.contato?.corretor || '',
          email: imovel.contato?.email || '',
          publicado: imovel.publicado !== false,
          selecaoNox: imovel.selecaoNox || false,
          dataEntrega: imovel.dataEntrega || '',
          caracteristicas: imovel.tags?.filter((tag: string) => 
            !['Frente Mar', 'Mobiliado', 'Vista Mar', 'Área de Lazer'].includes(tag)
          ).join(', ') || '',
        })

        // Carregar fotos existentes
        setFotosExistentes(imovel.fotos || [])
        setFotoPrincipalIndex(imovel.fotoPrincipalIndex || 0)
        if (imovel.fotos && imovel.fotos.length > 0) {
          setPreviewPrincipal(imovel.fotos[imovel.fotoPrincipalIndex || 0])
        }
      } catch (error: any) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadImovel()
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleFotoPrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFotoPrincipalFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewPrincipal(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFotosSecundariasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newFiles = [...fotosSecundariasFiles, ...files.slice(0, 4 - fotosSecundariasFiles.length)]
    setFotosSecundariasFiles(newFiles)
    
    // Criar previews
    const newPreviews: string[] = []
    newFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result as string)
        if (newPreviews.length === newFiles.length) {
          setPreviewSecundarias(newPreviews)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeFotoSecundaria = (index: number) => {
    const newFiles = fotosSecundariasFiles.filter((_, i) => i !== index)
    setFotosSecundariasFiles(newFiles)
    const newPreviews = previewSecundarias.filter((_, i) => i !== index)
    setPreviewSecundarias(newPreviews)
  }

  const removerFotoExistente = (index: number) => {
    const novasFotos = fotosExistentes.filter((_, i) => i !== index)
    setFotosExistentes(novasFotos)
    
    // Ajustar índice da foto principal se necessário
    if (fotoPrincipalIndex === index) {
      setFotoPrincipalIndex(0)
      if (novasFotos.length > 0) {
        setPreviewPrincipal(novasFotos[0])
      } else {
        setPreviewPrincipal(null)
      }
    } else if (fotoPrincipalIndex > index) {
      setFotoPrincipalIndex(fotoPrincipalIndex - 1)
    }
  }

  const selecionarFotoPrincipal = (index: number) => {
    setFotoPrincipalIndex(index)
    setPreviewPrincipal(fotosExistentes[index])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (!formData.titulo.trim()) {
        throw new Error('Título é obrigatório')
      }

      // Processar características (tags)
      const tagsComodidades = [
        ...(formData.frenteMar ? ['Frente Mar'] : []),
        ...(formData.mobiliado ? ['Mobiliado'] : []),
        ...(formData.vistaMar ? ['Vista Mar'] : []),
        ...(formData.areaLazer ? ['Área de Lazer'] : []),
      ]

      const tagsCaracteristicas = formData.caracteristicas
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const todasTags = [...tagsComodidades, ...tagsCaracteristicas]

      // Preparar dados do imóvel
      const imovelData = {
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
          frenteMar: formData.frenteMar,
          piscina: formData.areaLazer,
          churrasqueira: false,
          academia: formData.areaLazer,
          portaria: false,
          elevador: false,
          varanda: false,
          sacada: false,
        },
        tags: todasTags,
        contato: {
          whatsapp: formData.whatsapp.trim(),
          corretor: formData.corretor.trim() || 'NOX Imóveis',
          email: formData.email.trim() || undefined,
        },
        publicado: formData.publicado,
        selecaoNox: formData.selecaoNox,
        dataEntrega: formData.dataEntrega || undefined,
        fotoPrincipalIndex: fotoPrincipalIndex,
      }

      // Preparar lista completa de fotos ordenadas
      // 1. Reordenar fotos existentes: foto principal primeiro
      let fotosOrdenadas = [...fotosExistentes]
      if (fotosOrdenadas.length > 0 && fotoPrincipalIndex > 0 && fotoPrincipalIndex < fotosOrdenadas.length) {
        const fotoPrincipal = fotosOrdenadas[fotoPrincipalIndex]
        fotosOrdenadas.splice(fotoPrincipalIndex, 1)
        fotosOrdenadas.unshift(fotoPrincipal)
        imovelData.fotoPrincipalIndex = 0
      }

      // Preparar novas fotos para upload
      const novasFotos: File[] = []
      if (fotoPrincipalFile) {
        novasFotos.push(fotoPrincipalFile) // Nova foto principal vai primeiro
      }
      novasFotos.push(...fotosSecundariasFiles)

      // Se houver novas fotos, fazer upload
      // A API vai adicionar as novas URLs ao final
      // Depois faremos um segundo update para reordenar (nova principal primeiro)
      if (novasFotos.length > 0) {
        // Primeiro: fazer upload das novas fotos
        await updateImovelWithFotos(
          id,
          {
            ...imovelData,
            fotos: fotosOrdenadas, // Fotos existentes ordenadas
          },
          novasFotos
        )
        
        // Segundo: buscar imóvel atualizado e reordenar
        const response = await fetch('/api/imoveis-github', { cache: 'no-store' })
        const imoveis = await response.json()
        const imovelAtualizado = imoveis.find((i: any) => i.id === id)
        
        if (imovelAtualizado) {
          const todasFotos = imovelAtualizado.fotos || []
          let fotosFinais = [...todasFotos]
          
          // Se há nova foto principal, ela está no final (última das novas)
          // Mover para o início
          if (fotoPrincipalFile && todasFotos.length > fotosExistentes.length) {
            const indiceNovaPrincipal = todasFotos.length - novasFotos.length // Primeira nova = principal
            const novaPrincipal = todasFotos[indiceNovaPrincipal]
            fotosFinais.splice(indiceNovaPrincipal, 1)
            fotosFinais.unshift(novaPrincipal)
            imovelData.fotoPrincipalIndex = 0
          }
          
          // Atualizar com ordem final
          await updateImovelWithFotos(
            id,
            {
              ...imovelData,
              fotos: fotosFinais,
            }
          )
        }
      } else {
        // Apenas atualizar dados, mantendo fotos existentes ordenadas
        await updateImovelWithFotos(
          id,
          {
            ...imovelData,
            fotos: fotosOrdenadas,
          }
        )
      }

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

              <div className="grid grid-cols-2 gap-4">
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
              </div>
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
                placeholder="Ex: Varanda, Sacada, Piscina, Academia"
              />
              <p className="text-xs text-gray-500 mt-1">
                Adicione características adicionais separadas por vírgula. As comodidades (Frente Mar, Mobiliado, etc.) são marcadas abaixo.
              </p>
            </div>
          </div>

          {/* Comodidades */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Comodidades</h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="frenteMar"
                  checked={formData.frenteMar}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Frente Mar</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="vistaMar"
                  checked={formData.vistaMar}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Vista Mar</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="mobiliado"
                  checked={formData.mobiliado}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Mobiliado</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="areaLazer"
                  checked={formData.areaLazer}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Área de Lazer / Home Club</span>
              </label>
            </div>
          </div>

          {/* Fotos */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Fotos</h2>
            
            {/* Fotos Existentes */}
            {fotosExistentes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotos Existentes
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {fotosExistentes.map((foto, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={foto}
                        alt={`Foto ${index + 1}`}
                        className={`w-full h-48 object-cover rounded-lg border-2 ${
                          fotoPrincipalIndex === index ? 'border-purple-600' : 'border-gray-200'
                        }`}
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        {fotoPrincipalIndex === index ? (
                          <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                            Principal
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => selecionarFotoPrincipal(index)}
                            className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-blue-700"
                          >
                            Definir Principal
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removerFotoExistente(index)}
                          className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nova Foto Principal */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nova Foto Principal (opcional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {previewPrincipal && !fotosExistentes.includes(previewPrincipal) ? (
                  <div className="relative inline-block">
                    <img
                      src={previewPrincipal}
                      alt="Preview principal"
                      className="max-w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFotoPrincipalFile(null)
                        setPreviewPrincipal(fotosExistentes[fotoPrincipalIndex] || null)
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Clique para selecionar nova foto principal</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFotoPrincipalChange}
                        className="hidden"
                      />
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Novas Fotos Secundárias */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Novas Fotos Secundárias (opcional, máximo 4)
              </label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {previewSecundarias.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFotoSecundaria(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              {fotosSecundariasFiles.length < 4 && (
                <label className="block border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-purple-400 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-600">
                    Adicionar {fotosSecundariasFiles.length === 0 ? 'fotos' : 'mais fotos'} ({fotosSecundariasFiles.length}/4)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFotosSecundariasChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Contato */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contato</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="(47) 99753-0113"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Corretor
                  </label>
                  <input
                    type="text"
                    name="corretor"
                    value={formData.corretor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="NOX Imóveis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
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

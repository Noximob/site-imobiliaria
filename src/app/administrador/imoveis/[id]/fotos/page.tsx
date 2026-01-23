'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Check, Loader2, Image as ImageIcon } from 'lucide-react'
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
        
        // Carregar seleções existentes ou usar padrão
        const todasFotos = imovelEncontrado.fotos || []
        setFotoPrincipal(imovelEncontrado.fotoPrincipalDWV || todasFotos[0] || null)
        setFotosMenores(imovelEncontrado.fotosMenoresDWV || todasFotos.slice(1, 5) || [])
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

      // Atualizar apenas as seleções de fotos
      const imovelAtualizado = {
        ...imovelCompleto,
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
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Por que editar fotos aqui?</h3>
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
                      className="w-full h-full object-cover"
                    />
                    {fotoPrincipal === foto && (
                      <div className="absolute inset-0 bg-purple-600 bg-opacity-20 flex items-center justify-center">
                        <div className="bg-purple-600 text-white rounded-full p-2">
                          <Check className="w-6 h-6" />
                        </div>
                      </div>
                    )}
                    {fotoPrincipal === foto && (
                      <div className="absolute bottom-2 left-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        Principal
                      </div>
                    )}
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
                      {isMenor && (
                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                          Menor {fotosMenores.indexOf(foto) + 1}
                        </div>
                      )}
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
                <div className="grid grid-cols-2 gap-2 max-w-2xl">
                  {/* Foto Principal */}
                  {fotoPrincipal && (
                    <div className="row-span-2 aspect-square rounded-lg overflow-hidden border-2 border-purple-300">
                      <img
                        src={fotoPrincipal}
                        alt="Principal"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 left-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        Principal
                      </div>
                    </div>
                  )}
                  {/* Fotos Menores */}
                  <div className="grid grid-cols-2 gap-2">
                    {fotosMenores.slice(0, 4).map((foto, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden border-2 border-blue-300 relative"
                      >
                        <img
                          src={foto}
                          alt={`Menor ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
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

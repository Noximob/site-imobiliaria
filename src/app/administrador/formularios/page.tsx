'use client'

import { useEffect, useState } from 'react'
import { Trash2, Mail, Phone, Calendar, Eye, EyeOff, ClipboardList } from 'lucide-react'

interface FormularioAnunciar {
  id: string
  telefone: string
  email: string
  tipoImovel: string
  cidade: string
  bairro: string
  tipo: 'vender' | 'alugar'
  createdAt: string
  lido: boolean
}

interface FormularioEncontreImovel {
  id: string
  nome: string
  telefone: string
  email: string
  tipoImovel: string
  quartos: string
  vagas: string
  cidade: string
  bairro: string
  createdAt: string
  lido: boolean
}

interface FormularioContato {
  id: string
  nome: string
  telefone: string
  email: string
  departamento: string
  contatoWhatsApp: boolean
  contatoTelefone: boolean
  mensagem: string
  createdAt: string
  lido: boolean
}

interface FormularioTrabalheConosco {
  id: string
  nome: string
  telefone: string
  email: string
  instagram: string
  informacoes: string
  arquivos?: string[]
  createdAt: string
  lido: boolean
}

type TipoFormulario = 'anunciar' | 'encontre-imovel' | 'contato' | 'trabalhe-conosco'
type Formulario = FormularioAnunciar | FormularioEncontreImovel | FormularioContato | FormularioTrabalheConosco

export default function FormulariosPage() {
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoFormulario | 'todos'>('todos')
  const [formularios, setFormularios] = useState<{ tipo: TipoFormulario, dados: Formulario[] }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formularioExpandido, setFormularioExpandido] = useState<string | null>(null)

  useEffect(() => {
    loadFormularios()
  }, [])

  const loadFormularios = async () => {
    setIsLoading(true)
    try {
      const [anunciar, encontre, contato, trabalhe] = await Promise.all([
        fetch('/api/formularios/anunciar').then(r => r.json()),
        fetch('/api/formularios/encontre-imovel').then(r => r.json()),
        fetch('/api/formularios/contato').then(r => r.json()),
        fetch('/api/formularios/trabalhe-conosco').then(r => r.json()),
      ])

      setFormularios([
        { tipo: 'anunciar', dados: anunciar },
        { tipo: 'encontre-imovel', dados: encontre },
        { tipo: 'contato', dados: contato },
        { tipo: 'trabalhe-conosco', dados: trabalhe },
      ])
    } catch (error) {
      console.error('Erro ao carregar formulários:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (tipo: TipoFormulario, id: string) => {
    if (!confirm('Tem certeza que deseja excluir este formulário?')) return

    try {
      const rota = tipo === 'encontre-imovel' ? 'encontre-imovel' : tipo
      const response = await fetch(`/api/formularios/${rota}?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadFormularios()
      } else {
        alert('Erro ao excluir formulário')
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
      alert('Erro ao excluir formulário')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTipoNome = (tipo: TipoFormulario) => {
    const nomes = {
      'anunciar': 'Anunciar Imóvel',
      'encontre-imovel': 'Encontre seu Imóvel',
      'contato': 'Contato',
      'trabalhe-conosco': 'Trabalhe Conosco'
    }
    return nomes[tipo]
  }

  const getTipoCor = (tipo: TipoFormulario) => {
    const cores = {
      'anunciar': 'bg-purple-100 text-purple-800',
      'encontre-imovel': 'bg-blue-100 text-blue-800',
      'contato': 'bg-green-100 text-green-800',
      'trabalhe-conosco': 'bg-orange-100 text-orange-800'
    }
    return cores[tipo]
  }

  const formulariosFiltrados = tipoSelecionado === 'todos'
    ? formularios
    : formularios.filter(f => f.tipo === tipoSelecionado)

  const totalFormularios = formularios.reduce((acc, f) => acc + f.dados.length, 0)
  const naoLidos = formularios.reduce((acc, f) => acc + f.dados.filter(d => !(d as any).lido).length, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Formulários</h1>
          <p className="text-gray-600">Gerencie todas as submissões de formulários do site</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Formulários</p>
                <p className="text-2xl font-bold text-gray-900">{totalFormularios}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Não Lidos</p>
                <p className="text-2xl font-bold text-orange-600">{naoLidos}</p>
              </div>
              <EyeOff className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lidos</p>
                <p className="text-2xl font-bold text-green-600">{totalFormularios - naoLidos}</p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTipoSelecionado('todos')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                tipoSelecionado === 'todos'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {(['anunciar', 'encontre-imovel', 'contato', 'trabalhe-conosco'] as TipoFormulario[]).map(tipo => (
              <button
                key={tipo}
                onClick={() => setTipoSelecionado(tipo)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  tipoSelecionado === tipo
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getTipoNome(tipo)}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Formulários */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Carregando formulários...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {formulariosFiltrados.map(({ tipo, dados }) => (
              <div key={tipo} className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTipoCor(tipo)}`}>
                        {getTipoNome(tipo)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {dados.length} {dados.length === 1 ? 'formulário' : 'formulários'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="divide-y">
                  {dados.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      Nenhum formulário encontrado
                    </div>
                  ) : (
                    dados.map((formulario) => (
                      <div
                        key={formulario.id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !(formulario as any).lido ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {('nome' in formulario ? formulario.nome : formulario.email) || 'Sem nome'}
                              </h3>
                              {!(formulario as any).lido && (
                                <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">
                                  Novo
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                              {'email' in formulario && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  <span>{formulario.email}</span>
                                </div>
                              )}
                              {'telefone' in formulario && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  <span>{formulario.telefone}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(formulario.createdAt)}</span>
                              </div>
                            </div>
                            
                            {/* Detalhes expandidos */}
                            {formularioExpandido === formulario.id && (
                              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
                                {tipo === 'anunciar' && (
                                  <>
                                    <div><strong>Tipo:</strong> {(formulario as FormularioAnunciar).tipo === 'vender' ? 'Vender' : 'Alugar'}</div>
                                    <div><strong>Tipo do Imóvel:</strong> {(formulario as FormularioAnunciar).tipoImovel || 'Não informado'}</div>
                                    <div><strong>Cidade:</strong> {(formulario as FormularioAnunciar).cidade || 'Não informado'}</div>
                                    <div><strong>Bairro:</strong> {(formulario as FormularioAnunciar).bairro || 'Não informado'}</div>
                                  </>
                                )}
                                {tipo === 'encontre-imovel' && (
                                  <>
                                    <div><strong>Tipo do Imóvel:</strong> {(formulario as FormularioEncontreImovel).tipoImovel || 'Não informado'}</div>
                                    <div><strong>Quartos:</strong> {(formulario as FormularioEncontreImovel).quartos || 'Não informado'}</div>
                                    <div><strong>Vagas:</strong> {(formulario as FormularioEncontreImovel).vagas || 'Não informado'}</div>
                                    <div><strong>Cidade:</strong> {(formulario as FormularioEncontreImovel).cidade || 'Não informado'}</div>
                                    <div><strong>Bairro:</strong> {(formulario as FormularioEncontreImovel).bairro || 'Não informado'}</div>
                                  </>
                                )}
                                {tipo === 'contato' && (
                                  <>
                                    <div><strong>Departamento:</strong> {(formulario as FormularioContato).departamento || 'Não informado'}</div>
                                    <div><strong>Contato por WhatsApp:</strong> {(formulario as FormularioContato).contatoWhatsApp ? 'Sim' : 'Não'}</div>
                                    <div><strong>Contato por Telefone:</strong> {(formulario as FormularioContato).contatoTelefone ? 'Sim' : 'Não'}</div>
                                    {(formulario as FormularioContato).mensagem && (
                                      <div>
                                        <strong>Mensagem:</strong>
                                        <p className="mt-1 text-gray-700">{(formulario as FormularioContato).mensagem}</p>
                                      </div>
                                    )}
                                  </>
                                )}
                                {tipo === 'trabalhe-conosco' && (
                                  <>
                                    <div><strong>Instagram:</strong> {(formulario as FormularioTrabalheConosco).instagram || 'Não informado'}</div>
                                    {(formulario as FormularioTrabalheConosco).informacoes && (
                                      <div>
                                        <strong>Informações:</strong>
                                        <p className="mt-1 text-gray-700">{(formulario as FormularioTrabalheConosco).informacoes}</p>
                                      </div>
                                    )}
                                    {(formulario as FormularioTrabalheConosco).arquivos && (formulario as FormularioTrabalheConosco).arquivos!.length > 0 && (
                                      <div>
                                        <strong>Arquivos:</strong>
                                        <ul className="mt-1 list-disc list-inside">
                                          {(formulario as FormularioTrabalheConosco).arquivos!.map((arquivo, idx) => (
                                            <li key={idx}>{arquivo}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => setFormularioExpandido(formularioExpandido === formulario.id ? null : formulario.id)}
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                              title={formularioExpandido === formulario.id ? 'Ocultar detalhes' : 'Ver detalhes'}
                            >
                              {formularioExpandido === formulario.id ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                            <button
                              onClick={() => handleDelete(tipo, formulario.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


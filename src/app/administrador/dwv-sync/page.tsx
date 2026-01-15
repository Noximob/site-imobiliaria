'use client'

import { useState } from 'react'
import { RefreshCw, CheckCircle, XCircle, Eye, Loader2 } from 'lucide-react'

export default function DWVSyncPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [preview, setPreview] = useState<any>(null)
  const [syncResult, setSyncResult] = useState<any>(null)
  const [testResult, setTestResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTest = async () => {
    setIsTesting(true)
    setError(null)
    setTestResult(null)

    try {
      const response = await fetch('/api/dwv/test')
      const data = await response.json()

      if (data.success) {
        setTestResult(data)
      } else {
        setError(data.error || 'Erro ao testar conexão')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com a API')
    } finally {
      setIsTesting(false)
    }
  }

  const handleTestUrls = async () => {
    setIsTestingUrls(true)
    setError(null)
    setUrlTestResult(null)

    try {
      const response = await fetch('/api/dwv/test-url')
      const data = await response.json()

      if (data.success) {
        setUrlTestResult(data)
      } else {
        setError(data.error || 'Erro ao testar URLs')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao testar URLs')
    } finally {
      setIsTestingUrls(false)
    }
  }

  const handlePreview = async () => {
    setIsLoading(true)
    setError(null)
    setPreview(null)

    try {
      const response = await fetch('/api/dwv/sync')
      const data = await response.json()

      if (data.success) {
        setPreview(data)
      } else {
        setError(data.message || data.error || 'Erro ao buscar imóveis')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com a API')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSync = async (mode: 'merge' | 'replace') => {
    if (!confirm(`Tem certeza que deseja sincronizar? Modo: ${mode === 'merge' ? 'MERGE (adicionar/atualizar)' : 'REPLACE (substituir todos)'}`)) {
      return
    }

    setIsSyncing(true)
    setError(null)
    setSyncResult(null)

    try {
      const response = await fetch('/api/dwv/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mode }),
      })

      const data = await response.json()

      if (data.success) {
        setSyncResult(data)
        // Atualizar preview após sync
        handlePreview()
      } else {
        setError(data.error || 'Erro ao sincronizar')
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com a API')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sincronização DWV</h1>
          <p className="text-gray-600">
            Sincronize imóveis da API DWV com o site
          </p>
        </div>

        {/* Configuração */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Configuração Necessária</h3>
          <p className="text-sm text-yellow-800 mb-2">
            Configure estas variáveis no Netlify:
          </p>
          <ul className="text-sm text-yellow-800 list-disc list-inside space-y-1">
            <li><code className="bg-yellow-100 px-1 rounded">DWV_API_URL</code> - URL da API DWV</li>
            <li><code className="bg-yellow-100 px-1 rounded">DWV_API_TOKEN</code> - Token de autenticação</li>
          </ul>
          <p className="text-xs text-yellow-700 mt-2">
            Veja o arquivo <code className="bg-yellow-100 px-1 rounded">src/lib/dwv-api.ts</code> para ajustar o formato dos dados.
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleTest}
              disabled={isTesting}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Testando...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Testar Conexão
                </>
              )}
            </button>

            <button
              onClick={handleTestUrls}
              disabled={isTestingUrls}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isTestingUrls ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Testando URLs...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Testar URLs Alternativas
                </>
              )}
            </button>

            <button
              onClick={handlePreview}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  Ver Preview
                </>
              )}
            </button>

            <button
              onClick={() => handleSync('merge')}
              disabled={isSyncing || !preview}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Sincronizar (MERGE)
                </>
              )}
            </button>

            <button
              onClick={() => handleSync('replace')}
              disabled={isSyncing || !preview}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Substituir Todos (REPLACE)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Resultado do Teste de URLs */}
        {urlTestResult && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Teste de URLs Alternativas
              </h2>
            </div>
            {urlTestResult.recommendation && urlTestResult.recommendation.url ? (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-900 font-semibold mb-2">✅ URL Funcionando Encontrada!</p>
                <p className="text-sm text-green-800 mb-2">
                  <strong>URL:</strong> <code className="bg-green-100 px-2 py-1 rounded">{urlTestResult.recommendation.url}</code>
                </p>
                <p className="text-sm text-green-800">
                  Esta URL retornou <strong>{urlTestResult.recommendation.dataCount}</strong> imóveis de um total de <strong>{urlTestResult.recommendation.total}</strong>.
                </p>
                <p className="text-sm text-green-700 mt-2">
                  <strong>⚠️ Ação necessária:</strong> Configure esta URL na variável <code className="bg-green-100 px-1 rounded">DWV_API_URL</code> no Netlify.
                </p>
              </div>
            ) : (
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-900 font-semibold mb-2">⚠️ Nenhuma URL retornou imóveis</p>
                <p className="text-sm text-yellow-800">{urlTestResult.recommendation?.message}</p>
              </div>
            )}
            <div className="space-y-2 text-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Resultados de todas as URLs testadas:</h3>
              {urlTestResult.results?.map((result: any, index: number) => (
                <div key={index} className={`p-3 rounded border ${result.ok && result.hasData ? 'bg-green-50 border-green-200' : result.ok ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-mono text-xs break-all mb-1">{result.url}</div>
                      {result.ok ? (
                        <div className="text-xs">
                          <span className="text-green-600">✓ OK</span> - Status: {result.status} | 
                          Total: {result.total || 0} | 
                          Retornados: {result.dataCount || 0}
                          {result.firstItem && (
                            <div className="mt-1 text-gray-600">
                              Primeiro: ID {result.firstItem.id} - {result.firstItem.title} (Status: {result.firstItem.status})
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-red-600">
                          ✗ Erro: {result.status || 'N/A'} - {result.error || 'Erro desconhecido'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resultado do Teste */}
        {testResult && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Teste de Conexão
              </h2>
            </div>
            <div className="space-y-2 text-sm">
              <div><strong>Status:</strong> <span className="text-green-600">{testResult.message}</span></div>
              <div><strong>URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{testResult.config?.url}</code></div>
              <div><strong>Token:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{testResult.config?.tokenPreview}</code></div>
              {testResult.result && (
                <div className="mt-4 pt-4 border-t">
                  <div><strong>Imóveis encontrados:</strong> {testResult.result.totalEncontrados}</div>
                  {testResult.result.primeiroImovel && (
                    <div className="mt-2 p-3 bg-gray-50 rounded">
                      <div><strong>ID:</strong> {testResult.result.primeiroImovel.id}</div>
                      <div><strong>Título:</strong> {testResult.result.primeiroImovel.title}</div>
                      <div><strong>Status:</strong> {testResult.result.primeiroImovel.status}</div>
                      <div className="mt-2 text-xs text-gray-600">
                        <div>Tem Unit: {testResult.result.primeiroImovel.hasUnit ? '✅' : '❌'}</div>
                        <div>Tem Building: {testResult.result.primeiroImovel.hasBuilding ? '✅' : '❌'}</div>
                        <div>Tem Third Party: {testResult.result.primeiroImovel.hasThirdParty ? '✅' : '❌'}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <div className="flex-1">
                <p className="text-red-800 font-semibold">{error}</p>
                <p className="text-red-600 text-sm mt-1">
                  Verifique se as variáveis DWV_API_URL e DWV_API_TOKEN estão configuradas no Netlify.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Preview com erro mas com diagnóstico */}
        {preview && !preview.success && preview.diagnostic && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-yellow-600" />
              <h2 className="text-xl font-semibold text-gray-900">Diagnóstico da API</h2>
            </div>
            {preview.diagnostic.rawResponse && (
              <div className="space-y-2 text-sm mb-4">
                <div><strong>Total na API:</strong> {preview.diagnostic.rawResponse.total || 0}</div>
                <div><strong>Imóveis retornados:</strong> {preview.diagnostic.rawResponse.dataCount || 0}</div>
                <div><strong>Página:</strong> {preview.diagnostic.rawResponse.page || 1} de {preview.diagnostic.rawResponse.lastPage || 1}</div>
                {preview.diagnostic.rawResponse.allStatuses && preview.diagnostic.rawResponse.allStatuses.length > 0 && (
                  <div><strong>Status encontrados:</strong> {preview.diagnostic.rawResponse.allStatuses.join(', ')}</div>
                )}
                {preview.diagnostic.rawResponse.firstItem && (
                  <div className="mt-2 p-3 bg-white rounded border">
                    <div><strong>Primeiro imóvel retornado:</strong></div>
                    <div>ID: {preview.diagnostic.rawResponse.firstItem.id}</div>
                    <div>Título: {preview.diagnostic.rawResponse.firstItem.title}</div>
                    <div>Status: {preview.diagnostic.rawResponse.firstItem.status}</div>
                    <div>Deletado: {preview.diagnostic.rawResponse.firstItem.deleted ? 'Sim' : 'Não'}</div>
                  </div>
                )}
              </div>
            )}
            {preview.diagnostic.suggestion && (
              <div className="mt-4 p-3 bg-yellow-100 rounded">
                <p className="text-yellow-900 text-sm font-semibold">💡 Sugestão:</p>
                <p className="text-yellow-800 text-sm mt-1">{preview.diagnostic.suggestion}</p>
              </div>
            )}
          </div>
        )}

        {/* Preview */}
        {preview && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Preview: {preview.total} imóveis encontrados
              </h2>
            </div>
            <p className="text-gray-600 mb-4">{preview.message}</p>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Primeiros 5 imóveis (exemplo):</h3>
              {preview.preview?.map((imovel: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{imovel.titulo}</h4>
                    <span className="text-sm text-gray-500">ID: {imovel.id}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                    <div><strong>Tipo:</strong> {imovel.tipo}</div>
                    <div><strong>Status:</strong> {imovel.status}</div>
                    <div><strong>Cidade:</strong> {imovel.endereco.cidade}</div>
                    <div><strong>Preço:</strong> R$ {imovel.preco.toLocaleString('pt-BR')}</div>
                    <div><strong>Quartos:</strong> {imovel.caracteristicas.quartos}</div>
                    <div><strong>Banheiros:</strong> {imovel.caracteristicas.banheiros}</div>
                    <div><strong>Vagas:</strong> {imovel.caracteristicas.vagas}</div>
                    <div><strong>Área:</strong> {imovel.caracteristicas.area}m²</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resultado do Sync */}
        {syncResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Sincronização Concluída</h2>
            </div>
            <div className="space-y-2 text-gray-700">
              <p><strong>Total de imóveis:</strong> {syncResult.total}</p>
              <p><strong>Novos da DWV:</strong> {syncResult.novos}</p>
              <p><strong>Existentes:</strong> {syncResult.existentes}</p>
              <p className="text-green-600 font-semibold">{syncResult.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



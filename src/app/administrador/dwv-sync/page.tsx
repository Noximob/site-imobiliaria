'use client'

import { useState } from 'react'
import { RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function DWVSyncPage() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

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

      // Ler resposta UMA VEZ - não pode chamar .json() ou .text() duas vezes
      let data: any
      try {
        const contentType = response.headers.get('content-type')
        const isJson = contentType && contentType.includes('application/json')
        
        if (isJson) {
          data = await response.json()
        } else {
          const text = await response.text()
          throw new Error(`Resposta não é JSON (${response.status}): ${text.substring(0, 200)}`)
        }
      } catch (err: any) {
        // Se não conseguir fazer parse, retornar erro
        const errorMessage = err.message || `Erro ao processar resposta: ${response.status} ${response.statusText}`
        throw new Error(errorMessage)
      }
      
      // Agora verificar se foi erro HTTP
      if (!response.ok) {
        const errorMessage = data?.error || data?.message || `Erro HTTP ${response.status}`
        throw new Error(errorMessage)
      }

      if (data.success) {
        setSyncResult(data)
      } else {
        setError(data.error || data.message || 'Erro ao sincronizar')
      }
    } catch (err: any) {
      console.error('Erro ao sincronizar:', err)
      setError(err.message || 'Erro ao conectar com a API')
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            URL recomendada: <code className="bg-yellow-100 px-1 rounded">https://agencies.dwvapp.com.br/integration/properties</code>
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => handleSync('merge')}
              disabled={isSyncing}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Sincronizar (MERGE)
                </>
              )}
            </button>

            <button
              onClick={() => handleSync('replace')}
              disabled={isSyncing}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Substituindo...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Substituir Todos (REPLACE)
                </>
              )}
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              <strong>MERGE:</strong> Adiciona novos imóveis e atualiza existentes, mantendo imóveis não-DWV.
              <br />
              <strong>REPLACE:</strong> Remove todos os imóveis e substitui apenas pelos da DWV.
            </p>
          </div>
        </div>

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

        {/* Resultado do Sync */}
        {syncResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Sincronização Concluída</h2>
            </div>
            <div className="space-y-2 text-gray-700">
              <p><strong>Total de imóveis no site:</strong> {syncResult.total}</p>
              <p><strong>Adicionados:</strong> <span className="text-green-600">{syncResult.adicionados || 0}</span></p>
              <p><strong>Atualizados:</strong> <span className="text-blue-600">{syncResult.atualizados || 0}</span></p>
              <p><strong>Removidos:</strong> <span className="text-red-600">{syncResult.removidos || 0}</span></p>
              <p><strong>Total da DWV:</strong> {syncResult.totalDWV || 0}</p>
              <p className="text-green-600 font-semibold mt-4">{syncResult.message}</p>
              <p className="text-sm text-gray-500 mt-2">
                Os imóveis sincronizados já estão disponíveis na página de busca.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

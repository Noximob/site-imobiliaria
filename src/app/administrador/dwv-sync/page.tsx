'use client'

import { useState } from 'react'
import { RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function DWVSyncPage() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSync = async () => {
    if (!confirm('Sincronizar imóveis do DWV?\n\n- Adicionará novos imóveis selecionados\n- ATUALIZARÁ TODOS os imóveis existentes com dados mais recentes do DWV (upload total)\n- Removerá imóveis desmarcados no DWV\n- Manterá imóveis manuais intactos')) {
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
        body: JSON.stringify({}),
      })

      // Ler resposta UMA VEZ apenas
      const responseText = await response.text()
      
      let data: any
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        throw new Error(`Erro ao processar resposta do servidor: ${response.status} - ${responseText.substring(0, 200)}`)
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

        {/* Botão de Sincronização */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSyncing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Sincronizar Imóveis do DWV
              </>
            )}
          </button>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 font-semibold mb-2">Como funciona:</p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Adiciona novos imóveis que você selecionou no DWV</li>
              <li>Atualiza imóveis existentes com dados atualizados</li>
              <li>Remove imóveis que foram desmarcados no DWV</li>
              <li>Mantém seus imóveis manuais intactos</li>
            </ul>
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
              <p className="font-semibold text-lg mb-3">{syncResult.message}</p>
              {syncResult.temMudancas ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Total no site:</p>
                      <p className="text-xl font-bold text-gray-900">{syncResult.total}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Da DWV:</p>
                      <p className="text-xl font-bold text-blue-600">{syncResult.totalDWV || 0}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <div className="flex-1 text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Novos</p>
                      <p className="text-2xl font-bold text-green-600">{syncResult.adicionados || 0}</p>
                    </div>
                    <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Atualizados</p>
                      <p className="text-2xl font-bold text-blue-600">{syncResult.atualizados || 0}</p>
                    </div>
                    <div className="flex-1 text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-gray-600">Removidos</p>
                      <p className="text-2xl font-bold text-red-600">{syncResult.removidos || 0}</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Tudo está sincronizado!</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Total: <strong>{syncResult.total}</strong> imóveis | DWV: <strong>{syncResult.totalDWV || 0}</strong>
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-4">
                Os imóveis sincronizados já estão disponíveis na página de busca.
              </p>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/dwv/debug')
                    const responseText = await response.text()
                    let data: any = {}
                    
                    try {
                      data = JSON.parse(responseText)
                    } catch (parseErr) {
                      alert(`Erro ao processar resposta:\n${responseText.substring(0, 200)}`)
                      return
                    }

                    if (data.error) {
                      alert(`Erro: ${data.error}\nStatus: ${data.status || 'N/A'}`)
                      return
                    }

                    const msg = `Diagnóstico dos Imóveis:\n\n` +
                      `Arquivo existe: ${data.arquivoExiste ? 'Sim' : 'Não'}\n` +
                      `Total: ${data.total || 0}\n` +
                      `Publicados: ${data.publicados || 0}\n` +
                      `Não publicados: ${data.naoPublicados || 0}\n` +
                      `Da DWV: ${data.fonteDWV || 0}\n` +
                      `Não-DWV (manuais): ${data.naoDWV || 0}\n` +
                      `Com problemas: ${data.imoveisComProblemas || 0}`
                    
                    alert(msg)
                  } catch (err: any) {
                    alert(`Erro ao verificar: ${err.message || 'Erro desconhecido'}`)
                  }
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Verificar Imóveis no GitHub
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

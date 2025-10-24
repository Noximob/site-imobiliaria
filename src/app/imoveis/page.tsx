'use client'

import FiltrosImoveis from '@/components/FiltrosImoveis'

export default function ImoveisPage() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Conteúdo Principal com Duas Colunas */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar de Filtros - Lado Esquerdo - COM SCROLL */}
        <div className="w-80 bg-white shadow-lg overflow-y-auto">
          <FiltrosImoveis onFiltrosChange={(filtros) => {
            console.log('Filtros aplicados:', filtros)
          }} />
        </div>

        {/* Área Principal - Lado Direito - COM SCROLL */}
        <div className="flex-1 overflow-y-auto">
          {/* Header Fixo dos Imóveis - SÓ EM CIMA DOS IMÓVEIS */}
          <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Imóveis à Venda</h1>
                <p className="text-xs text-gray-600 mt-1">Home &gt; Imóveis à Venda</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Ordenar
                </button>
                <button className="p-1.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Encontramos 2 imóveis com seus critérios de busca
            </p>
          </div>

          <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Lista de Imóveis */}
            <div className="space-y-6">
              {/* Mockup 1 */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden flex h-64">
                <div className="w-80 h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500">Imagem do Imóvel</span>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Apartamento 4 quartos frente mar à venda no Edifício Mediterranne em Balneário Camboriú
                    </h3>
                    <p className="text-gray-600 text-sm mb-1">
                      Avenida Atlântica, 2898, Centro - Balneário Camboriú/SC
                    </p>
                    <p className="text-gray-500 text-sm mb-2">
                      Residencial Mediterranne
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      Cód.: 2678
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Estuda Permuta</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Mobiliado</span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                        </svg>
                        <span>4 Quartos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>4 Suítes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1H21v6H3V3h7.5z" />
                        </svg>
                        <span>2 Vagas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4a2 2 0 012-2h12a2 2 0 012 2v4M4 8v8a2 2 0 002 2h12a2 2 0 002-2V8M4 8h16" />
                        </svg>
                        <span>328m² Privat.</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">Venda R$ 6.800.000,00</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="text-gray-400 hover:text-red-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200">
                        SABER MAIS
                      </button>
                    </div>
                  </div>
            </div>
          </div>

              {/* Mockup 2 */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden flex h-64">
                <div className="w-80 h-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-500">Imagem do Imóvel</span>
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Apartamento frente mar à venda no Ed. Ibiza Towers em Balneário Camboriú
                  </h3>
                    <p className="text-gray-600 text-sm mb-1">
                      Avenida Atlântica, 5720, Centro - Balneário Camboriú/SC
                    </p>
                    <p className="text-gray-500 text-sm mb-2">
                      Ibiza Towers
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      Cód.: 3367
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Mobiliado</span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                        </svg>
                        <span>4 Quartos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>3 Suítes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M10.5 3L12 2l1.5 1H21v6H3V3h7.5z" />
                        </svg>
                        <span>3 Vagas</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">Venda R$ 12.800.000,00</p>
                      <p className="text-sm text-gray-500">Condomínio R$ 1.842,37</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="text-gray-400 hover:text-red-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200">
                        SABER MAIS
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
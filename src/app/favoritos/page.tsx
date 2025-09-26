'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Construction, Home, Clock } from 'lucide-react'

export default function FavoritosPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Construction className="w-12 h-12 text-purple-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Em Construção
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Estamos trabalhando para trazer uma experiência incrível para você!
            </p>
          </div>

          {/* Features em desenvolvimento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Favoritos
              </h3>
              <p className="text-gray-600 text-sm">
                Salve seus imóveis favoritos e acesse facilmente quando quiser.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Histórico
              </h3>
              <p className="text-gray-600 text-sm">
                Veja todos os imóveis que você já visualizou anteriormente.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Construction className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Comparação
              </h3>
              <p className="text-gray-600 text-sm">
                Compare diferentes imóveis lado a lado para tomar a melhor decisão.
              </p>
            </div>
          </div>

          {/* Call to action */}
          <div className="bg-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Quer ser notificado quando estiver pronto?
            </h2>
            <p className="text-purple-100 mb-6">
              Deixe seu e-mail e te avisamos assim que a funcionalidade estiver disponível.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-300 focus:outline-none"
              />
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                Notificar
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

'use client'

import { useState } from 'react'
import { DollarSign, TrendingUp, BarChart3, Camera } from 'lucide-react'

export default function AnunciarPage() {
  const [formData, setFormData] = useState({
    telefone: '',
    email: '',
    tipoImovel: '',
    cidade: '',
    bairro: '',
    tipo: 'vender'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Dados do formulário:', formData)
    alert('Formulário enviado com sucesso! Entraremos em contato em breve.')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Duas colunas */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            
            {/* Coluna Esquerda - Marketing */}
            <div className="space-y-8">
              <div className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wide">
                Anuncie com Especialistas
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Venda rápido, sem custo e sem complicação.
              </h1>
              
              <div className="pt-8">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors">
                  Ver Vantagens
                </button>
              </div>
            </div>

            {/* Coluna Direita - Formulário Flutuante */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-white rounded-xl shadow-2xl p-8 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Anuncie seu imóvel com a Nox
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DDD + Celular / WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(47) 99999-9999"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Dados do imóvel</h3>
                    
                    <div className="flex gap-3 mb-4">
                      <button
                        type="button"
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                          formData.tipo === 'vender' 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, tipo: 'vender' }))}
                      >
                        Quero vender
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                          formData.tipo === 'alugar' 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, tipo: 'alugar' }))}
                      >
                        Quero alugar
                      </button>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo do imóvel:
                      </label>
                      <select
                        name="tipoImovel"
                        value={formData.tipoImovel}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Selecione o tipo</option>
                        <option value="casa">Casa</option>
                        <option value="apartamento">Apartamento</option>
                        <option value="terreno">Terreno</option>
                        <option value="comercial">Comercial</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        placeholder="Sua cidade"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bairro
                      </label>
                      <input
                        type="text"
                        name="bairro"
                        value={formData.bairro}
                        onChange={handleChange}
                        placeholder="Seu bairro"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-bold text-lg transition-colors"
                  >
                    Avaliar meu imóvel
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vantagens Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
              Vantagens exclusivas de anunciar com a Nox Imóveis
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Vantagem 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Anúncio 100% gratuito
                </h3>
                <p className="text-gray-600">
                  Você não paga nada para divulgar seu imóvel conosco.
                </p>
              </div>

              {/* Vantagem 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Máxima visibilidade
                </h3>
                <p className="text-gray-600">
                  Seu imóvel será promovido nos principais canais e portais do mercado.
                </p>
              </div>

              {/* Vantagem 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Avaliação especializada
                </h3>
                <p className="text-gray-600">
                  Garantimos o melhor preço para o seu imóvel com base em uma análise criteriosa.
                </p>
              </div>

              {/* Vantagem 4 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Fotografia profissional
                </h3>
                <p className="text-gray-600">
                  Destaque seu imóvel com fotos de alta qualidade feitas por nossa equipe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
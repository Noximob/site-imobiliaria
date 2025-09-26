'use client'

import { useState } from 'react'
import { Home, DollarSign, TrendingUp, BarChart3, Camera, Users, Laptop, MapPin, ChevronDown } from 'lucide-react'

export default function AnunciarPage() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    tipo: 'vender',
    tipoImovel: '',
    cidade: '',
    bairro: '',
    aceito: false
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Dados do formulário:', formData)
    alert('Formulário enviado com sucesso! Entraremos em contato em breve.')
    
    // Reset do formulário
    setFormData({
      nome: '',
      telefone: '',
      email: '',
      tipo: 'vender',
      tipoImovel: '',
      cidade: '',
      bairro: '',
      aceito: false
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
             style={{backgroundImage: 'url("https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'}}>
        </div>
        
        <div className="relative z-10 h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Lado Esquerdo - Texto */}
              <div className="text-white space-y-6">
                <div className="inline-block bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  ANUNCIE COM ESPECIALISTAS
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Venda rápido, sem custo e sem complicação.
                </h1>
                <button
                  onClick={() => document.getElementById('vantagens')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-300"
                >
                  VER VANTAGENS
                </button>
              </div>

              {/* Lado Direito - Formulário Flutuante */}
              <div className="relative">
                <div className="bg-white rounded-lg shadow-2xl p-8 sticky top-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Cadastre seu imóvel
                    </h2>
                    <p className="text-gray-600 flex items-center justify-center">
                      <Home className="w-4 h-4 mr-2" />
                      Receba uma avaliação gratuita do seu imóvel
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nome */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome
                      </label>
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Seu nome completo"
                      />
                    </div>

                    {/* Telefone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        DDD + Celular / WhatsApp
                      </label>
                      <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="(47) 99999-9999"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="seu@email.com"
                      />
                    </div>

                    {/* Dados do imóvel */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Dados do imóvel
                      </h3>
                      
                      {/* Botões Vender/Alugar */}
                      <div className="flex space-x-2 mb-4">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, tipo: 'vender' }))}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                            formData.tipo === 'vender'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Quero vender
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, tipo: 'alugar' }))}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                            formData.tipo === 'alugar'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Quero alugar
                        </button>
                      </div>

                      {/* Tipo do imóvel */}
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
                          <option value="apartamento">Apartamento</option>
                          <option value="casa">Casa</option>
                          <option value="terreno">Terreno</option>
                          <option value="comercial">Comercial</option>
                        </select>
                      </div>

                      {/* Cidade */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cidade
                        </label>
                        <input
                          type="text"
                          name="cidade"
                          value={formData.cidade}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Sua cidade"
                        />
                      </div>

                      {/* Bairro */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bairro
                        </label>
                        <input
                          type="text"
                          name="bairro"
                          value={formData.bairro}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Seu bairro"
                        />
                      </div>
                    </div>

                    {/* Checkbox de aceite */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        name="aceito"
                        checked={formData.aceito}
                        onChange={handleChange}
                        required
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-1"
                      />
                      <label className="text-sm text-gray-600">
                        Declaro estar ciente que a ação de envio deste formulário permite que eu seja contatado pela Nox Imóveis, assim como estar de acordo com o exposto nos{' '}
                        <a href="#" className="text-purple-600 hover:underline">Termos de Uso</a> e{' '}
                        <a href="#" className="text-purple-600 hover:underline">Política de Privacidade</a>
                      </label>
                    </div>

                    {/* Botão Enviar */}
                    <button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-300"
                    >
                      ENVIAR
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Vantagens */}
      <div id="vantagens" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Lado Esquerdo - Vantagens */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Vantagens exclusivas de anunciar com a Nox Imóveis
              </h2>
              
              <div className="space-y-8">
                {/* Vantagem 1 */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Anúncio 100% gratuito
                    </h3>
                    <p className="text-gray-600">
                      Você não paga nada para divulgar seu imóvel conosco.
                    </p>
                  </div>
                </div>

                {/* Vantagem 2 */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Máxima visibilidade
                    </h3>
                    <p className="text-gray-600">
                      Seu imóvel será promovido nos principais canais e portais do mercado.
                    </p>
                  </div>
                </div>

                {/* Vantagem 3 */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Avaliação especializada
                    </h3>
                    <p className="text-gray-600">
                      Garantimos o melhor preço para o seu imóvel com base em uma análise criteriosa.
                    </p>
                  </div>
                </div>

                {/* Vantagem 4 */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Camera className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Fotografia profissional
                    </h3>
                    <p className="text-gray-600">
                      Destaque seu imóvel com fotos de alta qualidade feitas por nossa equipe.
                    </p>
                  </div>
                </div>

                {/* Vantagem 5 */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Consultoria personalizada
                    </h3>
                    <p className="text-gray-600">
                      Acompanhamos você em todas as etapas da negociação com transparência e segurança.
                    </p>
                  </div>
                </div>

                {/* Vantagem 6 */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Laptop className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Processo simples e digital
                    </h3>
                    <p className="text-gray-600">
                      Você resolve tudo sem complicação e com total agilidade.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lado Direito - Espaço para formulário flutuante */}
            <div className="lg:block hidden">
              {/* Espaço reservado para o formulário flutuante */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

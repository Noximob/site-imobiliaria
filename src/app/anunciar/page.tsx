'use client'

import { useState } from 'react'
import Image from 'next/image'
import { DollarSign, TrendingUp, BarChart3, Camera } from 'lucide-react'
import { getImageUrl } from '@/lib/github-images'
import { getText } from '@/lib/site-texts'
import DepoimentosSection from '@/components/DepoimentosSection'
import { getDepoimentosAtivos } from '@/lib/depoimentos-data'

const anunciarImage = getImageUrl('anunciar-imovel')

export default async function AnunciarPage() {
  // Buscar depoimentos ativos
  const depoimentos = await getDepoimentosAtivos()
  
  return <AnunciarPageClient depoimentos={depoimentos} />
}

function AnunciarPageClient({ depoimentos }: { depoimentos: any[] }) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Primeira Seção - Hero com duas colunas */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={anunciarImage}
            alt="Anunciar Imóvel - Nox Imóveis"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-8 items-center h-full py-6">
            
            {/* Coluna Esquerda - Marketing */}
            <div className="text-white space-y-3">
              <div className="inline-block bg-purple-600 text-white px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-wider">
                {getText('anunciar.hero.titulo')}
              </div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                {getText('anunciar.hero.subtitulo')}
              </h1>
              
              <div className="pt-2">
                <button 
                  onClick={() => document.getElementById('vantagens')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-bold text-sm transition-all duration-300 transform hover:scale-105"
                >
                  {getText('anunciar.hero.botao_vantagens')}
                </button>
              </div>
            </div>

            {/* Coluna Direita - Formulário Flutuante */}
            <div className="relative flex justify-center items-center h-full">
              <div className="bg-white rounded-2xl shadow-2xl p-5 sticky top-8 max-w-xs w-full">
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  {getText('anunciar.introducao.titulo')}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      DDD + Celular / WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(47) 99999-9999"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div className="pt-1">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Dados do imóvel</h3>
                    
                    <div className="flex gap-2 mb-2">
                      <button
                        type="button"
                        className={`flex-1 py-2 px-2 rounded-lg font-medium text-xs transition-all ${
                          formData.tipo === 'vender' 
                            ? 'bg-purple-600 text-white shadow-md' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, tipo: 'vender' }))}
                      >
                        Quero vender
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-2 px-2 rounded-lg font-medium text-xs transition-all ${
                          formData.tipo === 'alugar' 
                            ? 'bg-purple-600 text-white shadow-md' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, tipo: 'alugar' }))}
                      >
                        Quero alugar
                      </button>
                    </div>

                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tipo do imóvel:
                      </label>
                      <select
                        name="tipoImovel"
                        value={formData.tipoImovel}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        <option value="">Selecione o tipo</option>
                        <option value="casa">Casa</option>
                        <option value="apartamento">Apartamento</option>
                        <option value="terreno">Terreno</option>
                        <option value="comercial">Comercial</option>
                      </select>
                    </div>

                    <div className="mb-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Cidade
                      </label>
                      <input
                        type="text"
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleChange}
                        placeholder="Sua cidade"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Bairro
                      </label>
                      <input
                        type="text"
                        name="bairro"
                        value={formData.bairro}
                        onChange={handleChange}
                        placeholder="Seu bairro"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Avaliar meu imóvel
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Segunda Seção - Vantagens */}
      <section id="vantagens" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
              {getText('anunciar.vantagens.titulo')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Vantagem 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {getText('anunciar.vantagens.vantagem_1.titulo')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {getText('anunciar.vantagens.vantagem_1.descricao')}
                </p>
              </div>

              {/* Vantagem 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {getText('anunciar.vantagens.vantagem_2.titulo')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {getText('anunciar.vantagens.vantagem_2.descricao')}
                </p>
              </div>

              {/* Vantagem 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {getText('anunciar.vantagens.vantagem_3.titulo')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {getText('anunciar.vantagens.vantagem_3.descricao')}
                </p>
              </div>

              {/* Vantagem 4 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {getText('anunciar.vantagens.vantagem_4.titulo')}
                </h3>
                <p className="text-gray-600 text-sm">
                  {getText('anunciar.vantagens.vantagem_4.descricao')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Depoimentos - Dinâmica */}
      <DepoimentosSection depoimentos={depoimentos} />
    </div>
  )
}
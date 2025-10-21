'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getImageUrl } from '@/lib/github-images'
import { getText } from '@/lib/site-texts'

const encontreImages = {
  corretor1: getImageUrl('corretores-1'),
  corretor2: getImageUrl('corretores-2'),
  corretor3: getImageUrl('corretores-3'),
  corretor4: getImageUrl('corretores-4'),
  equipe: getImageUrl('equipe')
}

export default function EncontreMeuImovelPage() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    tipoImovel: '',
    quartos: '',
    vagas: '',
    cidade: '',
    bairro: ''
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
    alert('Formulário enviado com sucesso! Nossa equipe entrará em contato em breve.')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Primeira Seção - Hero com duas colunas */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            
            {/* Coluna Esquerda - Marketing */}
            <div className="bg-white p-6 rounded-lg shadow-xl border-t-4 border-purple-600">
              <h1 className="text-xl font-bold text-gray-900 mb-4">
                {getText('encontre_meu_imovel.hero.titulo')}
              </h1>
              
              <p className="text-base text-gray-600 leading-relaxed mb-6">
                {getText('encontre_meu_imovel.hero.subtitulo')}
              </p>

              {/* Seção Como Funciona */}
              <div className="bg-purple-900 text-white p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-purple-300 mb-1">{getText('encontre_meu_imovel.como_funciona.passo_1.numero')}</div>
                    <h3 className="text-base font-bold mb-1">{getText('encontre_meu_imovel.como_funciona.passo_1.titulo')}</h3>
                    <p className="text-purple-200 text-xs">
                      {getText('encontre_meu_imovel.como_funciona.passo_1.descricao')}
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-300 mb-1">{getText('encontre_meu_imovel.como_funciona.passo_2.numero')}</div>
                    <h3 className="text-base font-bold mb-1">{getText('encontre_meu_imovel.como_funciona.passo_2.titulo')}</h3>
                    <p className="text-purple-200 text-xs">
                      {getText('encontre_meu_imovel.como_funciona.passo_2.descricao')}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Segunda caixa com 03 e 04 */}
              <div className="bg-purple-900 text-white p-4 rounded-lg mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-purple-300 mb-1">{getText('encontre_meu_imovel.como_funciona.passo_3.numero')}</div>
                    <h3 className="text-base font-bold mb-1">{getText('encontre_meu_imovel.como_funciona.passo_3.titulo')}</h3>
                    <p className="text-purple-200 text-xs">
                      {getText('encontre_meu_imovel.como_funciona.passo_3.descricao')}
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-300 mb-1">{getText('encontre_meu_imovel.como_funciona.passo_4.numero')}</div>
                    <h3 className="text-base font-bold mb-1">{getText('encontre_meu_imovel.como_funciona.passo_4.titulo')}</h3>
                    <p className="text-purple-200 text-xs">
                      {getText('encontre_meu_imovel.como_funciona.passo_4.descricao')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna Direita - Formulário */}
            <div className="bg-white p-6 rounded-lg shadow-xl border-t-4 border-purple-600">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Encontre seu imóvel</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                {/* Telefone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DDD + Celular / WhatsApp</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(47) 99999-9999"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Tipo do imóvel */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo do imóvel</label>
                  <select
                    name="tipoImovel"
                    value={formData.tipoImovel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="casa">Casa</option>
                    <option value="terreno">Terreno</option>
                    <option value="comercial">Comercial</option>
                  </select>
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    placeholder="Sua cidade"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
                >
                  Enviar
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Segunda Seção - Conheça nossa equipe */}
      <section id="equipe" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header da Seção */}
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {getText('encontre_meu_imovel.equipe.titulo')}
            </h2>
            
            {/* Botões de Navegação */}
            <div className="flex space-x-2">
              <button className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Grid da Equipe */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Membro 1 - Adriana Barbosa Campos */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <div className="h-64 relative">
                <Image 
                  src={encontreImages.corretor1} 
                  alt="Adriana Barbosa Campos" 
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Adriana Barbosa Campos</h3>
                <p className="text-sm text-gray-600 mb-3">Corretora de imóveis</p>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <span>Ver contato</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Membro 2 - Adriana Medeiros */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <div className="h-64 relative">
                <Image 
                  src={encontreImages.corretor2} 
                  alt="Adriana Medeiros" 
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Adriana Medeiros</h3>
                <p className="text-sm text-gray-600 mb-3">Corretora de imóveis</p>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <span>Ver contato</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Membro 3 - Alan de Freitas Cordeiro */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <div className="h-64 relative">
                <Image 
                  src={encontreImages.corretor3} 
                  alt="Alan de Freitas Cordeiro" 
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Alan de Freitas Cordeiro</h3>
                <p className="text-sm text-gray-600 mb-3">Corretor de imóveis</p>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <span>Ver contato</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Membro 4 - Alex Penha */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <div className="h-64 relative">
                <Image 
                  src={encontreImages.corretor4} 
                  alt="Alex Penha" 
                  fill
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Alex Penha</h3>
                <p className="text-sm text-gray-600 mb-3">Corretor de imóveis</p>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-2">
                  <span>Ver contato</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção CTA Final */}
      <section className="py-16 bg-purple-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Team Photo */}
            <div className="relative w-full rounded-lg overflow-hidden">
              <Image
                src={encontreImages.equipe}
                alt="Equipe Nox Imóveis"
                width={600}
                height={400}
                className="w-full h-auto object-contain"
              />
            </div>
            {/* Right Column - CTA */}
            <div className="text-center lg:text-left space-y-6">
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <svg className="w-10 h-10 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <h2 className="text-3xl font-bold">{getText('encontre_meu_imovel.cta_contato.titulo')}</h2>
              </div>
              <p className="text-xl text-gray-300">{getText('encontre_meu_imovel.cta_contato.subtitulo')}</p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300">
                {getText('encontre_meu_imovel.cta_contato.botao')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
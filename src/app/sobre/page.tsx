'use client'

import { Metadata } from 'next'
import Image from 'next/image'
import { useState } from 'react'
import { getImageUrl } from '@/lib/github-images'
import { getText } from '@/lib/site-texts'

const sobreImages = {
  hero: getImageUrl('quem-somos-hero'),
  equipePrincipal: getImageUrl('equipe-principal'),
  corretor1: getImageUrl('corretores-1'),
  corretor2: getImageUrl('corretores-2'),
  corretor3: getImageUrl('corretores-3'),
  corretor4: getImageUrl('corretores-4')
}

export default function SobrePage() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null)

  return (
    <div className="min-h-screen">
      {/* Hero Section - Quem Somos */}
      <section className="relative h-[70vh] flex items-end justify-start overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image 
            src={sobreImages.hero}
            alt="Nox Imóveis - Quem Somos" 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-transparent"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 text-white p-6 pb-12 max-w-xl">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
            {getText('quem_somos.hero.titulo')}
          </h1>
          <p className="text-base md:text-lg mb-6 text-white/90">
            {getText('quem_somos.hero.subtitulo')}
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg text-sm transition-colors duration-300 shadow-lg">
            {getText('quem_somos.hero.botao')}
          </button>
        </div>
      </section>

      {/* Seção História da Empresa */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Imagem da Equipe */}
            <div className="relative">
              <Image 
                src={sobreImages.equipePrincipal}
                alt="Equipe Nox Imóveis" 
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            
            {/* Texto da História */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {getText('quem_somos.nossa_historia.titulo')}
              </h2>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-base">
                  {getText('quem_somos.nossa_historia.paragrafo_1')}
                </p>
                
                <p className="text-base">
                  {getText('quem_somos.nossa_historia.paragrafo_2')}
                </p>
                
                <p className="text-base">
                  {getText('quem_somos.nossa_historia.paragrafo_3')}
                </p>
              </div>
              
              <button className="mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300">
                {getText('quem_somos.servicos.titulo')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Missão, Visão e Valores */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Missão */}
            <div className="bg-purple-100 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{getText('quem_somos.missao_visao_valores.missao.titulo')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {getText('quem_somos.missao_visao_valores.missao.descricao')}
              </p>
            </div>
            
            {/* Visão */}
            <div className="bg-purple-100 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{getText('quem_somos.missao_visao_valores.visao.titulo')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {getText('quem_somos.missao_visao_valores.visao.descricao')}
              </p>
            </div>
            
            {/* Valores */}
            <div className="bg-purple-100 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{getText('quem_somos.missao_visao_valores.valores.titulo')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {getText('quem_somos.missao_visao_valores.valores.descricao')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção O que dizem nossos clientes */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {getText('quem_somos.depoimentos.titulo')}
            </h2>
          </div>

          {/* Card de Depoimento */}
          <div className="bg-white rounded-lg shadow-sm border-t-2 border-purple-600 p-6 max-w-2xl mx-auto">
            <div className="text-center">
              {/* Nome e Cargo */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Mondo Empreendimentos
                </h3>
                <p className="text-sm text-gray-600">
                  Parceiro
                </p>
              </div>

              {/* Depoimento */}
              <blockquote className="text-base text-gray-700 leading-relaxed italic">
                "Grande parceria e muito bem preparada para atender seus parceiros e clientes."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Conheça nossa equipe */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header da Seção */}
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {getText('quem_somos.equipe.titulo')}
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
                  src={sobreImages.corretor1} 
                  alt="Adriana Barbosa Campos" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Adriana Barbosa Campos</h3>
                <p className="text-sm text-gray-600 mb-3">Corretora de imóveis</p>
                <button 
                  onClick={() => setSelectedMember('adriana')}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
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
                  src={sobreImages.corretor2} 
                  alt="Adriana Medeiros" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Adriana Medeiros</h3>
                <p className="text-sm text-gray-600 mb-3">Corretora de imóveis</p>
                <button 
                  onClick={() => setSelectedMember('adriana-medeiros')}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
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
                  src={sobreImages.corretor3} 
                  alt="Alan de Freitas Cordeiro" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Alan de Freitas Cordeiro</h3>
                <p className="text-sm text-gray-600 mb-3">Corretor de imóveis</p>
                <button 
                  onClick={() => setSelectedMember('alan')}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
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
                  src={sobreImages.corretor4} 
                  alt="Alex Penha" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Alex Penha</h3>
                <p className="text-sm text-gray-600 mb-3">Corretor de imóveis</p>
                <button 
                  onClick={() => setSelectedMember('alex')}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
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

      {/* Seção Faça parte da Nox */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8">
            {/* Ícone Coração */}
            <div className="w-16 h-16 bg-purple-200 rounded-lg flex items-center justify-center">
              <span className="text-3xl">💜</span>
            </div>
            
            {/* Texto */}
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {getText('quem_somos.cta_trabalhe.titulo')}
              </h2>
            </div>
            
            {/* Botão */}
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300">
              {getText('quem_somos.cta_trabalhe.botao')}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
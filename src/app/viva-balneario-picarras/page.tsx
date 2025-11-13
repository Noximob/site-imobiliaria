'use client'

import Image from 'next/image'
import { getImageUrl } from '@/lib/github-images'
import { getText } from '@/lib/site-texts'

export default function VivaBalnearioPicarrasPage() {
  const picarrasImages = {
    hero: getImageUrl('picarras-hero'),
    praiaPrincipal: getImageUrl('picarras-praia-principal'),
    praiaSecundaria: getImageUrl('picarras-praia-secundaria'),
    praia1: getImageUrl('picarras-praia1'),
    atracao1: getImageUrl('picarras-atracao1'),
    atracao2: getImageUrl('picarras-atracao2'),
    gastronomia: getImageUrl('picarras-gastronomia'),
    praia2: getImageUrl('picarras-praia2'),
    skyline: getImageUrl('picarras-skyline')
  }
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-start justify-start overflow-hidden bg-transparent">
        {/* Background Image */}
        <div className="absolute inset-0 bg-transparent">
          <Image 
            src={picarrasImages.hero} 
            alt="Balneário Piçarras - Viva Balneário Piçarras" 
            fill
            className="object-cover bg-transparent"
          />
          <div className="absolute inset-0 bg-transparent"></div>
        </div>
        
        <div className="relative z-10 text-left pl-8 pt-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
            {getText('viva_balneario_picarras.hero.titulo')}
          </h1>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-5 rounded-lg text-base transition-colors duration-300 shadow-2xl">
            {getText('viva_balneario_picarras.hero.botao_vantagens')}
          </button>
        </div>
      </section>

      {/* Seção Descubra o paraíso catarinense */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Images */}
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <Image 
                  src={picarrasImages.praiaPrincipal} 
                  alt="Praia de Balneário Piçarras" 
                  width={600}
                  height={400}
                  className="w-full h-80 object-cover"
                />
              </div>
              
              {/* Secondary Overlapping Image */}
              <div className="absolute -bottom-8 -left-8 rounded-lg overflow-hidden shadow-lg">
                <Image 
                  src={picarrasImages.praiaSecundaria} 
                  alt="Vista da praia de Penha" 
                  width={300}
                  height={200}
                  className="w-64 h-40 object-cover"
                />
              </div>
            </div>

            {/* Right Column - Text */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {getText('viva_balneario_picarras.introducao.titulo')}
              </h2>
              <p className="text-base text-gray-600 mb-6 leading-relaxed">
                {getText('viva_balneario_picarras.introducao.descricao')}
              </p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-5 rounded-lg text-sm transition-colors duration-300">
                {getText('viva_balneario_picarras.introducao.botao_imoveis')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Seção O que fazer em Penha */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text and List */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {getText('viva_balneario_picarras.o_que_fazer.titulo')}
              </h2>
              <p className="text-base text-gray-600 mb-6 leading-relaxed">
                {getText('viva_balneario_picarras.o_que_fazer.subtitulo')}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{getText('viva_balneario_picarras.o_que_fazer.atracao_1')}</h3>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{getText('viva_balneario_picarras.o_que_fazer.atracao_2')}</h3>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{getText('viva_balneario_picarras.o_que_fazer.atracao_3')}</h3>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{getText('viva_balneario_picarras.o_que_fazer.atracao_4')}</h3>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{getText('viva_balneario_picarras.o_que_fazer.atracao_5')}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Images */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-4">
                <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
                  <Image 
                    src={picarrasImages.praia1} 
                    alt="Praia de Balneário Piçarras" 
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="relative h-32 rounded-lg overflow-hidden shadow-lg">
                  <Image 
                    src={picarrasImages.atracao1} 
                    alt="Cristo Luz Balneário Piçarras" 
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative h-32 rounded-lg overflow-hidden shadow-lg">
                  <Image 
                    src={picarrasImages.atracao2} 
                    alt="Beto Carrero World" 
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
                  <Image 
                    src={picarrasImages.gastronomia} 
                    alt="Jantar Romântico" 
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
                  <Image 
                    src={picarrasImages.praia2} 
                    alt="Praia de Balneário Piçarras" 
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="relative h-32 rounded-lg overflow-hidden shadow-lg">
                  <Image 
                    src={picarrasImages.skyline} 
                    alt="Skyline Balneário Piçarras" 
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Características */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Infraestrutura Urbana */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{getText('viva_balneario_picarras.beneficios.infraestrutura.titulo')}</h3>
              <p className="text-gray-600 text-sm">
                {getText('viva_balneario_picarras.beneficios.infraestrutura.descricao')}
              </p>
            </div>

            {/* Atrações Turísticas */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15v-3a2 2 0 114 0v3H8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{getText('viva_balneario_picarras.beneficios.atracoes.titulo')}</h3>
              <p className="text-gray-600 text-sm">
                {getText('viva_balneario_picarras.beneficios.atracoes.descricao')}
              </p>
            </div>

            {/* Segurança */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{getText('viva_balneario_picarras.beneficios.seguranca.titulo')}</h3>
              <p className="text-gray-600 text-sm">
                {getText('viva_balneario_picarras.beneficios.seguranca.descricao')}
              </p>
            </div>

            {/* Diversidade de Imóveis */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{getText('viva_balneario_picarras.beneficios.diversidade.titulo')}</h3>
              <p className="text-gray-600 text-sm">
                {getText('viva_balneario_picarras.beneficios.diversidade.descricao')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Investimento */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left Column - CTA (White Background) */}
            <div className="lg:pr-6 flex flex-col items-center lg:items-start">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight text-gray-900 text-center lg:text-left">
                Invista em Balneário Piçarras
              </h2>
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-5 rounded-lg flex items-center text-sm transition-colors duration-300 shadow-lg">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Receber atendimento
              </button>
            </div>

            {/* Right Column - Black Square with Benefits Grid (20% smaller) */}
            <div className="bg-black p-4 rounded-lg w-4/5 lg:w-full mx-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start">
                  <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1 text-white">{getText('viva_balneario_picarras.vantagens_investir.mercado_imobiliario.titulo')}</h3>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      {getText('viva_balneario_picarras.vantagens_investir.mercado_imobiliario.descricao')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1 text-white">{getText('viva_balneario_picarras.vantagens_investir.localizacao.titulo')}</h3>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      {getText('viva_balneario_picarras.vantagens_investir.localizacao.descricao')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1 text-white">{getText('viva_balneario_picarras.vantagens_investir.qualidade_vida.titulo')}</h3>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      {getText('viva_balneario_picarras.vantagens_investir.qualidade_vida.descricao')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-1 text-white">{getText('viva_balneario_picarras.vantagens_investir.turismo.titulo')}</h3>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      {getText('viva_balneario_picarras.vantagens_investir.turismo.descricao')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Localização */}
      <section className="py-8 bg-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Pergunta */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-medium text-gray-700">
              {getText('viva_balneario_picarras.invista.subtitulo')}
            </h2>
          </div>

          {/* Botões de Localização */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center text-sm shadow-lg hover:shadow-xl transform hover:scale-105">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {getText('viva_balneario_picarras.invista.opcao_1')}
            </button>
            
            <button className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center text-sm shadow-lg hover:shadow-xl transform hover:scale-105">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {getText('viva_balneario_picarras.invista.opcao_2')}
            </button>
            
            <button className="bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center text-sm shadow-lg hover:shadow-xl transform hover:scale-105">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {getText('viva_balneario_picarras.invista.opcao_3')}
            </button>
          </div>

          {/* Blocos de Conteúdo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Bloco Esquerdo - Investimento */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              {/* Imagem */}
              <div className="h-48 relative overflow-hidden">
                <Image
                  src="/imagens/Como Comprar/4.png"
                  alt="Praia - Investimento imobiliário"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Conteúdo */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6">
                <h3 className="text-white text-sm font-normal mb-1">
                  {getText('viva_balneario_picarras.cta_investimento.titulo')}
                </h3>
                <h3 className="text-white text-lg font-bold mb-4">
                  {getText('viva_balneario_picarras.cta_investimento.botao')}
                </h3>
                <button className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm shadow-lg hover:shadow-xl transform hover:scale-105">
                  Buscar imóveis
                </button>
              </div>
            </div>

            {/* Bloco Direito - Anuncie */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              {/* Imagem */}
              <div className="h-48 relative overflow-hidden">
                <Image
                  src="/imagens/Como Comprar/5.png"
                  alt="Equipe Nox Imóveis"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Conteúdo */}
              <div className="bg-gradient-to-br from-purple-800 to-purple-900 p-6">
                <h3 className="text-white text-sm font-normal mb-1">
                  {getText('viva_balneario_picarras.anuncie.titulo')}
                </h3>
                <h3 className="text-white text-lg font-bold mb-4">
                  {getText('viva_balneario_picarras.anuncie.subtitulo')}
                </h3>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm shadow-lg hover:shadow-xl transform hover:scale-105">
                  Avaliar meu imóvel
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
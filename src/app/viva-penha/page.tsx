'use client'

import Image from 'next/image'

export default function VivaPenhaPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image 
            src="/imagens/banners/penha-hero.jpg" 
            alt="Penha - Viva Penha" 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <h1 className="text-7xl md:text-8xl font-bold text-white mb-12">
            Viva Penha
          </h1>
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 px-10 rounded-lg text-2xl transition-colors duration-300 shadow-2xl">
            Ver as vantagens
          </button>
        </div>
      </section>

      {/* Seção O que fazer em Penha */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text and List */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                O que fazer em Penha?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Aproveite tudo o que Penha tem a oferecer e viva o melhor da cidade!
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Praias de Areias Brancas</h3>
                    <p className="text-gray-600">Praias paradisíacas com águas cristalinas e areias brancas.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Parque Beto Carrero World</h3>
                    <p className="text-gray-600">O maior parque temático da América Latina.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Cristo Luz</h3>
                    <p className="text-gray-600">Monumento religioso com vista panorâmica da cidade.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Vida Noturna Vibrante</h3>
                    <p className="text-gray-600">Bares, restaurantes e baladas para todos os gostos.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Gastronomia Excepcional</h3>
                    <p className="text-gray-600">Frutos do mar frescos e pratos típicos da região.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Images */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-4">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image 
                    src="/imagens/penha/praia1.jpg" 
                    alt="Praia de Penha" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <Image 
                    src="/imagens/penha/cristo-luz.jpg" 
                    alt="Cristo Luz Penha" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <Image 
                    src="/imagens/penha/beto-carrero.jpg" 
                    alt="Beto Carrero World" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image 
                    src="/imagens/penha/jantar-romantico.jpg" 
                    alt="Jantar Romântico" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image 
                    src="/imagens/penha/praia2.jpg" 
                    alt="Praia de Penha" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-32 rounded-lg overflow-hidden">
                  <Image 
                    src="/imagens/penha/skyline.jpg" 
                    alt="Skyline Penha" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Características */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Infraestrutura Urbana */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Infraestrutura Urbana</h3>
              <p className="text-gray-600 text-sm">
                Conforto e praticidade de sobra em uma cidade com infraestrutura completa e moderna.
              </p>
            </div>

            {/* Atrações Turísticas */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15v-3a2 2 0 114 0v3H8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Atrações Turísticas</h3>
              <p className="text-gray-600 text-sm">
                A cidade é cheia de opções de lazer para moradores e visitantes, com paisagens de tirar o fôlego.
              </p>
            </div>

            {/* Segurança */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Segurança</h3>
              <p className="text-gray-600 text-sm">
                Aproveite a tranquilidade de viver em uma das cidades mais seguras do sul do país!
              </p>
            </div>

            {/* Diversidade de Imóveis */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Diversidade de Imóveis</h3>
              <p className="text-gray-600 text-sm">
                Não faltam oportunidades de morar e investir na cidade, com opções para todos os gostos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Dubai Brasileira */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Dubai Brasileira
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Invista em um empreendimento que combina com o seu estilo de vida. Tenha segurança e rentabilidade com imóveis na planta na região mais desejada do Brasil.
              </p>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg font-semibold text-gray-900">Paisagens Deslumbrantes</span>
              </div>
            </div>

            {/* Right Column - Images */}
            <div className="grid grid-cols-3 gap-4">
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image 
                  src="/imagens/penha/skyline1.jpg" 
                  alt="Skyline Penha" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image 
                  src="/imagens/penha/skyline2.jpg" 
                  alt="Skyline Penha" 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image 
                  src="/imagens/penha/skyline3.jpg" 
                  alt="Skyline Penha" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Investimento */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - CTA */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Invista em Penha
              </h2>
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center text-lg transition-colors duration-300">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Receber atendimento
              </button>
            </div>

            {/* Right Column - Benefits */}
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Mercado imobiliário em crescimento</h3>
                  <p className="text-blue-200">
                    Penha é um dos destinos turísticos mais procurados do Brasil, o que torna o mercado imobiliário da cidade extremamente atraente para investidores.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Localização estratégica</h3>
                  <p className="text-blue-200">
                    A cidade está estrategicamente localizada no estado de Santa Catarina, entre as cidades de Florianópolis e Curitiba, facilitando o acesso por terra, mar e ar.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Qualidade de Vida</h3>
                  <p className="text-blue-200">
                    Além do potencial econômico, Penha oferece uma qualidade de vida excepcional. Com infraestrutura de primeira classe, serviços públicos de alta qualidade e um ambiente seguro.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Turismo em Expansão</h3>
                  <p className="text-blue-200">
                    O turismo é a espinha dorsal da economia de Penha. A cidade recebe milhões de turistas todos os anos, criando amplas oportunidades para investimentos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Localização */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Você prefere qual localização?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <button className="bg-blue-900 text-white p-6 rounded-lg text-center hover:bg-blue-800 transition-colors duration-300">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Frente mar</h3>
            </button>
            
            <button className="bg-blue-900 text-white p-6 rounded-lg text-center hover:bg-blue-800 transition-colors duration-300">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Quadra Mar</h3>
            </button>
            
            <button className="bg-blue-900 text-white p-6 rounded-lg text-center hover:bg-blue-800 transition-colors duration-300">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Vista Mar</h3>
            </button>
          </div>

          {/* Images Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image 
                src="/imagens/penha/sala-vista-mar.jpg" 
                alt="Sala com vista para o mar" 
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden">
              <Image 
                src="/imagens/penha/equipe.jpg" 
                alt="Equipe Nox Imóveis" 
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* CTA Sections */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-cyan-500 text-white p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Procurando o melhor investimento?</h3>
              <p className="text-xl mb-6">Encontre o seu imóvel na praia!</p>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                Buscar imóveis
              </button>
            </div>
            
            <div className="bg-blue-900 text-white p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Atendimento especializado</h3>
              <p className="text-xl mb-6">Converse com um especialista!</p>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                Entre em contato
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

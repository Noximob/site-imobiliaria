import Link from 'next/link'
import Image from 'next/image'
import { Search, Home, Building, MapPin, Star, Users, Award } from 'lucide-react'
import SearchForm from '@/components/SearchForm'
import ImovelCard from '@/components/ImovelCard'
import { getAllImoveis } from '@/lib/imoveis'

export default async function HomePage() {
  // Buscar imóveis em destaque (primeiros 6)
  const imoveis = await getAllImoveis()
  const imoveisDestaque = imoveis.slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white py-20 min-h-[600px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/imagens/banners/banner-home.png"
            alt="Nox Imóveis - Encontre o Imóvel dos Seus Sonhos"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay para melhorar legibilidade do texto */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              Imóveis em Penha, Piçarras e<br />
              Barra Velha
            </h1>
            
            {/* Search Form */}
            <div className="max-w-4xl mx-auto">
              <SearchForm />
            </div>
          </div>
        </div>
      </section>

      {/* Seção Cidades - Cards de Imóveis por Cidade */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título da Seção */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-blue-500">
                Encontre o imóvel ideal para cada momento da sua vida
              </h2>
            </div>
          </div>

          {/* Cards das Cidades */}
          <div className="space-y-12">
            {/* Penha */}
            <div>
              <div className="flex items-center mb-4">
                <Search className="w-4 h-4 text-blue-500 mr-2 font-bold" />
                <h3 className="text-lg font-bold text-blue-500">Penha</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Lançamentos Investidor</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Frente Mar</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Mobiliados</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Apartamentos</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Piçarras */}
            <div>
              <div className="flex items-center mb-4">
                <Search className="w-4 h-4 text-blue-500 mr-2 font-bold" />
                <h3 className="text-lg font-bold text-blue-500">Piçarras</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Apartamentos e Coberturas</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Mobiliados</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-cyan-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Vista Mar</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Lançamentos</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra Velha */}
            <div>
              <div className="flex items-center mb-4">
                <Search className="w-4 h-4 text-blue-500 mr-2 font-bold" />
                <h3 className="text-lg font-bold text-blue-500">Barra Velha</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Lançamentos Frente Mar</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-700"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Em Construção</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Imóveis Prontos</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Lado Esquerdo - Pergunta e Botão */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-6">
                <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                  Procurando investir, morar ou veranear?
                </h2>
              </div>
              
              <a
                href="https://wa.me/5547997530113"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span>Receber atendimento</span>
              </a>
            </div>

            {/* Lado Direito - Lista de Benefícios */}
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Consultoria personalizada</h3>
                  <p className="text-gray-600">Atendimento exclusivo para suas necessidades</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Especialistas em Penha, Piçarras e Barra Velha</h3>
                  <p className="text-gray-600">Conhecemos cada detalhe da região</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">Visite sem sair de casa</h3>
                  <p className="text-gray-600">Conheça o imóvel por videochamada</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Imóveis na Planta */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Lado Esquerdo - 3 Frames de Fotos em Colunas */}
            <div className="grid grid-cols-3 gap-4">
              {/* Frame 1 - Edifício moderno */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* Frame 2 - Retrato */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* Frame 3 - Edifício residencial */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Lado Direito - Texto e Botões */}
            <div className="text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Imóveis na Planta
              </h2>
              
              <p className="text-base text-gray-600 mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Invista em um empreendimento que combina com o seu estilo de vida. Tenha segurança e rentabilidade com imóveis na planta na região mais desejada do Brasil.
              </p>
              
              <div className="flex flex-col lg:flex-row gap-3">
                <button className="px-4 py-2 border border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-600 hover:text-white transition-colors duration-200 text-sm">
                  Penha
                </button>
                
                <button className="px-4 py-2 border border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-600 hover:text-white transition-colors duration-200 text-sm">
                  Piçarras
                </button>
                
                <button className="px-4 py-2 border border-purple-600 text-purple-600 font-medium rounded-lg hover:bg-purple-600 hover:text-white transition-colors duration-200 text-sm">
                  Barra Velha
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Depoimentos/Prova Social */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Título da Seção */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              O que dizem nossos clientes
            </h2>
          </div>

          {/* Card de Depoimento */}
          <div className="bg-white rounded-lg shadow-sm border-t-2 border-purple-600 p-6 max-w-2xl mx-auto">
            <div className="text-center">
              {/* Nome e Cargo */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Octavio Deiroz Neto
                </h3>
                <p className="text-sm text-gray-600">
                  Comprador
                </p>
              </div>

              {/* Depoimento */}
              <blockquote className="text-base text-gray-700 leading-relaxed italic">
                "Atendimento impecável, principalmente do corretor Flávio. Comprei uma casa ano passado e foram muito prestativos e extremamente rápidos com todos os trâmites. Nota 10!"
              </blockquote>
            </div>
          </div>

          {/* Indicadores de Navegação */}
          <div className="flex justify-center mt-6 space-x-2">
            <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Home className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Imóveis Disponíveis</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">1000+</h3>
              <p className="text-gray-600">Clientes Satisfeitos</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">15+</h3>
              <p className="text-gray-600">Anos de Experiência</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">50+</h3>
              <p className="text-gray-600">Bairros Atendidos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Imóveis em Destaque
            </h2>
            <p className="text-xl text-gray-600">
              Confira nossa seleção dos melhores imóveis
            </p>
          </div>

          {imoveisDestaque.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {imoveisDestaque.map((imovel) => (
                <ImovelCard key={imovel.id} imovel={imovel} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Nenhum imóvel encontrado
              </h3>
              <p className="text-gray-500">
                Em breve teremos imóveis disponíveis para você.
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/imoveis"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Search className="w-4 h-4" />
              <span>Ver Todos os Imóveis</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Encontrar seu Imóvel Ideal?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Nossa equipe está pronta para te ajudar a encontrar o imóvel perfeito
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contato"
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Fale Conosco
            </Link>
            <Link
              href="/imoveis"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Ver Imóveis
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

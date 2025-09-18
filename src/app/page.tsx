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
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
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

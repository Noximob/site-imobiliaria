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
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center mr-3">
                <Search className="w-5 h-5 text-black" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Encontre o imóvel ideal para cada momento da sua vida
              </h2>
            </div>
          </div>

          {/* Cards das Cidades */}
          <div className="space-y-12">
            {/* Penha */}
            <div>
              <div className="flex items-center mb-6">
                <Search className="w-6 h-6 text-blue-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Penha</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold text-center">Apartamentos e Coberturas</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold text-center">Mobiliados</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold text-center">Casas em Condomínio</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold text-center">Centro</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-pink-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold text-center">Praia</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Piçarras */}
            <div>
              <div className="flex items-center mb-6">
                <Search className="w-6 h-6 text-blue-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Piçarras</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold text-center">Apartamentos</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold text-center">Coberturas</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold text-center">Mobiliados</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold text-center">Casas em Condomínio</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra Velha */}
            <div>
              <div className="flex items-center mb-6">
                <Search className="w-6 h-6 text-blue-500 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Barra Velha</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold text-center">Frente Mar</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold text-center">Quadra Mar</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold text-center">Vista Mar</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold text-center">Lançamentos</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-pink-600"></div>
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-lg font-semibold text-center">Mobiliados</span>
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

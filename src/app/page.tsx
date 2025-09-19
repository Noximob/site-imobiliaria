'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Search, Home, Building, MapPin, Star, Users, Award } from 'lucide-react'
import SearchForm from '@/components/SearchForm'
import ImovelCard from '@/components/ImovelCard'
import { getAllImoveis } from '@/lib/imoveis'

export default function HomePage() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null)

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
                  <Image 
                    src="/imagens/Encontre Imovel/Lançamentos-Investidor.png" 
                    alt="Lançamentos Investidor" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Lançamentos Investidor</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <Image 
                    src="/imagens/Encontre Imovel/Frente-Mar.png" 
                    alt="Frente Mar" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Frente Mar</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <Image 
                    src="/imagens/Encontre Imovel/Mobiliados.png" 
                    alt="Mobiliados" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Mobiliados</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <Image 
                    src="/imagens/Encontre Imovel/Apartamentos.png" 
                    alt="Apartamentos" 
                    fill
                    className="object-cover"
                  />
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
                  <Image 
                    src="/imagens/Encontre Imovel/Piçarras/Apartamento-Cobertura.png" 
                    alt="Apartamentos e Coberturas" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Apartamentos e Coberturas</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <Image 
                    src="/imagens/Encontre Imovel/Piçarras/Mobiliado.png" 
                    alt="Mobiliados" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Mobiliados</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <Image 
                    src="/imagens/Encontre Imovel/Piçarras/Vista-Mar.png" 
                    alt="Vista Mar" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Vista Mar</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <Image 
                    src="/imagens/Encontre Imovel/Piçarras/Lançamentos.png" 
                    alt="Lançamentos" 
                    fill
                    className="object-cover"
                  />
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
                  <Image 
                    src="/imagens/Encontre Imovel/Barra Velha/Lançamentos Frente mar.png" 
                    alt="Lançamentos Frente Mar" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Lançamentos Frente Mar</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <Image 
                    src="/imagens/Encontre Imovel/Barra Velha/Em Construção.png" 
                    alt="Em Construção" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center group-hover:justify-start group-hover:pt-8 transition-all duration-300">
                    <span className="text-white text-sm font-medium text-center group-hover:-translate-y-2 transition-transform duration-300">Em Construção</span>
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2">Ver imóveis</span>
                  </div>
                </div>
                <div className="relative h-48 rounded-lg overflow-hidden group cursor-pointer">
                  <Image 
                    src="/imagens/Encontre Imovel/Barra Velha/Imoveis Prontos.png" 
                    alt="Imóveis Prontos" 
                    fill
                    className="object-cover"
                  />
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
              {/* Frame 1 - Penha */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <Image 
                    src="/imagens/Imoveis na Planta/1.png" 
                    alt="Imóveis na Planta - Penha" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            
              {/* Frame 2 - Piçarras */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <Image 
                    src="/imagens/Imoveis na Planta/2.png" 
                    alt="Imóveis na Planta - Piçarras" 
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            
              {/* Frame 3 - Barra Velha */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <Image 
                    src="/imagens/Imoveis na Planta/3.png" 
                    alt="Imóveis na Planta - Barra Velha" 
                    fill
                    className="object-cover"
                  />
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

      {/* Seção Seleção Nox */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header da Seção */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Seleção Nox
            </h2>
              <p className="text-sm text-gray-500 max-w-xl">
                Confira a nossa curadoria dos melhores imóveis selecionados pela equipe da Nox Imóveis.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <a
                href="/imoveis"
                className="inline-flex items-center px-5 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Buscar imóveis
                <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          {/* Carousel de Imóveis */}
          <div className="relative">
            {/* Botões de Navegação */}
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center transition-colors duration-200 z-10">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center transition-colors duration-200 z-10">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Grid de Imóveis */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Imóvel 1 */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-40 relative">
                  <Image 
                    src="/imagens/Seleção Nox/1.jpg" 
                    alt="Imóvel Seleção Nox 1" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    Apartamento 4 Quartos
                  </h3>
                  <p className="text-blue-600 text-xs font-medium mb-2">
                    Praia Brava, Itajaí
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    R$ 7.500.000,00
                  </p>
                </div>
              </div>

              {/* Imóvel 2 */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-40 relative">
                  <Image 
                    src="/imagens/Seleção Nox/2.jpg" 
                    alt="Imóvel Seleção Nox 2" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    Apartamento 4 Quartos
                  </h3>
                  <p className="text-blue-600 text-xs font-medium mb-2">
                    Pioneiros, Balneário Camboriú
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    R$ 6.400.000,00
                  </p>
                </div>
          </div>

              {/* Imóvel 3 */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="h-40 relative">
                  <Image 
                    src="/imagens/Seleção Nox/3.jpg" 
                    alt="Imóvel Seleção Nox 3" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    Apartamento 3 Quartos
              </h3>
                  <p className="text-blue-600 text-xs font-medium mb-2">
                    Pioneiros, Balneário Camboriú
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    R$ 8.300.000,00
              </p>
            </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Anuncie com a Nox */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Lado Esquerdo - Foto da Corretora */}
              <div className="relative h-64 lg:h-auto">
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                {/* Ícone da chave */}
                <div className="absolute bottom-4 right-4 lg:right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
              </div>

              {/* Lado Direito - Texto e Botão */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="text-white">
                  <p className="text-sm font-medium mb-2 opacity-90">
                    Anuncie com a Nox
                  </p>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-6">
                    A melhor forma de anunciar seu imóvel!
                  </h2>
                  
                  <button className="inline-flex items-center px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-200">
                    Avaliar meu imóvel
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
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

             {/* Seção Conheça nossa equipe */}
             <section className="py-16 bg-white">
               <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                 {/* Header da Seção */}
                 <div className="flex items-center justify-between mb-12">
                   <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                     Conheça nossa equipe
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
                     <div className="h-64 bg-gray-100 flex items-center justify-center">
                       <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                         <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                         </svg>
                       </div>
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
                     <div className="h-64 bg-gray-100 flex items-center justify-center">
                       <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                         <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                         </svg>
                       </div>
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
                     <div className="h-64 bg-gray-100 flex items-center justify-center">
                       <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-200 rounded-full flex items-center justify-center">
                         <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                         </svg>
                       </div>
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
                     <div className="h-64 bg-gray-100 flex items-center justify-center">
                       <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full flex items-center justify-center">
                         <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                         </svg>
                       </div>
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

             {/* Modal de Contato */}
             {selectedMember && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                 <div className="bg-white rounded-lg max-w-md w-full p-6">
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="text-xl font-bold text-gray-900">
                       {selectedMember === 'adriana' && 'Adriana Barbosa Campos'}
                       {selectedMember === 'adriana-medeiros' && 'Adriana Medeiros'}
                       {selectedMember === 'alan' && 'Alan de Freitas Cordeiro'}
                       {selectedMember === 'alex' && 'Alex Penha'}
                     </h3>
                     <button 
                       onClick={() => setSelectedMember(null)}
                       className="text-gray-400 hover:text-gray-600"
                     >
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                       </svg>
                     </button>
                   </div>
                   
                   <div className="space-y-4">
                     <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                         <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                         </svg>
                       </div>
                       <div>
                         <p className="text-sm text-gray-600">Telefone</p>
                         <p className="font-medium text-gray-900">(47) 99955-0880</p>
                       </div>
                     </div>
                     
                     <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                         <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                         </svg>
                       </div>
                       <div>
                         <p className="text-sm text-gray-600">Instagram</p>
                         <p className="font-medium text-gray-900">@adribcampos</p>
                       </div>
                     </div>
                     
                     <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                         <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                         </svg>
                       </div>
                       <div>
                         <p className="text-sm text-gray-600">Email</p>
                         <p className="font-medium text-gray-900">adriana@noximoveis.com.br</p>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             )}

    </div>
  )
}

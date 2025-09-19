'use client'

import Link from 'next/link'
import { Search, MapPin, Building, Phone, Mail, Instagram, Facebook, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Seção Buscas Frequentes */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          {/* Título da Seção */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-medium text-white">
              Buscas frequentes em Penha, Piçarras e Barra Velha
            </h2>
          </div>

          {/* Grid das Categorias */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Penha */}
            <div className="space-y-3">
              <div className="flex items-center space-x-1 mb-3">
                <Search className="w-3 h-3 text-purple-400" />
                <h3 className="text-sm font-medium text-purple-400">Penha</h3>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="space-y-1">
                  <Link href="/imoveis?cidade=penha&tipo=apartamento" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Apartamento à venda
                  </Link>
                  <Link href="/imoveis?cidade=penha" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Imóveis à venda
                  </Link>
                  <Link href="/imoveis?cidade=penha&tipo=cobertura" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Coberturas à venda
                  </Link>
                  <Link href="/imoveis?cidade=penha&vista=frente-mar" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Apartamento Frente Mar
                  </Link>
                  <Link href="/imoveis?cidade=penha&vista=vista-mar" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Apartamento Vista para o Mar
                  </Link>
                  <Link href="/imoveis?cidade=penha&vista=quadra-mar" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Apartamento Quadra Mar
                  </Link>
                </div>
                <div className="space-y-1">
                  <Link href="/imoveis?cidade=penha&tipo=apartamento&acao=comprar" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Comprar Apartamento
                  </Link>
                  <Link href="/imoveis?cidade=penha&status=na-planta" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Apartamentos na planta
                  </Link>
                  <Link href="/imoveis?cidade=penha&status=lancamento" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Lançamentos
                  </Link>
                  <Link href="/imoveis?cidade=penha&tipo=casa" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Casas à venda
                  </Link>
                  <Link href="/imoveis?cidade=penha&tipo=casa&condominio=fechado" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Casas em Condomínio Fechado
                  </Link>
                  <Link href="/imoveis?cidade=penha&mobiliado=sim" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Apartamentos Mobiliados
                  </Link>
                </div>
              </div>
            </div>

            {/* Piçarras */}
            <div className="space-y-3">
              <div className="flex items-center space-x-1 mb-3">
                <Search className="w-3 h-3 text-purple-400" />
                <h3 className="text-sm font-medium text-purple-400">Piçarras</h3>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="space-y-1">
                  <Link href="/imoveis?cidade=picarras&tipo=apartamento" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Apartamento à venda
                  </Link>
                  <Link href="/imoveis?cidade=picarras" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Imóveis à venda
                  </Link>
                  <Link href="/imoveis?cidade=picarras&tipo=cobertura" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Coberturas à venda
                  </Link>
                  <Link href="/imoveis?cidade=picarras&vista=frente-mar" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Apartamento Frente Mar
                  </Link>
                  <Link href="/imoveis?cidade=picarras&vista=vista-mar" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Apartamento Vista para o Mar
                  </Link>
                  <Link href="/imoveis?cidade=picarras&vista=quadra-mar" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Apartamento Quadra Mar
                  </Link>
                </div>
                <div className="space-y-1">
                  <Link href="/imoveis?cidade=picarras&tipo=apartamento&acao=comprar" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Comprar Apartamento
                  </Link>
                  <Link href="/imoveis?cidade=picarras&status=na-planta" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Apartamentos na planta
                  </Link>
                  <Link href="/imoveis?cidade=picarras&status=lancamento" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Lançamentos
                  </Link>
                  <Link href="/imoveis?cidade=picarras&tipo=casa" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Casas à venda
                  </Link>
                  <Link href="/imoveis?cidade=picarras&tipo=casa&condominio=fechado" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Casas em Condomínio Fechado
                  </Link>
                  <Link href="/imoveis?cidade=picarras&mobiliado=sim" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Apartamentos Mobiliados
                  </Link>
                </div>
              </div>
            </div>

            {/* Barra Velha */}
            <div className="space-y-3">
              <div className="flex items-center space-x-1 mb-3">
                <Search className="w-3 h-3 text-purple-400" />
                <h3 className="text-sm font-medium text-purple-400">Barra Velha</h3>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="space-y-1">
                  <Link href="/imoveis?cidade=barra-velha&tipo=apartamento" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Apartamento à venda
                  </Link>
                  <Link href="/imoveis?cidade=barra-velha" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Imóveis à venda
                  </Link>
                  <Link href="/imoveis?cidade=barra-velha&tipo=cobertura" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Coberturas à venda
                  </Link>
                  <Link href="/imoveis?cidade=barra-velha&vista=frente-mar" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Apartamento Frente Mar
                  </Link>
                  <Link href="/imoveis?cidade=barra-velha&vista=vista-mar" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Apartamento Vista para o Mar
                  </Link>
                  <Link href="/imoveis?cidade=barra-velha&vista=quadra-mar" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Apartamento Quadra Mar
                  </Link>
                </div>
                <div className="space-y-1">
                  <Link href="/imoveis?cidade=barra-velha&tipo=apartamento&acao=comprar" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Comprar Apartamento
                  </Link>
                  <Link href="/imoveis?cidade=barra-velha&status=na-planta" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Apartamentos na planta
                  </Link>
                  <Link href="/imoveis?cidade=barra-velha&status=lancamento" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Lançamentos
                  </Link>
                  <Link href="/imoveis?cidade=barra-velha&tipo=casa" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Casas à venda
                  </Link>
                  <Link href="/imoveis?cidade=barra-velha&tipo=casa&condominio=fechado" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Casas em Condomínio Fechado
                  </Link>
                  <Link href="/imoveis?cidade=barra-velha&mobiliado=sim" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Apartamentos Mobiliados
                  </Link>
                </div>
              </div>
            </div>

            {/* Construtoras */}
            <div className="space-y-3">
              <div className="flex items-center space-x-1 mb-3">
                <Building className="w-3 h-3 text-purple-400" />
                <h3 className="text-sm font-medium text-purple-400">Construtoras</h3>
              </div>
              <div className="space-y-1">
                <Link href="/imoveis?construtora=santer" className="block text-xs text-gray-400 hover:text-white transition-colors">
                  Santer
                </Link>
                <Link href="/imoveis?construtora=stein" className="block text-xs text-gray-400 hover:text-white transition-colors">
                  Stein
                </Link>
                <Link href="/imoveis?construtora=grupo-estrutura" className="block text-xs text-gray-400 hover:text-white transition-colors">
                  Grupo Estrutura
                </Link>
                <Link href="/imoveis?construtora=arthaus" className="block text-xs text-gray-400 hover:text-white transition-colors">
                  ArtHaus
                </Link>
                <Link href="/imoveis?construtora=vetter" className="block text-xs text-gray-400 hover:text-white transition-colors">
                  Vetter
                </Link>
                <Link href="/imoveis?construtora=rogga" className="block text-xs text-gray-400 hover:text-white transition-colors">
                  Rogga
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Blog */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          {/* Título da Seção */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Se atualize nos últimos conteúdos do nosso blog
            </h2>
          </div>

          {/* Grid dos Artigos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Artigo 1 - Penha */}
            <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                {/* Data */}
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium">
                  18 Set
                </div>
              </div>
              
              <div className="p-6">
                {/* Categoria */}
                <div className="mb-3">
                  <span className="inline-block bg-purple-100 text-purple-600 text-xs font-medium px-2 py-1 rounded">
                    Conheça Penha
                  </span>
                </div>
                
                {/* Título */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                  Investimentos em Penha: Oportunidades e Crescimento da Região
                </h3>
                
                {/* Descrição */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Descubra as principais oportunidades de investimento em Penha, uma cidade em constante crescimento com excelente localização e infraestrutura em desenvolvimento.
                </p>
                
                {/* Botão */}
                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors">
                  LEIA MAIS
                </button>
              </div>
            </article>

            {/* Artigo 2 - Piçarras */}
            <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                  <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                {/* Data */}
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium">
                  11 Set
                </div>
              </div>
              
              <div className="p-6">
                {/* Categoria */}
                <div className="mb-3">
                  <span className="inline-block bg-purple-100 text-purple-600 text-xs font-medium px-2 py-1 rounded">
                    Conheça Piçarras
                  </span>
                </div>
                
                {/* Título */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                  Piçarras: A Beleza Natural e o Desenvolvimento Imobiliário
                </h3>
                
                {/* Descrição */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Explore as belezas naturais de Piçarras e como o desenvolvimento imobiliário está crescendo de forma sustentável, preservando o charme da cidade.
                </p>
                
                {/* Botão */}
                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors">
                  LEIA MAIS
                </button>
              </div>
            </article>

            {/* Artigo 3 - Barra Velha */}
            <article className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                  <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                    </svg>
                  </div>
                </div>
                {/* Data */}
                <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded text-sm font-medium">
                  27 Ago
                </div>
              </div>
              
              <div className="p-6">
                {/* Categoria */}
                <div className="mb-3">
                  <span className="inline-block bg-purple-100 text-purple-600 text-xs font-medium px-2 py-1 rounded">
                    Dicas e Tendências
                  </span>
                </div>
                
                {/* Título */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                  Barra Velha: O Futuro do Turismo e Investimento Imobiliário
                </h3>
                
                {/* Descrição */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Conheça as tendências de investimento em Barra Velha, uma cidade que combina turismo de qualidade com oportunidades imobiliárias únicas na região.
                </p>
                
                {/* Botão */}
                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors">
                  LEIA MAIS
                </button>
              </div>
            </article>
          </div>

          {/* Botão Ver Mais */}
          <div className="text-center mt-12">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200">
              Ver mais artigos
            </button>
          </div>
        </div>
      </section>

      {/* Rodapé Tradicional */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo e Descrição */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-32 h-12 bg-purple-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">NOX</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-6 max-w-md">
                A melhor imobiliária da região de Penha, Piçarras e Barra Velha. 
                Encontre o imóvel dos seus sonhos com a nossa equipe especializada.
              </p>
              
              {/* Contato */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Phone className="w-4 h-4" />
                  <span>(47) 99753-0113</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span>contato@noximoveis.com.br</span>
                </div>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
              <h3 className="text-white font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                  <Link href="/imoveis" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Imóveis à venda
                </Link>
              </li>
              <li>
                  <Link href="/imoveis?status=lancamento" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Lançamentos
                </Link>
              </li>
              <li>
                  <Link href="/sobre" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Sobre nós
                </Link>
              </li>
              <li>
                  <Link href="/contato" className="text-gray-300 hover:text-white text-sm transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

            {/* Redes Sociais */}
          <div>
              <h3 className="text-white font-semibold mb-4">Siga-nos</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
            </div>
          </div>
        </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 Nox Imóveis. Todos os direitos reservados.
              </p>
              <p className="text-gray-400 text-sm mt-2 md:mt-0">
                CRECI/SC 12345
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
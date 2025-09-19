'use client'

import Link from 'next/link'
import Image from 'next/image'
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
      <div className="bg-gray-900 text-white">
        {/* Seção Superior - Contatos e Redes Sociais */}
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Telefones */}
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8 mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span className="text-sm font-medium">(47) 99753-0113</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium">(47) 3367-0990</span>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Acompanhe:</span>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Linha Divisória */}
        <div className="border-t border-gray-700"></div>

        {/* Seção Principal - Links e Informações */}
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Imóveis */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm">Imóveis</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/imoveis" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Imóveis à venda
                  </Link>
                </li>
                <li>
                  <Link href="/imoveis?status=lancamento" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Empreendimentos
                  </Link>
                </li>
                <li>
                  <Link href="/favoritos" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Favoritos
                  </Link>
                </li>
              </ul>
          </div>

            {/* Serviços */}
          <div>
              <h3 className="text-white font-semibold mb-4 text-sm">Serviços</h3>
            <ul className="space-y-2">
              <li>
                  <Link href="/anunciar" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Anunciar Imóvel
                </Link>
              </li>
              <li>
                  <Link href="/encontrar" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Encontre meu Imóvel
                </Link>
              </li>
              <li>
                  <Link href="/como-comprar" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Como comprar
                </Link>
              </li>
              <li>
                  <Link href="/simular-financiamento" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Simular Financiamento
                </Link>
              </li>
            </ul>
          </div>

            {/* Institucional */}
          <div>
              <h3 className="text-white font-semibold mb-4 text-sm">Institucional</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/sobre" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Quem somos
                  </Link>
                </li>
                <li>
                  <Link href="/contato" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link href="/trabalhe-conosco" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Trabalhe Conosco
                  </Link>
                </li>
              </ul>
              </div>

            {/* Links Adicionais */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link href="/viva-penha" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Viva Penha
                  </Link>
                </li>
                <li>
                  <Link href="/viva-picarras" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Viva Piçarras
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Linha Divisória */}
        <div className="border-t border-gray-700"></div>

        {/* Seção Inferior - Logo e Endereços */}
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            {/* Logo */}
            <div className="mb-6 lg:mb-0">
              <Image 
                src="/imagens/Logo1.png" 
                alt="Nox Imóveis" 
                width={200} 
                height={60}
                className="h-12 w-auto"
              />
            </div>

            {/* Central de Atendimento */}
            <div className="text-center lg:text-right">
              <h4 className="font-semibold text-purple-400 mb-2 text-lg">Central de Atendimento</h4>
              <p className="text-gray-300 mb-1">CRECI 12345-J</p>
              <p className="text-gray-300 mb-1">Rua Principal, 123</p>
              <p className="text-gray-300 mb-2">Centro, Penha - SC</p>
              <p className="text-purple-400 font-semibold">(47) 99753-0113</p>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-gray-700">
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
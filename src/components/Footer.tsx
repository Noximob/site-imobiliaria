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
            <h2 className="text-lg font-medium text-white">
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
              <div className="grid grid-cols-2 gap-1">
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
                <div className="space-y-1">
                  <Link href="/imoveis?status=lancamento" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Lançamentos
                  </Link>
                  <Link href="/imoveis?status=na-planta" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Na Planta
                  </Link>
                  <Link href="/imoveis?status=em-construcao" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Em Construção
                  </Link>
                  <Link href="/imoveis?status=pronto" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Pronto para Morar
                  </Link>
                  <Link href="/imoveis?tipo=apartamento" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Apartamentos
                  </Link>
                  <Link href="/imoveis?tipo=casa" className="block text-xs text-gray-400 hover:text-white transition-colors">
                    Casas
                  </Link>
                </div>
              </div>
            </div>
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
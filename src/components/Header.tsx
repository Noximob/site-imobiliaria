'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Phone, MapPin, ChevronDown, Instagram, Linkedin, Facebook } from 'lucide-react'
import Image from 'next/image'
import { getImageUrl } from '@/lib/github-images'
import DynamicText from './DynamicText'

export default function Header() {
  const logoUrl = getImageUrl('logo-header')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPenhaOpen, setIsPenhaOpen] = useState(false)
  const [isPicarrasOpen, setIsPicarrasOpen] = useState(false)
  const [isBarraVelhaOpen, setIsBarraVelhaOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo e Contatos - Esquerda */}
          <div className="flex items-center space-x-6">
          {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="relative w-32 h-12 bg-transparent">
                <Image
                  src={logoUrl}
                  alt="Nox Imóveis"
                  fill
                  className="object-contain bg-transparent"
                  priority
                />
            </div>
          </Link>

            {/* Telefone e Redes Sociais */}
          <div className="hidden lg:flex items-center space-x-4">
              {/* WhatsApp */}
              <div className="flex items-center space-x-2 text-sm text-green-600">
              <Phone className="w-4 h-4" />
                <DynamicText path="header.telefone" fallback="(47) 99753-0113" className="font-medium" />
              </div>
              
              {/* Redes Sociais */}
              <div className="flex items-center space-x-3">
                <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
            </div>
            </div>
          </div>

          {/* Cidades e Menu hambúrguer - Lado direito */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation - Cidades */}
            <nav className="hidden lg:flex items-center space-x-3">
              {/* Imóveis em Penha */}
              <div className="relative">
                    <button 
                      className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors text-sm font-bold"
                      onMouseEnter={() => setIsPenhaOpen(true)}
                      onMouseLeave={() => setIsPenhaOpen(false)}
                    >
                      <MapPin className="w-4 h-4" />
                      <DynamicText path="header.menu_imoveis_penha" fallback="Imóveis em Penha" />
                      <ChevronDown className="w-3 h-3" />
                    </button>
                {isPenhaOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                    <Link href="/imoveis?cidade=penha" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                      Apartamentos em Penha
                    </Link>
                    <Link href="/imoveis?cidade=penha&tipo=casa" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                      Casas em Penha
                    </Link>
                    <Link href="/imoveis?cidade=penha&tipo=terreno" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                      Terrenos em Penha
                    </Link>
                  </div>
                )}
              </div>

              {/* Imóveis em Piçarras */}
              <div className="relative">
                    <button 
                      className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors text-sm font-bold"
                      onMouseEnter={() => setIsPicarrasOpen(true)}
                      onMouseLeave={() => setIsPicarrasOpen(false)}
                    >
                      <MapPin className="w-4 h-4" />
                      <DynamicText path="header.menu_imoveis_picarras" fallback="Imóveis em Balneário Piçarras" />
                      <ChevronDown className="w-3 h-3" />
                    </button>
                {isPicarrasOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                    <Link href="/imoveis?cidade=picarras" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                      Apartamentos em Balneário Piçarras
                    </Link>
                    <Link href="/imoveis?cidade=picarras&tipo=casa" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                      Casas em Balneário Piçarras
                    </Link>
                    <Link href="/imoveis?cidade=picarras&tipo=terreno" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                      Terrenos em Balneário Piçarras
                    </Link>
                  </div>
                )}
              </div>

              {/* Imóveis em Barra Velha */}
              <div className="relative">
                    <button 
                      className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors text-sm font-bold"
                      onMouseEnter={() => setIsBarraVelhaOpen(true)}
                      onMouseLeave={() => setIsBarraVelhaOpen(false)}
                    >
                      <MapPin className="w-4 h-4" />
                      <DynamicText path="header.menu_imoveis_barra_velha" fallback="Imóveis em Barra Velha" />
                      <ChevronDown className="w-3 h-3" />
                    </button>
                {isBarraVelhaOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                    <Link href="/imoveis?cidade=barra-velha" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                      Apartamentos em Barra Velha
                    </Link>
                    <Link href="/imoveis?cidade=barra-velha&tipo=casa" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                      Casas em Barra Velha
                    </Link>
                    <Link href="/imoveis?cidade=barra-velha&tipo=terreno" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                      Terrenos em Barra Velha
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Menu hambúrguer */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}></div>
            
            {/* Sidebar */}
            <div className="absolute right-0 top-0 h-full w-64 bg-gray-900 p-4">
              {/* Close button */}
              <div className="flex justify-end mb-4">
                <button onClick={() => setIsMenuOpen(false)} className="text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Menu content */}
              <div className="space-y-5">
                {/* Imóveis */}
                <div>
                  <h3 className="text-purple-400 text-base font-semibold mb-2">Imóveis</h3>
                  <div className="space-y-1">
                    <Link href="/imoveis" className="block text-white text-sm hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      Imóveis à venda
                    </Link>
                    <Link href="/empreendimentos" className="block text-white text-sm hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      Empreendimentos
                    </Link>
                    <Link href="/favoritos" className="block text-white text-sm hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      Favoritos
              </Link>
                  </div>
                </div>

                {/* Serviços */}
                <div>
                  <h3 className="text-purple-400 text-base font-semibold mb-2">Serviços</h3>
                  <div className="space-y-1">
                    <Link href="/anunciar" className="block text-white text-sm hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      Anunciar imóvel
              </Link>
                    <Link href="/encontre-meu-imovel" className="block text-white text-sm hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      Encontre meu imóvel
              </Link>
                    <Link href="/como-comprar" className="block text-white text-sm hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      Como comprar
              </Link>
                  </div>
                </div>

                {/* Institucional */}
                <div>
                  <h3 className="text-purple-400 text-base font-semibold mb-2">Institucional</h3>
                  <div className="space-y-1">
                    <Link href="/sobre" className="block text-white text-sm hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      Quem somos
                    </Link>
                    <Link href="/contato" className="block text-white text-sm hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      Contato
                    </Link>
                    <Link href="/trabalhe-conosco" className="block text-white text-sm hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      Trabalhe Conosco
                    </Link>
                    <Link href="/viva-penha" className="block text-white text-sm hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      Viva Penha
                    </Link>
                    <Link href="/viva-balneario-picarras" className="block text-white text-sm hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      Viva Balneário Piçarras
                    </Link>
                    <Link href="/viva-barra-velha" className="block text-white text-sm hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      Viva Barra Velha
                    </Link>
                    <Link href="/blog" className="block text-white text-sm hover:text-gray-300" onClick={() => setIsMenuOpen(false)}>
                      Blog
                    </Link>
                  </div>
                </div>

                {/* Contatos */}
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center space-x-2 text-white text-sm">
                    <Phone className="w-4 h-4 text-purple-400" />
                    <span>(47) 99753-0113</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Phone, MapPin, ChevronDown, Instagram, Linkedin, Facebook } from 'lucide-react'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPenhaOpen, setIsPenhaOpen] = useState(false)
  const [isPicarrasOpen, setIsPicarrasOpen] = useState(false)
  const [isBarraVelhaOpen, setIsBarraVelhaOpen] = useState(false)

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-12 h-12">
              <Image
                src="/imagens/logo/logo.png"
                alt="Felicità Imóveis"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-purple-600">felicità</span>
              <span className="text-sm text-purple-500 -mt-1">IMOVEIS</span>
            </div>
          </Link>

          {/* Contact Info e Redes Sociais */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* WhatsApp */}
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <Phone className="w-4 h-4" />
              <span className="font-medium">(47) 99753-0113</span>
              <span className="text-xs text-gray-500">VENDAS</span>
            </div>
            
            {/* Redes Sociais */}
            <div className="flex items-center space-x-3">
              <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Desktop Navigation - Cidades */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Imóveis em Penha */}
            <div className="relative">
              <button 
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors"
                onMouseEnter={() => setIsPenhaOpen(true)}
                onMouseLeave={() => setIsPenhaOpen(false)}
              >
                <MapPin className="w-4 h-4" />
                <span>Imóveis em Penha</span>
                <ChevronDown className="w-4 h-4" />
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
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors"
                onMouseEnter={() => setIsPicarrasOpen(true)}
                onMouseLeave={() => setIsPicarrasOpen(false)}
              >
                <MapPin className="w-4 h-4" />
                <span>Imóveis em Piçarras</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isPicarrasOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                  <Link href="/imoveis?cidade=picarras" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                    Apartamentos em Piçarras
                  </Link>
                  <Link href="/imoveis?cidade=picarras&tipo=casa" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                    Casas em Piçarras
                  </Link>
                  <Link href="/imoveis?cidade=picarras&tipo=terreno" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                    Terrenos em Piçarras
                  </Link>
                </div>
              )}
            </div>

            {/* Imóveis em Barra Velha */}
            <div className="relative">
              <button 
                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors"
                onMouseEnter={() => setIsBarraVelhaOpen(true)}
                onMouseLeave={() => setIsBarraVelhaOpen(false)}
              >
                <MapPin className="w-4 h-4" />
                <span>Imóveis em Barra Velha</span>
                <ChevronDown className="w-4 h-4" />
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

            {/* Anunciar Imóvel */}
            <Link href="/anunciar" className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors">
              <MapPin className="w-4 h-4" />
              <span>Anunciar imóvel</span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-purple-50 rounded-lg mt-2">
              {/* WhatsApp Mobile */}
              <div className="flex items-center space-x-2 px-3 py-2 text-green-600">
                <Phone className="w-4 h-4" />
                <span className="font-medium">(47) 99753-0113</span>
                <span className="text-xs text-gray-500">VENDAS</span>
              </div>
              
              {/* Redes Sociais Mobile */}
              <div className="flex items-center space-x-4 px-3 py-2">
                <a href="#" className="text-purple-600 hover:text-purple-700">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-purple-600 hover:text-purple-700">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-purple-600 hover:text-purple-700">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>

              <div className="border-t border-purple-200 my-2"></div>

              {/* Menu Cidades Mobile */}
              <Link
                href="/imoveis?cidade=penha"
                className="block px-3 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Imóveis em Penha
              </Link>
              <Link
                href="/imoveis?cidade=picarras"
                className="block px-3 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Imóveis em Piçarras
              </Link>
              <Link
                href="/imoveis?cidade=barra-velha"
                className="block px-3 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Imóveis em Barra Velha
              </Link>
              <Link
                href="/anunciar"
                className="block px-3 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Anunciar imóvel
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

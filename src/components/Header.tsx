'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, Phone, MapPin, ChevronDown, Instagram, Linkedin, Facebook } from 'lucide-react'
import Image from 'next/image'
import { getImageUrl } from '@/lib/github-images'
import { getText } from '@/lib/site-texts'
import { getWhatsAppLink } from '@/lib/whatsapp'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const logoUrl = getImageUrl('logo-header')
  const telefone = getText('header.telefone')
  const menuPenha = getText('header.menu_imoveis_penha')
  const menuPicarras = getText('header.menu_imoveis_picarras')
  const menuBarraVelha = getText('header.menu_imoveis_barra_velha')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPenhaOpen, setIsPenhaOpen] = useState(false)
  const [isPicarrasOpen, setIsPicarrasOpen] = useState(false)
  const [isBarraVelhaOpen, setIsBarraVelhaOpen] = useState(false)

  const handleLinkClick = (href: string) => {
    // Fechar dropdowns
    setIsPenhaOpen(false)
    setIsPicarrasOpen(false)
    setIsBarraVelhaOpen(false)
    
    // Se já está na mesma rota, forçar navegação
    if (pathname === '/imoveis') {
      router.push(href)
      router.refresh()
    } else {
      router.push(href)
    }
  }

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
                <span className="font-medium">{telefone}</span>
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
              <div 
                className="relative"
                onMouseEnter={() => setIsPenhaOpen(true)}
                onMouseLeave={() => setIsPenhaOpen(false)}
              >
                    <button 
                      className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors text-sm font-bold"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{menuPenha}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                {isPenhaOpen && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50"
                    onMouseEnter={() => setIsPenhaOpen(true)}
                    onMouseLeave={() => setIsPenhaOpen(false)}
                  >
                    <button 
                      onClick={() => handleLinkClick('/imoveis?cidade=penha&tipo=apartamento')}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Apartamento à venda em Penha
                    </button>
                    <button 
                      onClick={() => handleLinkClick('/imoveis?cidade=penha')}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Imóveis à venda em Penha
                    </button>
                    <button 
                      onClick={() => handleLinkClick('/imoveis?cidade=penha&tipo=cobertura')}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Coberturas à venda em Penha
                    </button>
                    <button 
                      onClick={() => handleLinkClick('/imoveis?cidade=penha&frenteMar=true&vistaMar=true')}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Apartamento Frente Mar em Penha
                    </button>
                    <button 
                      onClick={() => handleLinkClick('/imoveis?cidade=penha&vistaMar=true')}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Apartamento Vista para o Mar em Penha
                    </button>
                    <button 
                      onClick={() => handleLinkClick('/imoveis?cidade=penha&quadraMar=true')}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Apartamento Quadra Mar em Penha
                    </button>
                  </div>
                )}
              </div>

              {/* Imóveis em Piçarras */}
              <div 
                className="relative"
                onMouseEnter={() => setIsPicarrasOpen(true)}
                onMouseLeave={() => setIsPicarrasOpen(false)}
              >
                    <button 
                      className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors text-sm font-bold"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{menuPicarras}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                {isPicarrasOpen && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50"
                    onMouseEnter={() => setIsPicarrasOpen(true)}
                    onMouseLeave={() => setIsPicarrasOpen(false)}
                  >
                    <button 
                      onClick={() => handleLinkClick('/imoveis?cidade=balneario-picarras&tipo=apartamento')}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Apartamento à venda em Balneário Piçarras
                    </button>
                    <button 
                      onClick={() => handleLinkClick('/imoveis?cidade=balneario-picarras')}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Imóveis à venda em Balneário Piçarras
                    </button>
                    <button 
                      onClick={() => handleLinkClick('/imoveis?cidade=balneario-picarras&tipo=cobertura')}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Coberturas à venda em Balneário Piçarras
                    </button>
                    <button 
                      onClick={() => handleLinkClick('/imoveis?cidade=balneario-picarras&frenteMar=true&vistaMar=true')}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Apartamento Frente Mar em Balneário Piçarras
                    </button>
                    <button 
                      onClick={() => handleLinkClick('/imoveis?cidade=balneario-picarras&vistaMar=true')}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Apartamento Vista para o Mar em Balneário Piçarras
                    </button>
                    <button 
                      onClick={() => handleLinkClick('/imoveis?cidade=balneario-picarras&quadraMar=true')}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Apartamento Quadra Mar em Balneário Piçarras
                    </button>
                  </div>
                )}
              </div>

              {/* Imóveis em Barra Velha */}
              <div 
                className="relative"
                onMouseEnter={() => setIsBarraVelhaOpen(true)}
                onMouseLeave={() => setIsBarraVelhaOpen(false)}
              >
                    <button 
                      className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors text-sm font-bold"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{menuBarraVelha}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                {isBarraVelhaOpen && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50"
                    onMouseEnter={() => setIsBarraVelhaOpen(true)}
                    onMouseLeave={() => setIsBarraVelhaOpen(false)}
                  >
                    <button 
                      onClick={() => handleLinkClick('/imoveis?cidade=barra-velha&tipo=apartamento')}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Apartamento à venda em Barra Velha
                    </button>
                    <button 
                      onClick={() => handleLinkClick('/imoveis?cidade=barra-velha')}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Imóveis à venda em Barra Velha
                    </button>
                    <button 
                      onClick={() => handleLinkClick('/imoveis?cidade=barra-velha&tipo=cobertura')}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Coberturas à venda em Barra Velha
                    </button>
                    <button 
                      onClick={() => handleLinkClick('/imoveis?cidade=barra-velha&frenteMar=true&vistaMar=true')}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Apartamento Frente Mar em Barra Velha
                    </button>
                    <button 
                      onClick={() => handleLinkClick('/imoveis?cidade=barra-velha&vistaMar=true')}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Apartamento Vista para o Mar em Barra Velha
                    </button>
                    <button 
                      onClick={() => handleLinkClick('/imoveis?cidade=barra-velha&quadraMar=true')}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50"
                    >
                      Apartamento Quadra Mar em Barra Velha
                    </button>
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
                  <a 
                    href={getWhatsAppLink('(47) 99753-0113')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-white text-sm hover:text-green-400 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-purple-400" />
                    <span>(47) 99753-0113</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

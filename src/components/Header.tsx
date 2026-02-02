'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, Phone, MapPin, ChevronDown, Instagram, Facebook, Youtube } from 'lucide-react'
import Image from 'next/image'
import { getImageUrl } from '@/lib/github-images'
import { getText } from '@/lib/site-texts'
import { getWhatsAppLink } from '@/lib/whatsapp'
import { trackWhatsAppClick, trackSocialClick } from '@/lib/analytics'

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

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
  const penhaRef = useRef<HTMLDivElement>(null)
  const picarrasRef = useRef<HTMLDivElement>(null)
  const barraVelhaRef = useRef<HTMLDivElement>(null)

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        penhaRef.current && !penhaRef.current.contains(target) &&
        picarrasRef.current && !picarrasRef.current.contains(target) &&
        barraVelhaRef.current && !barraVelhaRef.current.contains(target)
      ) {
        setIsPenhaOpen(false)
        setIsPicarrasOpen(false)
        setIsBarraVelhaOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const togglePenha = () => {
    setIsPenhaOpen(prev => !prev)
    setIsPicarrasOpen(false)
    setIsBarraVelhaOpen(false)
  }
  const togglePicarras = () => {
    setIsPicarrasOpen(prev => !prev)
    setIsPenhaOpen(false)
    setIsBarraVelhaOpen(false)
  }
  const toggleBarraVelha = () => {
    setIsBarraVelhaOpen(prev => !prev)
    setIsPenhaOpen(false)
    setIsPicarrasOpen(false)
  }

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
              <a
                href={getWhatsAppLink(telefone)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('header')}
                className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700 transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span className="font-medium">{telefone}</span>
              </a>
              
              {/* Redes Sociais */}
              <div className="flex items-center space-x-3">
                <a href="https://www.instagram.com/noximoveis?igsh=cmVzYTFzNmZkNQ%3D%3D" target="_blank" rel="noopener noreferrer" onClick={() => trackSocialClick('instagram')} className="text-purple-600 hover:text-purple-700 transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://www.tiktok.com/@noximoveis?_r=1&_t=ZS-93IL19xyQDN" target="_blank" rel="noopener noreferrer" onClick={() => trackSocialClick('tiktok')} className="text-purple-600 hover:text-purple-700 transition-colors" aria-label="TikTok">
                  <TikTokIcon className="w-5 h-5" />
                </a>
              <a href="https://www.facebook.com/share/1BtwHUDDAj/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" onClick={() => trackSocialClick('facebook')} className="text-purple-600 hover:text-purple-700 transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@NoxIm%C3%B3veis" target="_blank" rel="noopener noreferrer" onClick={() => trackSocialClick('youtube')} className="text-purple-600 hover:text-purple-700 transition-colors" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            </div>
          </div>

          {/* Cidades e Menu hambúrguer - Lado direito */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation - Cidades */}
            <nav className="hidden lg:flex items-center space-x-3">
              {/* Imóveis em Penha */}
              <div ref={penhaRef} className="relative">
                    <button 
                      onClick={togglePenha}
                      className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors text-sm font-bold"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{menuPenha}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                {isPenhaOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
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
                  </div>
                )}
              </div>

              {/* Imóveis em Piçarras */}
              <div ref={picarrasRef} className="relative">
                    <button 
                      onClick={togglePicarras}
                      className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors text-sm font-bold"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{menuPicarras}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                {isPicarrasOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
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
              <div ref={barraVelhaRef} className="relative">
                    <button 
                      onClick={toggleBarraVelha}
                      className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors text-sm font-bold"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{menuBarraVelha}</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                {isBarraVelhaOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
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
                    onClick={() => trackWhatsAppClick('header_mobile')}
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

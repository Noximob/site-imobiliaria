'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, Linkedin } from 'lucide-react'
import DynamicImage from '@/components/DynamicImage'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
image.png      {/* Rodapé Tradicional */}
      <div className="bg-gray-900 text-white">
        {/* Seção Superior - Contatos e Redes Sociais */}
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Telefone */}
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span className="text-sm font-medium">(47) 99753-0113</span>
            </div>

            {/* Redes Sociais */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Acompanhe:</span>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                <Linkedin className="w-5 h-5" />
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
              <DynamicImage 
                imageId="logo-footer"
                alt="Nox Imóveis" 
                width={200} 
                height={60}
                className="h-12 w-auto"
                fallbackSrc="/imagens/Logo1.png"
              />
            </div>

            {/* Central de Atendimento */}
            <div className="text-center lg:text-right">
              <h4 className="font-semibold text-purple-400 mb-2 text-lg">Central de Atendimento</h4>
              <p className="text-gray-300 mb-1">CRECI 9839-J</p>
              <p className="text-gray-300 mb-1">Jordelina Florzina Flores, 154</p>
              <p className="text-gray-300 mb-2">Gravatá de Penha - SC</p>
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
                CRECI/SC 9839-J
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
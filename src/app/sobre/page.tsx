'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { getImageUrl } from '@/lib/github-images'
import { getText } from '@/lib/site-texts'
import DepoimentosSection from '@/components/DepoimentosSection'
import TeamSection from '@/components/TeamSection'
import { getDepoimentosAtivos } from '@/lib/depoimentos-data'
import { getCorretoresAtivos } from '@/lib/corretores-data'

const sobreImages = {
  hero: getImageUrl('quem-somos-hero'),
  equipePrincipal: getImageUrl('equipe-principal'),
  corretor1: getImageUrl('corretores-1'),
  corretor2: getImageUrl('corretores-2'),
  corretor3: getImageUrl('corretores-3'),
  corretor4: getImageUrl('corretores-4')
}

export default async function SobrePage() {
  // Buscar dados dinâmicos
  const depoimentos = await getDepoimentosAtivos()
  const corretores = await getCorretoresAtivos()
  
  return <SobrePageClient depoimentos={depoimentos} corretores={corretores} />
}

function SobrePageClient({ depoimentos, corretores }: { depoimentos: any[], corretores: any[] }) {
  const [selectedMember, setSelectedMember] = useState<string | null>(null)

  return (
    <div className="min-h-screen">
      {/* Hero Section - Quem Somos: primeira tela inteira, foto + texto organizados */}
      <section className="min-h-screen h-screen flex flex-col md:flex-row overflow-hidden">
        {/* Coluna da foto */}
        <div className="flex-1 relative min-h-[40vh] md:min-h-0 order-2 md:order-1">
          <Image 
            src={sobreImages.hero}
            alt="Nox Imóveis - Quem Somos" 
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        
        {/* Coluna do texto + botão */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-900 to-purple-800 py-12 md:py-0 order-1 md:order-2">
          <div className="text-white max-w-lg px-6 sm:px-10 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4 md:mb-6">
              {getText('quem_somos.hero.titulo')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-purple-100 leading-relaxed mb-8 md:mb-10">
              {getText('quem_somos.hero.subtitulo')}
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('nossa-historia')
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="w-full sm:w-auto bg-white text-purple-700 hover:bg-purple-100 font-bold py-4 px-10 rounded-lg text-lg transition-colors duration-300 shadow-lg"
            >
              {getText('quem_somos.hero.botao')}
            </button>
          </div>
        </div>
      </section>

      {/* Seção História da Empresa */}
      <section id="nossa-historia" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Imagem da Equipe */}
            <div className="relative">
              <Image 
                src={sobreImages.equipePrincipal}
                alt="Equipe Nox Imóveis" 
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            
            {/* Texto da História */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {getText('quem_somos.nossa_historia.titulo')}
              </h2>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p className="text-base">
                  {getText('quem_somos.nossa_historia.paragrafo_1')}
                </p>
                
                <p className="text-base">
                  {getText('quem_somos.nossa_historia.paragrafo_2')}
                </p>
                
                <p className="text-base">
                  {getText('quem_somos.nossa_historia.paragrafo_3')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Missão, Visão e Valores */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Missão */}
            <div className="bg-purple-100 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{getText('quem_somos.missao_visao_valores.missao.titulo')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {getText('quem_somos.missao_visao_valores.missao.descricao')}
              </p>
            </div>
            
            {/* Visão */}
            <div className="bg-purple-100 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{getText('quem_somos.missao_visao_valores.visao.titulo')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {getText('quem_somos.missao_visao_valores.visao.descricao')}
              </p>
            </div>
            
            {/* Valores */}
            <div className="bg-purple-100 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{getText('quem_somos.missao_visao_valores.valores.titulo')}</h3>
              <p className="text-gray-700 leading-relaxed">
                {getText('quem_somos.missao_visao_valores.valores.descricao')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção O que dizem nossos clientes - Dinâmica */}
      <DepoimentosSection depoimentos={depoimentos} />

      {/* Seção Conheça nossa equipe - Dinâmica */}
      <TeamSection corretores={corretores} />

      {/* Seção Faça parte da Nox */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8">
            {/* Ícone Coração */}
            <div className="w-16 h-16 bg-purple-200 rounded-lg flex items-center justify-center">
              <span className="text-3xl">💜</span>
            </div>
            
            {/* Texto */}
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {getText('quem_somos.cta_trabalhe.titulo')}
              </h2>
            </div>
            
            {/* Botão */}
            <Link href="/trabalhe-conosco" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 inline-block">
              {getText('quem_somos.cta_trabalhe.botao')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
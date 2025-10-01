import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Sobre Nós - Nox Imóveis',
  description: 'Conheça nossa história, missão e valores. A melhor imobiliária da região.',
  openGraph: {
    title: 'Sobre Nós - Nox Imóveis',
    description: 'Conheça nossa história, missão e valores. A melhor imobiliária da região.',
    type: 'website',
  },
}

export default function SobrePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Quem Somos */}
      <section className="relative h-screen flex items-end justify-start overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image 
            src="/imagens/banners/quem-somos-hero.jpg" 
            alt="Nox Imóveis - Quem Somos" 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 text-white p-8 pb-16 max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            A imobiliária mais alto-astral do litoral catarinense
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Conheça a história da Nox.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors duration-300 shadow-lg">
            Saiba mais
          </button>
        </div>
      </section>
    </div>
  )
}
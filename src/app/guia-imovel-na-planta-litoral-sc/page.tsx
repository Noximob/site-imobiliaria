import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, FileText, Shield, CreditCard, MapPin, HelpCircle } from 'lucide-react'
import { getText } from '@/lib/site-texts'

const baseUrl = 'https://noximobiliaria.com.br'
const G = 'Guia Imóvel na Planta'

export const metadata: Metadata = {
  title: 'Guia Imóvel na Planta no Litoral de SC | Nox Imóveis',
  description: 'Guia completo sobre comprar imóvel na planta em Penha, Balneário Piçarras e Barra Velha. Passo a passo, segurança e dicas para investidores e segunda residência.',
  keywords: 'imóvel na planta litoral SC, apartamento na planta Penha, investimento imobiliário Piçarras, comprar na planta Barra Velha',
  authors: [{ name: 'Nox Imóveis' }],
  openGraph: {
    title: 'Guia Imóvel na Planta no Litoral de SC | Nox Imóveis',
    description: 'Guia completo sobre comprar imóvel na planta em Penha, Piçarras e Barra Velha. Segurança, pagamento e dicas.',
    type: 'website',
    locale: 'pt_BR',
    url: `${baseUrl}/guia-imovel-na-planta-litoral-sc/`,
    images: [{ url: `${baseUrl}/api/image?id=banner-home`, width: 1920, height: 1080, alt: 'Nox Imóveis' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guia Imóvel na Planta no Litoral de SC | Nox Imóveis',
    description: 'Guia completo sobre comprar imóvel na planta no litoral catarinense.',
    images: [`${baseUrl}/api/image?id=banner-home`],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: `${baseUrl}/guia-imovel-na-planta-litoral-sc/` },
}

const LINKS_SATELITES = [
  { href: '/como-comprar-imovel-na-planta', labelKey: 'temas.tema_como_comprar', icon: FileText },
  { href: '/fluxo-pagamento-imovel-na-planta', labelKey: 'temas.tema_fluxo', icon: CreditCard },
  { href: '/usar-fgts-imovel-na-planta', labelKey: 'temas.tema_fgts', icon: CreditCard },
  { href: '/investir-imovel-na-planta-litoral', labelKey: 'temas.tema_investir', icon: BookOpen },
  { href: '/frente-mar-vs-quadra-mar', labelKey: 'temas.tema_frente_mar', icon: MapPin },
  { href: '/seguranca-imovel-na-planta', labelKey: 'temas.tema_seguranca', icon: Shield },
]

export default function GuiaImovelNaPlantaLitoralScPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-700 to-purple-900 text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-purple-200" />
            <span className="text-purple-200 text-sm font-medium uppercase tracking-wide">{getText(`${G}.hub.hero_label`)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight max-w-3xl">
            {getText(`${G}.hub.hero_titulo`)}
          </h1>
          <p className="mt-4 text-purple-100 text-base sm:text-lg max-w-2xl">
            {getText(`${G}.hub.hero_subtitulo`)}
          </p>
        </div>
      </section>

      {/* Conteúdo principal */}
      <section className="py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              {getText(`${G}.hub.paragrafo_1`)}
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              {getText(`${G}.hub.paragrafo_2`)}
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              {getText(`${G}.hub.paragrafo_3`)}
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              {getText(`${G}.hub.paragrafo_4`)}
            </p>
          </div>
        </div>
      </section>

      {/* Índice do guia */}
      <section className="py-10 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{getText(`${G}.hub.indice_titulo`)}</h2>
          <p className="text-gray-600 mb-6">{getText(`${G}.hub.indice_subtitulo`)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LINKS_SATELITES.map(({ href, labelKey, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-colors"
              >
                <Icon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="font-medium text-gray-800">{getText(`${G}.${labelKey}`)}</span>
              </Link>
            ))}
            <Link
              href="/perguntas-frequentes-imovel-na-planta"
              className="flex items-start gap-3 p-4 rounded-lg bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              <HelpCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <span className="font-medium text-purple-900">{getText(`${G}.hub.perguntas_respostas_label`)}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Links úteis do site */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{getText(`${G}.hub.no_site_titulo`)}</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/imoveis?status=lancamento" className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors text-sm">
              {getText(`${G}.hub.link_ver_lancamentos`)}
            </Link>
            <Link href="/como-comprar" className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-purple-50 hover:border-purple-200 transition-colors text-sm">
              {getText(`${G}.hub.link_como_comprar_imovel`)}
            </Link>
            <Link href="/encontre-meu-imovel" className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-purple-50 hover:border-purple-200 transition-colors text-sm">
              {getText(`${G}.hub.link_encontre_meu_imovel`)}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

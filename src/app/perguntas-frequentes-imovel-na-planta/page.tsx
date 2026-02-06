import type { Metadata } from 'next'
import Link from 'next/link'
import { HelpCircle, ChevronDown } from 'lucide-react'
import { getText } from '@/lib/site-texts'

const baseUrl = 'https://noximobiliaria.com.br'
const G = 'Guia Imóvel na Planta'
const F = 'FAQ Imóvel na Planta'

function getFaqItems() {
  return Array.from({ length: 12 }, (_, i) => {
    const n = i + 1
    return {
      pergunta: getText(`${F}.pergunta_${n}`),
      resposta: getText(`${F}.resposta_${n}`),
    }
  })
}

function getFaqSchema() {
  const items = getFaqItems()
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.pergunta,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.resposta,
      },
    })),
  }
}

export const metadata: Metadata = {
  title: 'Perguntas Frequentes - Imóvel na Planta | Nox Imóveis',
  description: 'Tire suas dúvidas sobre compra de imóvel na planta no litoral de SC. Segurança, pagamento, FGTS, frente mar e mais. Respostas objetivas da Nox Imóveis.',
  keywords: 'perguntas frequentes imóvel na planta, dúvidas imóvel na planta, comprar apartamento na planta, litoral Santa Catarina',
  authors: [{ name: 'Nox Imóveis' }],
  openGraph: {
    title: 'Perguntas Frequentes - Imóvel na Planta | Nox Imóveis',
    description: 'Tire suas dúvidas sobre compra de imóvel na planta no litoral de SC. Segurança, pagamento, FGTS e mais.',
    type: 'website',
    locale: 'pt_BR',
    url: `${baseUrl}/perguntas-frequentes-imovel-na-planta/`,
    images: [{ url: `${baseUrl}/api/image?id=banner-home`, width: 1920, height: 1080, alt: 'Nox Imóveis' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Perguntas Frequentes - Imóvel na Planta | Nox Imóveis',
    description: 'Tire suas dúvidas sobre compra de imóvel na planta no litoral de SC.',
    images: [`${baseUrl}/api/image?id=banner-home`],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: `${baseUrl}/perguntas-frequentes-imovel-na-planta/` },
}

export default function PerguntasFrequentesImovelNaPlantaPage() {
  const faqItems = getFaqItems()
  const faqSchema = getFaqSchema()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-purple-700 to-purple-900 text-white py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-10 h-10 text-purple-200" />
              <span className="text-purple-200 text-sm font-medium uppercase tracking-wide">{getText(`${G}.hub.hero_label`)}</span>
              <span className="text-purple-300">·</span>
              <span className="text-white/90 text-sm">{getText(`${F}.hero_sublabel`)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight max-w-3xl">
              {getText(`${F}.hero_titulo`)}
            </h1>
            <p className="mt-4 text-purple-100 text-base sm:text-lg max-w-2xl">
              {getText(`${F}.hero_subtitulo`)}
            </p>
          </div>
        </section>

        {/* FAQ em acordeão */}
        <section className="py-10 sm:py-14" aria-labelledby="faq-titulo">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="faq-titulo" className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
              Perguntas e respostas
            </h2>
            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <details
                  key={index}
                  className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-5 py-4 text-left font-semibold text-gray-900 hover:bg-purple-50 transition-colors">
                    <span className="pr-2">{item.pergunta}</span>
                    <ChevronDown className="flex-shrink-0 w-5 h-5 text-purple-600 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-5 pb-5 pt-0 text-gray-700 leading-relaxed border-t border-gray-100">
                    {item.resposta}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Navegação do guia */}
        <section className="py-10 bg-white border-t border-gray-200" aria-labelledby="outros-temas-titulo">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="outros-temas-titulo" className="text-xl font-bold text-gray-900 mb-4">
              Outros temas do guia
            </h2>
            <p className="text-gray-600 mb-4">{getText(`${F}.cta_texto`)}</p>
            <Link
              href="/guia-imovel-na-planta-litoral-sc"
              className="inline-block px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
            >
              {getText(`${F}.cta_botao`)}
            </Link>
            <p className="mt-6 text-sm text-gray-500 mb-2">{getText(`${F}.outros_temas_label`)}</p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              <Link href="/como-comprar-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium text-sm">{getText(`${F}.link_como_comprar`)}</Link>
              <Link href="/seguranca-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium text-sm">{getText(`${F}.link_seguranca`)}</Link>
              <Link href="/fluxo-pagamento-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium text-sm">{getText(`${F}.link_pagamento`)}</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

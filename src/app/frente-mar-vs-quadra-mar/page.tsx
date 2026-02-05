import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

const baseUrl = 'https://noximobiliaria.com.br'

export const metadata: Metadata = {
  title: 'Frente Mar x Quadra Mar - Imóvel na Planta | Nox',
  description: 'Frente mar x quadra mar: diferenças, valorização e como escolher no litoral SC. Penha, Piçarras e Barra Velha. Guia Nox Imóveis.',
  keywords: 'frente mar quadra mar, apartamento frente mar, valorização imóvel litoral',
  authors: [{ name: 'Nox Imóveis' }],
  openGraph: {
    title: 'Frente Mar x Quadra Mar - Imóvel na Planta | Nox Imóveis',
    description: 'Diferenças entre frente mar e quadra mar no litoral de SC.',
    type: 'website',
    locale: 'pt_BR',
    url: `${baseUrl}/frente-mar-vs-quadra-mar/`,
    images: [{ url: `${baseUrl}/api/image?id=banner-home`, width: 1920, height: 1080, alt: 'Nox Imóveis' }],
  },
  twitter: { card: 'summary_large_image', title: 'Frente Mar x Quadra Mar | Nox', images: [`${baseUrl}/api/image?id=banner-home`] },
  robots: { index: true, follow: true },
  alternates: { canonical: `${baseUrl}/frente-mar-vs-quadra-mar/` },
}

export default function FrenteMarVsQuadraMarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-purple-700 to-purple-900 text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-10 h-10 text-purple-200" />
            <span className="text-purple-200 text-sm font-medium uppercase tracking-wide">Guia Imóvel na Planta</span>
            <span className="text-purple-300">·</span>
            <span className="text-white/90 text-sm">Frente mar x quadra mar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight max-w-3xl">
            Frente mar x quadra mar
          </h1>
          <p className="mt-4 text-purple-100 text-base sm:text-lg max-w-2xl">
            Entenda as diferenças e como escolher no litoral de Santa Catarina.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-6">
            <p>
              Imóveis <strong>frente mar</strong> costumam ter maior escassez e procura, o que favorece valorização ao longo do tempo. Já os projetos <strong>quadra mar</strong> com boa vista, padrão construtivo e localização estratégica também podem performar muito bem. A análise deve considerar o conjunto do empreendimento e o seu objetivo: moradia, segunda residência ou <Link href="/investir-imovel-na-planta-litoral" className="text-purple-600 hover:text-purple-700 font-medium">investimento</Link>.
            </p>
            <p>
              No litoral catarinense, há oferta de lançamentos tanto frente mar quanto quadra mar em <Link href="/imoveis?cidade=penha&frenteMar=true" className="text-purple-600 hover:text-purple-700 font-medium">Penha</Link>, <Link href="/imoveis?cidade=balneario-picarras&frenteMar=true" className="text-purple-600 hover:text-purple-700 font-medium">Balneário Piçarras</Link> e <Link href="/imoveis?cidade=barra-velha&frenteMar=true" className="text-purple-600 hover:text-purple-700 font-medium">Barra Velha</Link>. A escolha depende do perfil e do orçamento; em muitos casos, um bom projeto quadra mar pode oferecer melhor custo-benefício.
            </p>
            <p>
              Para saber como avaliar a <Link href="/seguranca-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">segurança do empreendimento</Link> e o <Link href="/fluxo-pagamento-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">fluxo de pagamento</Link>, consulte os guias específicos. O <Link href="/guia-imovel-na-planta-litoral-sc" className="text-purple-600 hover:text-purple-700 font-medium">guia completo de imóvel na planta no litoral SC</Link> e as <Link href="/perguntas-frequentes-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">perguntas frequentes</Link> trazem mais detalhes.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">No guia</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/guia-imovel-na-planta-litoral-sc" className="block p-4 rounded-lg bg-purple-50 border border-purple-100 text-purple-800 font-medium hover:bg-purple-100 transition-colors">Índice do guia</Link>
            <Link href="/perguntas-frequentes-imovel-na-planta" className="block p-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 font-medium hover:bg-purple-50 transition-colors">Perguntas e respostas</Link>
            <Link href="/investir-imovel-na-planta-litoral" className="block p-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 font-medium hover:bg-purple-50 transition-colors">Investir na planta</Link>
            <Link href="/seguranca-imovel-na-planta" className="block p-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 font-medium hover:bg-purple-50 transition-colors">Segurança</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

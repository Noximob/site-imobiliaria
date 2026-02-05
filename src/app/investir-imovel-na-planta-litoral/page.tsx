import type { Metadata } from 'next'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

const baseUrl = 'https://noximobiliaria.com.br'

export const metadata: Metadata = {
  title: 'Investir em Imóvel na Planta no Litoral SC | Nox',
  description: 'Análise e dicas para investir em imóvel na planta em Penha, Piçarras e Barra Velha. Projeto, localização e perfil do investidor.',
  keywords: 'investir imóvel na planta, investimento litoral SC, apartamento na planta investimento',
  authors: [{ name: 'Nox Imóveis' }],
  openGraph: {
    title: 'Investir em Imóvel na Planta no Litoral SC | Nox Imóveis',
    description: 'Análise para investir em imóvel na planta no litoral catarinense.',
    type: 'website',
    locale: 'pt_BR',
    url: `${baseUrl}/investir-imovel-na-planta-litoral/`,
    images: [{ url: `${baseUrl}/api/image?id=banner-home`, width: 1920, height: 1080, alt: 'Nox Imóveis' }],
  },
  twitter: { card: 'summary_large_image', title: 'Investir em Imóvel na Planta | Nox', images: [`${baseUrl}/api/image?id=banner-home`] },
  robots: { index: true, follow: true },
  alternates: { canonical: `${baseUrl}/investir-imovel-na-planta-litoral/` },
}

export default function InvestirImovelNaPlantaLitoralPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-purple-700 to-purple-900 text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-10 h-10 text-purple-200" />
            <span className="text-purple-200 text-sm font-medium uppercase tracking-wide">Guia imóvel na planta</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight max-w-3xl">
            Investir em imóvel na planta no litoral
          </h1>
          <p className="mt-4 text-purple-100 text-base sm:text-lg max-w-2xl">
            O que considerar ao investir em apartamento na planta em Penha, Piçarras e Barra Velha.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-6">
            <p>
              Investir em imóvel na planta depende do projeto, da localização e da condição de entrada. Muitos investidores buscam essa modalidade por entrar em fase inicial e acompanhar a valorização até a entrega. No litoral catarinense, a demanda por moradia e veraneio ajuda a sustentar o interesse, mas toda decisão deve considerar o perfil e o prazo do investidor.
            </p>
            <p>
              A escolha entre <Link href="/frente-mar-vs-quadra-mar" className="text-purple-600 hover:text-purple-700 font-medium">frente mar e quadra mar</Link> influencia valor e liquidez. A análise do empreendimento deve incluir a <Link href="/seguranca-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">segurança jurídica e construtiva</Link> e o <Link href="/fluxo-pagamento-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">fluxo de pagamento</Link>, para alinhar o investimento ao seu planejamento financeiro.
            </p>
            <p>
              Entender <Link href="/como-comprar-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">como comprar imóvel na planta</Link> e conferir as <Link href="/perguntas-frequentes-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">perguntas frequentes</Link> complementa a visão. Para um panorama completo, acesse o <Link href="/guia-imovel-na-planta-litoral-sc" className="text-purple-600 hover:text-purple-700 font-medium">guia de imóvel na planta no litoral SC</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/guia-imovel-na-planta-litoral-sc" className="block p-4 rounded-lg bg-purple-50 border border-purple-100 text-purple-800 font-medium hover:bg-purple-100 transition-colors">Guia completo</Link>
            <Link href="/frente-mar-vs-quadra-mar" className="block p-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 font-medium hover:bg-purple-50 transition-colors">Frente mar x quadra mar</Link>
            <Link href="/seguranca-imovel-na-planta" className="block p-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 font-medium hover:bg-purple-50 transition-colors">Segurança na planta</Link>
            <Link href="/perguntas-frequentes-imovel-na-planta" className="block p-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 font-medium hover:bg-purple-50 transition-colors">Perguntas frequentes</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

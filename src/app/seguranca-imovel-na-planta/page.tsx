import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield } from 'lucide-react'

const baseUrl = 'https://noximobiliaria.com.br'

export const metadata: Metadata = {
  title: 'Segurança ao Comprar Imóvel na Planta | Nox Imóveis',
  description: 'Segurança ao comprar imóvel na planta: registro de incorporação, patrimônio de afetação e dicas para Penha, Piçarras e Barra Velha.',
  keywords: 'segurança imóvel na planta, patrimônio de afetação, comprar na planta seguro',
  authors: [{ name: 'Nox Imóveis' }],
  openGraph: {
    title: 'Segurança ao Comprar Imóvel na Planta | Nox Imóveis',
    description: 'Segurança ao comprar na planta: registro, patrimônio de afetação e dicas no litoral SC.',
    type: 'website',
    locale: 'pt_BR',
    url: `${baseUrl}/seguranca-imovel-na-planta/`,
    images: [{ url: `${baseUrl}/api/image?id=banner-home`, width: 1920, height: 1080, alt: 'Nox Imóveis' }],
  },
  twitter: { card: 'summary_large_image', title: 'Segurança - Imóvel na Planta | Nox', images: [`${baseUrl}/api/image?id=banner-home`] },
  robots: { index: true, follow: true },
  alternates: { canonical: `${baseUrl}/seguranca-imovel-na-planta/` },
}

export default function SegurancaImovelNaPlantaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-purple-700 to-purple-900 text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-purple-200" />
            <span className="text-purple-200 text-sm font-medium uppercase tracking-wide">Guia Imóvel na Planta</span>
            <span className="text-purple-300">·</span>
            <span className="text-white/90 text-sm">Segurança</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight max-w-3xl">
            Segurança ao comprar imóvel na planta
          </h1>
          <p className="mt-4 text-purple-100 text-base sm:text-lg max-w-2xl">
            O que verificar para comprar com tranquilidade no litoral catarinense.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-6">
            <p>
              Comprar imóvel na planta é seguro quando o empreendimento tem <strong>registro de incorporação</strong> e segue as exigências legais. Um ponto central é o <strong>patrimônio de afetação</strong>: um mecanismo que separa os recursos financeiros da obra do restante da empresa, protegendo o andamento da construção e dando mais segurança aos compradores.
            </p>
            <p>
              Também é essencial avaliar o histórico de entregas da construtora, o padrão construtivo e a transparência contratual. A imobiliária pode auxiliar na análise dos documentos e na comparação entre projetos. Entender o <Link href="/como-comprar-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">processo de compra</Link> e o <Link href="/fluxo-pagamento-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">fluxo de pagamento</Link> complementa a visão e evita surpresas.
            </p>
            <p>
              Para quem pensa em <Link href="/investir-imovel-na-planta-litoral" className="text-purple-600 hover:text-purple-700 font-medium">investir</Link> ou em escolher entre <Link href="/frente-mar-vs-quadra-mar" className="text-purple-600 hover:text-purple-700 font-medium">frente mar e quadra mar</Link>, a segurança do empreendimento é um dos pilares da decisão. Consulte o <Link href="/guia-imovel-na-planta-litoral-sc" className="text-purple-600 hover:text-purple-700 font-medium">guia completo de imóvel na planta no litoral SC</Link> e as <Link href="/perguntas-frequentes-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">perguntas frequentes</Link> para mais detalhes.
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
            <Link href="/como-comprar-imovel-na-planta" className="block p-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 font-medium hover:bg-purple-50 transition-colors">Como comprar</Link>
            <Link href="/fluxo-pagamento-imovel-na-planta" className="block p-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 font-medium hover:bg-purple-50 transition-colors">Fluxo de pagamento</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

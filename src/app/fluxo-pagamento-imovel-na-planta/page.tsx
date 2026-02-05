import type { Metadata } from 'next'
import Link from 'next/link'
import { CreditCard } from 'lucide-react'

const baseUrl = 'https://noximobiliaria.com.br'

export const metadata: Metadata = {
  title: 'Fluxo de Pagamento - Imóvel na Planta | Nox Imóveis',
  description: 'Entenda o pagamento de imóvel na planta: entrada, parcelas na obra e financiamento na entrega. Dicas para Penha, Piçarras e Barra Velha.',
  keywords: 'pagamento imóvel na planta, parcelas na obra, financiamento na entrega',
  authors: [{ name: 'Nox Imóveis' }],
  openGraph: {
    title: 'Fluxo de Pagamento - Imóvel na Planta | Nox Imóveis',
    description: 'Como funciona o pagamento de imóvel na planta no litoral de SC.',
    type: 'website',
    locale: 'pt_BR',
    url: `${baseUrl}/fluxo-pagamento-imovel-na-planta/`,
    images: [{ url: `${baseUrl}/api/image?id=banner-home`, width: 1920, height: 1080, alt: 'Nox Imóveis' }],
  },
  twitter: { card: 'summary_large_image', title: 'Fluxo de Pagamento - Imóvel na Planta | Nox', images: [`${baseUrl}/api/image?id=banner-home`] },
  robots: { index: true, follow: true },
  alternates: { canonical: `${baseUrl}/fluxo-pagamento-imovel-na-planta/` },
}

export default function FluxoPagamentoImovelNaPlantaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-purple-700 to-purple-900 text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-10 h-10 text-purple-200" />
            <span className="text-purple-200 text-sm font-medium uppercase tracking-wide">Guia Imóvel na Planta</span>
            <span className="text-purple-300">·</span>
            <span className="text-white/90 text-sm">Pagamento</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight max-w-3xl">
            Fluxo de pagamento de imóvel na planta
          </h1>
          <p className="mt-4 text-purple-100 text-base sm:text-lg max-w-2xl">
            Entrada, parcelas durante a obra e saldo na entrega: como se organizar.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-6">
            <p>
              O pagamento de um imóvel na planta costuma ser dividido em etapas: entrada inicial, parcelas mensais ou reforços durante a construção e saldo na entrega das chaves. Esse modelo permite distribuir o investimento ao longo do tempo e é comum nos lançamentos de <Link href="/imoveis?cidade=penha" className="text-purple-600 hover:text-purple-700 font-medium">Penha</Link>, <Link href="/imoveis?cidade=balneario-picarras" className="text-purple-600 hover:text-purple-700 font-medium">Balneário Piçarras</Link> e <Link href="/imoveis?cidade=barra-velha" className="text-purple-600 hover:text-purple-700 font-medium">Barra Velha</Link>.
            </p>
            <p>
              Muitos compradores optam por <strong>financiar somente na entrega</strong>: pagam a entrada e as parcelas da obra direto à construtora e deixam o saldo para o financiamento bancário quando o imóvel estiver pronto. Assim o desembolso inicial fica menor e o planejamento financeiro mais previsível. O uso do <Link href="/usar-fgts-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">FGTS</Link> pode entrar na composição da entrada ou do financiamento, dentro das regras vigentes.
            </p>
            <p>
              Além do valor da unidade, é importante considerar custos como ITBI, escritura e registro. Para entender todo o processo desde a escolha do imóvel, confira o <Link href="/guia-imovel-na-planta-litoral-sc" className="text-purple-600 hover:text-purple-700 font-medium">guia completo de imóvel na planta no litoral SC</Link> e as <Link href="/perguntas-frequentes-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">perguntas frequentes</Link>.
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
            <Link href="/usar-fgts-imovel-na-planta" className="block p-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 font-medium hover:bg-purple-50 transition-colors">Usar FGTS</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

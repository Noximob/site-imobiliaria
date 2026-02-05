import type { Metadata } from 'next'
import Link from 'next/link'
import { Wallet } from 'lucide-react'

const baseUrl = 'https://noximobiliaria.com.br'

export const metadata: Metadata = {
  title: 'Usar FGTS para Comprar Imóvel na Planta | Nox Imóveis',
  description: 'Saiba quando e como usar o FGTS na compra de imóvel na planta. Regras, requisitos e dicas para o litoral de Santa Catarina.',
  keywords: 'FGTS imóvel na planta, usar FGTS compra imóvel, FGTS financiamento',
  authors: [{ name: 'Nox Imóveis' }],
  openGraph: {
    title: 'Usar FGTS para Comprar Imóvel na Planta | Nox Imóveis',
    description: 'Quando e como usar o FGTS na compra de imóvel na planta no litoral SC.',
    type: 'website',
    locale: 'pt_BR',
    url: `${baseUrl}/usar-fgts-imovel-na-planta/`,
    images: [{ url: `${baseUrl}/api/image?id=banner-home`, width: 1920, height: 1080, alt: 'Nox Imóveis' }],
  },
  twitter: { card: 'summary_large_image', title: 'Usar FGTS - Imóvel na Planta | Nox', images: [`${baseUrl}/api/image?id=banner-home`] },
  robots: { index: true, follow: true },
  alternates: { canonical: `${baseUrl}/usar-fgts-imovel-na-planta/` },
}

export default function UsarFgtsImovelNaPlantaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-purple-700 to-purple-900 text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-10 h-10 text-purple-200" />
            <span className="text-purple-200 text-sm font-medium uppercase tracking-wide">Guia Imóvel na Planta</span>
            <span className="text-purple-300">·</span>
            <span className="text-white/90 text-sm">FGTS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight max-w-3xl">
            Usar FGTS para comprar imóvel na planta
          </h1>
          <p className="mt-4 text-purple-100 text-base sm:text-lg max-w-2xl">
            Regras e possibilidades de uso do FGTS na entrada ou no financiamento.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-6">
            <p>
              Em muitos casos é possível usar o <strong>FGTS</strong> na etapa de financiamento ou na composição da entrada ao comprar imóvel na planta. As regras legais exigem, em geral, que o comprador não possua outro imóvel na mesma cidade e cumpra requisitos de tempo de trabalho e de saldo. Cada situação deve ser analisada individualmente, pois as condições variam conforme o programa e a instituição financeira.
            </p>
            <p>
              O <Link href="/fluxo-pagamento-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">fluxo de pagamento</Link> do imóvel na planta costuma permitir que você pague a entrada e as parcelas da obra e deixe o saldo para o financiamento na entrega — e é nessa etapa que o FGTS costuma ser utilizado. Entender o <Link href="/como-comprar-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">processo de compra</Link> e a <Link href="/seguranca-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">segurança do empreendimento</Link> ajuda a planejar o uso do fundo com mais tranquilidade.
            </p>
            <p>
              Para um panorama completo sobre compra na planta no litoral catarinense, consulte o <Link href="/guia-imovel-na-planta-litoral-sc" className="text-purple-600 hover:text-purple-700 font-medium">guia de imóvel na planta no litoral SC</Link> e a página de <Link href="/perguntas-frequentes-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">perguntas frequentes</Link>.
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
            <Link href="/fluxo-pagamento-imovel-na-planta" className="block p-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 font-medium hover:bg-purple-50 transition-colors">Fluxo de pagamento</Link>
            <Link href="/como-comprar-imovel-na-planta" className="block p-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 font-medium hover:bg-purple-50 transition-colors">Como comprar</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

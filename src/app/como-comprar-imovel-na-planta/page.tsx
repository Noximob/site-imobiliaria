import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText } from 'lucide-react'

const baseUrl = 'https://noximobiliaria.com.br'

export const metadata: Metadata = {
  title: 'Como Comprar Imóvel na Planta - Passo a Passo | Nox',
  description: 'Aprenda como comprar imóvel na planta com segurança. Passo a passo, documentação e dicas para Penha, Piçarras e Barra Velha. Nox Imóveis.',
  keywords: 'como comprar imóvel na planta, comprar apartamento na planta, passo a passo',
  authors: [{ name: 'Nox Imóveis' }],
  openGraph: {
    title: 'Como Comprar Imóvel na Planta - Passo a Passo | Nox Imóveis',
    description: 'Aprenda como comprar imóvel na planta com segurança no litoral de SC.',
    type: 'website',
    locale: 'pt_BR',
    url: `${baseUrl}/como-comprar-imovel-na-planta/`,
    images: [{ url: `${baseUrl}/api/image?id=banner-home`, width: 1920, height: 1080, alt: 'Nox Imóveis' }],
  },
  twitter: { card: 'summary_large_image', title: 'Como Comprar Imóvel na Planta | Nox Imóveis', description: 'Passo a passo para comprar na planta.', images: [`${baseUrl}/api/image?id=banner-home`] },
  robots: { index: true, follow: true },
  alternates: { canonical: `${baseUrl}/como-comprar-imovel-na-planta/` },
}

export default function ComoComprarImovelNaPlantaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-purple-700 to-purple-900 text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-10 h-10 text-purple-200" />
            <span className="text-purple-200 text-sm font-medium uppercase tracking-wide">Guia Imóvel na Planta</span>
            <span className="text-purple-300">·</span>
            <span className="text-white/90 text-sm">Como comprar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight max-w-3xl">
            Como comprar imóvel na planta
          </h1>
          <p className="mt-4 text-purple-100 text-base sm:text-lg max-w-2xl">
            Passo a passo e cuidados para adquirir seu apartamento ou casa na planta no litoral catarinense.
          </p>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-6">
            <p>
              Comprar imóvel na planta exige planejamento e informação. O processo começa pela definição do objetivo: moradia futura, <Link href="/investir-imovel-na-planta-litoral" className="text-purple-600 hover:text-purple-700 font-medium">investimento</Link> ou segunda residência. Em seguida, é importante entender o <Link href="/fluxo-pagamento-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">fluxo de pagamento</Link> e as etapas até a entrega.
            </p>
            <p>
              Escolher um empreendimento com <Link href="/seguranca-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">segurança jurídica e construtiva</Link> é fundamental. Verifique o registro de incorporação, o patrimônio de afetação e o histórico da construtora. A imobiliária pode auxiliar na comparação entre projetos e na análise dos contratos.
            </p>
            <p>
              A documentação pessoal e a análise de crédito (para financiamento ou uso de <Link href="/usar-fgts-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">FGTS</Link>) devem ser organizadas com antecedência. Assim você negocia com mais tranquilidade e evita surpresas na reta final.
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
            <Link href="/seguranca-imovel-na-planta" className="block p-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 font-medium hover:bg-purple-50 transition-colors">Segurança</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

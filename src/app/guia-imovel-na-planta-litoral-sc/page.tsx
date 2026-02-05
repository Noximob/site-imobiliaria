import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, FileText, Shield, CreditCard, MapPin } from 'lucide-react'

const baseUrl = 'https://noximobiliaria.com.br'

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
  { href: '/como-comprar-imovel-na-planta', label: 'Como comprar imóvel na planta', icon: FileText },
  { href: '/fluxo-pagamento-imovel-na-planta', label: 'Fluxo de pagamento', icon: CreditCard },
  { href: '/usar-fgts-imovel-na-planta', label: 'Usar FGTS na compra', icon: CreditCard },
  { href: '/investir-imovel-na-planta-litoral', label: 'Investir em imóvel na planta', icon: BookOpen },
  { href: '/frente-mar-vs-quadra-mar', label: 'Frente mar x quadra mar', icon: MapPin },
  { href: '/seguranca-imovel-na-planta', label: 'Segurança na compra na planta', icon: Shield },
]

export default function GuiaImovelNaPlantaLitoralScPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-700 to-purple-900 text-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-10 h-10 text-purple-200" />
            <span className="text-purple-200 text-sm font-medium uppercase tracking-wide">Guia completo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight max-w-3xl">
            Imóvel na planta no litoral de Santa Catarina
          </h1>
          <p className="mt-4 text-purple-100 text-base sm:text-lg max-w-2xl">
            Tudo o que você precisa saber para comprar com segurança em Penha, Balneário Piçarras e Barra Velha.
          </p>
        </div>
      </section>

      {/* Conteúdo principal */}
      <section className="py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Comprar <strong>imóvel na planta</strong> no litoral catarinense é uma opção cada vez mais buscada por quem deseja segunda residência, investimento ou planejamento de mudança. Em regiões como <Link href="/imoveis?cidade=penha" className="text-purple-600 hover:text-purple-700 font-medium">Penha</Link>, <Link href="/imoveis?cidade=balneario-picarras" className="text-purple-600 hover:text-purple-700 font-medium">Balneário Piçarras</Link> e <Link href="/imoveis?cidade=barra-velha" className="text-purple-600 hover:text-purple-700 font-medium">Barra Velha</Link>, os lançamentos oferecem condições de entrada e parcelamento que facilitam o acesso ao imóvel dos sonhos.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Entender <Link href="/como-comprar-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">como comprar imóvel na planta</Link> é o primeiro passo: desde a escolha do empreendimento até a entrega das chaves. A <strong>segurança</strong> da operação depende de verificar o registro do empreendimento e o histórico da construtora — abordamos isso em detalhes no guia de <Link href="/seguranca-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">segurança ao comprar na planta</Link>.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              O <Link href="/fluxo-pagamento-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">fluxo de pagamento</Link> costuma incluir entrada, parcelas durante a obra e a possibilidade de financiar o saldo na entrega. Muitos compradores também utilizam o <Link href="/usar-fgts-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">FGTS</Link> na etapa de financiamento ou na entrada, dentro das regras legais. Para quem pensa em <Link href="/investir-imovel-na-planta-litoral" className="text-purple-600 hover:text-purple-700 font-medium">investir em imóvel na planta no litoral</Link>, a análise do projeto, localização e demanda da região é fundamental.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              A decisão entre <Link href="/frente-mar-vs-quadra-mar" className="text-purple-600 hover:text-purple-700 font-medium">frente mar e quadra mar</Link> influencia valor e uso do imóvel. Cada perfil tem suas vantagens; o importante é alinhar a escolha ao seu objetivo. Se ainda tiver dúvidas, consulte nossas <Link href="/perguntas-frequentes-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium">perguntas frequentes sobre imóvel na planta</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Cards para satélites + FAQ */}
      <section className="py-10 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Tópicos do guia</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LINKS_SATELITES.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-colors"
              >
                <Icon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="font-medium text-gray-800">{label}</span>
              </Link>
            ))}
            <Link
              href="/perguntas-frequentes-imovel-na-planta"
              className="flex items-start gap-3 p-4 rounded-lg bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <span className="font-medium text-purple-900">Perguntas frequentes</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Relacionados */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Relacionados</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/imoveis?status=lancamento" className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors text-sm">
              Ver lançamentos
            </Link>
            <Link href="/como-comprar" className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-purple-50 hover:border-purple-200 transition-colors text-sm">
              Como comprar um imóvel
            </Link>
            <Link href="/encontre-meu-imovel" className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-purple-50 hover:border-purple-200 transition-colors text-sm">
              Encontre meu imóvel
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

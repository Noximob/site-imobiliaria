import type { Metadata } from 'next'
import Link from 'next/link'
import { HelpCircle, ChevronDown } from 'lucide-react'

const baseUrl = 'https://noximobiliaria.com.br'

const FAQ_ITEMS = [
  {
    pergunta: 'O que é comprar um imóvel na planta?',
    resposta: 'Comprar um imóvel na planta significa adquirir a unidade antes da conclusão da obra, diretamente da construtora ou com intermediação imobiliária. O principal benefício é entrar no projeto em fase inicial, normalmente com melhor condição de preço e pagamento parcelado durante a construção. No litoral de Santa Catarina, muitos compradores utilizam esse modelo tanto para moradia futura quanto para investimento e segunda residência.',
  },
  {
    pergunta: 'Imóvel na planta é seguro?',
    resposta: 'Sim, desde que o empreendimento tenha registro de incorporação e siga as exigências legais. Um ponto importante é o patrimônio de afetação, que separa financeiramente a obra do restante da empresa. Também é essencial avaliar o histórico de entregas da construtora, padrão construtivo e transparência contratual. Com análise correta, é uma modalidade amplamente utilizada e segura.',
  },
  {
    pergunta: 'Como funciona o pagamento de um apartamento na planta?',
    resposta: 'Normalmente o pagamento é dividido em entrada, parcelas mensais durante a obra e reforços intermediários. Na entrega das chaves, o saldo pode ser quitado com recursos próprios ou financiamento bancário. Esse modelo permite distribuir o investimento ao longo do tempo e é bastante comum nos lançamentos imobiliários do litoral.',
  },
  {
    pergunta: 'Posso financiar somente na entrega do imóvel?',
    resposta: 'Sim. Em muitos empreendimentos o comprador paga parte durante a obra direto à construtora e deixa o saldo final para financiamento bancário na entrega. Isso reduz o desembolso inicial e permite organizar melhor o planejamento financeiro até a conclusão do projeto.',
  },
  {
    pergunta: 'Posso usar FGTS para comprar imóvel na planta?',
    resposta: 'Em muitos casos é possível usar o FGTS na etapa de financiamento ou na composição de entrada, desde que o comprador atenda às regras legais. É necessário não possuir outro imóvel na mesma cidade e cumprir requisitos de tempo de trabalho. Cada situação deve ser analisada individualmente.',
  },
  {
    pergunta: 'Vale a pena investir em imóvel na planta?',
    resposta: 'Depende do projeto, localização e condição de entrada. Muitos investidores buscam imóveis na planta porque entram em fase inicial e acompanham a valorização até a entrega. No litoral catarinense, a demanda por moradia e veraneio ajuda a sustentar interesse, mas toda decisão deve considerar perfil e prazo.',
  },
  {
    pergunta: 'Imóvel frente mar valoriza mais que quadra mar?',
    resposta: 'Imóveis frente mar costumam ter maior escassez e procura, o que favorece valorização ao longo do tempo. Porém, projetos quadra mar com boa vista, padrão construtivo e localização estratégica também podem performar muito bem. A análise deve considerar conjunto do empreendimento.',
  },
  {
    pergunta: 'Posso revender antes da entrega?',
    resposta: 'Na maioria dos contratos é possível fazer cessão de direitos, ou seja, transferir o contrato para outro comprador antes da entrega. As regras variam por construtora e precisam estar previstas em contrato.',
  },
  {
    pergunta: 'Comprar com imobiliária é mais caro que direto com a construtora?',
    resposta: 'Não. O valor normalmente é o mesmo. A imobiliária é remunerada pela construtora. O diferencial é a assessoria, comparação entre projetos e apoio técnico na escolha e negociação.',
  },
  {
    pergunta: 'Quais custos existem além do valor do imóvel?',
    resposta: 'Além do valor da unidade, existem custos como ITBI, escritura e registro. Se houver financiamento, podem existir taxas bancárias. Esses valores variam conforme município e modalidade de compra.',
  },
  {
    pergunta: 'O que é patrimônio de afetação?',
    resposta: 'É um mecanismo legal que separa os recursos financeiros da obra do restante da empresa. Isso protege o andamento da construção e dá mais segurança aos compradores.',
  },
  {
    pergunta: 'Imóvel na planta é melhor para morar ou investir?',
    resposta: 'Pode servir para ambos. Para morar, permite planejar a mudança futura. Para investir, possibilita entrada antecipada em bons projetos. A escolha depende do objetivo do comprador.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.pergunta,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.resposta,
    },
  })),
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
              <span className="text-purple-200 text-sm font-medium uppercase tracking-wide">Guia Imóvel na Planta</span>
              <span className="text-purple-300">·</span>
              <span className="text-white/90 text-sm">Perguntas e respostas</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight max-w-3xl">
              Perguntas frequentes sobre imóvel na planta
            </h1>
            <p className="mt-4 text-purple-100 text-base sm:text-lg max-w-2xl">
              Respostas objetivas para as principais dúvidas sobre compra de imóvel na planta no litoral de Santa Catarina.
            </p>
          </div>
        </section>

        {/* FAQ em acordeão */}
        <section className="py-10 sm:py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, index) => (
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
        <section className="py-10 bg-white border-t border-gray-200">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-600 mb-4">Este conteúdo faz parte do <strong>Guia Imóvel na Planta</strong>.</p>
            <Link
              href="/guia-imovel-na-planta-litoral-sc"
              className="inline-block px-6 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
            >
              Ver índice completo do guia
            </Link>
            <p className="mt-6 text-sm text-gray-500 mb-2">Outros temas:</p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              <Link href="/como-comprar-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium text-sm">Como comprar</Link>
              <Link href="/seguranca-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium text-sm">Segurança</Link>
              <Link href="/fluxo-pagamento-imovel-na-planta" className="text-purple-600 hover:text-purple-700 font-medium text-sm">Pagamento</Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

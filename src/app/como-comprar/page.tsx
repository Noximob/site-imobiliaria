import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Users, FileText, Home, Shield, CreditCard, Calculator, Phone, Mail, MapPin, Building, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Como Comprar um Imóvel - Guia Completo | Nox Imóveis',
  description: 'Aprenda como comprar um imóvel com segurança e tranquilidade. Guia completo com todos os passos, documentação necessária e dicas importantes.',
  keywords: 'como comprar imóvel, financiamento imobiliário, compra de casa, compra de apartamento, documentação imóvel, CRECI',
  authors: [{ name: 'Nox Imóveis' }],
  openGraph: {
    title: 'Como Comprar um Imóvel - Guia Completo | Nox Imóveis',
    description: 'Aprenda como comprar um imóvel com segurança e tranquilidade. Guia completo com todos os passos, documentação necessária e dicas importantes.',
    type: 'website',
    locale: 'pt_BR',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ComoComprarPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative text-white py-8 min-h-[350px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <div className="text-center text-white/20">
              <div className="text-6xl font-bold">FOTO DE FUNDO</div>
              <div className="text-lg mt-2">Aqui ficará a imagem que você escolher</div>
            </div>
          </div>
          {/* Overlay para melhorar legibilidade do texto */}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between">
            {/* Lado Esquerdo - Texto e Botão */}
            <div className="text-white w-1/2">
              <div className="space-y-4">
                <div className="text-3xl md:text-4xl font-bold leading-tight">
                  <div>A experiência de</div>
                  <div>quem entende o</div>
                  <div>mercado ao seu lado!</div>
                </div>
                
                <div className="flex justify-start">
                  <Link 
                    href="/sobre" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center text-base"
                  >
                    Ver as vantagens
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Lado Direito - Pessoas (placeholder para depois escolher a foto) */}
            <div className="w-1/2 flex justify-end">
              <div className="grid grid-cols-3 gap-3">
                {/* Pessoa 1 */}
                <div className="text-center">
                  <div className="relative mb-3">
                    <div className="w-24 h-32 bg-white/20 backdrop-blur-sm rounded-lg mx-auto flex items-center justify-center border border-white/30">
                      <Users className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h4 className="text-white font-semibold text-xs">Especialista em</h4>
                  <p className="text-white/80 text-xs">Vendas</p>
                </div>
                
                {/* Pessoa 2 */}
                <div className="text-center">
                  <div className="relative mb-3">
                    <div className="w-24 h-32 bg-white/20 backdrop-blur-sm rounded-lg mx-auto flex items-center justify-center border border-white/30">
                      <Building className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h4 className="text-white font-semibold text-xs">Consultor em</h4>
                  <p className="text-white/80 text-xs">Investimentos</p>
                </div>
                
                {/* Pessoa 3 */}
                <div className="text-center">
                  <div className="relative mb-3">
                    <div className="w-24 h-32 bg-white/20 backdrop-blur-sm rounded-lg mx-auto flex items-center justify-center border border-white/30">
                      <Award className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h4 className="text-white font-semibold text-xs">Especialista em</h4>
                  <p className="text-white/80 text-xs">Financiamentos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Como é Comprar */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between">
            {/* Lado Esquerdo - Título e Botão */}
            <div className="w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
                <div>Como é comprar</div>
                <div>com a Nox?</div>
              </h2>
              
              <div className="mt-6">
                <Link 
                  href="/imoveis" 
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center text-base"
                >
                  Buscar imóveis
                </Link>
              </div>
            </div>
            
            {/* Lado Direito - 4 Passos Horizontais */}
            <div className="w-1/2 flex justify-end">
              <div className="grid grid-cols-4 gap-4">
                {/* Passo 1 */}
                <div>
                  <div className="text-3xl font-bold text-gray-300 mb-2">01.</div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    Busque o imóvel ideal em nosso site
                  </h3>
                  <p className="text-xs text-gray-600">
                    Utilize nossos filtros para otimizar seus resultados
                  </p>
                </div>
                
                {/* Passo 2 */}
                <div>
                  <div className="text-3xl font-bold text-gray-300 mb-2">02.</div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    Entre em contato e agende suas visitas
                  </h3>
                  <p className="text-xs text-gray-600">
                    Aproveite para tirar todas as suas dúvidas com o corretor
                  </p>
                </div>
                
                {/* Passo 3 */}
                <div>
                  <div className="text-3xl font-bold text-gray-300 mb-2">03.</div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    Faça suas propostas
                  </h3>
                  <p className="text-xs text-gray-600">
                    Nossos especialistas ajudam você com a negociação e documentação
                  </p>
                </div>
                
                {/* Passo 4 */}
                <div>
                  <div className="text-3xl font-bold text-gray-300 mb-2">04.</div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    Assine digitalmente e receba as chaves
                  </h3>
                  <p className="text-xs text-gray-600">
                    Todo o processo digital para maior comodidade
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Como Funciona */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Como Funciona
            </h2>
            <p className="text-lg text-gray-600">
              Processo simples e transparente em 4 etapas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Etapa 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Escolha o Imóvel</h3>
              <p className="text-gray-600">
                Navegue pelos nossos imóveis e encontre aquele que mais se adequa ao seu perfil e necessidades.
              </p>
            </div>

            {/* Etapa 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Agende uma Visita</h3>
              <p className="text-gray-600">
                Entre em contato conosco para agendar uma visita ao imóvel escolhido.
              </p>
            </div>

            {/* Etapa 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Documentação</h3>
              <p className="text-gray-600">
                Nossa equipe te auxilia com toda a documentação necessária para a compra.
              </p>
            </div>

            {/* Etapa 4 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Finalização</h3>
              <p className="text-gray-600">
                Assinatura do contrato e entrega das chaves do seu novo imóvel!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Documentação Necessária */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Documentação Necessária
            </h2>
            <p className="text-lg text-gray-600">
              Lista completa dos documentos que você precisa ter em mãos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Documentos Pessoais */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Documentos Pessoais</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">RG e CPF (cópias autenticadas)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Comprovante de renda (últimos 3 meses)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Comprovante de residência</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Certidão de estado civil</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">PIS/PASEP (se aplicável)</span>
                </li>
              </ul>
            </div>

            {/* Documentos Financeiros */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Documentos Financeiros</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Extrato bancário (últimos 3 meses)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Declaração de IR (últimos 2 anos)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Comprovante de bens (se aplicável)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Certidão negativa de débitos</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <span className="text-gray-700">Comprovante de emprego/atividade</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Financiamento */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Financiamento Imobiliário
            </h2>
            <p className="text-lg text-gray-600">
              Conheça as principais opções de financiamento disponíveis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Minha Casa Minha Vida */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Minha Casa Minha Vida</h3>
              <p className="text-gray-600 mb-6">
                Programa do governo federal com juros reduzidos e subsídios para famílias de baixa renda.
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700">Juros de 4,5% a.a.</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700">Até 120 meses para pagar</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700">Subsídio até R$ 45.000</span>
                </li>
              </ul>
            </div>

            {/* Financiamento Bancário */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Financiamento Bancário</h3>
              <p className="text-gray-600 mb-6">
                Financiamento tradicional através de bancos com taxas competitivas do mercado.
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700">Taxas a partir de 8,5% a.a.</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700">Até 420 meses para pagar</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700">Entrada mínima de 20%</span>
                </li>
              </ul>
            </div>

            {/* Consórcio */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Consórcio</h3>
              <p className="text-gray-600 mb-6">
                Alternativa sem juros através de grupos de consórcio imobiliário.
              </p>
              <ul className="text-left space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700">Sem juros</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700">Prazo flexível</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700">Pode contemplar antes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Cálculo de Financiamento */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Simule seu Financiamento
            </h2>
            <p className="text-lg text-gray-600">
              Calcule o valor da sua parcela e veja qual opção se adequa melhor ao seu orçamento
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Formulário de Simulação */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Dados para Simulação</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor do Imóvel (R$)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 350.000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor da Entrada (R$)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 70.000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prazo (meses)
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option value="">Selecione o prazo</option>
                      <option value="120">120 meses</option>
                      <option value="180">180 meses</option>
                      <option value="240">240 meses</option>
                      <option value="300">300 meses</option>
                      <option value="360">360 meses</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    <Calculator className="w-5 h-5 inline mr-2" />
                    Calcular Parcela
                  </button>
                </form>
              </div>

              {/* Resultado da Simulação */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Resultado</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600">Valor Financiado</div>
                    <div className="text-2xl font-bold text-purple-600">R$ 280.000</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600">Parcela Mensal</div>
                    <div className="text-2xl font-bold text-green-600">R$ 2.450</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600">Total a Pagar</div>
                    <div className="text-2xl font-bold text-gray-900">R$ 441.000</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  * Valores aproximados. Consulte condições reais com nossa equipe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Por que Escolher a Nox */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Por que Escolher a Nox Imóveis?
            </h2>
            <p className="text-lg text-gray-600">
              Nossa experiência e compromisso fazem a diferença na sua compra
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Experiência */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Segurança</h3>
              <p className="text-gray-600">
                Transações seguras e transparentes com toda a documentação em dia.
              </p>
            </div>

            {/* Experiência */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Experiência</h3>
              <p className="text-gray-600">
                Mais de 10 anos no mercado imobiliário da região.
              </p>
            </div>

            {/* Acompanhamento */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Acompanhamento</h3>
              <p className="text-gray-600">
                Suporte completo em todas as etapas da compra.
              </p>
            </div>

            {/* Localização */}
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Localização</h3>
              <p className="text-gray-600">
                Conhecemos cada detalhe das cidades onde atuamos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção CTA Final */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Realizar o Sonho da Casa Própria?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            Nossa equipe especializada está pronta para te ajudar em cada etapa do processo. 
            Entre em contato e vamos começar essa jornada juntos!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/5547997530113"
              className="bg-white text-purple-600 hover:bg-purple-50 font-bold py-4 px-8 rounded-lg transition-colors inline-flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              Falar no WhatsApp
            </a>
            <a
              href="tel:+5547997530113"
              className="bg-purple-800 text-white hover:bg-purple-700 font-bold py-4 px-8 rounded-lg transition-colors inline-flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              Ligar Agora
            </a>
          </div>
          <div className="mt-8">
            <p className="text-purple-200">
              CRECI/SC 9839-J | Jordelina Florzina Flores, 154 - Gravatá de Penha - SC
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

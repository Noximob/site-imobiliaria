import { Metadata } from 'next'
import { Users, Award, Target, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre Nós - Imobiliária',
  description: 'Conheça nossa história, missão e valores. A melhor imobiliária da região com mais de 15 anos de experiência.',
  openGraph: {
    title: 'Sobre Nós - Imobiliária',
    description: 'Conheça nossa história, missão e valores. A melhor imobiliária da região com mais de 15 anos de experiência.',
    type: 'website',
  },
}

export default function SobrePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sobre Nossa Imobiliária
            </h1>
            <p className="text-xl md:text-2xl text-primary-100">
              Mais de 15 anos conectando pessoas aos seus sonhos
            </p>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Nossa História
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Fundada em 2008, nossa imobiliária nasceu com o sonho de revolucionar 
                o mercado imobiliário da região. Começamos como uma pequena empresa 
                familiar e hoje somos referência em qualidade e confiança.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Ao longo dos anos, desenvolvemos uma metodologia única que combina 
                tecnologia de ponta com o atendimento humanizado que nossos clientes 
                merecem. Cada imóvel é tratado com carinho e cada cliente é único.
              </p>
              <p className="text-lg text-gray-600">
                Hoje, orgulhamo-nos de ter facilitado mais de 1.000 negociações 
                imobiliárias, sempre priorizando a satisfação e o sucesso de nossos clientes.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                <span className="text-gray-500">Imagem da equipe</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossos Valores
            </h2>
            <p className="text-xl text-gray-600">
              Os princípios que guiam nosso trabalho diário
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Paixão</h3>
              <p className="text-gray-600">
                Amamos o que fazemos e isso se reflete em cada atendimento e negociação.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Excelência</h3>
              <p className="text-gray-600">
                Buscamos sempre a melhor solução para nossos clientes, sem comprometer a qualidade.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Confiança</h3>
              <p className="text-gray-600">
                Construímos relacionamentos duradouros baseados na transparência e honestidade.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Inovação</h3>
              <p className="text-gray-600">
                Estamos sempre em busca de novas tecnologias e métodos para melhorar nosso serviço.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nossa Equipe
            </h2>
            <p className="text-xl text-gray-600">
              Profissionais qualificados e apaixonados pelo que fazem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">Foto</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">João Silva</h3>
              <p className="text-primary-600 font-medium mb-2">Diretor Geral</p>
              <p className="text-gray-600">
                Mais de 20 anos de experiência no mercado imobiliário.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">Foto</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Maria Santos</h3>
              <p className="text-primary-600 font-medium mb-2">Gerente de Vendas</p>
              <p className="text-gray-600">
                Especialista em negociações e atendimento ao cliente.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">Foto</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pedro Costa</h3>
              <p className="text-primary-600 font-medium mb-2">Corretor Sênior</p>
              <p className="text-gray-600">
                Especialista em imóveis de alto padrão e frente mar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Conhecer Nossos Serviços?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Entre em contato conosco e descubra como podemos te ajudar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contato"
              className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Fale Conosco
            </a>
            <a
              href="/imoveis"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Ver Imóveis
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

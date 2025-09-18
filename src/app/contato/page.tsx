'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contato - Imobiliária',
  description: 'Entre em contato conosco. Estamos prontos para te ajudar a encontrar o imóvel ideal.',
  openGraph: {
    title: 'Contato - Imobiliária',
    description: 'Entre em contato conosco. Estamos prontos para te ajudar a encontrar o imóvel ideal.',
    type: 'website',
  },
}

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você pode integrar com Netlify Forms ou Firebase
    console.log('Formulário enviado:', formData)
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      assunto: '',
      mensagem: ''
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Entre em Contato
            </h1>
            <p className="text-xl md:text-2xl text-primary-100">
              Estamos prontos para te ajudar a encontrar o imóvel ideal
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulário de Contato */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Envie sua Mensagem
            </h2>
            <p className="text-gray-600 mb-8">
              Preencha o formulário abaixo e nossa equipe entrará em contato em breve.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    className="input"
                    placeholder="(47) 99999-9999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assunto
                  </label>
                  <select
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="venda">Quero vender meu imóvel</option>
                    <option value="compra">Quero comprar um imóvel</option>
                    <option value="aluguel">Quero alugar um imóvel</option>
                    <option value="locacao">Quero locar meu imóvel</option>
                    <option value="duvidas">Dúvidas gerais</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem *
                </label>
                <textarea
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="input"
                  placeholder="Conte-nos como podemos te ajudar..."
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Mensagem</span>
              </button>
            </form>
          </div>

          {/* Informações de Contato */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Informações de Contato
            </h2>
            <p className="text-gray-600 mb-8">
              Você também pode nos contatar através dos canais abaixo:
            </p>

            <div className="space-y-6">
              {/* Telefone */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Telefone
                  </h3>
                  <p className="text-gray-600 mb-2">(47) 99999-9999</p>
                  <p className="text-sm text-gray-500">
                    Segunda a Sexta: 8h às 18h
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Email
                  </h3>
                  <p className="text-gray-600 mb-2">contato@imobiliaria.com</p>
                  <p className="text-sm text-gray-500">
                    Respondemos em até 24h
                  </p>
                </div>
              </div>

              {/* Endereço */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Endereço
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Rua das Flores, 123 - Centro<br />
                    Balneário Camboriú - SC<br />
                    CEP: 88330-000
                  </p>
                </div>
              </div>

              {/* Horário de Funcionamento */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Horário de Funcionamento
                  </h3>
                  <div className="text-gray-600 space-y-1">
                    <p>Segunda a Sexta: 8h às 18h</p>
                    <p>Sábado: 8h às 12h</p>
                    <p>Domingo: Fechado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="mt-8 p-6 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <MessageCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  WhatsApp
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Para atendimento mais rápido, fale conosco pelo WhatsApp:
              </p>
              <a
                href="https://wa.me/5547999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Falar no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

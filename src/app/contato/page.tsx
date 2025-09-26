'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    departamento: '',
    contatoWhatsApp: true,
    contatoTelefone: false,
    mensagem: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Formulário enviado:', formData)
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')
    setFormData({
      nome: '',
      telefone: '',
      email: '',
      departamento: '',
      contatoWhatsApp: true,
      contatoTelefone: false,
      mensagem: ''
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Lado Esquerdo - Informações de Contato */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Fale com a nossa <span className="text-blue-600">equipe</span>
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Preencha o formulário ou entre em contato por um de nossos canais de atendimento.
              </p>
              
              {/* Botão WhatsApp */}
              <a
                href="https://wa.me/5547997530113"
                className="inline-flex items-center bg-green-400 hover:bg-green-500 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Receber atendimento
              </a>
            </div>

            {/* Telefones */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">(47) 99699-3030</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 font-medium">(47) 3367-0990</span>
              </div>
            </div>
          </div>

          {/* Lado Direito - Formulário */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>

              {/* DDD + Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DDD + Telefone
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(47) 99999-9999"
                />
              </div>

              {/* E-mail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              {/* Departamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecionar um departamento
                </label>
                <select
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione um departamento</option>
                  <option value="vendas">Vendas</option>
                  <option value="locacao">Locação</option>
                  <option value="administrativo">Administrativo</option>
                  <option value="suporte">Suporte</option>
                </select>
              </div>

              {/* Preferência de Contato */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Desejo receber contato por:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="contatoWhatsApp"
                      checked={formData.contatoWhatsApp}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">WhatsApp</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="contatoTelefone"
                      checked={formData.contatoTelefone}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Telefone</span>
                  </label>
                </div>
              </div>

              {/* Mensagem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem
                </label>
                <textarea
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Como podemos lhe ajudar?"
                />
              </div>

              {/* Botão Enviar */}
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg transition-colors"
              >
                Enviar mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

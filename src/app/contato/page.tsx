'use client'

import { useState } from 'react'
import { Phone } from 'lucide-react'
import Image from 'next/image'
import { getImageUrl } from '@/lib/github-images'
import { getText } from '@/lib/site-texts'
import { getWhatsAppLink } from '@/lib/whatsapp'
import { trackWhatsAppClick, trackFormSubmit } from '@/lib/analytics'

const contatoImage = getImageUrl('contato')

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

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/formularios/contato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        trackFormSubmit('contato')
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
      } else {
        alert('Erro ao enviar mensagem. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
      alert('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={contatoImage}
          alt="Contato Nox Imóveis" 
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-transparent"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lado Esquerdo - Informações de Contato */}
          <div className="flex flex-col justify-center items-center text-center space-y-6 py-8">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {getText('contato.hero.titulo')}
              </h1>
              <p className="text-white/90 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
                {getText('contato.hero.subtitulo')}
              </p>
            </div>
            
            {/* Botão WhatsApp */}
            <div className="pt-4">
              <a
                href="https://wa.me/5547997530113"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick('contato')}
                className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 text-lg shadow-2xl hover:shadow-green-500/25 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Receber atendimento
              </a>
            </div>

            {/* Telefone */}
            <a 
              href={getWhatsAppLink('(47) 99753-0113')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsAppClick('contato_telefone')}
              className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 hover:bg-white/20 transition-colors"
            >
              <Phone className="w-5 h-5 text-purple-300" />
              <span className="text-white font-semibold text-lg">(47) 99753-0113</span>
            </a>
          </div>

          {/* Lado Direito - Formulário */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Nome */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Seu nome completo"
                />
              </div>

              {/* DDD + Telefone */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  DDD + Telefone
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="(47) 99999-9999"
                />
              </div>

              {/* E-mail */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="seu@email.com"
                />
              </div>

              {/* Departamento */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Selecionar um departamento
                </label>
                <select
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Desejo receber contato por:
                </label>
                <div className="space-y-1">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="contatoWhatsApp"
                      checked={formData.contatoWhatsApp}
                      onChange={handleChange}
                      className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-xs text-gray-700">WhatsApp</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="contatoTelefone"
                      checked={formData.contatoTelefone}
                      onChange={handleChange}
                      className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-xs text-gray-700">Telefone</span>
                  </label>
                </div>
              </div>

              {/* Mensagem */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Como podemos lhe ajudar?"
                />
              </div>

              {/* Botão Enviar */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

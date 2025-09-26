'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Send, Upload, X } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TrabalheConoscoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    instagram: '',
    loja: '',
    vaga: '',
    informacoes: ''
  })

  const [arquivos, setArquivos] = useState<File[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setArquivos(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setArquivos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Dados do formulário:', formData)
    console.log('Arquivos:', arquivos)
    alert('Currículo enviado com sucesso! Entraremos em contato em breve.')
    
    // Reset do formulário
    setFormData({
      nome: '',
      telefone: '',
      email: '',
      instagram: '',
      loja: '',
      vaga: '',
      informacoes: ''
    })
    setArquivos([])
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Primeira Tela - Hero Section */}
      <div className="relative bg-blue-900 min-h-screen">
        <div className="h-screen flex">
          {/* Lado Esquerdo - Texto */}
          <div className="flex-1 flex items-center justify-center bg-blue-900">
            <div className="text-white max-w-lg px-8">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Venha para o nosso time!
              </h1>
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8">
                Faça parte da imobiliária que mais cresce em Santa Catarina!
              </p>
              <button
                onClick={() => document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Enviar currículo
              </button>
            </div>
          </div>

          {/* Lado Direito - Imagem */}
          <div className="flex-1 flex items-center justify-center bg-gray-200">
            <div className="text-center text-gray-500 p-8">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium">Foto da equipe</p>
              <p className="text-xs text-gray-400">4 pessoas sorrindo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda Tela - Formulário */}
      <div id="formulario" className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Lado Esquerdo - Texto */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-600">
                Venha para a Nox Imóveis
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Está buscando uma oportunidade de trabalho no mercado imobiliário? Envie seu CV e, assim que surgir uma oportunidade, entraremos em contato com você.
              </p>
            </div>

            {/* Lado Direito - Formulário */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome:
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Seu nome completo"
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    DDD + Celular / WhatsApp:
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(47) 99999-9999"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    @instagram:
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="@seuusuario"
                  />
                </div>

                {/* Loja de interesse */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loja de interesse:
                  </label>
                  <select
                    name="loja"
                    value={formData.loja}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione uma loja</option>
                    <option value="penha">Penha</option>
                    <option value="picarras">Balneário Piçarras</option>
                    <option value="barra-velha">Barra Velha</option>
                  </select>
                </div>

                {/* Vaga */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vaga:
                  </label>
                  <input
                    type="text"
                    name="vaga"
                    value={formData.vaga}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Cargo de interesse"
                  />
                </div>

                {/* Maiores informações */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maiores informações:
                  </label>
                  <textarea
                    name="informacoes"
                    value={formData.informacoes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Conte-nos mais sobre você..."
                  />
                </div>

                {/* Upload de arquivos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anexar arquivos:
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Arraste e solte seus arquivos aqui ou clique/toque para selecionar.
                      </p>
                    </label>
                  </div>
                  
                  {/* Dica */}
                  <p className="text-xs text-gray-500 mt-2">
                    <strong>Dica:</strong> Segure a tecla CTRL na janela de seleção para enviar múltiplos arquivos. (Máx. 15 arquivos de até 10mb cada)
                  </p>

                  {/* Lista de arquivos */}
                  {arquivos.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {arquivos.map((arquivo, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-700">{arquivo.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botões */}
                <div className="flex space-x-4">
                  {arquivos.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setArquivos([])}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                    >
                      REMOVER ANEXOS
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    ENVIAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

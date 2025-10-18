'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { getImageUrl } from '@/lib/github-images'

const trabalheImage = getImageUrl('trabalhe-conosco')

export default function TrabalheConoscoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    instagram: '',
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
      informacoes: ''
    })
    setArquivos([])
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Primeira Tela - Hero Section */}
      <div className="relative h-screen">
        <div className="h-full flex">
          {/* Lado Esquerdo - Texto */}
          <div className="flex-1 flex items-center justify-center bg-purple-900">
            <div className="text-white max-w-lg px-8">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Venha para o nosso time!
              </h1>
              <p className="text-lg md:text-xl text-purple-100 leading-relaxed mb-8">
                Faça parte da imobiliária que mais cresce em Santa Catarina!
              </p>
              <button
                onClick={() => document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
              >
                Enviar currículo
              </button>
            </div>
          </div>

          {/* Lado Direito - Imagem da Equipe */}
          <div className="flex-1 relative">
            <Image
              src={trabalheImage}
              alt="Equipe Nox Imóveis"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white bg-black/50 px-4 py-2 rounded-lg">
              <p className="text-sm font-medium">Foto da equipe</p>
              <p className="text-xs text-white/80">4 pessoas sorrindo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Valores */}
      <div className="bg-gray-800 py-8 -mt-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cultura de Aprendizado */}
            <div className="text-center text-white">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Cultura de aprendizado</h3>
              <p className="text-gray-200 leading-relaxed text-xs">
                Procuramos inspiração e aprendizado em todos os lugares e instantes.
              </p>
            </div>

            {/* Desenvolvimento Constante */}
            <div className="text-center text-white">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Desenvolvimento Constante</h3>
              <p className="text-gray-200 leading-relaxed text-xs">
                Focamos no desenvolvimento de cada colaborador. Queremos que você evolua.
              </p>
            </div>

            {/* Time Unido */}
            <div className="text-center text-white">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Time unido</h3>
              <p className="text-gray-200 leading-relaxed text-xs">
                Juntos, nos empenhamos para oferecer o melhor serviço para a nossa comunidade.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda Tela - Formulário */}
      <div id="formulario" className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Lado Esquerdo - Texto */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-purple-600">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="@seuusuario"
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
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
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
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    ENVIAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

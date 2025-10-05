'use client'

import { useState } from 'react'
import { ArrowLeft, FileText, Save, Edit3 } from 'lucide-react'
import Link from 'next/link'

export default function AdminTextos() {
  const [textos, setTextos] = useState({
    home: {
      titulo: 'Encontre o Imóvel dos Seus Sonhos',
      subtitulo: 'A melhor seleção de imóveis em Balneário Camboriú e região',
      descricao: 'Somos especialistas em imóveis de alto padrão, oferecendo as melhores opções para venda e locação na região.'
    },
    sobre: {
      titulo: 'Sobre a Nox Imóveis',
      descricao: 'Com mais de 10 anos de experiência no mercado imobiliário, a Nox Imóveis se consolidou como referência em qualidade e atendimento personalizado.',
      missao: 'Nossa missão é conectar pessoas aos seus sonhos, oferecendo imóveis que transformam vidas.',
      visao: 'Ser a imobiliária mais confiável e inovadora da região.'
    },
    contato: {
      titulo: 'Entre em Contato',
      subtitulo: 'Estamos aqui para ajudar você a encontrar o imóvel perfeito',
      telefone: '(47) 99999-9999',
      email: 'contato@noximoveis.com.br',
      endereco: 'Rua das Palmeiras, 123 - Centro, Balneário Camboriú - SC'
    }
  })

  const [activeSection, setActiveSection] = useState('home')
  const [isEditing, setIsEditing] = useState(false)

  const sections = [
    { id: 'home', name: 'Página Inicial', icon: '🏠' },
    { id: 'sobre', name: 'Sobre Nós', icon: 'ℹ️' },
    { id: 'contato', name: 'Contato', icon: '📞' }
  ]

  const handleSave = () => {
    // Aqui você salvaria no Firebase ou banco de dados
    console.log('Salvando textos:', textos)
    setIsEditing(false)
    // Simular salvamento
    alert('Textos salvos com sucesso!')
  }

  const handleChange = (section: string, field: string, value: string) => {
    setTextos(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link 
                href="/administrador"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <FileText className="w-8 h-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Gerenciar Textos
              </h1>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Seções
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {sections.find(s => s.id === activeSection)?.name}
              </h2>

              {activeSection === 'home' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título Principal
                    </label>
                    <input
                      type="text"
                      value={textos.home.titulo}
                      onChange={(e) => handleChange('home', 'titulo', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtítulo
                    </label>
                    <input
                      type="text"
                      value={textos.home.subtitulo}
                      onChange={(e) => handleChange('home', 'subtitulo', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={textos.home.descricao}
                      onChange={(e) => handleChange('home', 'descricao', e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              )}

              {activeSection === 'sobre' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={textos.sobre.titulo}
                      onChange={(e) => handleChange('sobre', 'titulo', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <textarea
                      value={textos.sobre.descricao}
                      onChange={(e) => handleChange('sobre', 'descricao', e.target.value)}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Missão
                    </label>
                    <textarea
                      value={textos.sobre.missao}
                      onChange={(e) => handleChange('sobre', 'missao', e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visão
                    </label>
                    <textarea
                      value={textos.sobre.visao}
                      onChange={(e) => handleChange('sobre', 'visao', e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              )}

              {activeSection === 'contato' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título
                    </label>
                    <input
                      type="text"
                      value={textos.contato.titulo}
                      onChange={(e) => handleChange('contato', 'titulo', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtítulo
                    </label>
                    <input
                      type="text"
                      value={textos.contato.subtitulo}
                      onChange={(e) => handleChange('contato', 'subtitulo', e.target.value)}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone
                      </label>
                      <input
                        type="text"
                        value={textos.contato.telefone}
                        onChange={(e) => handleChange('contato', 'telefone', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={textos.contato.email}
                        onChange={(e) => handleChange('contato', 'email', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço
                    </label>
                    <textarea
                      value={textos.contato.endereco}
                      onChange={(e) => handleChange('contato', 'endereco', e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

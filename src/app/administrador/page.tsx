'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, Key, Home, Image, FileText, Building, BookOpen, Users, MessageSquare, ClipboardList } from 'lucide-react'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  // Carregar credenciais salvas ao montar o componente
  React.useEffect(() => {
    const savedUsername = localStorage.getItem('admin_username')
    const savedPassword = localStorage.getItem('admin_password')
    const savedRemember = localStorage.getItem('admin_remember')
    
    if (savedRemember === 'true' && savedUsername && savedPassword) {
      setUsername(savedUsername)
      setPassword(savedPassword)
      setRememberMe(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (username === 'admin' && password === 'NoxAdmin2024!') {
      setIsLoggedIn(true)
      setError('')
      
      // Salvar credenciais se "Lembrar" estiver marcado
      if (rememberMe) {
        localStorage.setItem('admin_username', username)
        localStorage.setItem('admin_password', password)
        localStorage.setItem('admin_remember', 'true')
      } else {
        localStorage.removeItem('admin_username')
        localStorage.removeItem('admin_password')
        localStorage.removeItem('admin_remember')
      }
    } else {
      setError('Usuário ou senha incorretos')
    }
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Home className="w-8 h-8 text-primary-600 mr-3" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Administrador - Nox Imóveis
                </h1>
              </div>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Painel Administrativo
            </h2>
            <p className="text-gray-600">
              Gerencie o conteúdo do seu site imobiliário
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div 
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push('/administrador/imagens')}
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Image className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Imagens</h3>
                  <p className="text-sm text-gray-500">Gerenciar fotos e banners</p>
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push('/administrador/textos')}
            >
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Textos</h3>
                  <p className="text-sm text-gray-500">Editar textos do site</p>
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push('/administrador/imoveis')}
            >
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Imóveis</h3>
                  <p className="text-sm text-gray-500">Gerenciar propriedades</p>
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push('/administrador/blog')}
            >
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Blog</h3>
                  <p className="text-sm text-gray-500">Gerenciar artigos</p>
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push('/administrador/corretores')}
            >
              <div className="flex items-center">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Corretores</h3>
                  <p className="text-sm text-gray-500">Gerenciar equipe</p>
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push('/administrador/depoimentos')}
            >
              <div className="flex items-center">
                <div className="p-3 bg-pink-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-pink-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Depoimentos</h3>
                  <p className="text-sm text-gray-500">Gerenciar avaliações</p>
                </div>
              </div>
            </div>

            <div 
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push('/administrador/formularios')}
            >
              <div className="flex items-center">
                <div className="p-3 bg-teal-100 rounded-lg">
                  <ClipboardList className="w-6 h-6 text-teal-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Formulários</h3>
                  <p className="text-sm text-gray-500">Ver submissões</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Resumo Rápido
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-500">Imóveis Cadastrados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-500">Artigos Publicados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-gray-500">Imagens Uploaded</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-primary-100 rounded-full">
            <Lock className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Acesso Administrativo
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Nox Imóveis - Painel de Controle
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Usuário
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Lembrar login
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

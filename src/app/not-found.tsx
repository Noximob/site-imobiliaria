import type { Metadata } from 'next'
import Link from 'next/link'
import { Home, Building2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Página não encontrada | Nox Imóveis',
  description: 'O endereço que você acessou não existe ou foi alterado.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <p className="text-6xl font-light text-purple-600 mb-2">404</p>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Página não encontrada
        </h1>
        {/* H2 estrutural explicando o contexto do erro */}
        <h2 className="text-lg font-medium text-gray-700 mb-2">
          O endereço pode ter sido removido, alterado ou digitado incorretamente.
        </h2>
        <p className="text-gray-600 mb-8">
          O endereço que você acessou não existe ou foi alterado. Use os links abaixo para voltar ao site.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Página inicial
          </Link>
          <Link
            href="/imoveis/"
            className="inline-flex items-center justify-center gap-2 border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors"
          >
            <Building2 className="w-5 h-5" />
            Ver imóveis
          </Link>
        </div>
      </div>
    </div>
  )
}

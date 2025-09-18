import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getImovelBySlug, getAllImoveis } from '@/lib/imoveis'
import { formatPrice } from '@/lib/imoveis'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Ruler, 
  Phone, 
  MessageCircle, 
  Share2,
  ArrowLeft,
  Star,
  Home,
  Building,
  TreePine,
  Store
} from 'lucide-react'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  // Para sites estáticos, retornamos array vazio
  // As páginas serão geradas dinamicamente quando necessário
  return []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const imovel = await getImovelBySlug(params.slug)
    
    if (!imovel) {
      return {
        title: 'Imóvel não encontrado',
        description: 'O imóvel solicitado não foi encontrado.',
      }
    }

    const tipoLabels = {
      casa: 'Casa',
      apartamento: 'Apartamento',
      terreno: 'Terreno',
      comercial: 'Comercial'
    }

    const statusLabels = {
      venda: 'Venda',
      aluguel: 'Aluguel',
      'venda-aluguel': 'Venda e Aluguel'
    }

    const title = `${tipoLabels[imovel.tipo]} para ${statusLabels[imovel.status]} - ${imovel.titulo}`
    const description = `${imovel.descricao.substring(0, 160)}... ${formatPrice(imovel.preco)} - ${imovel.endereco.bairro}, ${imovel.endereco.cidade}`

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        images: imovel.fotos.length > 0 ? [imovel.fotos[0]] : [],
      },
      alternates: {
        canonical: `/imoveis/${imovel.slug}`,
      },
    }
  } catch (error) {
    return {
      title: 'Imóvel não encontrado',
      description: 'O imóvel solicitado não foi encontrado.',
    }
  }
}

export default async function ImovelDetalhePage({ params }: PageProps) {
  try {
    const imovel = await getImovelBySlug(params.slug)

    if (!imovel) {
      notFound()
    }

  const tipoIcons = {
    casa: Home,
    apartamento: Building,
    terreno: TreePine,
    comercial: Store
  }

  const TipoIcon = tipoIcons[imovel.tipo]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            href="/imoveis" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Imóveis
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2">
            {/* Galeria de Fotos */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative h-96">
                <Image
                  src={imovel.fotos[0] || '/placeholder-imovel.jpg'}
                  alt={imovel.titulo}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    imovel.status === 'venda' 
                      ? 'bg-green-100 text-green-800' 
                      : imovel.status === 'aluguel'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {imovel.status === 'venda' ? 'Venda' : 
                     imovel.status === 'aluguel' ? 'Aluguel' : 'Venda/Aluguel'}
                  </span>
                </div>
                {imovel.caracteristicas.frenteMar && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Frente Mar
                    </span>
                  </div>
                )}
              </div>
              
              {/* Miniaturas */}
              {imovel.fotos.length > 1 && (
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-2">
                    {imovel.fotos.slice(1, 5).map((foto, index) => (
                      <div key={index} className="relative h-20 rounded-lg overflow-hidden">
                        <Image
                          src={foto}
                          alt={`${imovel.titulo} - Foto ${index + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Informações do Imóvel */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {imovel.titulo}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>
                      {imovel.endereco.rua}, {imovel.endereco.numero} - {imovel.endereco.bairro}, {imovel.endereco.cidade}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <TipoIcon className="w-4 h-4 mr-1" />
                    <span className="capitalize">{imovel.tipo}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    {formatPrice(imovel.preco)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {imovel.status === 'venda' ? 'Valor de venda' : 
                     imovel.status === 'aluguel' ? 'Valor do aluguel' : 'Valor'}
                  </div>
                </div>
              </div>

              {/* Características */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Bed className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">{imovel.caracteristicas.quartos}</div>
                  <div className="text-sm text-gray-600">Quartos</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Bath className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">{imovel.caracteristicas.banheiros}</div>
                  <div className="text-sm text-gray-600">Banheiros</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Car className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">{imovel.caracteristicas.vagas}</div>
                  <div className="text-sm text-gray-600">Vagas</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Ruler className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">{imovel.caracteristicas.area}m²</div>
                  <div className="text-sm text-gray-600">Área</div>
                </div>
              </div>

              {/* Características Especiais */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Características</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {imovel.caracteristicas.frenteMar && (
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Frente Mar
                    </div>
                  )}
                  {imovel.caracteristicas.piscina && (
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Piscina
                    </div>
                  )}
                  {imovel.caracteristicas.churrasqueira && (
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Churrasqueira
                    </div>
                  )}
                  {imovel.caracteristicas.academia && (
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Academia
                    </div>
                  )}
                  {imovel.caracteristicas.portaria && (
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Portaria 24h
                    </div>
                  )}
                  {imovel.caracteristicas.elevador && (
                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      Elevador
                    </div>
                  )}
                </div>
              </div>

              {/* Descrição */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
                <p className="text-gray-700 leading-relaxed">
                  {imovel.descricao}
                </p>
              </div>
            </div>

            {/* Mapa */}
            {imovel.coordenadas && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Localização</h3>
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Mapa interativo será implementado aqui</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Card de Contato */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interessado?</h3>
              <p className="text-gray-600 mb-4">
                Entre em contato com nosso corretor para mais informações.
              </p>
              
              <div className="space-y-3">
                <a
                  href={`https://wa.me/55${imovel.contato.whatsapp.replace(/\D/g, '')}?text=Olá! Tenho interesse no imóvel: ${imovel.titulo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
                
                {imovel.contato.telefone && (
                  <a
                    href={`tel:${imovel.contato.telefone}`}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Ligar</span>
                  </a>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary-600 font-bold text-lg">
                      {imovel.contato.corretor.charAt(0)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900">{imovel.contato.corretor}</h4>
                  <p className="text-sm text-gray-600">Corretor de Imóveis</p>
                  <div className="flex items-center justify-center mt-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">4.8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compartilhar */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Compartilhar</h3>
              <div className="flex space-x-3">
                <button className="flex-1 btn-secondary flex items-center justify-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Compartilhar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  } catch (error) {
    notFound()
  }
}

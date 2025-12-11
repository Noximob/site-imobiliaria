'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getImovelBySlug, getAllImoveis, formatPrice } from '@/lib/imoveis'
import { getWhatsAppLink } from '@/lib/whatsapp'
import { 
  MapPin, 
  Key,
  Heart,
  Check,
  MessageCircle,
  BedDouble,
  Droplet,
  Car,
  Maximize2
} from 'lucide-react'

export default function ImovelDetalhePage() {
  const params = useParams()
  const slug = params.slug as string
  const [imovel, setImovel] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [contatoTipo, setContatoTipo] = useState<'telefone' | 'email' | 'whatsapp'>('email')
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: 'Olá, gostaria de receber mais informações sobre este imóvel. Aguardo contato, obrigado.'
  })

  useEffect(() => {
    const loadImovel = async () => {
      try {
        const imovelData = await getImovelBySlug(slug)
        if (!imovelData) {
          notFound()
          return
        }
        setImovel(imovelData)
        
      } catch (error) {
        console.error('Erro ao carregar imóvel:', error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }
    
    loadImovel()
  }, [slug])

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (contatoTipo === 'whatsapp') {
      const message = encodeURIComponent(`${formData.mensagem}\n\nNome: ${formData.nome}\nEmail: ${formData.email}\nTelefone: ${formData.telefone}`)
      window.open(getWhatsAppLink(imovel?.contato?.whatsapp || '', message), '_blank')
    } else if (contatoTipo === 'email') {
      const subject = encodeURIComponent(`Interesse no imóvel: ${imovel?.titulo}`)
      const body = encodeURIComponent(`${formData.mensagem}\n\nNome: ${formData.nome}\nEmail: ${formData.email}\nTelefone: ${formData.telefone}`)
      window.location.href = `mailto:${imovel?.contato?.email || ''}?subject=${subject}&body=${body}`
    } else if (contatoTipo === 'telefone') {
      window.location.href = `tel:${imovel?.contato?.telefone || imovel?.contato?.whatsapp || ''}`
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Carregando imóvel...</p>
        </div>
      </div>
    )
  }

  if (!imovel) {
    notFound()
    return null
  }

  const precoDesconto = imovel.precoOriginal && imovel.precoOriginal > imovel.preco
    ? imovel.precoOriginal - imovel.preco
    : 0

  // Organizar fotos: foto principal primeiro
  const todasFotos = imovel.fotos || []
  const fotoPrincipalIndex = (imovel as any).fotoPrincipalIndex ?? 0
  
  // Se há foto principal definida e não está na primeira posição, reorganizar
  let fotosOrdenadas = [...todasFotos]
  if (fotoPrincipalIndex > 0 && fotoPrincipalIndex < fotosOrdenadas.length) {
    const fotoPrincipal = fotosOrdenadas[fotoPrincipalIndex]
    fotosOrdenadas.splice(fotoPrincipalIndex, 1)
    fotosOrdenadas.unshift(fotoPrincipal)
  }

  // Características vêm apenas das tags/comodidades (interligadas com o filtro)
  // Não incluir outras características booleanas, apenas as tags
  const caracteristicasList: string[] = []

  const infraestruturaList = imovel.infraestrutura || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        {/* Informações do Imóvel - ACIMA da Galeria - Textos elegantes e menores */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Coluna Esquerda - Título, Endereço, Código */}
            <div className="flex-1">
              {/* Título Principal - Elegante e menor */}
              <h1 className="text-xl md:text-2xl font-light text-gray-900 mb-2 tracking-tight">
                {imovel.titulo}
              </h1>
              
              {/* Endereço - Texto fino e elegante */}
              <div className="flex items-center text-gray-500 mb-1.5">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                <span className="text-xs font-light">
                  {imovel.endereco.rua}, {imovel.endereco.numero}, {imovel.endereco.bairro} - {imovel.endereco.cidade}/{imovel.endereco.estado}
                </span>
              </div>
              
              {/* Código - Texto fino */}
              <div className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-purple-600" />
                <span className="font-light text-gray-700 text-xs">CÓDIGO: {imovel.id}</span>
              </div>
            </div>
            
            {/* Coluna Direita - Preço e Botão Favorito */}
            <div className="flex flex-col items-end gap-2">
              {/* Preço - Elegante */}
              <div className="text-right">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl md:text-2xl font-light text-red-600 tracking-tight">
                    {formatPrice(imovel.preco)}
                  </span>
                </div>
              </div>
              
              {/* Botão Favorito - Elegante */}
              <button className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                <Heart className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-600 font-light">Favorito</span>
              </button>
            </div>
          </div>
        </div>

        {/* Galeria de Fotos - Layout: 1 foto grande à esquerda, 4 fotos menores à direita (2x2) */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-3">
          {fotosOrdenadas.length > 0 ? (
            <div className="grid grid-cols-2 gap-1.5 p-1.5" style={{ height: '400px' }}>
              {/* Coluna Esquerda - Foto Principal (grande) */}
              <div className="relative rounded-lg overflow-hidden h-full">
                <Image
                  src={fotosOrdenadas[0]}
                  alt={`${imovel.titulo} - Foto principal`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              
              {/* Coluna Direita - Grid 2x2 com 4 fotos menores */}
              <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
                {/* Foto 2 - Superior esquerda */}
                {fotosOrdenadas[1] && (
                  <div className="relative rounded-lg overflow-hidden">
                    <Image
                      src={fotosOrdenadas[1]}
                      alt={`${imovel.titulo} - Foto 2`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                
                {/* Foto 3 - Superior direita */}
                {fotosOrdenadas[2] && (
                  <div className="relative rounded-lg overflow-hidden">
                    <Image
                      src={fotosOrdenadas[2]}
                      alt={`${imovel.titulo} - Foto 3`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                
                {/* Foto 4 - Inferior esquerda */}
                {fotosOrdenadas[3] && (
                  <div className="relative rounded-lg overflow-hidden">
                    <Image
                      src={fotosOrdenadas[3]}
                      alt={`${imovel.titulo} - Foto 4`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                
                {/* Foto 5 - Inferior direita com botão Visualizar Fotos */}
                {fotosOrdenadas[4] ? (
                  <Link href={`/imoveis/${imovel.slug}/fotos`} className="relative rounded-lg overflow-hidden group cursor-pointer">
                    <Image
                      src={fotosOrdenadas[4]}
                      alt={`${imovel.titulo} - Foto 5`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {/* Botão Visualizar Fotos - Canto inferior direito */}
                    <div className="absolute bottom-2 right-2">
                      <div className="bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 shadow-lg">
                        <span>Visualizar Fotos</span>
                        {fotosOrdenadas.length > 5 && (
                          <span className="text-xs text-gray-600">({fotosOrdenadas.length})</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ) : fotosOrdenadas.length > 0 && fotosOrdenadas.length < 5 ? (
                  // Se tiver menos de 5 fotos mas mais de 0, mostrar botão na última foto disponível
                  <Link href={`/imoveis/${imovel.slug}/fotos`} className="relative rounded-lg overflow-hidden group cursor-pointer">
                    <Image
                      src={fotosOrdenadas[fotosOrdenadas.length - 1]}
                      alt={`${imovel.titulo} - Última foto`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute bottom-2 right-2">
                      <div className="bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-lg">
                        <span>Visualizar Fotos</span>
                      </div>
                    </div>
                  </Link>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Sem imagens</span>
            </div>
          )}
        </div>

        {/* Características do Imóvel - Abaixo das Fotos */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            {/* Código */}
            <div className="flex items-center gap-2 text-gray-700">
              <Key className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
              <span className="font-light">{imovel.id.slice(-5).padStart(5, '0')} Código</span>
            </div>
            
            {/* Quartos */}
            {imovel.caracteristicas.quartos > 0 && (
              <div className="flex items-center gap-2 text-gray-700">
                <BedDouble className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                <span className="font-light">{imovel.caracteristicas.quartos} {imovel.caracteristicas.quartos === 1 ? 'Quarto' : 'Quartos'}</span>
              </div>
            )}
            
            {/* Banheiros */}
            {imovel.caracteristicas.banheiros > 0 && (
              <div className="flex items-center gap-2 text-gray-700">
                <Droplet className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                <span className="font-light">{imovel.caracteristicas.banheiros} {imovel.caracteristicas.banheiros === 1 ? 'Banheiro' : 'Banheiros'}</span>
              </div>
            )}
            
            {/* Vagas */}
            {imovel.caracteristicas.vagas > 0 && (
              <div className="flex items-center gap-2 text-gray-700">
                <Car className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                <span className="font-light">{imovel.caracteristicas.vagas} {imovel.caracteristicas.vagas === 1 ? 'Vaga' : 'Vagas'}</span>
              </div>
            )}
            
            {/* Área */}
            {imovel.caracteristicas.area > 0 && (
              <div className="flex items-center gap-2 text-gray-700">
                <Maximize2 className="w-5 h-5 text-purple-600" strokeWidth={2.5} />
                <span className="font-light">{imovel.caracteristicas.area} M² Privativos</span>
              </div>
            )}
            
          </div>
        </div>

        {/* Conteúdo Principal - Layout com Título, Características, Descrição à Esquerda e Formulário à Direita */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Título Completo */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                {(() => {
                  const tipoTexto = imovel.tipo === 'apartamento' ? 'Apartamento' : 
                                   imovel.tipo === 'cobertura' ? 'Cobertura diferenciado' : 
                                   imovel.tipo === 'comercial' ? 'Sala Comercial' : 'Imóvel'
                  const frenteMarTexto = imovel.caracteristicas.frenteMar ? 'Frente Mar' : ''
                  const cidadeTexto = `em ${imovel.endereco.cidade}`
                  const suiteTexto = imovel.caracteristicas.suite ? `com ${imovel.caracteristicas.suite} ${imovel.caracteristicas.suite === 1 ? 'suíte' : 'suítes'}` : ''
                  const quartosTexto = imovel.caracteristicas.quartos ? `${imovel.caracteristicas.quartos} ${imovel.caracteristicas.quartos === 1 ? 'quarto' : 'quartos'}` : ''
                  
                  return `${tipoTexto} ${frenteMarTexto} ${cidadeTexto} ${suiteTexto ? suiteTexto : quartosTexto}`.replace(/\s+/g, ' ').trim()
                })()}
              </h1>
            </div>

            {/* Descrição */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {imovel.descricao}
              </p>
            </div>

            {/* Características - Apenas tags/comodidades (interligadas com o filtro) */}
            {imovel.tags && imovel.tags.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Características</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {imovel.tags.map((tag: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Infraestrutura */}
            {infraestruturaList.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Infraestrutura</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {infraestruturaList.map((item: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Localização - Mapa */}
            {imovel.coordenadas && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Localização</h2>
                <div className="mb-3">
                  <p className="text-gray-700">
                    {imovel.endereco.rua}, {imovel.endereco.numero}, {imovel.endereco.bairro} - {imovel.endereco.cidade}/{imovel.endereco.estado}
                  </p>
                </div>
                <div className="relative h-96 rounded-lg overflow-hidden bg-gray-200">
                  <iframe
                    src={`https://maps.google.com/maps?q=${imovel.coordenadas.lat},${imovel.coordenadas.lng}&hl=pt-BR&z=15&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Coluna Direita - Formulário de Contato */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-white text-lg font-semibold mb-4">RECEBER CONTATO POR:</h3>
              
              {/* Opções de Contato */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setContatoTipo('telefone')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    contatoTipo === 'telefone'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Telefone
                </button>
                <button
                  onClick={() => setContatoTipo('email')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    contatoTipo === 'email'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Email
                </button>
                <button
                  onClick={() => setContatoTipo('whatsapp')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    contatoTipo === 'whatsapp'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  WhatsApp
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-4">
                <textarea
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg p-3 text-sm resize-none"
                  rows={4}
                  required
                />

                <input
                  type="text"
                  placeholder="Nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg p-3 text-sm"
                  required
                />

                <input
                  type="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg p-3 text-sm"
                  required
                />

                <input
                  type="tel"
                  placeholder="Celular / WhatsApp"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full bg-gray-800 text-white rounded-lg p-3 text-sm"
                  required
                />

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  ENVIAR
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">OU</span>
                  </div>
                </div>

                <a
                  href={getWhatsAppLink(imovel.contato?.whatsapp || '', `Olá, gostaria de receber mais informações sobre este imóvel: ${imovel.titulo}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Fale pelo WhatsApp
                </a>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}





'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getImovelBySlug, getAllImoveis, formatPrice } from '@/lib/imoveis'
import { getWhatsAppLink } from '@/lib/whatsapp'
import { 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Ruler,
  Key,
  Eye,
  Heart,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  Check,
  Phone,
  MessageCircle,
  ArrowLeft,
  Flame
} from 'lucide-react'

export default function ImovelDetalhePage() {
  const params = useParams()
  const slug = params.slug as string
  const [imovel, setImovel] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [contatoTipo, setContatoTipo] = useState<'telefone' | 'email' | 'whatsapp'>('email')
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: 'Olá, gostaria de receber mais informações sobre este imóvel. Aguardo contato, obrigado.'
  })
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    const loadImovel = async () => {
      try {
        const imovelData = await getImovelBySlug(slug)
        if (!imovelData) {
          notFound()
          return
        }
        setImovel(imovelData)
        
        // Incrementar visualizações (opcional - pode ser feito via API)
        if (imovelData.visualizacoes !== undefined) {
          // Aqui você pode fazer uma chamada à API para incrementar
        }
      } catch (error) {
        console.error('Erro ao carregar imóvel:', error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }
    
    loadImovel()
  }, [slug])

  const handleShare = async (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const title = imovel?.titulo || ''
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`, '_blank')
        break
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
        break
      case 'copy':
        navigator.clipboard.writeText(url)
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
        break
    }
  }

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

  const todasFotos = imovel.fotos || []
  const fotoPrincipal = todasFotos[selectedImageIndex] || todasFotos[0] || ''
  // Thumbnails: as 4 fotos seguintes, excluindo a foto principal atual
  const fotosParaThumbnails = todasFotos.filter((_: string, index: number) => index !== selectedImageIndex).slice(0, 4)

  // Características extras (combinando booleanas e array de extras)
  const caracteristicasList = [
    ...(imovel.caracteristicas?.extras || []),
    imovel.caracteristicas?.frenteMar && 'Vista para o Mar',
    imovel.caracteristicas?.varanda && 'Varanda',
    imovel.caracteristicas?.sacada && 'Sacada',
    imovel.caracteristicas?.piscina && 'Piscina',
    imovel.caracteristicas?.churrasqueira && 'Churrasqueira',
    imovel.caracteristicas?.academia && 'Academia',
    imovel.caracteristicas?.portaria && 'Portaria 24h',
    imovel.caracteristicas?.elevador && 'Elevador',
  ].filter(Boolean) as string[]

  const infraestruturaList = imovel.infraestrutura || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/imoveis" 
            className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Imóveis
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Informações do Imóvel - ACIMA da Galeria - Igual ao site de referência */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Coluna Esquerda - Título, Subtítulo, Endereço, Código */}
            <div className="flex-1">
              {/* Título Principal */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {imovel.titulo}
              </h1>
              
              {/* Subtítulo (Nome do Edifício) - Extraído do título */}
              {(() => {
                const edMatch = imovel.titulo.match(/Ed\.\s*([^,em]+)/i);
                const edificioMatch = imovel.titulo.match(/Edifício\s+([^,em]+)/i);
                const residenciaMatch = imovel.titulo.match(/([A-Z][A-Z\s]+(?:RESIDENCE|APARTAMENTO|CONDOMINIO|VILLAGE|TOWER|SUITE|CLUB|PARK|GARDEN|LIFE|HOME|PLACE|HOUSE))/);
                
                const subtitulo = edMatch?.[1]?.trim() || 
                                edificioMatch?.[1]?.trim() || 
                                residenciaMatch?.[1]?.trim() || 
                                null;
                
                return subtitulo ? (
                  <h2 className="text-lg font-semibold text-gray-700 mb-3 uppercase">
                    {subtitulo}
                  </h2>
                ) : null;
              })()}
              
              {/* Endereço */}
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                <span>
                  {imovel.endereco.rua}, {imovel.endereco.numero}, {imovel.endereco.bairro} - {imovel.endereco.cidade}/{imovel.endereco.estado}
                </span>
              </div>
              
              {/* Código */}
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-orange-500" />
                <span className="font-medium text-gray-900">CÓDIGO: {imovel.id}</span>
              </div>
            </div>
            
            {/* Coluna Direita - Preço e Botão Favorito */}
            <div className="flex flex-col items-end gap-4">
              {/* Preço */}
              <div className="text-right">
                {precoDesconto > 0 && (
                  <div className="mb-2">
                    <span className="text-green-600 font-semibold text-sm">
                      Economize {formatPrice(precoDesconto)}
                    </span>
                  </div>
                )}
                <div className="flex flex-col items-end gap-1">
                  {precoDesconto > 0 && (
                    <span className="text-lg text-gray-400 line-through">
                      {imovel.status === 'venda' ? 'VENDA' : imovel.status === 'aluguel' ? 'ALUGUEL' : 'VENDA/ALUGUEL'}. DE {formatPrice(imovel.precoOriginal || 0)}
                    </span>
                  )}
                  <div className="flex items-baseline gap-2">
                    {!precoDesconto && (
                      <span className="text-sm text-gray-600 font-medium">
                        {imovel.status === 'venda' ? 'VENDA' : imovel.status === 'aluguel' ? 'ALUGUEL' : 'VENDA/ALUGUEL'}.
                      </span>
                    )}
                    {precoDesconto > 0 && (
                      <span className="text-sm text-gray-600 font-medium">POR:</span>
                    )}
                    <span className="text-3xl font-bold text-red-600">
                      {formatPrice(imovel.preco)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Botão Favorito */}
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700 font-medium">Favorito</span>
              </button>
            </div>
          </div>
        </div>

        {/* Banner de Muito Visualizado */}
        {imovel.visualizacoes && imovel.visualizacoes > 1000 && (
          <div className="bg-red-500 text-white rounded-lg p-3 mb-6 flex items-center gap-2">
            <Flame className="w-5 h-5" />
            <span className="font-medium">Muito visualizado! Já foram {imovel.visualizacoes} acessos.</span>
          </div>
        )}

        {/* Galeria de Fotos - Logo abaixo das informações */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="relative flex gap-2">
            {/* Foto Principal - Lado Esquerdo (Grande) */}
            <div className="flex-1 relative h-[600px]">
              {fotoPrincipal ? (
                <Image
                  src={fotoPrincipal}
                  alt={imovel.titulo}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Sem imagem</span>
                </div>
              )}
            </div>

            {/* Grid de 4 Fotos - Lado Direito */}
            {fotosParaThumbnails.length > 0 && (
              <div className="w-64 grid grid-cols-2 gap-2">
                {fotosParaThumbnails.map((foto: string, index: number) => {
                  // Encontrar o índice original da foto no array todasFotos
                  const fotoIndex = todasFotos.findIndex((f: string) => f === foto)
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(fotoIndex)}
                      className="relative h-[294px] rounded-lg overflow-hidden hover:opacity-90 transition-opacity border-2 border-transparent hover:border-purple-500"
                    >
                      <Image
                        src={foto}
                        alt={`${imovel.titulo} - Foto ${index + 2}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Formulário de Contato - Abaixo da Galeria */}
        <div className="bg-gray-900 rounded-lg shadow-lg p-6 mb-6">
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

        {/* Conteúdo Principal - Abaixo do Formulário */}
        <div className="space-y-6">

            {/* Descrição */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Descrição</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {imovel.descricao}
              </p>
            </div>

            {/* Características */}
            {caracteristicasList.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Características</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {caracteristicasList.map((caracteristica: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span>{caracteristica}</span>
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
      </div>
    </div>
  )
}





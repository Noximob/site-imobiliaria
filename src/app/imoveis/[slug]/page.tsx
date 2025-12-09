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

  const fotosPrincipais = imovel.fotos?.slice(0, 5) || []
  const fotoPrincipal = fotosPrincipais[selectedImageIndex] || fotosPrincipais[0]
  const fotosGrid = fotosPrincipais.slice(1, 5)

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
        {/* Barra de Informações do Imóvel */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-orange-500" />
              <span className="font-medium text-gray-900">Código:</span>
              <span className="text-gray-600">{imovel.id}</span>
            </div>
            {imovel.caracteristicas?.quartos > 0 && (
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-orange-500" />
                <span className="text-gray-600">{imovel.caracteristicas.quartos} {imovel.caracteristicas.quartos === 1 ? 'Quarto' : 'Quartos'}</span>
              </div>
            )}
            {imovel.caracteristicas?.suite && imovel.caracteristicas.suite > 0 && (
              <div className="flex items-center gap-2">
                <Bed className="w-4 h-4 text-orange-500" />
                <span className="text-gray-600">{imovel.caracteristicas.suite} {imovel.caracteristicas.suite === 1 ? 'Suíte' : 'Suítes'}</span>
              </div>
            )}
            {imovel.caracteristicas?.banheiros > 0 && (
              <div className="flex items-center gap-2">
                <Bath className="w-4 h-4 text-orange-500" />
                <span className="text-gray-600">{imovel.caracteristicas.banheiros} {imovel.caracteristicas.banheiros === 1 ? 'Banheiro' : 'Banheiros'}</span>
              </div>
            )}
            {imovel.caracteristicas?.vagas > 0 && (
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-orange-500" />
                <span className="text-gray-600">{imovel.caracteristicas.vagas} {imovel.caracteristicas.vagas === 1 ? 'Vaga' : 'Vagas'}</span>
              </div>
            )}
            {imovel.caracteristicas?.area > 0 && (
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-orange-500" />
                <span className="text-gray-600">{imovel.caracteristicas.area} m² Privativos</span>
              </div>
            )}
            {imovel.visualizacoes !== undefined && (
              <div className="flex items-center gap-2 ml-auto">
                <Eye className="w-4 h-4 text-orange-500" />
                <span className="text-gray-600">{imovel.visualizacoes} Visualizações</span>
              </div>
            )}
          </div>
        </div>

        {/* Banner de Muito Visualizado */}
        {imovel.visualizacoes && imovel.visualizacoes > 1000 && (
          <div className="bg-red-500 text-white rounded-lg p-3 mb-6 flex items-center gap-2">
            <Flame className="w-5 h-5" />
            <span className="font-medium">Muito visualizado! Já foram {imovel.visualizacoes} acessos.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galeria de Fotos */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative flex gap-2">
                {/* Foto Principal - Lado Esquerdo */}
                <div className="flex-1 relative h-[500px]">
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
                  
                  {/* Botão Favorito */}
                  <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors shadow-lg">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Grid de Fotos - Lado Direito */}
                {fotosGrid.length > 0 && (
                  <div className="w-64 grid grid-cols-2 gap-2">
                    {fotosGrid.map((foto: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index + 1)}
                        className="relative h-[244px] rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                      >
                        <Image
                          src={foto}
                          alt={`${imovel.titulo} - Foto ${index + 2}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Título e Preço */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {imovel.titulo}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>
                      {imovel.endereco.rua}, {imovel.endereco.numero}, {imovel.endereco.bairro} - {imovel.endereco.cidade}/{imovel.endereco.estado}
                    </span>
                  </div>
                  
                  {/* Tags */}
                  {imovel.tags && imovel.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {imovel.tags.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Preço */}
              <div className="border-t border-gray-200 pt-4">
                {precoDesconto > 0 && (
                  <div className="mb-2">
                    <span className="text-green-600 font-semibold">
                      Economize {formatPrice(precoDesconto)}
                    </span>
                  </div>
                )}
                <div className="flex items-baseline gap-3">
                  {precoDesconto > 0 && (
                    <span className="text-xl text-gray-400 line-through">
                      {formatPrice(imovel.precoOriginal)}
                    </span>
                  )}
                  <div>
                    <span className="text-sm text-gray-600 font-medium">
                      {imovel.status === 'venda' ? 'VENDA' : imovel.status === 'aluguel' ? 'ALUGUEL' : 'VENDA/ALUGUEL'}. 
                      {precoDesconto > 0 ? ' DE' : ''}
                    </span>
                    {precoDesconto > 0 && (
                      <span className="text-sm text-gray-600 font-medium ml-1">POR:</span>
                    )}
                    <div className="text-3xl font-bold text-purple-600">
                      {formatPrice(imovel.preco)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                  {caracteristicasList.map((caracteristica, index) => (
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
                  {infraestruturaList.map((item, index) => (
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

          {/* Sidebar Direita */}
          <div className="lg:col-span-1 space-y-6">
            {/* Compartilhamento Social - Lateral Esquerda */}
            <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
              <div className="bg-white rounded-lg shadow-lg p-2 space-y-2">
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                  title="Compartilhar no Facebook"
                >
                  <Facebook className="w-5 h-5 text-blue-600" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                  title="Compartilhar no Twitter"
                >
                  <Twitter className="w-5 h-5 text-blue-400" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                  title="Compartilhar no LinkedIn"
                >
                  <Linkedin className="w-5 h-5 text-blue-700" />
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                  title="Compartilhar no WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 text-green-600" />
                </button>
                <button
                  onClick={() => handleShare('email')}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                  title="Compartilhar por Email"
                >
                  <Mail className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                  title="Copiar link"
                >
                  {linkCopied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Formulário de Contato */}
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 sticky top-6">
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





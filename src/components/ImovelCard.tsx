import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Bed, Bath, Car, Ruler, Star } from 'lucide-react'
import { Imovel } from '@/types'
import { formatPrice, getFotoPrincipal } from '@/lib/imoveis'

interface ImovelCardProps {
  imovel: Imovel
}

export default function ImovelCard({ imovel }: ImovelCardProps) {
  const primeiraFoto = getFotoPrincipal(imovel) || '/placeholder-imovel.jpg'
  
  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      <Link 
        href={`/imoveis/${imovel.slug}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-transparent" style={{ minHeight: '12rem' }}>
          <Image
            src={primeiraFoto}
            alt={imovel.titulo}
            fill
            className="object-contain hover:scale-105 transition-transform duration-300 bg-gray-100"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, 400px"
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              imovel.status === 'prontos' 
                ? 'bg-green-100 text-green-800' 
                : imovel.status === 'lancamento'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {imovel.status === 'prontos' ? 'Pronto' : 
               imovel.status === 'lancamento' ? 'Lançamento' : 'Em Construção'}
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
        
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {imovel.titulo}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {imovel.endereco.bairro}, {imovel.endereco.cidade}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-primary-600">
              {formatPrice(imovel.preco)}
            </span>
            <span className="text-sm text-gray-500 capitalize">
              {imovel.tipo}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-4">
              {Number(imovel.caracteristicas?.quartos) > 0 && (
                <div className="flex items-center">
                  <Bed className="w-4 h-4 mr-1" />
                  <span>{imovel.caracteristicas.quartos}</span>
                </div>
              )}
              {Number(imovel.caracteristicas?.banheiros) > 0 && (
                <div className="flex items-center">
                  <Bath className="w-4 h-4 mr-1" />
                  <span>{imovel.caracteristicas.banheiros}</span>
                </div>
              )}
              {Number(imovel.caracteristicas?.vagas) > 0 && (
                <div className="flex items-center">
                  <Car className="w-4 h-4 mr-1" />
                  <span>{imovel.caracteristicas.vagas}</span>
                </div>
              )}
            </div>
            {Number(imovel.caracteristicas?.area) > 0 && (
              <div className="flex items-center">
                <Ruler className="w-4 h-4 mr-1" />
                <span>{imovel.caracteristicas.area}m²</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="ml-1 text-sm text-gray-600">4.8</span>
            </div>
            <span className="text-sm text-gray-500">
              {imovel.contato.corretor}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

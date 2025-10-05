export interface Imovel {
  id: string;
  titulo: string;
  slug: string;
  descricao: string;
  preco: number;
  tipo: 'casa' | 'apartamento' | 'terreno' | 'comercial';
  status: 'venda' | 'aluguel' | 'venda-aluguel';
  endereco: {
    cidade: string;
    bairro: string;
    rua: string;
    numero: string;
    cep: string;
    estado: string;
  };
  caracteristicas: {
    quartos: number;
    banheiros: number;
    vagas: number;
    area: number;
    areaTerreno?: number;
    frenteMar: boolean;
    piscina: boolean;
    churrasqueira: boolean;
    academia: boolean;
    portaria: boolean;
    elevador: boolean;
    varanda: boolean;
    sacada: boolean;
  };
  fotos: string[];
  coordenadas?: {
    lat: number;
    lng: number;
  };
  contato: {
    whatsapp: string;
    telefone?: string;
    email?: string;
    corretor: string;
  };
  createdAt: Date;
  updatedAt: Date;
  publicado: boolean;
}

export interface FiltrosImovel {
  cidade?: string;
  bairro?: string;
  precoMin?: number;
  precoMax?: number;
  quartos?: number;
  banheiros?: number;
  vagas?: number;
  tipo?: string;
  status?: string;
  frenteMar?: boolean;
  piscina?: boolean;
  areaMin?: number;
  areaMax?: number;
}

export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
  imovelId?: string;
  origem: 'formulario' | 'whatsapp' | 'telefone';
  createdAt: Date;
  status: 'novo' | 'contatado' | 'convertido' | 'perdido';
}

export interface Artigo {
  id: string;
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: string;
  imagem: string;
  autor: string;
  categoria: string;
  tags: string[];
  publicado: boolean;
  dataPublicacao: Date;
  visualizacoes: number;
  createdAt: Date;
  updatedAt: Date;
}
# 🏠 Site Imobiliária

Um site moderno e responsivo para imobiliárias, construído com Next.js 14, TypeScript e Tailwind CSS, com integração completa ao Firebase Firestore.

## ✨ Funcionalidades

### 🏡 **Gestão de Imóveis**
- Listagem completa de imóveis com filtros avançados
- Página de detalhes com galeria de fotos
- Busca por cidade, bairro, preço, quartos, características especiais
- URLs amigáveis (SEO-friendly)

### 🔍 **SEO Otimizado**
- Meta tags dinâmicas para cada imóvel
- Sitemap.xml automático
- Robots.txt configurado
- Open Graph para redes sociais
- JSON-LD para rich snippets

### 📱 **Design Responsivo**
- Interface moderna e intuitiva
- Totalmente responsivo (mobile-first)
- Componentes reutilizáveis
- Animações suaves

### 🚀 **Deploy Automático**
- Configurado para Netlify
- Build otimizado para sites estáticos
- Deploy contínuo via GitHub

## 🛠️ Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Firebase Firestore** - Banco de dados
- **Lucide React** - Ícones
- **Netlify** - Hospedagem

## 🚀 Como Começar

### 1. **Clone o Repositório**
```bash
git clone <seu-repositorio>
cd site-imobiliaria
```

### 2. **Instale as Dependências**
```bash
npm install
```

### 3. **Configure o Firebase**
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Ative o Firestore Database
3. Copie o arquivo `env.example` para `.env.local`
4. Preencha as variáveis do Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
NEXT_PUBLIC_SITE_URL=https://seu-site.netlify.app
```

### 4. **Execute o Projeto**
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📊 Estrutura do Banco de Dados

### Coleção: `imoveis`
```typescript
{
  id: string
  titulo: string
  slug: string
  descricao: string
  preco: number
  tipo: 'casa' | 'apartamento' | 'terreno' | 'comercial'
  status: 'venda' | 'aluguel' | 'venda-aluguel'
  endereco: {
    cidade: string
    bairro: string
    rua: string
    numero: string
    cep: string
    estado: string
  }
  caracteristicas: {
    quartos: number
    banheiros: number
    vagas: number
    area: number
    areaTerreno?: number
    frenteMar: boolean
    piscina: boolean
    churrasqueira: boolean
    academia: boolean
    portaria: boolean
    elevador: boolean
    varanda: boolean
    sacada: boolean
  }
  fotos: string[]
  coordenadas?: {
    lat: number
    lng: number
  }
  contato: {
    whatsapp: string
    telefone?: string
    email?: string
    corretor: string
  }
  createdAt: Date
  updatedAt: Date
  publicado: boolean
}
```

## 🎨 Personalização

### **Cores**
Edite o arquivo `tailwind.config.ts` para personalizar as cores:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        100: '#dbeafe',
        500: '#3b82f6', // Cor principal
        600: '#2563eb',
        700: '#1d4ed8',
      }
    }
  }
}
```

### **Logo e Marca**
1. Substitua o logo no componente `Header.tsx`
2. Atualize as informações da empresa nos componentes
3. Modifique as cores conforme sua identidade visual

## 🚀 Deploy no Netlify

### **1. Conecte com GitHub**
1. Faça push do código para o GitHub
2. Conecte o repositório no Netlify
3. Configure as variáveis de ambiente no Netlify

### **2. Configurações do Build**
- **Build Command**: `npm run build`
- **Publish Directory**: `out`
- **Node Version**: `18`

### **3. Variáveis de Ambiente**
Adicione no Netlify:
```
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
NEXT_PUBLIC_SITE_URL=https://seu-site.netlify.app
GITHUB_TOKEN=seu_token_github
EMAIL_USER=imoveisnox@gmail.com
EMAIL_PASSWORD=seu_app_password_gmail
```

**Nota sobre Email:**
Para o envio de emails funcionar, você precisa criar uma "App Password" no Gmail:
1. Acesse sua conta Google
2. Vá em Segurança > Verificação em duas etapas (deve estar ativada)
3. Crie uma "Senha de app" para "Email"
4. Use essa senha na variável `EMAIL_PASSWORD`

## 📱 Páginas Incluídas

- **/** - Home com busca e imóveis em destaque
- **/imoveis** - Listagem com filtros avançados
- **/imoveis/[slug]** - Detalhes do imóvel
- **/sobre** - Página institucional
- **/contato** - Formulário de contato

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run start        # Servidor de produção
npm run lint         # Verificar código
npm run export       # Gerar site estático
```

## 📈 SEO e Performance

- ✅ Meta tags dinâmicas
- ✅ Sitemap.xml automático
- ✅ Robots.txt configurado
- ✅ Open Graph tags
- ✅ URLs amigáveis
- ✅ Imagens otimizadas
- ✅ Lazy loading
- ✅ Core Web Vitals otimizados

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a [documentação](https://nextjs.org/docs)
2. Abra uma [issue](https://github.com/seu-usuario/site-imobiliaria/issues)
3. Entre em contato: contato@imobiliaria.com

---

**Desenvolvido com ❤️ para imobiliárias modernas**

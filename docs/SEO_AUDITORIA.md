# Auditoria SEO – Nox Imóveis (análise técnica)

Análise feita com base no que **já está implementado** no código, excluindo o que você controla no admin (blog, textos, fotos).

---

## O que já está muito bem feito

- **Metadata**: `metadataBase`, títulos e descrições por página, Open Graph e Twitter em páginas principais.
- **Canonical**: Todas as páginas relevantes com `alternates.canonical` (home, imóveis, ficha, blog, fotos, estáticas).
- **Robots**: 404 e Favoritos com `noindex, follow`; resto indexável.
- **Sitemap**: `/sitemap.xml` com listagem, blog, imóveis (GitHub), imagens dos imóveis, changefreq e priority.
- **robots.txt**: Sitemap declarado, bloqueio de `/api/`, `/administrador/`, `/_next/`.
- **Estrutura de dados**:
  - Raiz: Organization (nome, url, logo).
  - Ficha do imóvel: RealEstateListing + BreadcrumbList.
  - Blog artigo: BlogPosting + BreadcrumbList.
  - FAQ: FAQPage (perguntas/respostas).
- **URLs**: `trailingSlash: true` em todo o site.
- **Performance**: Preload do banner da home para LCP; imagens com AVIF/WebP; lazy loading na galeria.
- **Verificação**: Google (meta tag) no layout raiz.

---

## Melhorias recomendadas (no código)

### 1. **Página de galeria `/imoveis/[slug]/fotos/` – noindex** ✅ (implementado)

- **Problema**: Mesmo imóvel em duas URLs (ficha + galeria) pode ser visto como conteúdo duplicado.
- **Solução**: `robots: { index: false, follow: true }` no layout de `/fotos/`. A ficha continua como URL canônica do imóvel; a galeria fica acessível e linkável, mas não compite no índice.

### 2. **Schema Organization (raiz) – enriquecer depois (opcional)**

- Hoje: nome, url, logo.
- Pode acrescentar (se tiver dados estáveis): `address` (PostalAddress), `telephone`, `areaServed` (Penha, Balneário Piçarras, Barra Velha) para reforçar resultado local. Dados podem vir de `site-texts` ou config.

### 3. **Blog – único H1 por página**

- Já está correto: o H1 “Artigo não encontrado” só aparece no estado de erro; na página normal há um único H1 (título do artigo).

### 4. **Sitemap**

- Não incluir URLs de `/fotos/` no sitemap (ou manter fora) quando a galeria for noindex, para não incentivar indexação. O sitemap atual já não lista /fotos/, está alinhado.

### 5. **Páginas estáticas (sobre, contato, anunciar, etc.)**

- Todas com canonical e metadata. Melhorar descrições e títulos é conteúdo/admin, não mudança de código.

### 6. **Imagens**

- Galeria e listagem já usam `alt` com título do imóvel. Manter esse padrão em qualquer nova imagem de imóvel.

---

## Resumo das ações no código

| Ação | Status |
|------|--------|
| noindex em `/imoveis/[slug]/fotos/` | Feito neste PR |
| Enriquecer Organization (telefone, endereço, área) | Opcional, quando houver fonte de dados |
| Revisar textos/descrições das páginas | Admin/conteúdo |

---

## O que não entra nesta auditoria (admin/conteúdo)

- Qualidade e volume dos textos (blog, descrições de imóveis).
- Peso e otimização das imagens (você já citou que pode melhorar).
- Estratégia de palavras-chave e conteúdo novo.

Com a aplicação do noindex na galeria, o risco de duplicação entre ficha e galeria fica resolvido no lado técnico.

---

## Carrossel mobile (detalhe do imóvel) – altura dinâmica e SEO

O carrossel de fotos no mobile passa a redimensionar conforme a proporção de cada foto (igual à ideia da listagem, mas dinâmico ao trocar de foto). **Impacto em SEO:** a mudança de altura gera um pequeno **layout shift** (CLS – Cumulative Layout Shift), um dos Core Web Vitals. Para reduzir isso foi colocada uma **transição de 0,3s** no `aspect-ratio`, e o shift só ocorre após ação do usuário (swipe/seta), não no carregamento inicial. Assim o impacto no SEO é **baixo**: o Google penaliza sobretudo shifts inesperados no load; aqui o movimento é esperado e suavizado. Se no futuro quiser priorizar CLS ao máximo, basta fixar de novo um único aspect-ratio (ex.: 4/3) no carrossel.

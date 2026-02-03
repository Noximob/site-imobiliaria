# Análise SEO – Nox Imóveis (para primeira página no Google)

**Data:** Janeiro 2025  
**Objetivo:** Listar o que já está bem feito e o que ainda falta para alinhar o site e disputar a primeira página do Google.

---

## 1. O que já está bem feito

### 1.1 Técnico / Infraestrutura
- **Canonical:** Todas as páginas públicas têm `alternates.canonical` com URL final (trailing slash).
- **Sitemap XML:** `/sitemap.xml` dinâmico com todas as URLs (home, imóveis, blog, páginas estáticas, filtros de cidade/tipo), `lastmod`, `changefreq`, `priority` e **imagens** nos imóveis (sitemap-image).
- **Robots:** `robots.ts` permite rastreamento, bloqueia `/api/`, `/administrador/`, `/_next/` e aponta o sitemap. (Observação: o `public/robots.txt` tem `Crawl-delay: 1`; o Google ignora isso, mas pode ser removido para evitar confusão se o Next servir o `robots.ts`.)
- **Trailing slash:** `next.config.mjs` com `trailingSlash: true` – URLs consistentes.
- **Verificação Google:** `metadata.verification.google` no layout raiz.
- **Ping do Sitemap:** API `/api/submit-sitemap` para notificar Google e Bing após mudanças.

### 1.2 Metadados e redes sociais
- **Title/Description:** Páginas com títulos e descrições únicos e relevantes.
- **Open Graph:** Todas as páginas importantes com `og:title`, `og:description`, `og:url`, `og:image` (banner via API).
- **Twitter Cards:** Implementados em todas as páginas (card, title, description, images).
- **metadataBase:** Definido no layout raiz (`https://noximobiliaria.com.br`).
- **Authors:** "Nox Imóveis" no root e onde faz sentido.

### 1.3 Conteúdo e estrutura
- **H1:** Páginas principais têm um H1 claro e coerente com o conteúdo (home, contato, anunciar, blog, imóveis, Viva Penha/Piçarras/Barra Velha, etc.).
- **Alt em imagens:** Uso consistente de `alt` descritivo nas páginas públicas (home, listagem, detalhe do imóvel, blog, Viva, contato, anunciar, etc.).
- **Idioma:** `<html lang="pt-BR">` no root.

### 1.4 Dados estruturados (Schema.org)
- **Home:** `RealEstateAgent` (nome, descrição, endereço, telefone, areaServed, hasOfferCatalog).
- **Imóvel (detalhe):** `RealEstateListing` + `BreadcrumbList`.
- **Blog (artigo):** `BlogPosting` (headline, description, image, dates, author, publisher).
- **Como Comprar:** `FAQPage` para os passos.

### 1.5 Performance e Core Web Vitals
- **Preload do banner:** Link `preload` da imagem principal da home para melhorar LCP.
- **Imagens:** Next/Image com AVIF/WebP, deviceSizes e cache longo; `loading="lazy"` onde faz sentido.
- **Compressão:** `compress: true` no Next.
- **GA4:** Configurado com strategy `afterInteractive`.

### 1.6 Outros
- **RSS do blog:** `/blog/rss.xml` com itens e link no `<head>`.
- **PWA:** `manifest.json`, theme-color, apple-mobile-web-app.
- **404:** Página customizada com links para home e imóveis.

---

## 2. O que falta ou pode melhorar (para primeira página)

### 2.1 Crítico / Alto impacto

#### A) Título do layout raiz vs home
- **Problema:** No `layout.tsx` raiz o `title` é genérico: "Imobiliária - Encontre o Imóvel dos Seus Sonhos". A home sobrescreve com "Nox Imóveis - Imóveis em Penha, Balneário Piçarras e Barra Velha", mas em fallback (ex.: antes do JS) ou em algumas ferramentas pode aparecer o genérico.
- **Sugestão:** Alinhar o title padrão do root com a marca e região, por exemplo: "Nox Imóveis - Imóveis em Penha, Piçarras e Barra Velha".

#### B) Página de Contato – title
- **Problema:** `contato/layout.tsx` usa `title: 'Contato - Imobiliária'` enquanto o Open Graph usa "Contato - Nox Imóveis".
- **Sugestão:** Usar `title: 'Contato - Nox Imóveis'` para consistência e reforço de marca.

#### C) Schema LocalBusiness/RealEstateAgent na home – URL da imagem
- **Problema:** O JSON-LD usa `"image": "https://noximobiliaria.com.br/imagens/banners/banner-home.png"`. No resto do site a imagem é servida por `api/image?id=banner-home`. Se esse path estático não existir, o Google pode ver imagem inválida no schema.
- **Sugestão:** Usar a mesma URL que funciona nas redes sociais: `https://noximobiliaria.com.br/api/image?id=banner-home`.

#### D) Listagem de imóveis com filtros (SEO por “cidade/tipo”)
- **Problema:** A página `/imoveis` é client component e o metadata vem só do layout ("Imóveis à Venda - Nox Imóveis"). URLs como `/imoveis?cidade=penha`, `/imoveis?tipo=apartamento` não têm title/description específicos (ex.: "Imóveis em Penha - Nox Imóveis").
- **Impacto:** Perde oportunidade de rankear para buscas como "imóveis em Penha", "apartamentos à venda Penha".
- **Sugestão (estrutural):** Ter metadata dinâmica por query (ex.: um layout ou page server que leia `searchParams` e exporte `generateMetadata` com título/descrição por cidade e tipo). Pode exigir refatorar a listagem (ex.: wrapper server + client) ou usar uma solução híbrida com `generateMetadata` que leia searchParams na `page.tsx` (se virar server component só para isso).

#### E) Páginas /imoveis/penha, /imoveis/barra-velha, etc.
- **Situação:** Essas rotas fazem `redirect` para `/imoveis?cidade=...`. Têm canonical para a própria URL (que redireciona).
- **Sugestão:** Manter o redirect (evita conteúdo duplicado). Garantir que a página de destino (`/imoveis?cidade=penha`) tenha, no futuro, metadata específica (como em D), e que o canonical da listagem filtrada aponte para a URL com query (ou para a versão “canônica” que você escolher).

### 2.2 Médio impacto

#### F) Favoritos
- **Sugestão:** Avaliar `robots: { index: false }` ou `noindex` apenas para `/favoritos`, pois é conteúdo por usuário e pouco relevante para SEO. Hoje o layout não define robots (herda index do root).

#### G) Blog – RSS
- **Detalhe:** Links do RSS usam `/blog/${slug}` sem trailing slash; o site usa trailing slash. Melhor alinhar: `https://noximobiliaria.com.br/blog/${slug}/`.

#### H) Organization schema global
- **Sugestão:** Além do `RealEstateAgent` na home, considerar um schema `Organization` no layout raiz (nome, logo, url, sameAs se tiver redes sociais). Ajuda o Google a entender a entidade em todo o site.

#### I) Breadcrumbs na listagem e em outras páginas
- **Situação:** Só a página do imóvel (detalhe) tem BreadcrumbList.
- **Sugestão:** Incluir breadcrumbs (visuais + JSON-LD) em listagem (`Imóveis > Penha`), blog, Como Comprar, etc. Melhora UX e chance de rich results (breadcrumbs no SERP).

### 2.3 Baixo impacto / Boas práticas

#### J) Página 404
- **Sugestão:** Garantir que a resposta HTTP seja 404 e, se quiser, adicionar metadata com `robots: { index: false, follow: true }` para deixar explícito que não deve ser indexada.

#### K) Robots.txt estático vs robots.ts
- **Situação:** Existem `public/robots.txt` e `src/app/robots.ts`. No App Router, o `robots.ts` costuma gerar a resposta de `/robots.txt`. Verificar em produção qual está sendo servido e manter um só (recomendado: apenas `robots.ts`, sem `Crawl-delay`).

#### L) Tamanho e qualidade de conteúdo
- **Páginas “Viva” (Penha, Piçarras, Barra Velha):** Já têm texto e imagens. Para primeira página, conteúdo único e mais longo (guias, dicas, “viver em X”) ajuda.
- **Blog:** Manter publicação regular com palavras-chave da região (imóveis Penha, apartamento Piçarras, etc.) e links internos para imóveis e páginas de cidade.

#### M) Links internos
- **Sugestão:** Revisar se todas as páginas importantes (home, listagem, Viva X, Como Comprar, Contato) estão ligadas entre si por links no conteúdo ou no menu/rodapé. Quanto mais bem ligado, melhor para distribuição de “autoridade”.

#### N) Core Web Vitals em produção
- **Sugestão:** Acompanhar no Search Console (Core Web Vitals) e no PageSpeed Insights. O preload do hero e as imagens otimizadas já ajudam; ajustar LCP/CLS conforme métricas reais.

---

## 3. Checklist resumido (primeira página Google)

| Item | Status | Ação sugerida |
|------|--------|----------------|
| Canonical em todas as páginas | OK | — |
| Sitemap com URLs e imagens (imóveis) | OK | — |
| Robots allow/disallow + sitemap | OK | Unificar com robots.ts, remover Crawl-delay se duplicado |
| Title/description únicos | Quase | Ajustar root + Contato; metadata dinâmica em /imoveis?cidade=&tipo= |
| Open Graph + Twitter em todas | OK | — |
| Schema RealEstateAgent + Listing + BlogPosting + FAQ | OK | Corrigir URL da image no schema da home; opcional: Organization |
| H1 e alt em imagens | OK | — |
| Conteúdo único e relevante | Em progresso | Reforçar Viva + Blog + links internos |
| Performance (LCP, imagens) | Bom | Medir em produção e ajustar se necessário |
| Favoritos | — | Considerar noindex |
| 404 | OK | Opcional: noindex no metadata |
| RSS + trailing slash | Pequeno | Alinhar links do RSS ao trailing slash |

---

## 4. Ordem sugerida de implementação

1. **Rápidos (sem quebrar nada):**  
   - Ajustar title do layout raiz e da página Contato.  
   - Corrigir `image` no JSON-LD da home para `api/image?id=banner-home`.  
   - Alinhar links do RSS ao trailing slash.

2. **Médio prazo:**  
   - Metadata dinâmica para `/imoveis` (por cidade e tipo).  
   - Decisão sobre noindex em `/favoritos`.  
   - Breadcrumbs (visual + JSON-LD) em listagem e blog.

3. **Contínuo:**  
   - Conteúdo (Blog + Viva), links internos, medição de Core Web Vitals e acompanhamento no Search Console.

Com isso o site fica bem alinhado tecnicamente para SEO e com um caminho claro para disputar a primeira página no Google para as buscas da região.

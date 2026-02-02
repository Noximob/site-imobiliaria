# 📋 Análise SEO e Roadmap para 1ª Página

## ✅ CHECKLIST ORIGINAL – STATUS

| # | Item | Status | Observação |
|---|------|--------|------------|
| 1 | Sitemap XML dinâmico | ✅ | `sitemap.ts` com estáticas, imóveis e blog |
| 2 | robots.txt | ✅ | `robots.ts` gera dinamicamente (corrigido baseUrl) |
| 3 | Meta tags dinâmicas por imóvel | ✅ | `generateMetadata` em imoveis/[slug]/layout.tsx |
| 4 | Canonical URLs | ✅ | Em todas as páginas principais |
| 5 | Schema.org RealEstateListing | ✅ | JSON-LD em cada imóvel |
| 6 | Breadcrumbs + Schema | ✅ | Visuais e BreadcrumbList |
| 7 | Preload recursos críticos | ✅ | Banner home, fontes (Inter) |
| 8 | Lazy loading imagens | ✅ | Exceto hero/banner |
| 9 | Gzip/Brotli | ✅ | Netlify automático |
| 10 | Páginas de categoria | ✅ | penha, balneario-picarras, barra-velha, apartamentos, frente-mar |
| 11 | Google Search Console | ✅ | Meta tag + arquivo HTML |
| 12 | API submit-sitemap | ⚠️ | Existe; Google bloqueia ping. Submissão manual no GSC funciona |
| 13 | RSS Feed blog | ✅ | `/blog/rss.xml` |
| 14 | FAQ Schema | ✅ | Página Como Comprar |
| 15 | PWA / Manifest | ✅ | `manifest.json` + meta tags |
| 16 | OG Image dinâmica | ⏸️ | Revertido: usava foto direta; WhatsApp OK com foto direta |

---

## 🔧 CORREÇÕES APLICADAS

1. **robots.ts**: `baseUrl` alterado de `imobiliaria.netlify.app` para `noximobiliaria.com.br`; `disallow` corrigido de `/admin/` para `/administrador/`.
2. **Footer**: link "Sobre Piçarras" corrigido de `/viva-picarras` para `/viva-balneario-picarras`.

---

## 🚀 PRÓXIMAS MELHORIAS (Prioridade para 1ª Página)

### Alta prioridade

1. **Canonical + trailing slash**
   - `next.config.mjs` usa `trailingSlash: true`.
   - Canonical e sitemap usam URLs sem `/` final.
   - Padronizar para o formato real servido (com `/`) para evitar sinal de duplicação.

2. **PWA ícones**
   - `manifest.json` usa só favicon.
   - Adicionar ícones 192x192 e 512x512.
   - Melhora instalação e classificação mobile.

3. **Página de listagem com h1 contextual**
   - `/imoveis` usa h1 genérico "Imóveis à Venda".
   - Quando há filtro (ex.: `?cidade=penha`), ajustar h1 para algo como "Imóveis à venda em Penha".
   - Melhora correspondência com buscas locais.

### Média prioridade

4. **Schema LocalBusiness**
   - Adicionar `LocalBusiness` na home com endereço, telefone, horário.
   - Ajuda em buscas locais e Knowledge Panel.

5. **Revalidação**
   - Home está `revalidate = 0` e `force-dynamic`.
   - Para SEO, considerar `revalidate = 3600` (1h) para reduzir carga sem perder atualização.

6. **URLs no sitemap com trailing slash**
   - Incluir `/` final nas URLs do sitemap se o site usa `trailingSlash: true`.

### Baixa prioridade / Futuro

7. **Image sitemaps**
   - Sitemap de imagens para imóveis (ex.: `<image:image>`).
   - Pode ajudar em Google Imagens.

8. **Hreflang**
   - Se houver versão em outro idioma.

9. **Lighthouse / Core Web Vitals**
   - Rodar auditoria e atacar problemas de LCP, FID, CLS.

---

## 📌 O QUE VOCÊ FAZ NO /ADMINISTRADOR

- Conteúdo e textos dos imóveis
- Blog (artigos, imagens)
- Descrições otimizadas com palavras-chave locais
- Títulos e meta descriptions por imóvel
- Atualizar textos em site.json conforme necessário

---

## 🎯 RESUMO

- Itens críticos e importantes da lista original estão implementados.
- Bugs corrigidos: `robots.ts` e link “Sobre Piçarras”.
- Próximos passos sugeridos: canonicals/sitemap com trailing slash, ícones PWA, h1 dinâmico na listagem e schema LocalBusiness.

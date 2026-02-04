# Prova real: imagens com width/height e sizes (CLS e SEO)

Este documento descreve como conferir que as alterações de **dimensões explícitas** e **sizes** nas imagens foram aplicadas no site.

---

## 1. Commit e deploy

- **Commit:** `perf(images): width/height e sizes para CLS e Core Web Vitals (SEO)`
- Após o deploy (Vercel ou outro), use o site em produção para as provas abaixo.

---

## 2. Prova no HTML (páginas públicas)

### 2.1 Página de um imóvel (`/imoveis/[slug]/`)

1. Abra qualquer ficha de imóvel, ex.:  
   `https://noximobiliaria.com.br/imoveis/apartamento-na-planta-em-itajuba-barra-velha-2-quartos-sacada-com-churrasqueira-entrega-abril2029/`
2. Clique com o botão direito → **Inspecionar** (ou F12).
3. Na aba **Elements** (Elementos), procure por `<img` na galeria de fotos (logo abaixo do título/endereço).
4. **Prova:** as tags `<img>` da galeria devem ter os atributos **`width`** e **`height`** (ex.: `width="800" height="600"` na foto principal e `width="400" height="300"` nas menores).  
   Antes da mudança essas tags não tinham width/height.

### 2.2 Listagem de imóveis (`/imoveis`)

1. Abra `https://noximobiliaria.com.br/imoveis/`
2. Inspecione a imagem de um card de imóvel.
3. **Prova:** o `<img>` gerado pelo Next.js (dentro do card) deve ter **`sizes`** no código-fonte ou a requisição para `/_next/image?url=...` deve incluir parâmetros de tamanho. O container do card continua com altura fixa; a diferença é que a imagem agora declara tamanho esperado (evita CLS).

### 2.3 Home – Seção “Seleção Nox”

1. Abra `https://noximobiliaria.com.br/`
2. Inspecione a imagem de um dos imóveis da seção “Seleção Nox”.
3. **Prova:** o componente `<Image>` dessa seção agora tem o atributo **`sizes="(max-width: 768px) 100vw, 33vw"`** (ou equivalente) no código-fonte do React/Next. No HTML final, a tag `<img>` pode vir com width/height implícitos ou com `sizes` usado pelo otimizador.

### 2.4 Blog

1. Abra `https://noximobiliaria.com.br/blog/`
2. Inspecione a imagem de um artigo no listing.
3. **Prova:** a `<Image>` do card tem **`sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`** (ou similar) no código.  
4. Abra um artigo, ex.: `https://noximobiliaria.com.br/blog/[algum-slug]/`
5. **Prova:** a imagem principal do artigo tem **`sizes`** (ex.: `(max-width: 768px) 100vw, 896px`). O container já tinha `aspect-ratio`; a mudança é o `sizes` na `Image`.

### 2.5 Header (logo)

1. Em qualquer página, inspecione o logo “Nox Imóveis” no canto superior esquerdo.
2. **Prova:** a `Image` do logo tem **`sizes="128px"`** no código-fonte.

---

## 3. Prova no administrador

### 3.1 Blog – preview da imagem

1. Acesse **Administrador → Blog** e crie ou edite um artigo.
2. Envie uma imagem e veja o preview abaixo do campo.
3. Inspecione o elemento do preview.
4. **Prova:** a tag é `<img ... width="128" height="128" ...>`. Antes não tinha width/height.

### 3.2 Corretores – foto no formulário e na lista

1. **Administrador → Corretores** → adicione ou edite um corretor com foto.
2. Inspecione o preview da foto no formulário: deve ter **`width="64" height="64"`**.
3. Na lista de corretores, inspecione a miniatura ao lado do nome: deve ter **`width="48" height="48"`**.

### 3.3 Imóveis – fotos (novo / editar / editar fotos)

1. **Administrador → Imóveis → Novo** (ou **Editar** um imóvel).
2. Envie fotos e veja os previews na “Foto Principal” e “Fotos Menores”.
3. Inspecione qualquer `<img>` de preview: deve ter **`width` e `height`** (ex.: 320×240 ou 320×180).
4. **Administrador → Imóveis → [um imóvel] → Fotos**: as miniaturas e o preview da galeria devem ter **width e height** nas tags `<img>` (ex.: 320×240, 320×180, 800×600, 400×300 conforme o bloco).

---

## 4. Prova com ferramentas (opcional)

### 4.1 Google PageSpeed Insights / Lighthouse

1. Acesse https://pagespeed.web.dev/
2. Informe a URL do site (ex.: página inicial ou uma ficha de imóvel).
3. Rode a análise (mobile e/ou desktop).
4. **Prova:** na seção **Diagnostics** (ou “Oportunidades”), o aviso **“Image elements do not have explicit width and height”** deve diminuir ou sumir em relação a uma análise feita antes das mudanças.  
   A métrica **CLS (Cumulative Layout Shift)** pode melhorar, pois o espaço das imagens passa a ser reservado desde o primeiro frame.

### 4.2 Verificar no código (dev)

- **Listagem:** em `src/app/imoveis/ImoveisListagem.tsx`, a `<Image>` do card tem `sizes="(max-width: 640px) 100vw, 256px"`.
- **Ficha do imóvel:** em `src/app/imoveis/[slug]/page.tsx`, as `<img>` da galeria têm `width={800} height={600}` (principal) e `width={400} height={300}` (menores).
- **Blog:** em `src/app/blog/page.tsx`, a `<Image>` do card tem `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`.

---

## 5. Resumo do que mudou

| Onde | O que foi feito |
|------|------------------|
| Galeria na ficha do imóvel | `<img>` com `width` e `height` (800×600 e 400×300) |
| Listagem, home, favoritos, ImovelCard | `sizes` no `<Image>` e, onde aplicável, container com `aspect-ratio` |
| Blog (lista e artigo) | `sizes` nas `<Image>` |
| Header, contato, anunciar, como-comprar, viva-* | `sizes` nas imagens com `fill` |
| Galeria fullscreen (fotos) | `sizes` na foto principal e nos thumbnails |
| DynamicImage | `sizes` quando usa `fill` |
| Admin (blog, corretores, imóveis, fotos) | `<img>` de preview com `width` e `height` |
| TeamSection (corretores no site) | `<img>` do card com `width={400} height={300}` |

Se ao seguir estes passos você encontrar os `width`/`height` e `sizes` nos lugares indicados (e o relatório de imagens sem dimensões diminuir), a prova real das mudanças está atendida.

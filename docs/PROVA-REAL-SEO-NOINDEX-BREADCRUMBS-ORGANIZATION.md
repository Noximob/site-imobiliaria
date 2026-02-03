# Prova real – noindex Favoritos, Breadcrumbs e Organization

Testes para fazer **depois do deploy**.

---

## 1. Favoritos – noindex

**Objetivo:** A página de favoritos não deve ser indexada pelo Google.

1. Abra **https://noximobiliaria.com.br/favoritos/**.
2. Clique com o botão direito → **Exibir código-fonte** (ou Ctrl+U).
3. Procure por **robots** ou **noindex** no `<head>`.
   - **Esperado:** existir algo como `<meta name="robots" content="noindex, follow">` (ou equivalente gerado pelo Next a partir do metadata).
4. Opcional: no **Google Search Console** → Inspeção de URL → colar a URL de favoritos. Depois de um tempo, a página pode aparecer como “Não indexada” ou com aviso de noindex.

**Prova:** A página continua funcionando (você vê seus favoritos); só não deve ser indexada.

---

## 2. Breadcrumbs – listagem de imóveis

**Objetivo:** Ver breadcrumbs clicáveis e JSON-LD na listagem.

1. Abra **https://noximobiliaria.com.br/imoveis/**.
2. Abaixo do título **"Imóveis à Venda"**, deve aparecer uma linha: **Home › Imóveis** (com “Home” e “Imóveis” clicáveis).
3. Aplique um filtro (ex.: Cidade = Penha). A linha deve mudar para algo como **Home › Imóveis › Imóveis em Penha** (o último item é só texto, sem link).
4. No código-fonte da página, procure por **BreadcrumbList** ou **application/ld+json**.
   - **Esperado:** um bloco `"@type": "BreadcrumbList"` com `itemListElement` (Home, Imóveis e, se houver filtro, o nome da página atual).

**Prova:** Links Home e Imóveis levam à home e à listagem; o texto reflete o filtro; o JSON-LD está presente.

---

## 3. Breadcrumbs – blog (lista)

**Objetivo:** Ver breadcrumb na lista do blog.

1. Abra **https://noximobiliaria.com.br/blog/**.
2. No topo da página (acima do hero roxo), deve aparecer: **Home › Blog** (Home clicável, Blog como texto).
3. No código-fonte, procure por **BreadcrumbList**.
   - **Esperado:** JSON-LD com dois itens: Home e Blog.

**Prova:** Link “Home” leva à home; JSON-LD com 2 itens.

---

## 4. Breadcrumbs – artigo do blog

**Objetivo:** Ver breadcrumb na página do artigo.

1. Abra qualquer artigo (ex.: **https://noximobiliaria.com.br/blog/[algum-slug]/**).
2. No topo do conteúdo (acima do botão “Voltar”), deve aparecer: **Home › Blog › [Título do artigo]** (Home e Blog clicáveis, título como texto).
3. No código-fonte, procure por **BreadcrumbList**.
   - **Esperado:** JSON-LD com três itens: Home, Blog e o título do artigo.

**Prova:** Links funcionam; JSON-LD com 3 itens.

---

## 5. Schema Organization

**Objetivo:** Ver schema Organization no site.

1. Abra a **home**: **https://noximobiliaria.com.br/**.
2. No código-fonte (Ctrl+U), procure por **"@type": "Organization"**.
   - **Esperado:** um bloco JSON-LD com `@type: Organization`, `name: Nox Imóveis`, `url` e `logo`.

**Prova:** O script com Organization aparece no HTML da home (ou de qualquer página, pois está no layout raiz).

---

## Resumo

| Item | Onde testar | O que conferir |
|------|-------------|----------------|
| noindex Favoritos | /favoritos/ | meta robots noindex ou equivalente; página continua funcionando |
| Breadcrumbs listagem | /imoveis/ e /imoveis/?cidade=penha | Home › Imóveis [› filtro]; links ok; JSON-LD BreadcrumbList |
| Breadcrumbs blog lista | /blog/ | Home › Blog; JSON-LD com 2 itens |
| Breadcrumbs blog artigo | /blog/[slug]/ | Home › Blog › Título; JSON-LD com 3 itens |
| Organization | Home (código-fonte) | JSON-LD com @type Organization, name, url, logo |

Se tudo isso estiver certo, as mudanças estão validadas.

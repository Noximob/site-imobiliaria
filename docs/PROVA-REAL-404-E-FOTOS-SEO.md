# Prova real – 404 noindex e galeria de fotos (SEO)

## Item 1: 404 com noindex

### O que foi feito
- No `src/app/not-found.tsx` foi adicionado `metadata` com:
  - `title: 'Página não encontrada | Nox Imóveis'`
  - `description` curta
  - `robots: { index: false, follow: true }` para o Google não indexar a página 404.

### Como testar (prova real)

1. **Ver o título da 404**
   - Abra uma URL que não existe, por exemplo:  
     `https://noximobiliaria.com.br/administr/` ou `https://noximobiliaria.com.br/qualquer-coisa-inexistente/`
   - A aba do navegador deve mostrar: **"Página não encontrada | Nox Imóveis"** (e não mais o título da home).

2. **Ver o noindex no HTML**
   - Na mesma página 404, abra as ferramentas do desenvolvedor (F12).
   - Aba **Elements** (ou **Elementos**), no `<head>`, procure por:
     - `<meta name="robots" content="noindex, follow">`
   - Se esse meta existir, a prova real do item 1 está ok.

3. **Opcional – teste de indexação**
   - Depois do deploy, no Google Search Console: **Inspecionar URL** de uma URL que retorna 404.
   - Após algum tempo, a página não deve ser indexada (ou deve sair do índice) por causa do `noindex`.

---

## Item 2: Galeria de fotos com metadata e canonical próprios

### O que foi feito
- Criado `src/app/imoveis/[slug]/fotos/layout.tsx` que define:
  - Título: **"Fotos - [Nome do imóvel] | Nox Imóveis"**
  - Description e Open Graph específicos da galeria.
  - **Canonical:** `https://noximobiliaria.com.br/imoveis/[slug]/fotos/`

### Como testar (prova real)

1. **Escolher um imóvel que existe**
   - Exemplo: se existir um imóvel com slug `apartamento-exemplo`, a URL da galeria é:  
     `https://noximobiliaria.com.br/imoveis/apartamento-exemplo/fotos/`

2. **Título e canonical na galeria**
   - Abra a URL da **galeria** (ex.: `.../imoveis/[slug]/fotos/`).
   - A **aba do navegador** deve mostrar algo como: **"Fotos - [Nome do imóvel] | Nox Imóveis"** (e não o título da ficha do imóvel).
   - No código-fonte da página (clique direito → “Exibir código-fonte” ou Ctrl+U), procure no `<head>`:
     - `<link rel="canonical" href="https://noximobiliaria.com.br/imoveis/[slug]/fotos/">`
     - `<meta property="og:title" content="Fotos - [Nome do imóvel] | Nox Imóveis">`
   - Se esses elementos estiverem corretos, a prova real do item 2 está ok.

3. **Comparar com a ficha do imóvel**
   - Abra a **ficha** do mesmo imóvel: `https://noximobiliaria.com.br/imoveis/[slug]/`
   - O título da aba deve ser **"[Nome do imóvel] | Nox Imóveis"** (sem “Fotos -”).
   - O canonical da ficha deve ser `.../imoveis/[slug]/` (sem `/fotos/`).
   - Assim você confirma que ficha e galeria têm títulos e canonicals diferentes.

4. **Comportamento do site**
   - A galeria continua abrindo e mostrando as fotos normalmente.
   - Os botões e links (voltar, etc.) continuam funcionando.
   - Nenhuma funcionalidade da página de fotos foi removida.

---

## Resumo rápido

| Item | O que conferir |
|------|-----------------|
| **1 – 404** | Título da aba “Página não encontrada \| Nox Imóveis” e `<meta name="robots" content="noindex, follow">` no `<head>`. |
| **2 – Fotos** | Na URL `.../imoveis/[slug]/fotos/`: título “Fotos - [Imóvel] \| Nox Imóveis” e canonical com `/fotos/` no final. |

Se algo não bater (título errado, canonical da galeria igual ao da ficha ou sem noindex na 404), avise para ajustarmos.

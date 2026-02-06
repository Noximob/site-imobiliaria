# Hierarquia H1, H2 e H3 — Todo o site

Documento de referência para auditoria e correções. Regras: **1 H1 por página**; **H2 para seções principais**; **H3 para subseções**; nunca pular nível (ex.: H1 → H3).

## Resumo das alterações aplicadas

- **perguntas-frequentes-imovel-na-planta:** H2 "Perguntas e respostas" antes do acordeão; H2 "Outros temas do guia" na seção final.
- **encontre-meu-imovel:** H2 "Como funciona" antes dos 4 H3 (passos); ordem H1 → H2 → H3×4 → H2 (form) → H2 (CTA).
- **trabalhe-conosco:** H2 "Nossos valores" antes dos 3 H3 (valores).
- **como-comprar:** Seção "Seu Imóvel na Praia": label pequeno virou `<p>`, subtítulo virou H2 (correção H2/H3 invertidos).
- **imoveis/[slug]:** H2 duplicado (título) trocado por "Sobre o imóvel"; H2 "Entre em contato" antes do formulário; H3 "Receber contato por" mantido.
- **imoveis/ImoveisListagem:** H2 "Imóveis encontrados" antes do grid quando há resultados.
- **favoritos:** H2 "Sua lista de favoritos" antes do grid quando há itens.
- **administrador/imoveis/[id]/fotos:** Primeiro heading "Por que editar..." de H3 para H2 (evitar H3 antes de H2).

---

## Páginas públicas

### Home `(public)/page.tsx`
- **H1** — Banner (getText home.banner.titulo)
- **H2** — Seleção Nox | Encontre seu imóvel (cidades) | CTA Atendimento | Imóveis na Planta | Anuncie com a Nox
- **H3** — Penha, Piçarras, Barra Velha (subcidades); benefício 1, 2, 3
- **Componentes:** DepoimentosSection (H2), TeamSection (H3 por card), BlogSection (verificar)
- Status: OK. Apenas garantir que BlogSection use H2.

### Listagem de imóveis `imoveis/ImoveisListagem.tsx`
- **H1** — Dinâmico (getH1Text)
- **H2** — "Ordenar" (modal); falta H2 na área principal → adicionar "Resultado da busca" ou "Imóveis encontrados"
- **H3** — Título de cada card de imóvel
- Ação: Adicionar H2 visível antes do grid (ex.: "Imóveis encontrados").

### Detalhe do imóvel `imoveis/[slug]/page.tsx`
- **H1** — Título do imóvel (uma vez, no topo)
- **H2** — Atualmente: repetição do título (linha 474), Características, Infraestrutura, Localização, "Imóveis que você pode gostar". H3 "RECEBER CONTATO POR".
- Ação: Trocar H2 duplicado (titulo) por "Sobre o imóvel". Inserir H2 "Entre em contato" antes do formulário; manter H3 "RECEBER CONTATO POR".

### Blog lista `blog/page.tsx`
- **H1** — getText blog.hero.titulo
- **H2** — "Últimos artigos do blog Nox Imóveis"
- **H3** — Título de cada card; estado vazio
- Status: OK.

### Blog artigo `blog/[slug]/page.tsx`
- **H1** — Título do artigo (ou "Artigo não encontrado" em erro)
- **H2** — "Sobre este artigo" (bloco de conteúdo)
- **H3** — Tags; "Encontrou o que procurava?" (CTA)
- Status: OK.

### Contato `contato/page.tsx`
- **H1** — getText contato.hero.titulo
- **H2** — "Envie sua mensagem" (formulário)
- Status: OK.

### 404 `not-found.tsx`
- **H1** — Página não encontrada
- **H2** — Explicação do erro
- Status: OK.

### Como Comprar `como-comprar/page.tsx`
- **H1** — getText como_comprar.hero.titulo
- **H2** — "Como é comprar" (passos); Localização
- **H3** — Passo 1, 2, 3, 4
- Problema: Seção "Seu Imóvel na Praia" tem H2 (texto pequeno titulo) e H3 (subtitulo grande) — invertidos.
- Ação: H2 = subtitulo (texto principal da seção); label pequeno = <p> ou <span>, não H2.

### Encontre Meu Imóvel `encontre-meu-imovel/page.tsx`
- **H1** — getText encontre_meu_imovel.hero.titulo
- **H3** — Passos 1–4 (antes de qualquer H2)
- **H2** — "Encontre seu imóvel" (form); CTA final
- Ação: Adicionar H2 "Como funciona" antes dos 4 H3 (passos).

### Trabalhe Conosco `trabalhe-conosco/page.tsx`
- **H1** — getText trabalhe_conosco.hero.titulo
- **H3** — Valor 1, 2, 3 (sem H2 pai)
- **H2** — Título do formulário
- Ação: Adicionar H2 "Nossos valores" antes dos 3 H3.

### Perguntas Frequentes `perguntas-frequentes-imovel-na-planta/page.tsx`
- **H1** — getText FAQ hero_titulo
- **H2** — Nenhum atualmente.
- Ação: H2 "Perguntas e respostas" antes do acordeão; H2 "Mais temas" ou "Outros temas" na seção final.

### Favoritos `favoritos/page.tsx`
- **H1** — "Seus favoritos" ou similar
- **H2** — Mensagem quando vazio ou "Sua lista"
- **H3** — Título de cada card
- Verificar ordem e textos.

### Anunciar `anunciar/page.tsx`
- **H1** — Título da página
- **H2** — Seção do formulário; seção de benefícios
- **H3** — "Dados do imóvel"; itens de benefícios
- Verificar sequência H2 → H3.

### Sobre `sobre/page.tsx`
- **H1** — getText quem_somos
- **H2** — Seções principais
- **H3** — Missão, Visão, Valores
- Status: OK.

### Viva Penha / Piçarras / Barra Velha
- **H1** — Nome da cidade
- **H2** — Seções (O que fazer, Benefícios, Investir, CTA)
- **H3** — Atrações, itens de lista
- Status: OK (verificar ordem em cada arquivo).

### Guias (como-comprar-imovel-na-planta, fluxo-pagamento, seguranca, etc.)
- **H1** — Título do guia
- **H2** — "No guia" (link)
- Status: OK. Opcional: mais H2 por seção de conteúdo se houver.

### Guia principal `guia-imovel-na-planta-litoral-sc/page.tsx`
- **H1** — Título
- **H2** — Índice; "No site"
- Status: OK.

---

## Administrador

Estrutura mantida: H1 por tela (ex.: "Imóveis", "Editar Imóvel"), H2 por blocos (Informações Básicas, Endereço, etc.), H3 quando necessário. Ajuste pontual: **imoveis/[id]/fotos** — trocar primeiro H3 ("Por que editar...") por H2 para não ter H3 antes de H2.

---

## Componentes compartilhados

- **TeamSection:** usa H3 para nome do corretor no card — OK (dentro de seção que já tem H2 na página).
- **DepoimentosSection:** usa H2 "O que dizem nossos clientes" — OK.
- **BlogSection:** deve usar H2 para o título da seção na home.

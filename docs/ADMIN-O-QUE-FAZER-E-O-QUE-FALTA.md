# Administrador – O que fazer e o que (realmente) falta

Resumo do que você precisa **fazer** no `/administrador` (conteúdo e boas práticas) e o que ainda **falta no sistema** (funcionalidades ou correções).

---

## 1. O que você PRECISA FAZER no administrador (conteúdo)

### 1.1 Imóveis (`/administrador/imoveis`)

- **Título**
  - Use títulos claros e com palavras que as pessoas buscam: cidade, tipo, diferencial.
  - Exemplos bons: *Apartamento 2 quartos frente mar em Penha*, *Cobertura em Balneário Piçarras com vista para o mar*, *Casa em Barra Velha com piscina*.
  - Evite só “Apartamento à venda” ou “Casa”.

- **Descrição**
  - Preencha sempre. Descrições vazias ou muito curtas prejudicam SEO e conversão.
  - Escreva 2–4 parágrafos: localização, ambientes, comodidades, diferenciais, quem é o imóvel para (família, investidor, etc.).
  - Inclua bairro e cidade no texto quando fizer sentido.

- **Fotos**
  - Foto principal: a melhor imagem do imóvel (fachada ou sala).
  - Pelo menos 4–6 fotos por imóvel. Ordem: principal → outras de destaque → demais.

- **Coordenadas (lat/long)**
  - Se o imóvel for manual (não DWV), preencha para o imóvel aparecer no mapa na página do imóvel.

- **Publicado / Seleção Nox**
  - Deixe “Publicado” marcado para aparecer no site.
  - “Seleção Nox” para destacar na home.

**Resumo:** Título rico + descrição completa + boas fotos + coordenadas quando possível.

---

### 1.2 Blog (`/administrador/blog`)

- **Título**
  - Use termos que as pessoas pesquisam: *Como financiar imóvel em 2025*, *Melhores bairros em Penha para investir*, *Apartamento frente mar: o que saber antes de comprar*.

- **Resumo**
  - É o que aparece na listagem e em redes sociais. 1–3 frases objetivas, até ~160 caracteres.
  - Inclua a ideia principal e uma “isca” para clicar.

- **Conteúdo**
  - Não deixe vazio. Textos longos e únicos ajudam SEO.
  - Use parágrafos curtos, subtítulos e, se possível, listas.
  - Mencione cidades (Penha, Piçarras, Barra Velha) e link para a listagem de imóveis quando fizer sentido.

- **Categoria**
  - Mantenha consistente: ex. *Dicas*, *Mercado*, *Financiamento*, *Região*.

- **Imagem**
  - Tamanho sugerido 1200x900 (4:3). Boa qualidade e relacionada ao tema.

- **Publicar**
  - Só marque “Publicar imediatamente” quando o texto e a imagem estiverem prontos.

**Resumo:** Título com palavra-chave + resumo forte + conteúdo completo + imagem boa.

---

### 1.3 Textos do site (`/administrador/textos`)

- **O que é:** Todos os textos editáveis do site (header, footer, home, páginas institucionais, etc.).
- **O que fazer:**
  - Revisar títulos e descrições das seções (hero, blocos, CTAs).
  - Garantir telefone, e-mail e endereço corretos em todos os lugares.
  - Ajustar mensagens de botões e links para serem claras e com CTA (ex.: “Falar com corretor”, “Ver imóveis em Penha”).
- **Depois de editar:** Clicar em “Publicar” para enviar as mudanças; o site atualiza em alguns minutos.

**Resumo:** Manter textos atualizados, corretos e com foco em conversão.

---

### 1.4 Imagens (`/administrador/imagens`)

- **Banners e imagens de seções:** Usar imagens de qualidade, com foco no negócio e na região.
- **Nomes/descrições:** Preencher descrição quando houver campo; ajuda na organização (não afeta SEO diretamente, mas evita confusão).

---

### 1.5 Depoimentos (`/administrador/depoimentos`)

- **Nome:** Nome completo ou só primeiro nome + inicial do sobrenome.
- **Comentário:** Texto curto e verdadeiro; ative só os que forem adequados e positivos.

---

### 1.6 Formulários (`/administrador/formularios`)

- **O que fazer:** Acompanhar leads (Anunciar, Encontre Meu Imóvel, Contato, Trabalhe Conosco), marcar como lido e responder.
- O sistema já lista e permite marcar lido/excluir; não falta função essencial aqui.

---

### 1.7 Corretores (`/administrador/corretores`)

- Manter nome, contato e foto atualizados para exibição no site.

---

## 2. O que REALMENTE FALTA no sistema (funcionalidades / correções)

### 2.1 Blog – Slug ao editar (importante)

- **Problema:** Ao **editar** um artigo e mudar o **título**, o sistema recalcula o **slug** (URL) a partir do novo título. A URL do artigo muda e links antigos (Google, redes sociais, outros sites) quebram.
- **O que falta:** Na edição, **manter o slug antigo** (não sobrescrever com um novo). Ou ter um campo “Slug” editável, com aviso de que mudar quebra links.
- **Enquanto não corrigir:** Evite mudar o título de artigos já publicados; se precisar, altere só o texto mantendo o mesmo título (ou avise que a URL vai mudar).

---

### 2.2 Blog – Tags

- **Situação:** O tipo “Artigo” tem campo `tags`, mas no formulário do admin **não existe campo para editar tags**; sempre salva `tags: []`.
- **Impacto:** Tags ajudam em filtros e em SEO interno (palavras-chave). Não é crítico, mas é uma melhoria.
- **O que falta:** Incluir no formulário de criar/editar artigo um campo “Tags” (ex.: várias palavras separadas por vírgula) e salvar no artigo.

---

### 2.3 Nada crítico faltando

- **Imóveis:** Criar, editar, fotos, ordem, principal, coordenadas, publicar, seleção Nox – tudo existe.
- **Textos:** Edição por seção e publicação no GitHub – ok.
- **Formulários:** Listagem, marcar lido, excluir – ok.
- **Depoimentos / Corretores / Imagens / DWV Sync:** Funcionalidades que você usa estão presentes.

Ou seja: além do **slug do blog na edição** e, opcionalmente, **tags do blog**, não há “falta grande” no sistema. O que pesa mais é **conteúdo**: boas descrições dos imóveis, artigos completos e textos do site bem escritos.

---

## 3. Checklist rápido – O que fazer no admin

| Onde | O que fazer |
|------|-------------|
| **Imóveis** | Título com cidade/tipo/diferencial; descrição completa; fotos em ordem; coordenadas nos manuais; publicado. |
| **Blog** | Título com palavra-chave; resumo forte (~160 caracteres); conteúdo completo; imagem 1200x900; não mudar título de artigo já publicado (por causa do slug). |
| **Textos** | Revisar e publicar após editar; conferir telefone/endereço/CTAs. |
| **Imagens** | Banners e seções com boa qualidade e descrição. |
| **Depoimentos** | Só ativar os adequados; nome e comentário claros. |
| **Formulários** | Acompanhar leads e responder. |
| **Corretores** | Dados e foto atualizados. |

---

## 4. Resumo final

- **Falta no sistema (a corrigir):**
  1. **Blog – preservar slug na edição** (para não quebrar URL ao mudar título).
  2. **Blog – campo Tags** (opcional, melhora SEO e organização).

- **Não falta:** fluxo de imóveis, textos, formulários, depoimentos, corretores, imagens, DWV. O sistema está completo para o dia a dia.

- **O que mais impacta resultado (SEO e conversão):** o que **você** faz no admin: **descrições e títulos melhores nos imóveis**, **artigos com conteúdo completo e bem nomeados**, e **textos do site revisados e publicados**.

Se quiser, no próximo passo podemos só implementar a correção do slug na edição do blog (e, se desejar, o campo de tags).

# Prova real – Blog Admin (slug + tags)

Faça estes testes **depois** do deploy (commit e push).

---

## 1. Slug preservado ao editar

**Objetivo:** Garantir que, ao editar um artigo e mudar o título, a URL do artigo **não** muda.

1. Anote a URL de um artigo publicado (ex.: `https://noximobiliaria.com.br/blog/meu-artigo-existente/`).
2. Entre em **Administrador** → **Gerenciar Blog**.
3. Clique em **Editar** nesse artigo.
4. **Altere só o título** (ex.: adicione " - Atualizado" no final).
5. Salve (Atualizar Artigo).
6. Abra a **mesma URL** que anotou no passo 1.
   - **Esperado:** A página abre normalmente e mostra o artigo **com o novo título**.
   - **Se a URL tivesse mudado:** a URL antiga daria 404.

**Prova real:** URL antiga continua funcionando e o conteúdo exibido está com o título novo.

---

## 2. Tags – criar e editar

**Objetivo:** Garantir que o campo Tags aparece e é salvo.

1. **Criar artigo com tags**
   - Administrador → Gerenciar Blog → **Novo Artigo**.
   - Preencha Título, Resumo, Categoria, Autor, escolha uma imagem.
   - No campo **Tags**, digite: `Penha, investimento, apartamento`.
   - Salve.
   - Abra o artigo no site (Blog → clique no artigo).
   - No final da página, na área de Tags, deve aparecer: `#Penha` `#investimento` `#apartamento`.

2. **Editar artigo e adicionar/alterar tags**
   - No admin, edite um artigo existente.
   - No campo **Tags**, coloque ou altere (ex.: `dicas, financiamento`).
   - Salve.
   - Abra o artigo no site e confira se as tags aparecem no rodapé do conteúdo.

**Prova real:** Tags preenchidas no admin aparecem na página pública do artigo.

---

## 3. Resumo rápido

| Teste | O que fazer | Resultado esperado |
|-------|-------------|--------------------|
| Slug ao editar | Editar artigo, mudar título, salvar. Abrir URL antiga. | URL antiga abre e mostra artigo com título novo. |
| Tags ao criar | Novo artigo com Tags "Penha, investimento". | Tags aparecem no artigo no site. |
| Tags ao editar | Editar artigo e preencher/alterar Tags. | Tags atualizadas aparecem no artigo no site. |

Se os três passarem, as mudanças estão corretas.

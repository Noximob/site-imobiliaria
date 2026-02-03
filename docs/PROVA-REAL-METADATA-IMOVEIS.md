# Prova real – Metadata dinâmica na listagem de imóveis

Faça estes testes **depois** do deploy para confirmar que o título da página (e do Google) muda conforme o filtro.

---

## 1. Sem filtro

1. Abra **https://noximobiliaria.com.br/imoveis/** (ou só `/imoveis/`).
2. Olhe o **título da aba** do navegador.
   - **Esperado:** algo como **"Imóveis à Venda | Nox Imóveis"**.

---

## 2. Filtro por cidade

1. Abra **https://noximobiliaria.com.br/imoveis/?cidade=penha** (ou use o filtro “Penha” na página e confira a URL).
2. Olhe o **título da aba**.
   - **Esperado:** **"Imóveis em Penha | Nox Imóveis"** (ou parecido).
3. Repita para:
   - `?cidade=balneario-picarras` → **"Imóveis em Balneário Piçarras | Nox Imóveis"**.
   - `?cidade=barra-velha` → **"Imóveis em Barra Velha | Nox Imóveis"**.

---

## 3. Filtro por tipo

1. Abra **/imoveis/?tipo=apartamento**.
2. **Esperado:** título da aba algo como **"Apartamentos à Venda | Nox Imóveis"**.
3. Tipo + cidade: **/imoveis/?tipo=apartamento&cidade=penha** → **"Apartamentos em Penha | Nox Imóveis"** (ou equivalente).

---

## 4. Listagem e filtros funcionando

1. Em **/imoveis/** altere filtros (cidade, tipo, etc.) e aplique.
2. **Esperado:** a lista de imóveis atualiza, a URL muda com os parâmetros e o **título da aba** reflete o filtro (ex.: “Imóveis em Penha”, “Apartamentos à Venda”).
3. Mobile: abra o menu de filtros, escolha uma cidade, aplique.
   - **Esperado:** mesma URL e mesmo título da aba que no desktop para a mesma combinação de filtros.

---

## Resumo

| URL / filtro              | Título da aba esperado (exemplo)        |
|---------------------------|-----------------------------------------|
| /imoveis/                 | Imóveis à Venda \| Nox Imóveis          |
| ?cidade=penha             | Imóveis em Penha \| Nox Imóveis         |
| ?cidade=balneario-picarras| Imóveis em Balneário Piçarras \| Nox Imóveis |
| ?tipo=apartamento         | Apartamentos à Venda \| Nox Imóveis     |
| ?tipo=casa&cidade=penha   | Casas em Penha \| Nox Imóveis           |

Se o título da aba mudar conforme a tabela e a listagem continuar funcionando (filtros, ordenação, paginação, abrir detalhe do imóvel), a prova real está ok.

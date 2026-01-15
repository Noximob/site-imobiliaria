# 🔄 Configuração da Integração DWV

## 📋 O que foi criado

1. **`src/lib/dwv-api.ts`** - Funções para buscar e converter imóveis da API DWV
2. **`src/app/api/dwv/sync/route.ts`** - API para sincronizar imóveis
3. **`src/app/administrador/dwv-sync/page.tsx`** - Interface administrativa para sincronização

## 🔧 Passo 1: Obter informações da API DWV

Você precisa fornecer:

1. **URL da API DWV**
   - Exemplo: `https://api.dwv.com.br/v1/imoveis`
   - Ou: `https://api.dwv.com.br/v1/properties`

2. **Token de autenticação**
   - O token que você recebeu ao assinar

3. **Formato de autenticação**
   - Header: `Authorization: Bearer TOKEN`
   - Ou: `Authorization: Token TOKEN`
   - Ou: Query param: `?token=TOKEN`

4. **Estrutura da resposta**
   - Como a API retorna os dados?
   - Exemplo de resposta JSON (pode ser um objeto ou array)

## 🔧 Passo 2: Configurar no Netlify

Adicione estas variáveis de ambiente:

```
DWV_API_URL=https://apisandbox.dwvapp.com.br/integration/properties
DWV_API_TOKEN=seu_token_aqui
```

**Nota:** 
- **Sandbox (testes)**: `https://apisandbox.dwvapp.com.br/integration/properties`
- **Produção**: `https://api.dwvapp.com.br/integration/properties`
- O token deve ser gerado no sistema de Integração DWV (`https://app.dwvapp.com.br/integrations`)
- **Formato de autenticação**: Header `token: TOKEN_IMOBILIARIA` (conforme documentação oficial)

## 🔧 Passo 3: Ajustar o código

### 3.1 Ajustar URL e autenticação

Edite `src/lib/dwv-api.ts`:

```typescript
// Linha ~20: Ajustar URL
const apiUrl = process.env.DWV_API_URL || 'https://api.dwv.com.br/v1/imoveis'

// Linha ~28: Ajustar formato do header
headers: {
  'Authorization': `Bearer ${apiToken}`, // Ou o formato que a API usa
  // Ou se for query param:
  // Adicione: ?token=${apiToken} na URL
}
```

### 3.2 Ajustar estrutura da resposta

Na função `fetchDWVImoveis()`, ajuste como os dados são extraídos:

```typescript
const data: DWVResponse = await response.json()

// Ajustar conforme a estrutura real:
// Se retornar: { data: [...] }
const imoveis = data.data || []

// Se retornar: { imoveis: [...] }
const imoveis = data.imoveis || []

// Se retornar array direto: [...]
const imoveis = Array.isArray(data) ? data : []
```

### 3.3 Ajustar mapeamento de campos

Na função `convertDWVToImovel()`, ajuste os campos conforme a API retorna:

```typescript
// Exemplo: Se a API retorna "price" ao invés de "preco"
preco: dwvImovel.price || dwvImovel.preco || 0,

// Exemplo: Se a API retorna "bedrooms" ao invés de "quartos"
quartos: dwvImovel.bedrooms || dwvImovel.quartos || 0,
```

### 3.4 Ajustar tipos

Edite a interface `DWVImovel` em `src/lib/dwv-api.ts` para refletir os campos reais:

```typescript
interface DWVImovel {
  id?: string | number
  codigo?: string
  titulo?: string
  // Adicione todos os campos que a API retorna
  price?: number
  bedrooms?: number
  bathrooms?: number
  // etc...
}
```

## 🚀 Passo 4: Testar

1. Acesse `/administrador/dwv-sync`
2. Clique em **"Ver Preview"**
3. Verifique se os imóveis aparecem corretamente
4. Se estiver OK, clique em **"Sincronizar (MERGE)"** ou **"Substituir Todos (REPLACE)"**

## 📝 Modos de Sincronização

### MERGE (Recomendado)
- Mantém imóveis existentes
- Adiciona novos da DWV
- Atualiza imóveis existentes se tiverem o mesmo ID

### REPLACE
- **CUIDADO**: Remove TODOS os imóveis existentes
- Substitui por todos os imóveis da DWV
- Use apenas se quiser que a DWV seja a única fonte

## ❓ Precisa de ajuda?

Se você tiver:
- Documentação da API DWV
- Exemplo de resposta JSON
- URL e token

Posso ajudar a ajustar o código para funcionar perfeitamente!



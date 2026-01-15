# 🔑 Como Atualizar o Token no Netlify

## ⚠️ Token Atual vs Token Antigo

- **Token atual no Netlify:** `b1cfaacf95c56088c891ae949fcc65d93213a670ac5b9868426e89f38a98086b`
- **Token antigo:** `84b92d3a31b4f183dddf5115812683382e30727ad91d01b9b0aea97c72b146a0`

O token pode ter mudado ou o atual pode estar incorreto.

## 📝 Passo a Passo para Atualizar

### 1. Acesse o Netlify
- Vá para https://app.netlify.com
- Faça login na sua conta

### 2. Selecione seu site
- Clique no site `site-imobiliaria`

### 3. Vá em Environment variables
- No menu lateral, clique em **"Site settings"**
- Role até **"Build & deploy"**
- Clique em **"Environment variables"**

### 4. Encontre a variável `DWV_API_TOKEN`
- Procure na lista a variável `DWV_API_TOKEN`
- Clique no valor atual (ou no ícone de edição)

### 5. Atualize o valor
- **Valor atual:** `b1cfaacf95c56088c891ae949fcc65d93213a670ac5b9868426e89f38a98086b`
- **Novo valor (token antigo):** `84b92d3a31b4f183dddf5115812683382e30727ad91d01b9b0aea97c72b146a0`
- Clique em **"Save"** ou **"Update"**

### 6. Aguarde alguns segundos
- As variáveis são atualizadas imediatamente
- Não precisa fazer deploy

## 🧪 Teste Imediatamente

Após atualizar, teste:

1. Acesse `/administrador/dwv-sync`
2. Clique em **"Testar Conexão"**
3. Veja se agora funciona com o token antigo

## ⚠️ Importante

Se o token antigo funcionar:
- ✅ O problema era o token incorreto
- ✅ Use o token antigo ou gere um novo no painel DWV

Se o token antigo também não funcionar:
- ❌ Pode ter expirado
- ❌ Pode ser para produção, não sandbox
- ❌ Precisa gerar um novo token no painel DWV

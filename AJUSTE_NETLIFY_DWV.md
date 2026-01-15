# 🔧 Ajuste Necessário no Netlify - DWV API

## ⚠️ Problema Identificado

A URL configurada no Netlify está apontando para produção (`https://api.dwvapp.com.br/integration/properties`), mas essa URL retorna **404 (não existe)**.

A URL de sandbox (`https://apisandbox.dwvapp.com.br/integration/properties`) **existe** (retorna 401, não 404), mas o token está sendo rejeitado.

## ✅ Solução

### Passo 1: Atualizar a URL no Netlify

1. Acesse o Netlify: https://app.netlify.com
2. Vá em **Site settings** → **Environment variables**
3. Encontre a variável `DWV_API_URL`
4. **Altere o valor para:**
   ```
   https://apisandbox.dwvapp.com.br/integration/properties
   ```
5. Salve as alterações

### Passo 2: Verificar o Token

O token atual está sendo rejeitado pela API sandbox. Possíveis causas:

1. **Token incorreto**: O token pode estar errado ou ter sido copiado incorretamente
2. **Token expirado**: O token pode ter expirado
3. **Token para produção**: O token pode ser para produção, não sandbox

**O que fazer:**
- Acesse `https://app.dwvapp.com.br/integrations`
- Procure por:
  - Botão "Ver Token" ou "Gerar Token"
  - Seção "API" ou "Configuração"
  - Informações sobre sandbox vs produção
- Gere um novo token se necessário
- Confirme se o token é para sandbox ou produção

### Passo 3: Se o Token for para Produção

Se o token for para produção, você precisa descobrir a URL correta de produção. A URL `https://api.dwvapp.com.br/integration/properties` retorna 404, então pode ser:

- `https://api.dwvapp.com.br/integrations/properties` (com 's')
- Ou outra variação

**Contate o suporte do DWV** para confirmar:
- URL correta da API de produção
- Se o token é para sandbox ou produção
- Como gerar um novo token se necessário

## 📋 Resumo das URLs

### Sandbox (Testes)
- ✅ URL existe: `https://apisandbox.dwvapp.com.br/integration/properties`
- ❌ Problema: Token sendo rejeitado (401)

### Produção
- ❌ URL não existe: `https://api.dwvapp.com.br/integration/properties` (404)
- ❓ Precisa descobrir a URL correta

## 🔍 Próximos Passos

1. **Atualize a URL no Netlify para sandbox** (conforme Passo 1)
2. **Verifique o token no painel de integrações** (conforme Passo 2)
3. **Teste novamente** após atualizar
4. **Se ainda não funcionar**, contate o suporte do DWV

# 🔄 Sincronização Automática DWV

## 📋 O que foi implementado

1. **Botão MERGE funciona sem precisar de preview** ✅
2. **Paginação de 10 imóveis por página** na página de busca ✅
3. **Endpoint de sincronização automática** `/api/dwv/auto-sync` ✅

## 🚀 Como usar a sincronização automática

### Opção 1: Netlify Scheduled Functions (Recomendado)

1. **Criar arquivo de função agendada:**
   
   Crie o arquivo `netlify/functions/dwv-auto-sync.js`:
   
   ```javascript
   exports.handler = async (event, context) => {
     const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL
     const syncToken = process.env.DWV_AUTO_SYNC_TOKEN || 'change-me'
     
     try {
       const response = await fetch(`${siteUrl}/api/dwv/auto-sync`, {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${syncToken}`,
           'Content-Type': 'application/json',
         },
       })
       
       const data = await response.json()
       
       return {
         statusCode: 200,
         body: JSON.stringify({
           success: true,
           message: 'Sincronização automática executada',
           result: data,
         }),
       }
     } catch (error) {
       return {
         statusCode: 500,
         body: JSON.stringify({
           success: false,
           error: error.message,
         }),
       }
     }
   }
   ```

2. **Configurar schedule no `netlify.toml`:**
   
   Adicione ao `netlify.toml`:
   
   ```toml
   [functions]
     included_files = ["netlify/functions/**"]
   
   [[plugins]]
     package = "@netlify/plugin-scheduled-functions"
   
   [build]
     command = "npm run build"
     functions = "netlify/functions"
   ```

3. **Configurar variável de ambiente no Netlify:**
   - `DWV_AUTO_SYNC_TOKEN` - Token para autenticação (ex: uma string aleatória)
   
   Opcional: Use o mesmo token nas variáveis de ambiente para segurança.

4. **Agendar a execução:**
   
   Adicione ao `netlify.toml`:
   
   ```toml
   [[plugins]]
     package = "@netlify/plugin-scheduled-functions"
   
   [plugins.inputs]
     schedule = "0 * * * *"  # A cada hora (formato cron)
   ```

### Opção 2: Webhook externo

Você pode configurar um serviço externo (como Zapier, Make.com, ou um cron job no servidor) para chamar:

```
POST https://seu-site.netlify.app/api/dwv/auto-sync
Authorization: Bearer {DWV_AUTO_SYNC_TOKEN}
```

### Opção 3: Manual via interface

1. Acesse `/administrador/dwv-sync`
2. Clique em **"Sincronizar (MERGE)"**
3. Aguarde a conclusão

## ⚙️ Configurações necessárias

### Variáveis de ambiente no Netlify:

```
DWV_API_URL=https://agencies.dwvapp.com.br/integration/properties
DWV_API_TOKEN=seu_token_da_dwv
DWV_AUTO_SYNC_TOKEN=token_aleatorio_para_seguranca (opcional)
GITHUB_TOKEN=seu_token_do_github
```

## 📅 Formatos de schedule (cron)

- `0 * * * *` - A cada hora
- `0 */6 * * *` - A cada 6 horas
- `0 0 * * *` - Uma vez por dia (meia-noite)
- `0 0 * * 1` - Uma vez por semana (segunda-feira)
- `*/30 * * * *` - A cada 30 minutos

## 🔒 Segurança

Para proteger o endpoint de chamadas não autorizadas, defina `DWV_AUTO_SYNC_TOKEN` e envie no header:

```
Authorization: Bearer {DWV_AUTO_SYNC_TOKEN}
```

Se não configurar o token, o endpoint ainda funcionará, mas será público.

## 📊 O que acontece na sincronização

1. **Busca todos os imóveis** da API DWV (com paginação automática)
2. **Converte** para o formato do site
3. **Faz MERGE** com imóveis existentes:
   - Mantém imóveis que não vieram da DWV
   - Adiciona novos imóveis da DWV
   - Atualiza imóveis existentes (mesmo ID)
4. **Preserva dados** como visualizações e datas de criação
5. **Salva** no GitHub (`public/imoveis/imoveis.json`)

## 🔍 Logs

A sincronização automática gera logs que aparecem no Netlify Functions:
- `🔄 [AUTO-SYNC]` - Início da sincronização
- `📊 [AUTO-SYNC]` - Estatísticas
- `✅ [AUTO-SYNC]` - Sucesso
- `❌ [AUTO-SYNC]` - Erros

## ❓ Troubleshooting

**Problema:** Sincronização não executa automaticamente
- Verifique se o plugin `@netlify/plugin-scheduled-functions` está instalado
- Verifique se o schedule está correto no `netlify.toml`
- Verifique os logs do Netlify Functions

**Problema:** Erro 401 (Não autorizado)
- Verifique se `DWV_AUTO_SYNC_TOKEN` está configurado
- Verifique se o token no header está correto

**Problema:** Nenhum imóvel sincronizado
- Verifique se `DWV_API_TOKEN` está correto
- Verifique se `DWV_API_URL` está correto
- Verifique se há imóveis selecionados no painel DWV

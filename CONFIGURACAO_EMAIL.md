# 📧 Configuração de Email - Guia Completo

## ⚠️ Problema: Emails não estão chegando?

Siga este guia passo a passo para configurar corretamente.

## 🔧 Passo 1: Criar App Password no Gmail

1. **Acesse sua conta Google**: https://myaccount.google.com/
2. **Vá em Segurança** (menu lateral)
3. **Ative a Verificação em duas etapas** (se ainda não estiver ativada)
   - É obrigatório ter isso ativado para criar App Password
4. **Crie uma Senha de app**:
   - Role até "Senhas de app"
   - Clique em "Senhas de app"
   - Selecione "Email" como app
   - Selecione "Outro (nome personalizado)" como dispositivo
   - Digite: "Nox Imóveis Netlify"
   - Clique em "Gerar"
   - **COPIE A SENHA** (16 caracteres, sem espaços)

## 🔧 Passo 2: Configurar no Netlify

1. **Acesse o Netlify**: https://app.netlify.com/
2. **Vá no seu site** → **Site settings** → **Environment variables**
3. **Adicione estas variáveis**:

```
EMAIL_USER=imoveisnox@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

⚠️ **IMPORTANTE**: 
- Use a **App Password** que você copiou (não a senha normal do Gmail)
- Não coloque espaços na senha (se vier com espaços, remova-os)
- O valor deve ser exatamente 16 caracteres

## 🔧 Passo 3: Fazer Redeploy

Após adicionar as variáveis:
1. Vá em **Deploys**
2. Clique nos **3 pontinhos** do último deploy
3. Clique em **Trigger deploy** → **Clear cache and deploy site**

## 🔍 Como Verificar se Está Funcionando

### Opção 1: Verificar Logs do Netlify
1. Vá em **Functions** → **View logs**
2. Preencha um formulário no site
3. Veja os logs - deve aparecer:
   - `✅ Email enviado com sucesso!` (se funcionou)
   - `❌ Erro ao enviar email` (se não funcionou)

### Opção 2: Verificar no Console do Netlify
1. Vá em **Functions** → **View logs**
2. Procure por mensagens de erro relacionadas a email

## ❌ Erros Comuns

### Erro: "EAUTH" ou "Invalid login"
- **Causa**: App Password incorreta ou não configurada
- **Solução**: Verifique se copiou a App Password corretamente (16 caracteres)

### Erro: "EMAIL_PASSWORD não configurado"
- **Causa**: Variável de ambiente não foi adicionada no Netlify
- **Solução**: Adicione `EMAIL_PASSWORD` no Netlify e faça redeploy

### Erro: "ECONNECTION"
- **Causa**: Problema de rede ou firewall
- **Solução**: Verifique se o Netlify consegue acessar o Gmail

## ✅ Checklist

- [ ] Verificação em duas etapas ativada no Gmail
- [ ] App Password criada (16 caracteres)
- [ ] Variável `EMAIL_USER` configurada no Netlify
- [ ] Variável `EMAIL_PASSWORD` configurada no Netlify (com App Password)
- [ ] Redeploy feito após configurar variáveis
- [ ] Testou preenchendo um formulário
- [ ] Verificou os logs do Netlify

## 🆘 Ainda não funciona?

1. Verifique os logs do Netlify (Functions → View logs)
2. Copie a mensagem de erro completa
3. Verifique se as variáveis estão configuradas corretamente
4. Tente criar uma nova App Password


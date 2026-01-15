# 📧 Template de Solicitação para T.I do DWV

## Opção 1: Email Formal

**Assunto:** Solicitação de Documentação da API para Integração

---

Prezado(a) equipe técnica do DWV,

Estou integrando o sistema DWV ao nosso site imobiliário e preciso das seguintes informações técnicas para realizar a integração:

**1. Endpoint da API:**
- URL base da API
- Endpoint específico para listar/buscar imóveis
- Versão da API (se aplicável)

**2. Autenticação:**
- Método de autenticação (Bearer Token, API Key, etc.)
- Formato do header ou parâmetro de autenticação
- Token/credencial de acesso (já possuo o token, mas preciso confirmar o formato de uso)

**3. Documentação Técnica:**
- Documentação da API (Swagger, Postman Collection, PDF, etc.)
- Exemplo de requisição (curl, Postman, etc.)
- Exemplo de resposta JSON com todos os campos disponíveis

**4. Informações Adicionais:**
- Limites de requisições (rate limiting)
- Paginação (se houver muitos imóveis)
- Filtros disponíveis (cidade, tipo, status, etc.)
- Campos obrigatórios vs opcionais

**5. Suporte:**
- Contato para dúvidas técnicas durante a integração
- Canal de suporte (email, telefone, ticket system)

Agradeço desde já pela atenção e aguardo retorno.

Atenciosamente,
[Seu Nome]
[Empresa]
[Contato]

---

## Opção 2: Mensagem Mais Direta (WhatsApp/Telegram)

Olá! Preciso integrar a API do DWV no nosso site. Podem me passar:

1. URL da API para buscar imóveis
2. Como usar o token (header, query param, etc.)
3. Um exemplo de resposta JSON ou a documentação

Já tenho o token, só preciso saber como usar corretamente.

Obrigado!

---

## Opção 3: Lista de Perguntas Específicas

**Para o T.I do DWV:**

Olá! Estou fazendo a integração da API DWV e preciso das seguintes informações:

1. **URL da API:**
   - Qual é a URL completa para buscar/listar imóveis?
   - Exemplo: `https://api.dwv.com.br/v1/imoveis` ou similar?

2. **Autenticação:**
   - Como devo enviar o token?
   - Header: `Authorization: Bearer TOKEN`?
   - Ou: `Authorization: Token TOKEN`?
   - Ou: Query parameter `?token=TOKEN`?

3. **Exemplo de Requisição:**
   - Pode me enviar um exemplo de como fazer a requisição?
   - Exemplo curl ou Postman seria perfeito!

4. **Exemplo de Resposta:**
   - Pode me enviar um exemplo de resposta JSON com um imóvel completo?
   - Isso me ajuda a mapear os campos corretamente.

5. **Documentação:**
   - Existe documentação da API (Swagger, Postman Collection, PDF)?
   - Se sim, onde posso acessar?

6. **Limitações:**
   - Há limite de requisições por minuto/hora?
   - Como funciona a paginação (se houver muitos imóveis)?

Muito obrigado pela ajuda!

---

## O que você deve receber de volta:

✅ **URL da API** - Exemplo: `https://api.dwv.com.br/v1/properties`

✅ **Formato de autenticação** - Exemplo: 
```bash
Authorization: Bearer seu_token_aqui
```

✅ **Exemplo de requisição** - Exemplo:
```bash
curl -X GET "https://api.dwv.com.br/v1/properties" \
  -H "Authorization: Bearer seu_token_aqui"
```

✅ **Exemplo de resposta JSON** - Exemplo:
```json
{
  "data": [
    {
      "id": "12345",
      "codigo": "APT001",
      "titulo": "Apartamento 2 quartos",
      "preco": 350000,
      "cidade": "Penha",
      "bairro": "Centro",
      "quartos": 2,
      "banheiros": 2,
      "vagas": 1,
      "area": 65,
      "fotos": ["url1", "url2"],
      ...
    }
  ]
}
```

✅ **Documentação** - Link ou arquivo com todos os detalhes

---

## Dicas para a conversa:

1. **Seja específico:** Peça exatamente o que precisa (URL, token format, exemplo JSON)

2. **Mencione o propósito:** Diga que é para integração automática no site

3. **Peça exemplos:** Um exemplo real vale mais que 1000 palavras

4. **Seja educado:** T.I geralmente está ocupado, seja direto mas educado

5. **Ofereça testar:** Diga que você pode testar e dar feedback se algo não funcionar

---

## Após receber as informações:

Envie para mim (o desenvolvedor) e eu ajusto o código automaticamente! 🚀

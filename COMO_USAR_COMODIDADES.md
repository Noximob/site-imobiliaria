# 🏷️ Como Usar Comodidades/Tags nos Imóveis

## 📝 Forma Mais Simples

Para adicionar comodidades aos imóveis, você pode escrever as palavras-chave **em qualquer lugar** do descritivo do imóvel no DWV:

### ✅ Comodidades Disponíveis

#### 1. **Frente Mar**
Escreva qualquer uma dessas opções:
- `Frente Mar`
- `Frente ao Mar`
- `Frente do Mar`
- `Beira Mar`
- Ou simplesmente `frente` e `mar` próximos (até 50 caracteres)

**Onde escrever:** No título do imóvel, no tópico do descritivo, ou em qualquer item do descritivo.

#### 2. **Vista Mar**
- `Vista Mar`
- `Vista para o Mar`
- `Vista do Mar`
- Ou `vista` e `mar` próximos

#### 3. **Quadra Mar**
- `Quadra Mar`
- `Quadra do Mar`
- `1 Quadra do Mar`
- Ou `quadra` e `mar` próximos

#### 4. **Mobiliado**
- `Mobiliado`
- `Mobiliada`
- `Totalmente Mobiliado`
- `Completo Mobiliado`

#### 5. **Área de Lazer**
- `Área de Lazer`
- `Área Lazer`
- `Lazer Completo`
- `Espaço de Lazer`

#### 6. **Home Club**
- `Home Club`
- `Home Club Completo`
- `Clube Completo`
- `Clube`

## 🎯 Exemplos Práticos

### Exemplo 1: No Título
```
Apartamento Frente Mar em Penha
```
✅ Detecta automaticamente: **Frente Mar**

### Exemplo 2: No Tópico do Descritivo
```
Tópico: Frente Mar
```
✅ Detecta automaticamente: **Frente Mar**

### Exemplo 3: No Meio do Texto
```
Apartamento com vista mar e totalmente mobiliado...
```
✅ Detecta automaticamente: **Vista Mar** e **Mobiliado**

### Exemplo 4: Palavras Separadas
```
Apartamento frente à praia, com mar ao lado...
```
✅ Detecta automaticamente: **Frente Mar** (palavras "frente" e "mar" próximas)

## ⚙️ Como Funciona

1. **Busca Automática**: O sistema busca automaticamente essas palavras-chave em:
   - Título do imóvel
   - Título das seções do descritivo
   - Itens do descritivo
   - Descrição completa

2. **Flexível**: Não precisa escrever exatamente igual. O sistema:
   - Ignora maiúsculas/minúsculas
   - Ignora acentos
   - Aceita variações das palavras

3. **Sincronização**: Após adicionar no DWV:
   - Vá em `/administrador/dwv-sync`
   - Clique em "Sincronizar"
   - As tags serão extraídas automaticamente

## 🔍 Verificar se Funcionou

1. Sincronize o imóvel
2. Vá em `/imoveis`
3. Use o filtro de comodidades
4. O imóvel deve aparecer nos resultados

## 💡 Dica

**A forma mais fácil:** Escreva a comodidade no **título do imóvel** ou no **primeiro tópico do descritivo**. Assim fica mais visível e o sistema detecta com certeza!

---

**Problemas?** Verifique os logs da sincronização para ver se a tag foi detectada.

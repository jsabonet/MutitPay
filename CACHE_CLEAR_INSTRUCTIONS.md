# Instruções para Limpar Cache de Produtos

## Problema
O frontend está mostrando produtos que já foram deletados em produção devido ao cache do navegador.

## Solução Implementada
✅ **Código atualizado** com cache-busting automático:
- `useFeaturedProducts()` agora adiciona timestamp `_t` nas requisições
- `useBestsellerProducts()` agora adiciona timestamp `_t` nas requisições
- Isso força o navegador a buscar dados frescos do servidor

## Como Aplicar a Correção em Produção

### 1. Build do Frontend
```bash
cd d:\Projectos\MutitPay\frontend
npm run build
```

### 2. Deploy para o Servidor
```bash
# Copiar arquivos compilados
scp -r d:\Projectos\MutitPay\frontend\dist\* root@134.122.71.250:/var/www/mutitpay/frontend/dist/

# Reiniciar container
ssh root@134.122.71.250 "docker restart mutitpay-frontend-1"
```

### 3. Limpar Cache do Navegador (IMPORTANTE)

#### Chrome/Edge:
1. Pressione `Ctrl + Shift + Delete`
2. Selecione "Imagens e arquivos em cache"
3. Selecione "Cookies e outros dados de sites"
4. Clique em "Limpar dados"

**OU** em modo desenvolvedor:
1. Pressione `F12` para abrir DevTools
2. Clique com botão direito no ícone de recarregar
3. Selecione "Esvaziar cache e atualizar forçadamente"

#### Firefox:
1. Pressione `Ctrl + Shift + Delete`
2. Selecione "Cache" e "Cookies"
3. Clique em "Limpar Agora"

#### Safari:
1. Pressione `Cmd + Option + E` (limpa cache)
2. Pressione `Cmd + R` (recarrega página)

### 4. Verificação

Após limpar o cache:
1. Acesse a página inicial: `https://mutitpay.co.mz`
2. Abra o DevTools (F12)
3. Vá para aba "Network"
4. Recarregue a página
5. Verifique se as requisições para `/api/products/featured/` e `/api/products/bestsellers/` incluem `?_t=` com timestamp
6. Confirme que apenas produtos ativos aparecem

## Comandos de Deploy Completo

```bash
# 1. Build local
cd d:\Projectos\MutitPay\frontend
npm run build

# 2. Git commit
cd d:\Projectos\MutitPay
git add frontend/src/hooks/useApi.ts frontend/src/lib/api.ts
git commit -m "fix: Add cache-busting for featured and bestseller products"
git push origin main

# 3. Deploy no servidor
ssh root@134.122.71.250
cd /var/www/mutitpay
git pull origin main
cd frontend
npm run build
docker restart mutitpay-frontend-1
exit
```

## Prevenir Problemas Futuros

A correção implementada adiciona automaticamente um timestamp único a cada requisição, garantindo que o navegador sempre busque dados frescos do servidor. Isso elimina problemas de cache para produtos em destaque e bestsellers.

## Notas Técnicas

- **Service Worker**: Já configurado para NÃO fazer cache (`sw.js`)
- **Cache-busting**: Parâmetro `_t` com timestamp atual
- **Backend**: Deve ignorar parâmetros desconhecidos (Django faz isso por padrão)
- **Performance**: Impacto mínimo, apenas 10-15 caracteres extras na URL

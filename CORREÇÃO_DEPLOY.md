# 🔧 CORREÇÃO - Assets não carregando após deploy

## 📋 Problemas Identificados

### 1. **CSS/JS não carregando (404)**
**Causa:** O Nginx estava retornando `index.html` para TODAS as requisições, incluindo arquivos `.js` e `.css`.

**Solução:** Reorganizada a ordem dos `location` blocks no Nginx:
- Primeiro: servir assets estáticos (`/assets/*`)
- Depois: proxy da API (`/api/`)
- Por último: SPA fallback (`/`)

### 2. **API com HTTPS em vez de HTTP**
**Causa:** O frontend estava tentando conectar via `https://134.122.71.250/api/` (conexão recusada).

**Solução:** 
- Criado `.env.production` no frontend com `VITE_API_BASE_URL=/api`
- Atualizado `.env.server` para incluir a variável
- Agora o frontend usa URL relativa `/api` que o Nginx faz proxy para o backend

## 📁 Arquivos Modificados

1. **`frontend/deploy/nginx/default.conf`**
   - Adicionado location específico para `/assets/`
   - Reordenado locations para priorizar assets
   - Adicionado endpoint `/health` para healthcheck

2. **`frontend/.env.production`** (NOVO)
   - Define `VITE_API_BASE_URL=/api`

3. **`.env.server`**
   - Adicionado `VITE_API_BASE_URL=/api`

4. **`deploy_fixed.sh`** (NOVO)
   - Script de deploy melhorado com rebuild completo

## 🚀 Como Fazer o Deploy

### No Servidor (SSH):

```bash
# 1. Entre no diretório do projeto
cd /var/www/mutitpay

# 2. Dê permissão de execução ao script
chmod +x deploy_fixed.sh

# 3. Execute o script de deploy
./deploy_fixed.sh
```

O script vai:
1. ✅ Fazer `git pull` das últimas alterações
2. ✅ Parar os containers
3. ✅ Fazer rebuild do frontend (sem cache)
4. ✅ Perguntar se quer rebuild do backend
5. ✅ Iniciar os containers
6. ✅ Mostrar status e logs

### Deploy Manual (alternativa):

```bash
cd /var/www/mutitpay

# Puxar alterações
git pull origin main

# Parar tudo
docker-compose down

# Rebuild do frontend (IMPORTANTE: --no-cache)
docker-compose build --no-cache frontend

# Subir novamente
docker-compose up -d

# Verificar logs
docker-compose logs -f frontend
```

## ✅ Verificação

Após o deploy, verifique:

1. **Assets carregando:**
   ```bash
   curl -I http://134.122.71.250/assets/css/index-XXXXX.css
   # Deve retornar: HTTP/1.1 200 OK
   ```

2. **API funcionando:**
   ```bash
   curl http://134.122.71.250/api/health/
   # Deve retornar: 200 OK
   ```

3. **No navegador:**
   - Abra DevTools (F12)
   - Aba Network
   - Recarregue a página (Ctrl+Shift+R)
   - Verifique se os arquivos `.js` e `.css` retornam 200

## 🐛 Troubleshooting

### CSS/JS ainda não carregam

```bash
# Verifique se o arquivo existe no container
docker-compose exec frontend ls -la /usr/share/nginx/html/assets/

# Veja os logs do nginx
docker-compose logs frontend | grep -i error

# Rebuild forçado
docker-compose down
docker-compose build --no-cache frontend
docker-compose up -d
```

### API ainda usa HTTPS

```bash
# Verifique se o .env.production foi copiado no build
docker-compose exec frontend cat /app/.env.production

# Se não existir, rebuild é necessário
docker-compose build --no-cache frontend
```

### Container não inicia

```bash
# Veja os logs detalhados
docker-compose logs backend
docker-compose logs frontend

# Verifique o status
docker-compose ps
```

## 📝 Notas Importantes

1. **Sempre use `--no-cache`** ao fazer rebuild do frontend para garantir que as mudanças sejam aplicadas
2. **Limpe o cache do navegador** após o deploy (Ctrl+Shift+R)
3. **Variáveis de ambiente** são definidas em tempo de BUILD do Vite, não em runtime
4. **O arquivo `.env`** no servidor deve conter as mesmas variáveis do `.env.server`

## 🎯 Próximos Passos (Recomendado)

1. **Configurar HTTPS** com Let's Encrypt/Certbot
2. **Adicionar domínio** em vez de usar IP
3. **Configurar firewall** (UFW) para permitir apenas portas 80/443
4. **Backup automático** do banco de dados
5. **Monitoramento** com logs centralizados

---

**Data da correção:** 10 de Novembro de 2025
**Status:** ✅ Pronto para deploy

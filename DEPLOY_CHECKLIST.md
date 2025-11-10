# 📋 MUTIT PAY - Checklist de Deploy

Use este checklist para garantir que todos os passos foram concluídos corretamente.

## 🏗️ Fase 1: Preparação do Servidor (Digital Ocean)

- [ ] Criar conta na Digital Ocean
- [ ] Criar Droplet (Ubuntu 22.04, mínimo 2GB RAM)
- [ ] Anotar IP do Droplet: `_______________`
- [ ] Configurar SSH key para acesso seguro
- [ ] Testar conexão SSH: `ssh root@IP_DROPLET`

## 🌐 Fase 2: Configuração DNS

- [ ] Acessar painel de DNS do domínio
- [ ] Criar registro A: `@` → `IP_DROPLET`
- [ ] Criar registro A: `www` → `IP_DROPLET`
- [ ] Aguardar propagação DNS (5-30 minutos)
- [ ] Testar: `ping mutitpay.com`
- [ ] Testar: `ping www.mutitpay.com`

## 🐳 Fase 3: Instalação Docker (no servidor)

```bash
# SSH no servidor
ssh root@IP_DROPLET

# Atualizar sistema
apt update && apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verificar instalações
docker --version
docker-compose --version
```

- [ ] Docker instalado: versão `_______________`
- [ ] Docker Compose instalado: versão `_______________`

## 🔧 Fase 4: Configuração do Servidor

```bash
# Criar diretórios
mkdir -p /var/www/mutitpay
mkdir -p /var/backups/mutitpay
mkdir -p /var/www/mutitpay/deploy/ssl

# Configurar firewall
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status
```

- [ ] Diretórios criados
- [ ] Firewall configurado (portas 22, 80, 443)

## 📝 Fase 5: Configuração Local

### 5.1 Variáveis de Ambiente

```bash
# Na sua máquina local
cp .env.production .env
nano .env
```

- [ ] Arquivo `.env` criado
- [ ] `SECRET_KEY` gerado (único e seguro)
- [ ] `DEBUG=False`
- [ ] `ALLOWED_HOSTS=mutitpay.com,www.mutitpay.com,IP_DROPLET`
- [ ] `DB_PASSWORD` definido (senha forte)
- [ ] `BREVO_API_KEY` configurado
- [ ] `PAYSUITE_API_KEY` configurado
- [ ] `PAYSUITE_WEBHOOK_SECRET` configurado
- [ ] Todas as credenciais Firebase preenchidas

**Gerar SECRET_KEY:**
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### 5.2 Script de Deploy

```bash
nano deploy.sh
# Alterar: DROPLET_IP="SEU_IP_AQUI"
chmod +x deploy.sh
```

- [ ] `deploy.sh` editado com IP correto
- [ ] Permissão de execução concedida

## 🚀 Fase 6: Deploy Inicial

```bash
./deploy.sh
```

- [ ] Script executado sem erros
- [ ] Arquivos enviados para servidor
- [ ] Containers iniciados
- [ ] Migrações aplicadas
- [ ] Arquivos estáticos coletados
- [ ] Health check passou

**Verificar:**
- [ ] Frontend acessível: `http://IP_DROPLET`
- [ ] API acessível: `http://IP_DROPLET/api/`
- [ ] Admin acessível: `http://IP_DROPLET/admin/`

## 👤 Fase 7: Criar Superusuário

```bash
ssh root@IP_DROPLET
cd /var/www/mutitpay
docker-compose exec backend python manage.py createsuperuser
```

- [ ] Superusuário criado
- [ ] Username: `_______________`
- [ ] Email: `_______________`
- [ ] Login admin testado

## 🔒 Fase 8: Configurar SSL/HTTPS

```bash
# No servidor
ssh root@IP_DROPLET

# Instalar certbot
apt install -y certbot

# Parar Nginx temporariamente
cd /var/www/mutitpay
docker-compose stop frontend

# Gerar certificados
certbot certonly --standalone \
  -d mutitpay.com \
  -d www.mutitpay.com \
  --email jsabonete09@gmail.com \
  --agree-tos \
  --non-interactive

# Copiar certificados
mkdir -p /var/www/mutitpay/deploy/ssl/live/mutitpay.com
cp -r /etc/letsencrypt/live/mutitpay.com/* /var/www/mutitpay/deploy/ssl/live/mutitpay.com/

# Descomentar seção HTTPS no nginx
nano /var/www/mutitpay/deploy/nginx/default.conf
# Descomentar linhas 205-229 (seção HTTPS)

# Reiniciar frontend
docker-compose up -d --build frontend

# Configurar renovação automática
echo "0 3 * * * certbot renew --quiet && docker-compose -f /var/www/mutitpay/docker-compose.yml restart frontend" | crontab -
```

- [ ] Certbot instalado
- [ ] Certificados SSL gerados
- [ ] Certificados copiados para projeto
- [ ] Configuração HTTPS descomentada
- [ ] Frontend reiniciado com HTTPS
- [ ] Renovação automática configurada
- [ ] HTTPS funcionando: `https://mutitpay.com`

## 🔧 Fase 9: Configurações Finais

### 9.1 Atualizar .env para HTTPS

```bash
# No servidor
nano /var/www/mutitpay/.env

# Alterar:
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

- [ ] Variáveis SSL atualizadas
- [ ] Backend reiniciado: `docker-compose restart backend`

### 9.2 Configurar Webhooks PaySuite

No painel do PaySuite:
- [ ] URL configurada: `https://mutitpay.com/api/paysuite/webhook/`
- [ ] Webhook secret configurado
- [ ] Webhook testado

### 9.3 Testar Emails Brevo

- [ ] Fazer pedido teste
- [ ] Verificar email de confirmação recebido
- [ ] Verificar email de status de pagamento
- [ ] Verificar todos os templates funcionando

## 📊 Fase 10: Monitoramento

### 10.1 Verificar Logs

```bash
# Ver logs em tempo real
ssh root@IP_DROPLET 'cd /var/www/mutitpay && docker-compose logs -f'

# Ver logs específicos
ssh root@IP_DROPLET 'cd /var/www/mutitpay && docker-compose logs backend'
ssh root@IP_DROPLET 'cd /var/www/mutitpay && docker-compose logs frontend'
ssh root@IP_DROPLET 'cd /var/www/mutitpay && docker-compose logs db'
```

- [ ] Logs do backend sem erros críticos
- [ ] Logs do frontend sem erros
- [ ] Logs do banco sem warnings

### 10.2 Verificar Containers

```bash
ssh root@IP_DROPLET 'cd /var/www/mutitpay && docker-compose ps'
```

- [ ] Container `db`: Up and healthy
- [ ] Container `backend`: Up and healthy
- [ ] Container `frontend`: Up and healthy

### 10.3 Health Checks

```bash
# Frontend health
curl https://mutitpay.com/health

# Backend health
curl https://mutitpay.com/api/health/
```

- [ ] Frontend health: OK
- [ ] Backend health: database connected

## 🔐 Fase 11: Segurança

- [ ] Senha do root alterada: `passwd root`
- [ ] Usuário não-root criado (opcional)
- [ ] SSH key-only configurado (opcional)
- [ ] Fail2Ban instalado (opcional): `apt install fail2ban`
- [ ] Backups automáticos configurados

## 📈 Fase 12: Performance

- [ ] Swap configurado (se Droplet < 4GB RAM)
- [ ] Gunicorn workers ajustados conforme CPU
- [ ] Cache headers verificados
- [ ] Compressão Gzip/Brotli ativa
- [ ] CDN configurado (opcional)

## ✅ Verificação Final

### Testes Funcionais

- [ ] **Frontend**
  - [ ] Homepage carrega corretamente
  - [ ] Produtos listados
  - [ ] Carrinho funciona
  - [ ] Checkout funciona
  - [ ] Login/Register funciona

- [ ] **Backend API**
  - [ ] Endpoints respondem
  - [ ] Autenticação funciona
  - [ ] CORS configurado corretamente

- [ ] **Pagamentos**
  - [ ] PaySuite integrado
  - [ ] Webhook recebendo notificações
  - [ ] Status de pedidos atualizando

- [ ] **Emails**
  - [ ] Confirmação de pedido enviado
  - [ ] Status de pagamento enviado
  - [ ] Emails admin funcionando

- [ ] **Admin**
  - [ ] Login admin funciona
  - [ ] Produtos gerenciáveis
  - [ ] Pedidos visíveis
  - [ ] Exportação funciona

### Testes de Performance

- [ ] Tempo de carregamento < 3s
- [ ] Assets comprimidos (gzip/brotli)
- [ ] Cache headers configurados
- [ ] SSL Labs score: A+ (https://www.ssllabs.com/ssltest/)

### Testes de Segurança

- [ ] HTTPS funcionando
- [ ] Redirecionamento HTTP → HTTPS
- [ ] Security headers presentes
- [ ] Rate limiting ativo
- [ ] CORS restrito
- [ ] Debug mode desabilitado

## 📞 Suporte

- [ ] Documentação lida: `DEPLOY.md`
- [ ] Email de suporte anotado: `jsabonete09@gmail.com`
- [ ] Backup de recuperação testado

## 🎉 Deploy Completo!

- [ ] **Todos os itens acima marcados**
- [ ] **Aplicação funcionando em produção**
- [ ] **SSL/HTTPS ativo**
- [ ] **Monitoramento configurado**
- [ ] **Backups automáticos rodando**

---

**Data do Deploy:** `_______________`

**Versão:** `1.0.0`

**Responsável:** `_______________`

**MUTIT PAY** - Boutique Premium de Tecnologia 🏆

Deploy realizado com sucesso! ✨

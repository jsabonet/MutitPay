# 🚀 MUTIT PAY - Guia de Deploy na Digital Ocean

Este guia fornece instruções completas para fazer deploy do MUTIT PAY na Digital Ocean usando Docker.

## 📋 Pré-requisitos

- Conta na [Digital Ocean](https://www.digitalocean.com/)
- Domínio configurado (mutitpay.com)
- Credenciais do Brevo (Email Service)
- Credenciais do PaySuite (Payment Gateway)
- Credenciais do Firebase (Authentication)
- Git instalado localmente
- SSH configurado

## 🖥️ 1. Criar Droplet na Digital Ocean

### 1.1 Configuração do Droplet

1. Acesse [Digital Ocean](https://cloud.digitalocean.com/)
2. Clique em **Create** → **Droplets**
3. Configure:
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic (Shared CPU)
   - **CPU Options**: Regular - $12/mo (2 GB RAM, 1 vCPU, 50 GB SSD)
   - **Datacenter**: Escolha a região mais próxima (ex: Frankfurt para Europa/África)
   - **Authentication**: SSH Key (recomendado) ou Password
   - **Hostname**: mutitpay-production
4. Clique em **Create Droplet**
5. Anote o **IP do Droplet** (ex: 164.90.XXX.XXX)

## 🌐 2. Configurar DNS do Domínio

Configure os registros DNS para apontar para o IP do Droplet:

```
A Record:  @           → 164.90.XXX.XXX (seu IP)
A Record:  www         → 164.90.XXX.XXX (seu IP)
CNAME:     api         → mutitpay.com
```

Aguarde a propagação DNS (pode levar até 48h, mas geralmente 5-30 minutos).

## 🔧 3. Configurar Servidor (SSH no Droplet)

### 3.1 Conectar ao Droplet

```bash
ssh root@SEU_IP_DROPLET
```

### 3.2 Atualizar Sistema

```bash
apt update && apt upgrade -y
```

### 3.3 Instalar Docker

```bash
# Instalar dependências
apt install -y apt-transport-https ca-certificates curl software-properties-common

# Adicionar repositório Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io

# Verificar instalação
docker --version
```

### 3.4 Instalar Docker Compose

```bash
# Baixar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Dar permissão de execução
chmod +x /usr/local/bin/docker-compose

# Verificar instalação
docker-compose --version
```

### 3.5 Criar Diretórios do Projeto

```bash
mkdir -p /var/www/mutitpay
mkdir -p /var/backups/mutitpay
mkdir -p /var/www/mutitpay/deploy/ssl
```

### 3.6 Configurar Firewall

```bash
# Configurar UFW (Uncomplicated Firewall)
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

## 📦 4. Preparar Projeto Local

### 4.1 Configurar Variáveis de Ambiente

```bash
# Na sua máquina local, no diretório do projeto
cp .env.production .env

# Edite .env com seus dados reais:
nano .env
```

Preencha os valores necessários:

```bash
# Django
SECRET_KEY=GERE-UMA-CHAVE-SEGURA-AQUI
DEBUG=False
ALLOWED_HOSTS=mutitpay.com,www.mutitpay.com,SEU_IP_DROPLET

# Database
DB_PASSWORD=senha-forte-postgresql

# Brevo (já configurado)
BREVO_API_KEY=xsmtpsib-c6db1dacdc17f7b09af060e6b67815cfd1f8e8126311

# PaySuite
PAYSUITE_API_KEY=sua-chave-paysuite
PAYSUITE_WEBHOOK_SECRET=seu-webhook-secret

# Firebase (já configurado)
VITE_FIREBASE_API_KEY=AIzaSyBeBr6s7AH1PZBs1LA0UxZuU6Dbf25Wbss
```

**Gerar SECRET_KEY:**
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### 4.2 Configurar Script de Deploy

```bash
# Edite deploy.sh
nano deploy.sh

# Altere DROPLET_IP para o IP do seu servidor
DROPLET_IP="164.90.XXX.XXX"
```

### 4.3 Dar Permissão de Execução

```bash
chmod +x deploy.sh
```

## 🚀 5. Deploy Inicial

### 5.1 Executar Deploy

```bash
./deploy.sh
```

Este script vai:
1. ✅ Verificar conexão com o servidor
2. ✅ Criar backup (se já existir versão anterior)
3. ✅ Enviar arquivos via rsync
4. ✅ Configurar variáveis de ambiente
5. ✅ Construir imagens Docker
6. ✅ Iniciar containers
7. ✅ Aplicar migrações do banco
8. ✅ Coletar arquivos estáticos
9. ✅ Verificar saúde da aplicação

### 5.2 Verificar Deploy

Acesse no navegador:
- Frontend: `http://SEU_IP_DROPLET` ou `http://mutitpay.com`
- Backend API: `http://SEU_IP_DROPLET/api/`
- Admin: `http://SEU_IP_DROPLET/admin/`

## 🔒 6. Configurar SSL/HTTPS com Let's Encrypt

### 6.1 Conectar ao Servidor

```bash
ssh root@SEU_IP_DROPLET
cd /var/www/mutitpay
```

### 6.2 Instalar Certbot

```bash
apt install -y certbot python3-certbot-nginx
```

### 6.3 Parar Nginx Temporariamente

```bash
docker-compose stop frontend
```

### 6.4 Gerar Certificados SSL

```bash
certbot certonly --standalone -d mutitpay.com -d www.mutitpay.com --email jsabonete09@gmail.com --agree-tos --non-interactive
```

### 6.5 Copiar Certificados

```bash
mkdir -p /var/www/mutitpay/deploy/ssl/live/mutitpay.com
cp -r /etc/letsencrypt/live/mutitpay.com/* /var/www/mutitpay/deploy/ssl/live/mutitpay.com/
cp -r /etc/letsencrypt/archive /var/www/mutitpay/deploy/ssl/
```

### 6.6 Descomentar Configuração HTTPS no Nginx

Edite `deploy/nginx/default.conf` e descomente a seção HTTPS (linhas 205-229).

### 6.7 Reiniciar Containers

```bash
docker-compose up -d --build frontend
```

### 6.8 Configurar Renovação Automática

```bash
# Adicionar cronjob para renovação automática
echo "0 3 * * * certbot renew --quiet && docker-compose -f /var/www/mutitpay/docker-compose.yml restart frontend" | crontab -
```

### 6.9 Atualizar .env

```bash
nano .env

# Alterar para HTTPS
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### 6.10 Reiniciar Backend

```bash
docker-compose restart backend
```

## 📊 7. Monitoramento e Manutenção

### 7.1 Ver Logs

```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend

# Apenas database
docker-compose logs -f db
```

### 7.2 Status dos Containers

```bash
docker-compose ps
```

### 7.3 Reiniciar Serviços

```bash
# Todos
docker-compose restart

# Específico
docker-compose restart backend
docker-compose restart frontend
docker-compose restart db
```

### 7.4 Backup Manual do Banco

```bash
# Criar backup
docker-compose exec db pg_dump -U mutitpay_user mutit_pay > /var/backups/mutitpay/db_backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker-compose exec -T db psql -U mutitpay_user mutit_pay < /var/backups/mutitpay/db_backup_XXXXXXXX_XXXXXX.sql
```

### 7.5 Atualizar Aplicação

```bash
# Na máquina local
./deploy.sh

# Ou manualmente no servidor
cd /var/www/mutitpay
git pull  # Se usar git
docker-compose down
docker-compose build --no-cache
docker-compose up -d
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py collectstatic --noinput
```

## 🔧 8. Comandos Úteis

### 8.1 Django Management

```bash
# Criar superusuário
docker-compose exec backend python manage.py createsuperuser

# Acessar shell Django
docker-compose exec backend python manage.py shell

# Ver migrações
docker-compose exec backend python manage.py showmigrations

# Fazer migrate específico
docker-compose exec backend python manage.py migrate app_name
```

### 8.2 PostgreSQL

```bash
# Acessar banco de dados
docker-compose exec db psql -U mutitpay_user mutit_pay

# Ver tabelas
docker-compose exec db psql -U mutitpay_user mutit_pay -c "\dt"

# Executar query
docker-compose exec db psql -U mutitpay_user mutit_pay -c "SELECT * FROM auth_user LIMIT 5;"
```

### 8.3 Limpeza

```bash
# Remover containers parados
docker container prune -f

# Remover imagens não utilizadas
docker image prune -a -f

# Remover volumes não utilizados (CUIDADO!)
docker volume prune -f

# Limpeza completa
docker system prune -a -f --volumes
```

## 🛡️ 9. Segurança

### 9.1 Mudar Senha do Root

```bash
passwd root
```

### 9.2 Criar Usuário Não-Root

```bash
adduser deploy
usermod -aG sudo deploy
usermod -aG docker deploy

# Testar login
su - deploy
```

### 9.3 Configurar SSH Key-Only

```bash
nano /etc/ssh/sshd_config

# Alterar:
PasswordAuthentication no
PermitRootLogin no

# Reiniciar SSH
systemctl restart sshd
```

### 9.4 Fail2Ban (Proteção contra Brute Force)

```bash
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

## 📈 10. Otimizações de Performance

### 10.1 Configurar Swap (para Droplets pequenos)

```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
```

### 10.2 Aumentar Workers do Gunicorn

Edite `.env`:
```bash
GUNICORN_WORKERS=4  # (2 x CPU cores) + 1
```

### 10.3 Configurar Redis para Cache (Opcional)

Adicione ao `docker-compose.yml`:
```yaml
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data
    networks:
      - mutitpay_network
```

## 🐛 11. Troubleshooting

### 11.1 Containers não iniciam

```bash
docker-compose logs
docker-compose down
docker-compose up -d
```

### 11.2 Banco de dados não conecta

```bash
# Verificar status do PostgreSQL
docker-compose exec db pg_isready -U mutitpay_user

# Verificar variáveis de ambiente
docker-compose exec backend env | grep DB
```

### 11.3 Frontend não carrega

```bash
# Verificar configuração Nginx
docker-compose exec frontend nginx -t

# Ver logs Nginx
docker-compose logs frontend
```

### 11.4 SSL não funciona

```bash
# Verificar certificados
ls -la /var/www/mutitpay/deploy/ssl/live/mutitpay.com/

# Testar SSL
openssl s_client -connect mutitpay.com:443 -servername mutitpay.com
```

## 📞 12. Suporte

- **Email**: jsabonete09@gmail.com
- **Logs**: `/var/log/nginx/` e `docker-compose logs`
- **Documentação Docker**: https://docs.docker.com/
- **Digital Ocean Docs**: https://docs.digitalocean.com/

## ✅ Checklist Final

- [ ] Droplet criado e configurado
- [ ] DNS apontando para o IP do Droplet
- [ ] Docker e Docker Compose instalados
- [ ] .env configurado com valores de produção
- [ ] Deploy executado com sucesso
- [ ] SSL configurado e funcionando
- [ ] Backup automático configurado
- [ ] Firewall configurado
- [ ] Monitoramento configurado
- [ ] Superusuário admin criado
- [ ] PaySuite webhook configurado
- [ ] Brevo emails testados

---

**MUTIT PAY** - Boutique Premium de Tecnologia 🏆

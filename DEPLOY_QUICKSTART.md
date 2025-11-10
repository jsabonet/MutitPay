# ====================================
# MUTIT PAY - Quick Deploy Reference
# ====================================

## 🚀 Deploy Rápido

### Pré-requisitos
1. ✅ Droplet Digital Ocean criado (Ubuntu 22.04)
2. ✅ Docker e Docker Compose instalados no servidor
3. ✅ DNS configurado (mutitpay.com → IP do droplet)
4. ✅ .env.production preenchido com valores reais

### Deploy em 3 Passos

```bash
# 1. Configure o IP do servidor
nano deploy.sh
# Altere: DROPLET_IP="164.90.XXX.XXX"

# 2. Configure variáveis de ambiente
cp .env.production .env
nano .env
# Preencha: SECRET_KEY, DB_PASSWORD, PAYSUITE_API_KEY, etc.

# 3. Execute o deploy
chmod +x deploy.sh
./deploy.sh
```

### Primeiro Deploy no Servidor

```bash
# SSH no servidor
ssh root@SEU_IP

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Criar diretórios
mkdir -p /var/www/mutitpay /var/backups/mutitpay

# Configurar firewall
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Agora execute deploy.sh na sua máquina local
```

### Após Deploy

```bash
# Criar superusuário admin
ssh root@SEU_IP
cd /var/www/mutitpay
docker-compose exec backend python manage.py createsuperuser

# Configurar SSL (depois que DNS propagar)
ssh root@SEU_IP
apt install -y certbot
docker-compose stop frontend
certbot certonly --standalone -d mutitpay.com -d www.mutitpay.com --email jsabonete09@gmail.com --agree-tos
mkdir -p /var/www/mutitpay/deploy/ssl/live/mutitpay.com
cp -r /etc/letsencrypt/live/mutitpay.com/* /var/www/mutitpay/deploy/ssl/live/mutitpay.com/
docker-compose up -d

# Configurar renovação automática SSL
echo "0 3 * * * certbot renew --quiet && docker-compose -f /var/www/mutitpay/docker-compose.yml restart frontend" | crontab -
```

## 📊 Comandos Úteis

### Ver Logs
```bash
ssh root@SEU_IP 'cd /var/www/mutitpay && docker-compose logs -f'
```

### Reiniciar Serviços
```bash
ssh root@SEU_IP 'cd /var/www/mutitpay && docker-compose restart'
```

### Backup Manual
```bash
ssh root@SEU_IP 'cd /var/www/mutitpay && docker-compose exec db pg_dump -U mutitpay_user mutit_pay > /var/backups/mutitpay/backup_$(date +%Y%m%d).sql'
```

### Atualizar Código
```bash
# Na máquina local
./deploy.sh
```

## 🔒 Checklist de Segurança

- [ ] SECRET_KEY único e forte
- [ ] DEBUG=False em produção
- [ ] Senha forte do PostgreSQL
- [ ] Firewall configurado (UFW)
- [ ] SSL configurado (HTTPS)
- [ ] Senha root alterada
- [ ] SSH key-only (desabilitar senha)
- [ ] Fail2Ban instalado
- [ ] Backup automático configurado

## 📞 Troubleshooting

### Site não carrega
```bash
# Verificar containers
ssh root@SEU_IP 'cd /var/www/mutitpay && docker-compose ps'

# Ver logs
ssh root@SEU_IP 'cd /var/www/mutitpay && docker-compose logs'

# Reiniciar
ssh root@SEU_IP 'cd /var/www/mutitpay && docker-compose restart'
```

### Banco não conecta
```bash
ssh root@SEU_IP 'cd /var/www/mutitpay && docker-compose exec db pg_isready -U mutitpay_user'
```

### Erro 502 Bad Gateway
```bash
# Backend não está respondendo
ssh root@SEU_IP 'cd /var/www/mutitpay && docker-compose logs backend'
ssh root@SEU_IP 'cd /var/www/mutitpay && docker-compose restart backend'
```

## 🎯 URLs Importantes

- **Frontend**: https://mutitpay.com
- **Admin**: https://mutitpay.com/admin/
- **API**: https://mutitpay.com/api/
- **Health Check**: https://mutitpay.com/health

---

Para documentação completa, veja **DEPLOY.md**

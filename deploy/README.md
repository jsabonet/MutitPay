# 📦 MUTIT PAY - Arquivos de Deploy

Esta pasta contém todos os arquivos necessários para fazer deploy do MUTIT PAY na Digital Ocean.

## 📁 Estrutura

```
deploy/
├── nginx/
│   └── default.conf          # Configuração Nginx para produção
└── ssl/
    └── README.md              # Instruções para certificados SSL
```

## 🚀 Arquivos de Deploy na Raiz do Projeto

- **DEPLOY.md** - Documentação completa de deploy (LEIA PRIMEIRO!)
- **DEPLOY_QUICKSTART.md** - Referência rápida para deploy
- **.env.production** - Template de variáveis de ambiente para produção
- **docker-compose.yml** - Orquestração dos containers Docker
- **deploy.sh** - Script automatizado de deploy (Linux/Mac)
- **deploy_windows.sh** - Script de deploy para Windows/Git Bash
- **.dockerignore** - Arquivos excluídos do build Docker

## 📋 Checklist de Configuração

### Antes do Deploy

1. ✅ **Criar Droplet na Digital Ocean**
   - Ubuntu 22.04 LTS
   - Mínimo: 2 GB RAM, 1 vCPU, 50 GB SSD
   - Configurar SSH key

2. ✅ **Configurar DNS**
   - Apontar mutitpay.com para IP do Droplet
   - Aguardar propagação (5-30 minutos)

3. ✅ **Configurar Servidor**
   - Instalar Docker
   - Instalar Docker Compose
   - Configurar firewall

4. ✅ **Configurar Variáveis de Ambiente**
   ```bash
   cp .env.production .env
   nano .env
   ```
   - SECRET_KEY (gerar nova chave)
   - DB_PASSWORD (senha forte)
   - ALLOWED_HOSTS (adicionar domínio e IP)
   - PAYSUITE_API_KEY (do painel PaySuite)
   - PAYSUITE_WEBHOOK_SECRET (do painel PaySuite)

5. ✅ **Configurar Script de Deploy**
   ```bash
   nano deploy.sh
   # Alterar DROPLET_IP="SEU_IP_AQUI"
   chmod +x deploy.sh
   ```

### Durante o Deploy

6. ✅ **Executar Deploy**
   ```bash
   ./deploy.sh
   ```

7. ✅ **Criar Superusuário Admin**
   ```bash
   ssh root@SEU_IP
   cd /var/www/mutitpay
   docker-compose exec backend python manage.py createsuperuser
   ```

8. ✅ **Configurar SSL (HTTPS)**
   - Seguir instruções em DEPLOY.md seção 6
   - Instalar certbot
   - Gerar certificados
   - Configurar renovação automática

### Após o Deploy

9. ✅ **Verificar Funcionamento**
   - Frontend: https://mutitpay.com
   - Admin: https://mutitpay.com/admin/
   - API: https://mutitpay.com/api/

10. ✅ **Configurar Webhooks PaySuite**
    - URL: https://mutitpay.com/api/paysuite/webhook/
    - Secret: valor de PAYSUITE_WEBHOOK_SECRET

11. ✅ **Testar Emails Brevo**
    - Fazer pedido teste
    - Verificar recebimento de emails

12. ✅ **Configurar Backup Automático**
    - Cronjob para backup do banco
    - Backup de media files

## 🔧 Configurações Importantes

### Nginx (`deploy/nginx/default.conf`)

- ✅ Proxy reverso para backend Django
- ✅ Servir frontend React/Vite
- ✅ Compressão Gzip e Brotli
- ✅ Cache headers otimizados
- ✅ Rate limiting para proteção
- ✅ Security headers
- ✅ SSL/HTTPS (descomentar após configurar)

### Docker Compose (`docker-compose.yml`)

- ✅ PostgreSQL 15 com healthcheck
- ✅ Backend Django com Gunicorn
- ✅ Frontend Nginx otimizado
- ✅ Volumes persistentes (db, media, static)
- ✅ Restart policies
- ✅ Network isolada
- ✅ Health checks

### Backend Dockerfile (`backend/Dockerfile`)

- ✅ Python 3.11 slim
- ✅ Dependências otimizadas
- ✅ Non-root user
- ✅ Requirements produção vs desenvolvimento
- ✅ Entrypoint para migrations e collectstatic

### Frontend Dockerfile (`frontend/Dockerfile`)

- ✅ Multi-stage build (Node → Nginx)
- ✅ Build otimizado do Vite/React
- ✅ Pre-compressão (gzip + brotli)
- ✅ Nginx Alpine (imagem pequena)
- ✅ Configuração Nginx customizada

## 📊 Monitoramento

### Logs em Tempo Real
```bash
# Todos os serviços
docker-compose logs -f

# Backend
docker-compose logs -f backend

# Frontend
docker-compose logs -f frontend

# Database
docker-compose logs -f db
```

### Status dos Containers
```bash
docker-compose ps
```

### Recursos do Sistema
```bash
docker stats
```

## 🔒 Segurança

### Configurações Aplicadas

1. ✅ **Firewall (UFW)**
   - SSH (22)
   - HTTP (80)
   - HTTPS (443)

2. ✅ **Django Security**
   - DEBUG=False
   - SECURE_SSL_REDIRECT
   - SESSION_COOKIE_SECURE
   - CSRF_COOKIE_SECURE
   - Security headers

3. ✅ **Nginx Security**
   - Rate limiting
   - X-Frame-Options
   - X-Content-Type-Options
   - X-XSS-Protection
   - Referrer-Policy

4. ✅ **Database**
   - Senha forte
   - Network isolada
   - Volumes persistentes

5. ✅ **Docker**
   - Non-root users
   - Read-only filesystems onde possível
   - Resource limits

## 🆘 Suporte

### Documentação
- **DEPLOY.md** - Guia completo passo a passo
- **DEPLOY_QUICKSTART.md** - Referência rápida
- **README.md** (este arquivo) - Visão geral

### Troubleshooting
Veja seção 11 em **DEPLOY.md** para soluções de problemas comuns.

### Contato
- Email: jsabonete09@gmail.com

---

**MUTIT PAY** - Boutique Premium de Tecnologia 🏆

Deploy configurado com ❤️ para Digital Ocean

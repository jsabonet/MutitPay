#!/bin/bash

# ====================================
# MUTIT PAY - Deploy Script (Windows/Git Bash)
# Digital Ocean Deployment
# ====================================

set -e  # Exit on error

echo "======================================"
echo "MUTIT PAY - Deploy para Digital Ocean"
echo "======================================"

# Configuration
DROPLET_USER="root"
DROPLET_IP="YOUR_DROPLET_IP"  # Altere para o IP do seu Droplet
PROJECT_DIR="/var/www/mutitpay"
BACKUP_DIR="/var/backups/mutitpay"

# Functions
print_success() {
    echo "[OK] $1"
}

print_error() {
    echo "[ERRO] $1"
}

print_info() {
    echo "[INFO] $1"
}

# Check if .env.production exists
if [ ! -f .env.production ]; then
    print_error ".env.production não encontrado!"
    echo "Copie .env.production e preencha com os valores corretos."
    exit 1
fi

print_info "Verificando conexão com o servidor..."
if ! ssh -o ConnectTimeout=5 $DROPLET_USER@$DROPLET_IP "echo 'Connected'" > /dev/null 2>&1; then
    print_error "Não foi possível conectar ao servidor!"
    echo "Verifique DROPLET_IP e as credenciais SSH."
    echo "Configure SSH: ssh-keygen -t rsa -b 4096 e copie a chave para o servidor"
    exit 1
fi
print_success "Conectado ao servidor"

# Create backup
print_info "Criando backup da versão atual..."
ssh $DROPLET_USER@$DROPLET_IP bash << 'EOF'
    BACKUP_DIR="/var/backups/mutitpay"
    PROJECT_DIR="/var/www/mutitpay"
    
    mkdir -p $BACKUP_DIR
    
    if [ -d "$PROJECT_DIR" ]; then
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        tar -czf $BACKUP_DIR/mutitpay_backup_$TIMESTAMP.tar.gz -C /var/www mutitpay
        echo "Backup criado: mutitpay_backup_$TIMESTAMP.tar.gz"
        
        # Keep only last 5 backups
        cd $BACKUP_DIR
        ls -t mutitpay_backup_*.tar.gz | tail -n +6 | xargs -r rm
    fi
EOF
print_success "Backup concluído"

# Upload files
print_info "Enviando arquivos para o servidor..."
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '__pycache__' \
    --exclude '*.pyc' \
    --exclude '.git' \
    --exclude 'media/*' \
    --exclude 'backend/db.sqlite3' \
    --exclude '.env' \
    -e "ssh" \
    . $DROPLET_USER@$DROPLET_IP:$PROJECT_DIR/
print_success "Arquivos enviados"

# Copy .env.production as .env
print_info "Configurando variáveis de ambiente..."
scp .env.production $DROPLET_USER@$DROPLET_IP:$PROJECT_DIR/.env
print_success "Variáveis de ambiente configuradas"

# Deploy on server
print_info "Executando deploy no servidor..."
ssh $DROPLET_USER@$DROPLET_IP bash << EOF
    set -e
    cd $PROJECT_DIR
    
    echo "Parando containers..."
    docker-compose down || true
    
    echo "Construindo imagens Docker..."
    docker-compose build --no-cache
    
    echo "Iniciando containers..."
    docker-compose up -d
    
    echo "Aguardando serviços iniciarem..."
    sleep 10
    
    echo "Aplicando migrações do banco de dados..."
    docker-compose exec -T backend python manage.py migrate --noinput || true
    
    echo "Coletando arquivos estáticos..."
    docker-compose exec -T backend python manage.py collectstatic --noinput || true
    
    echo "Verificando status dos containers..."
    docker-compose ps
    
    echo "Limpando imagens antigas..."
    docker image prune -f
EOF
print_success "Deploy concluído"

# Health check
print_info "Verificando saúde da aplicação..."
sleep 5
if curl -f http://$DROPLET_IP/health > /dev/null 2>&1; then
    print_success "Aplicação está respondendo corretamente!"
else
    print_error "Aplicação não está respondendo ao health check"
    echo "Verifique os logs com: ssh $DROPLET_USER@$DROPLET_IP 'cd $PROJECT_DIR && docker-compose logs'"
fi

echo ""
echo "======================================"
print_success "Deploy concluído com sucesso!"
echo "======================================"
echo ""
echo "Próximos passos:"
echo "1. Acesse: http://$DROPLET_IP"
echo "2. Configure SSL com certbot (veja DEPLOY.md)"
echo "3. Monitore logs: ssh $DROPLET_USER@$DROPLET_IP 'cd $PROJECT_DIR && docker-compose logs -f'"
echo ""

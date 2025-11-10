#!/bin/bash

# ====================================
# MUTIT PAY - Deploy Script (Servidor)
# ====================================
# Execute este script no servidor para fazer deploy

set -e  # Parar em caso de erro

echo "🚀 Iniciando deploy do MUTIT PAY..."

# 1. Git pull
echo "📥 Baixando últimas alterações..."
git pull origin main

# 2. Parar containers
echo "🛑 Parando containers..."
docker-compose down

# 3. Rebuild do frontend (com --no-cache para garantir novo build)
echo "🔨 Fazendo rebuild do frontend..."
docker-compose build --no-cache frontend

# 4. Rebuild do backend (se necessário)
read -p "🤔 Rebuild do backend também? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔨 Fazendo rebuild do backend..."
    docker-compose build --no-cache backend
fi

# 5. Subir containers
echo "🚀 Iniciando containers..."
docker-compose up -d

# 6. Aguardar containers ficarem saudáveis
echo "⏳ Aguardando containers ficarem prontos..."
sleep 10

# 7. Verificar status
echo ""
echo "📊 Status dos containers:"
docker-compose ps

echo ""
echo "📝 Logs recentes do frontend:"
docker-compose logs --tail=20 frontend

echo ""
echo "📝 Logs recentes do backend:"
docker-compose logs --tail=20 backend

echo ""
echo "✅ Deploy concluído!"
echo ""
echo "🌐 Acesse: http://$(hostname -I | awk '{print $1}')"
echo "📊 Monitore os logs: docker-compose logs -f"

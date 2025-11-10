#!/bin/bash

# ====================================
# Atualiza APENAS o Nginx (sem rebuild)
# ====================================

echo "🔄 Atualizando configuração do Nginx..."

cd /var/www/mutitpay

# 1. Git pull
echo "1️⃣ Baixando última configuração..."
git pull origin main

# 2. Parar frontend
echo "2️⃣ Parando frontend..."
docker-compose stop frontend

# 3. Remover container
echo "3️⃣ Removendo container antigo..."
docker-compose rm -f frontend

# 4. Rebuild APENAS frontend (rápido - usa cache)
echo "4️⃣ Rebuild do frontend (30 segundos)..."
docker-compose build frontend

# 5. Subir novamente
echo "5️⃣ Iniciando frontend..."
docker-compose up -d frontend

echo ""
echo "⏳ Aguardando 10 segundos..."
sleep 10

echo ""
echo "✅ Nginx atualizado!"
echo ""
echo "🧪 Teste:"
curl -I http://localhost/assets/css/index-*.css 2>/dev/null | head -3

echo ""
echo "📝 Logs:"
docker-compose logs --tail=5 frontend

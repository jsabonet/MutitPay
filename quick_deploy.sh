#!/bin/bash

# ====================================
# QUICK DEPLOY - Execute no servidor
# ====================================

echo "🚀 MUTIT PAY - Quick Deploy"
echo ""
echo "Executando em 3 segundos... (Ctrl+C para cancelar)"
sleep 3

cd /var/www/mutitpay

echo "1️⃣ Git pull..."
git pull origin main

echo ""
echo "2️⃣ Parando containers..."
docker-compose down

echo ""
echo "3️⃣ Rebuild do frontend (isso vai demorar ~1min)..."
docker-compose build --no-cache frontend

echo ""
echo "4️⃣ Iniciando containers..."
docker-compose up -d

echo ""
echo "5️⃣ Aguardando 15 segundos..."
sleep 15

echo ""
echo "✅ DEPLOY COMPLETO!"
echo ""
echo "🌐 Acesse: http://134.122.71.250"
echo ""
echo "📊 Status:"
docker-compose ps

echo ""
echo "📝 Últimos logs do frontend:"
docker-compose logs --tail=10 frontend

echo ""
echo "🔍 Teste os assets:"
echo "curl -I http://134.122.71.250/assets/js/index-BCgxLWW7.js"

#!/bin/bash

# Script de diagnóstico - Execute no servidor

echo "🔍 DIAGNÓSTICO DO BUILD"
echo "======================="
echo ""

echo "1️⃣ Verificando arquivo .env.production no container:"
docker-compose exec frontend cat /app/.env.production 2>/dev/null || echo "❌ Arquivo NÃO encontrado!"
echo ""

echo "2️⃣ Verificando assets compilados:"
docker-compose exec frontend ls -lh /usr/share/nginx/html/assets/js/ | head -5
echo ""

echo "3️⃣ Verificando VITE_API_BASE_URL no código compilado:"
docker-compose exec frontend grep -r "https://134.122.71.250" /usr/share/nginx/html/assets/js/ 2>/dev/null && echo "❌ ENCONTRADO HTTPS hardcoded!" || echo "✅ HTTPS não encontrado"
echo ""

echo "4️⃣ Testando se assets estão sendo servidos:"
curl -I http://localhost/assets/css/index-*.css 2>/dev/null | head -5
echo ""

echo "5️⃣ Testando endpoint /health:"
curl -s http://localhost/health
echo ""

echo "6️⃣ Testando proxy da API:"
curl -I http://localhost/api/health/ 2>/dev/null | head -5
echo ""

echo "7️⃣ Logs recentes do nginx:"
docker-compose logs --tail=5 frontend 2>/dev/null

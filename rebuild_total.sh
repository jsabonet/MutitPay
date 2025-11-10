#!/bin/bash

# ====================================
# REBUILD TOTAL - Limpa TUDO e reconstrói
# ====================================

set -e

echo "🔥 REBUILD TOTAL DO FRONTEND"
echo "=============================="
echo ""
echo "⚠️  ATENÇÃO: Isso vai:"
echo "   - Parar todos os containers"
echo "   - Deletar a imagem do frontend"
echo "   - Deletar volumes de build"
echo "   - Fazer rebuild COMPLETO do zero"
echo ""
read -p "Continuar? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelado"
    exit 1
fi

cd /var/www/mutitpay

echo ""
echo "1️⃣ Parando containers..."
docker-compose down -v

echo ""
echo "2️⃣ Deletando imagem antiga do frontend..."
docker rmi mutitpay-frontend 2>/dev/null || echo "Imagem não encontrada"

echo ""
echo "3️⃣ Limpando cache do Docker..."
docker builder prune -f

echo ""
echo "4️⃣ Verificando arquivo .env.production no frontend:"
if [ -f frontend/.env.production ]; then
    echo "✅ Arquivo encontrado:"
    cat frontend/.env.production
else
    echo "❌ ARQUIVO NÃO ENCONTRADO!"
    echo "Criando arquivo..."
    cat > frontend/.env.production << EOF
# Frontend Production Environment
VITE_API_BASE_URL=/api
EOF
    echo "✅ Arquivo criado"
fi

echo ""
echo "5️⃣ Fazendo rebuild COMPLETO (vai demorar 1-2 minutos)..."
docker-compose build --no-cache --pull frontend

echo ""
echo "6️⃣ Iniciando containers..."
docker-compose up -d

echo ""
echo "7️⃣ Aguardando 20 segundos..."
sleep 20

echo ""
echo "8️⃣ Verificando se o build usou .env.production correto:"
echo "Procurando por HTTPS hardcoded no JavaScript..."
docker-compose exec frontend sh -c "grep -r 'https://134.122.71.250' /usr/share/nginx/html/assets/ 2>/dev/null" && echo "❌ PROBLEMA: HTTPS ainda no código!" || echo "✅ OK: Sem HTTPS hardcoded"

echo ""
echo "9️⃣ Testando assets:"
curl -I http://localhost/assets/css/index-*.css 2>/dev/null | head -3

echo ""
echo "🔟 Status dos containers:"
docker-compose ps

echo ""
echo "✅ REBUILD COMPLETO!"
echo ""
echo "🧪 TESTE AGORA:"
echo "   1. Abra http://134.122.71.250 no navegador"
echo "   2. Pressione Ctrl+Shift+R (hard refresh)"
echo "   3. Abra DevTools (F12) e veja a aba Network"
echo "   4. Verifique se as requisições da API vão para /api/ (HTTP)"
echo ""
echo "📝 Veja os logs:"
echo "   docker-compose logs -f frontend"

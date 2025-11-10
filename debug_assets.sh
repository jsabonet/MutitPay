#!/bin/bash

echo "🔍 DIAGNÓSTICO DETALHADO"
echo "========================"
echo ""

echo "1️⃣ Estrutura de arquivos no container:"
docker-compose exec frontend ls -la /usr/share/nginx/html/
echo ""

echo "2️⃣ Arquivos dentro de /assets/:"
docker-compose exec frontend find /usr/share/nginx/html/assets/ -type f | head -20
echo ""

echo "3️⃣ Config do nginx carregada:"
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf | grep -A 5 "location /assets"
echo ""

echo "4️⃣ Testando acesso direto a um arquivo específico:"
# Primeiro, descubra o nome real de um arquivo
FIRST_CSS=$(docker-compose exec frontend find /usr/share/nginx/html/assets/css -name "*.css" -type f | head -1 | tr -d '\r')
echo "Arquivo encontrado: $FIRST_CSS"
if [ -n "$FIRST_CSS" ]; then
    RELATIVE_PATH=${FIRST_CSS#/usr/share/nginx/html}
    echo "Caminho relativo: $RELATIVE_PATH"
    echo "Testando: http://localhost$RELATIVE_PATH"
    curl -I "http://localhost$RELATIVE_PATH" 2>/dev/null | head -5
fi
echo ""

echo "5️⃣ Logs de erro do nginx:"
docker-compose logs frontend 2>&1 | grep -i "error\|404" | tail -10
echo ""

echo "6️⃣ Teste com curl verboso:"
docker-compose exec frontend sh -c "curl -v http://localhost/assets/css/ 2>&1" | head -20

@echo off
REM ====================================
REM MUTIT PAY - Deploy Script (Windows CMD)
REM Digital Ocean Deployment
REM ====================================

echo ======================================
echo MUTIT PAY - Deploy para Digital Ocean
echo ======================================
echo.

REM Configuration - ALTERE AQUI!
set DROPLET_USER=root
set DROPLET_IP=YOUR_DROPLET_IP
set PROJECT_DIR=/var/www/mutitpay

REM Check if .env.production exists
if not exist .env.production (
    echo [ERRO] .env.production nao encontrado!
    echo Copie .env.production e preencha com os valores corretos.
    pause
    exit /b 1
)

echo [INFO] Verificando conexao com o servidor...
ssh -o ConnectTimeout=5 %DROPLET_USER%@%DROPLET_IP% "echo Connected" >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Nao foi possivel conectar ao servidor!
    echo Verifique DROPLET_IP e as credenciais SSH.
    echo Configure SSH: ssh-keygen -t rsa -b 4096
    pause
    exit /b 1
)
echo [OK] Conectado ao servidor
echo.

echo [INFO] Enviando arquivos para o servidor...
rsync -avz --delete --exclude node_modules --exclude __pycache__ --exclude *.pyc --exclude .git --exclude media/* --exclude backend/db.sqlite3 --exclude .env -e ssh . %DROPLET_USER%@%DROPLET_IP%:%PROJECT_DIR%/
if errorlevel 1 (
    echo [ERRO] Falha ao enviar arquivos!
    pause
    exit /b 1
)
echo [OK] Arquivos enviados
echo.

echo [INFO] Configurando variaveis de ambiente...
scp .env.production %DROPLET_USER%@%DROPLET_IP%:%PROJECT_DIR%/.env
if errorlevel 1 (
    echo [ERRO] Falha ao copiar .env!
    pause
    exit /b 1
)
echo [OK] Variaveis de ambiente configuradas
echo.

echo [INFO] Executando deploy no servidor...
ssh %DROPLET_USER%@%DROPLET_IP% "cd %PROJECT_DIR% && docker-compose down && docker-compose build --no-cache && docker-compose up -d && sleep 10 && docker-compose exec -T backend python manage.py migrate --noinput && docker-compose exec -T backend python manage.py collectstatic --noinput && docker-compose ps && docker image prune -f"
if errorlevel 1 (
    echo [ERRO] Falha no deploy!
    pause
    exit /b 1
)
echo [OK] Deploy concluido
echo.

echo ======================================
echo [OK] Deploy concluido com sucesso!
echo ======================================
echo.
echo Proximos passos:
echo 1. Acesse: http://%DROPLET_IP%
echo 2. Configure SSL com certbot (veja DEPLOY.md)
echo 3. Monitore logs: ssh %DROPLET_USER%@%DROPLET_IP% "cd %PROJECT_DIR% && docker-compose logs -f"
echo.
pause

# ====================================
# MUTIT PAY - Makefile
# Comandos úteis para desenvolvimento e deploy
# ====================================

.PHONY: help dev build deploy restart logs clean backup ssh

# Default target
help:
	@echo "======================================"
	@echo "MUTIT PAY - Comandos Disponíveis"
	@echo "======================================"
	@echo ""
	@echo "Desenvolvimento:"
	@echo "  make dev          - Iniciar ambiente de desenvolvimento"
	@echo "  make build        - Build das imagens Docker"
	@echo "  make restart      - Reiniciar todos os containers"
	@echo "  make logs         - Ver logs em tempo real"
	@echo "  make shell        - Acessar shell do backend"
	@echo "  make dbshell      - Acessar PostgreSQL shell"
	@echo ""
	@echo "Deploy:"
	@echo "  make deploy       - Deploy para Digital Ocean"
	@echo "  make deploy-prod  - Deploy de produção (com build)"
	@echo "  make ssh          - SSH no servidor"
	@echo ""
	@echo "Manutenção:"
	@echo "  make backup       - Backup do banco de dados"
	@echo "  make migrate      - Aplicar migrações"
	@echo "  make collectstatic - Coletar arquivos estáticos"
	@echo "  make superuser    - Criar superusuário"
	@echo "  make clean        - Limpar containers e volumes"
	@echo ""
	@echo "Testes:"
	@echo "  make test         - Executar testes"
	@echo "  make lint         - Verificar código"
	@echo ""

# Development
dev:
	docker-compose up -d
	@echo "Aplicação rodando em http://localhost"

build:
	docker-compose build --no-cache

restart:
	docker-compose restart

logs:
	docker-compose logs -f

shell:
	docker-compose exec backend python manage.py shell

dbshell:
	docker-compose exec db psql -U mutitpay_user mutit_pay

# Deploy
deploy:
	@bash deploy.sh

deploy-prod:
	@echo "Executando deploy de produção..."
	@bash deploy.sh

ssh:
	@ssh root@YOUR_DROPLET_IP

# Database
migrate:
	docker-compose exec backend python manage.py migrate

makemigrations:
	docker-compose exec backend python manage.py makemigrations

superuser:
	docker-compose exec backend python manage.py createsuperuser

backup:
	@echo "Criando backup do banco de dados..."
	docker-compose exec db pg_dump -U mutitpay_user mutit_pay > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Backup criado com sucesso!"

# Static files
collectstatic:
	docker-compose exec backend python manage.py collectstatic --noinput

# Cleanup
clean:
	docker-compose down -v
	docker system prune -f

clean-all:
	docker-compose down -v
	docker system prune -a -f --volumes

# Testing
test:
	docker-compose exec backend python manage.py test

lint:
	docker-compose exec backend flake8 .

# Health check
health:
	@curl -f http://localhost/health || echo "Aplicação não está respondendo"

# Production commands (run on server)
prod-logs:
	@ssh root@YOUR_DROPLET_IP 'cd /var/www/mutitpay && docker-compose logs -f'

prod-restart:
	@ssh root@YOUR_DROPLET_IP 'cd /var/www/mutitpay && docker-compose restart'

prod-status:
	@ssh root@YOUR_DROPLET_IP 'cd /var/www/mutitpay && docker-compose ps'

prod-backup:
	@ssh root@YOUR_DROPLET_IP 'cd /var/www/mutitpay && docker-compose exec db pg_dump -U mutitpay_user mutit_pay > /var/backups/mutitpay/backup_$(shell date +%Y%m%d_%H%M%S).sql'
	@echo "Backup criado no servidor!"

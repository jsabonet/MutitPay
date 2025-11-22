"""
Script para testar integração com Brevo e envio de emails
"""

import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chiva_backend.settings')
django.setup()

from cart.email_service_v2 import EmailService
from django.conf import settings

def test_brevo_connection():
    """Testa conexão com Brevo"""
    print("="*60)
    print("TESTE DE INTEGRAÇÃO BREVO (SENDINBLUE)")
    print("="*60)
    
    # Verificar configurações
    print(f"\n📧 Configurações:")
    print(f"   API Key: {'✓ Configurada' if settings.BREVO_API_KEY else '✗ Não configurada'}")
    print(f"   Sender Email: {settings.BREVO_SENDER_EMAIL}")
    print(f"   Sender Name: {settings.BREVO_SENDER_NAME}")
    print(f"   Admin Email: {settings.ADMIN_EMAIL}")
    print(f"   Notifications Enabled: {settings.EMAIL_NOTIFICATIONS_ENABLED}")
    
    if not settings.BREVO_API_KEY:
        print("\n❌ BREVO_API_KEY não configurada no .env")
        print("   Adicione: BREVO_API_KEY=sua_chave_aqui")
        return False
    
    # Criar instância do serviço
    email_service = EmailService()
    
    if not email_service.enabled:
        print("\n❌ Serviço de email desabilitado")
        return False
    
    print("\n✓ Serviço de email inicializado com sucesso")
    
    # Testar envio de email
    print("\n📨 Enviando email de teste...")
    
    # Criar um objeto mock de Order para teste
    from cart.models import Order
    from decimal import Decimal
    from datetime import datetime
    
    # Tentar pegar um pedido real ou criar dados de teste
    try:
        test_order = Order.objects.first()
        if test_order:
            print(f"   Usando pedido real: #{test_order.order_number}")
            success = email_service.send_order_confirmation(
                order=test_order,
                customer_email=settings.ADMIN_EMAIL,
                customer_name='Teste Cliente'
            )
        else:
            print("   Nenhum pedido encontrado para teste")
            print("   Crie um pedido na loja primeiro")
            return False
    except Exception as e:
        print(f"\n❌ Erro ao enviar email: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    if success:
        print(f"\n✅ Email enviado com sucesso para {settings.ADMIN_EMAIL}")
        print("   Verifique sua caixa de entrada (e spam)")
        return True
    else:
        print("\n❌ Falha ao enviar email")
        print("   Verifique os logs para mais detalhes")
        return False

if __name__ == '__main__':
    test_brevo_connection()

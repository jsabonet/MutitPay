"""
Script para simular envio de email de teste usando Brevo
Cria dados mockados de pedido para testar a integração
"""

import os
import sys
import django
from decimal import Decimal
from datetime import datetime

# Setup Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chiva_backend.settings')
django.setup()

from cart.email_service_v2 import EmailService
from django.conf import settings

def create_mock_order_data():
    """Cria dados mockados de pedido para teste"""
    class MockProduct:
        def __init__(self):
            self.name = "Vestido Elegante de Teste"
            self.price = Decimal('2500.00')
    
    class MockSize:
        def __init__(self):
            self.name = "M"
    
    class MockColor:
        def __init__(self):
            self.name = "Azul Marinho"
    
    class MockOrderItem:
        def __init__(self):
            self.product = MockProduct()
            self.size = MockSize()
            self.color = MockColor()
            self.quantity = 2
            self.price = Decimal('2500.00')
            
        def get_total(self):
            return self.price * self.quantity
    
    class MockOrder:
        def __init__(self):
            self.order_number = f"TEST-{datetime.now().strftime('%Y%m%d%H%M%S')}"
            self.created_at = datetime.now()
            self.status = 'pending'
            self.payment_status = 'pending'
            self.total_amount = Decimal('5000.00')
            self.shipping_cost = Decimal('0.00')
            self.customer_name = "Cliente de Teste"
            self.customer_email = settings.ADMIN_EMAIL
            self.customer_phone = "+258 84 000 0000"
            self.shipping_address = "Avenida Julius Nyerere, 123, Maputo"
            self.shipping_city = "Maputo"
            self.shipping_province = "Maputo Cidade"
            self.payment_method = 'bank_transfer'
            self._items = [MockOrderItem()]
        
        @property
        def items(self):
            class ItemsManager:
                def __init__(self, items):
                    self._items = items
                
                def all(self):
                    return self._items
            
            return ItemsManager(self._items)
        
        def get_subtotal(self):
            return sum(item.get_total() for item in self._items)
        
        def get_total(self):
            return self.get_subtotal() + self.shipping_cost
    
    return MockOrder()

def test_brevo_email_simulation():
    """Testa envio de email com dados simulados"""
    print("="*70)
    print("🧪 TESTE DE SIMULAÇÃO DE EMAIL BREVO")
    print("="*70)
    
    # Verificar configurações
    print(f"\n📋 Verificando Configurações:")
    print(f"   {'✅' if settings.BREVO_API_KEY else '❌'} API Key: {'Configurada' if settings.BREVO_API_KEY else 'NÃO CONFIGURADA'}")
    print(f"   📧 Sender: {settings.BREVO_SENDER_EMAIL} ({settings.BREVO_SENDER_NAME})")
    print(f"   👤 Admin: {settings.ADMIN_EMAIL}")
    print(f"   🔔 Notifications: {'Habilitadas' if settings.EMAIL_NOTIFICATIONS_ENABLED else 'Desabilitadas'}")
    
    if not settings.BREVO_API_KEY:
        print("\n❌ ERRO: BREVO_API_KEY não configurada no arquivo .env")
        print("   Adicione a linha: BREVO_API_KEY=sua_chave_api_aqui")
        return False
    
    if not settings.EMAIL_NOTIFICATIONS_ENABLED:
        print("\n⚠️  AVISO: Notificações de email desabilitadas")
        print("   Configure EMAIL_NOTIFICATIONS_ENABLED=True no .env")
        return False
    
    # Inicializar serviço de email
    print(f"\n🔧 Inicializando EmailService...")
    try:
        email_service = EmailService()
        
        if not email_service.enabled:
            print("❌ Serviço de email não está habilitado")
            return False
        
        print("✅ EmailService inicializado com sucesso")
    except Exception as e:
        print(f"❌ Erro ao inicializar EmailService: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Criar dados mockados
    print(f"\n📦 Criando pedido simulado...")
    mock_order = create_mock_order_data()
    print(f"   Número do Pedido: {mock_order.order_number}")
    print(f"   Cliente: {mock_order.customer_name}")
    print(f"   Email Destino: {mock_order.customer_email}")
    print(f"   Total: {mock_order.total_amount} MZN")
    print(f"   Items: {len(mock_order.items.all())} produto(s)")
    
    # Testar envio
    print(f"\n📨 Enviando email de confirmação de pedido...")
    print(f"   De: {settings.BREVO_SENDER_EMAIL}")
    print(f"   Para: {settings.ADMIN_EMAIL}")
    print(f"   Template: order_confirmation.html")
    
    try:
        success = email_service.send_order_confirmation(
            order=mock_order,
            customer_email=settings.ADMIN_EMAIL,
            customer_name=mock_order.customer_name
        )
        
        if success:
            print(f"\n{'='*70}")
            print(f"✅ EMAIL ENVIADO COM SUCESSO!")
            print(f"{'='*70}")
            print(f"\n📬 Verifique o email em: {settings.ADMIN_EMAIL}")
            print(f"   ⚠️  Não esqueça de verificar a pasta de SPAM")
            print(f"\n📊 Informações do Email:")
            print(f"   • Assunto: Confirmação de Pedido #{mock_order.order_number}")
            print(f"   • Contatos incluídos:")
            print(f"     - 📧 agente@mutitpay.com")
            print(f"     - 📧 contato@mutitpay.co.mz")
            print(f"     - 📱 +258 84 913 5181")
            print(f"\n💡 Próximos passos:")
            print(f"   1. Acesse sua conta de email {settings.ADMIN_EMAIL}")
            print(f"   2. Procure por email de MUTIT PAY")
            print(f"   3. Verifique se todas as informações estão corretas")
            print(f"   4. Confirme que os links de contato funcionam")
            print(f"\n🎉 Integração Brevo funcionando perfeitamente!")
            return True
        else:
            print(f"\n{'='*70}")
            print(f"❌ FALHA AO ENVIAR EMAIL")
            print(f"{'='*70}")
            print(f"\n🔍 Possíveis causas:")
            print(f"   1. API Key inválida ou expirada")
            print(f"   2. Limite de 300 emails/dia atingido")
            print(f"   3. Email do remetente não verificado no Brevo")
            print(f"   4. Problemas de conectividade")
            print(f"\n💡 Soluções:")
            print(f"   • Verifique a API Key no painel Brevo")
            print(f"   • Confirme que {settings.BREVO_SENDER_EMAIL} está verificado")
            print(f"   • Verifique os logs do Django para mais detalhes")
            return False
            
    except Exception as e:
        print(f"\n{'='*70}")
        print(f"❌ ERRO DURANTE ENVIO")
        print(f"{'='*70}")
        print(f"\n🐛 Detalhes do erro:")
        print(f"   {str(e)}")
        print(f"\n📋 Traceback completo:")
        import traceback
        traceback.print_exc()
        print(f"\n💡 Verifique:")
        print(f"   • Instalação do SDK: pip install sib-api-v3-sdk")
        print(f"   • Configuração da API Key")
        print(f"   • Conexão com a internet")
        return False

def test_api_connection():
    """Testa apenas a conexão com a API Brevo"""
    print("\n" + "="*70)
    print("🔌 TESTE DE CONEXÃO COM API BREVO")
    print("="*70)
    
    try:
        import sib_api_v3_sdk
        from sib_api_v3_sdk.rest import ApiException
        
        print("\n✅ SDK sib-api-v3-sdk instalado")
        
        # Configurar API
        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key['api-key'] = settings.BREVO_API_KEY
        
        # Testar com endpoint de account
        api_instance = sib_api_v3_sdk.AccountApi(sib_api_v3_sdk.ApiClient(configuration))
        
        print("🔄 Testando conexão com API...")
        account_info = api_instance.get_account()
        
        print(f"\n✅ CONEXÃO ESTABELECIDA COM SUCESSO!")
        print(f"\n📊 Informações da Conta Brevo:")
        print(f"   • Email: {account_info.email}")
        print(f"   • Empresa: {account_info.company_name if hasattr(account_info, 'company_name') else 'N/A'}")
        print(f"   • Plano: {account_info.plan[0].type if account_info.plan else 'N/A'}")
        
        if hasattr(account_info, 'relay_data') and account_info.relay_data:
            print(f"   • Emails enviados hoje: {account_info.relay_data.sent}")
            print(f"   • Limite diário: {account_info.relay_data.quota}")
            print(f"   • Emails restantes: {account_info.relay_data.quota - account_info.relay_data.sent}")
        
        return True
        
    except ImportError:
        print("❌ SDK não instalado. Execute: pip install sib-api-v3-sdk")
        return False
    except Exception as e:
        print(f"\n❌ Erro ao conectar com API: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("\n🚀 Iniciando testes de integração Brevo...")
    print(f"⏰ {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
    
    # Primeiro testa a conexão
    connection_ok = test_api_connection()
    
    if connection_ok:
        # Depois testa o envio de email
        input("\n⏸️  Pressione ENTER para continuar com o teste de envio de email...")
        test_brevo_email_simulation()
    else:
        print("\n⚠️  Corrija os problemas de conexão antes de testar o envio de emails")
    
    print("\n" + "="*70)
    print("🏁 Testes concluídos")
    print("="*70)

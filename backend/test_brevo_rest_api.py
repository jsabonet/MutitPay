"""
Teste de envio de email usando API REST do Brevo
(Não precisa de ativação SMTP - funciona imediatamente!)
"""

import os
import sys
import django
from datetime import datetime

# Setup Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chiva_backend.settings')
django.setup()

from django.conf import settings
from cart.email_service_v2 import EmailService

def test_api_rest():
    """Testa envio de email via API REST Brevo"""
    
    print("\n" + "="*70)
    print("🚀 TESTE DE EMAIL VIA API REST BREVO")
    print("="*70)
    
    print(f"\n📋 Configuração:")
    print(f"   API Key: {'✅ Configurada' if settings.BREVO_API_KEY else '❌ Faltando'}")
    if settings.BREVO_API_KEY:
        key_preview = settings.BREVO_API_KEY[:20] + "..." if len(settings.BREVO_API_KEY) > 20 else settings.BREVO_API_KEY
        print(f"   Preview: {key_preview}")
        print(f"   Tipo: {'✅ REST API (xkeysib-)' if settings.BREVO_API_KEY.startswith('xkeysib-') else '⚠️ SMTP Key (xsmtpsib-)'}")
    print(f"   Remetente: {settings.BREVO_SENDER_EMAIL}")
    print(f"   Nome: {settings.BREVO_SENDER_NAME}")
    print(f"   Admin: {settings.ADMIN_EMAIL}")
    print(f"   Notificações: {'✅ Habilitadas' if settings.EMAIL_NOTIFICATIONS_ENABLED else '❌ Desabilitadas'}")
    
    # Verificar se é a chave correta
    if not settings.BREVO_API_KEY:
        print("\n❌ ERRO: BREVO_API_KEY não configurada!")
        print("\n📝 Adicione no arquivo backend/.env:")
        print("   BREVO_API_KEY=xkeysib-SUA_CHAVE_AQUI")
        return False
    
    if settings.BREVO_API_KEY.startswith('xsmtpsib-'):
        print("\n⚠️ AVISO: Você está usando chave SMTP (xsmtpsib-)")
        print("   Para usar API REST, precisa de chave que começa com 'xkeysib-'")
        print("\n📋 Como obter:")
        print("   1. Acesse https://app.brevo.com/")
        print("   2. Vá em: [Seu Nome] → SMTP & API → API Keys")
        print("   3. Copie ou crie uma chave que comece com 'xkeysib-'")
        print("\n💡 Continuando teste mesmo assim...")
    
    # Inicializar serviço
    print(f"\n🔧 Inicializando EmailService...")
    try:
        email_service = EmailService()
        
        if not email_service.enabled:
            print("❌ Serviço de email desabilitado")
            return False
        
        print("✅ EmailService inicializado com sucesso")
    except Exception as e:
        print(f"❌ Erro ao inicializar: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Criar dados de teste
    print(f"\n📦 Criando dados de pedido simulado...")
    
    class MockProduct:
        def __init__(self):
            self.name = "Vestido Elegante Azul"
            self.price = 2500.00
    
    class MockSize:
        def __init__(self):
            self.name = "M"
    
    class MockColor:
        def __init__(self):
            self.name = "Azul"
    
    class MockOrderItem:
        def __init__(self):
            self.product = MockProduct()
            self.size = MockSize()
            self.color = MockColor()
            self.quantity = 2
            self.price = 2500.00
            # Atributos esperados pelo email_service_v2
            self.product_name = "Vestido Elegante Azul"
            self.color_name = "Azul"
            self.size_abbreviation = "M"
            self.unit_price = 2500.00
            self.subtotal = 5000.00
        
        def get_total(self):
            return self.price * self.quantity
    
    class MockOrder:
        def __init__(self):
            self.order_number = f"TEST-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
            self.created_at = datetime.now()
            self.status = 'pending'
            self.payment_status = 'pending'
            self.total_amount = 5000.00
            self.shipping_cost = 0.00
            self.customer_name = "Cliente Teste"
            self.customer_email = settings.ADMIN_EMAIL
            self.customer_phone = "+258 84 000 0000"
            self.shipping_address = "Av. Julius Nyerere, 123"
            self.shipping_city = "Maputo"
            self.shipping_province = "Maputo Cidade"
            self.payment_method = 'bank_transfer'
            self._items = [MockOrderItem()]
        
        def get_status_display(self):
            return "Pendente"
        
        def get_payment_status_display(self):
            return "Aguardando Pagamento"
        
        def get_payment_method_display(self):
            return "Transferência Bancária"
        
        @property
        def items(self):
            class Manager:
                def __init__(self, items):
                    self._items = items
                def all(self):
                    return self._items
            return Manager(self._items)
        
        def get_subtotal(self):
            return sum(item.get_total() for item in self._items)
        
        def get_total(self):
            return self.get_subtotal() + self.shipping_cost
    
    mock_order = MockOrder()
    
    print(f"   Pedido: {mock_order.order_number}")
    print(f"   Cliente: {mock_order.customer_name}")
    print(f"   Email: {mock_order.customer_email}")
    print(f"   Total: {mock_order.total_amount} MZN")
    
    # Enviar email
    print(f"\n📨 Enviando email de confirmação via API REST...")
    print(f"   Template: order_confirmation.html")
    print(f"   De: {settings.BREVO_SENDER_EMAIL}")
    print(f"   Para: {settings.ADMIN_EMAIL}")
    
    try:
        success = email_service.send_order_confirmation(
            order=mock_order,
            customer_email=settings.ADMIN_EMAIL,
            customer_name=mock_order.customer_name
        )
        
        if success:
            print("\n" + "="*70)
            print("✅ EMAIL ENVIADO COM SUCESSO VIA API REST!")
            print("="*70)
            print(f"\n📬 Verifique o email: {settings.ADMIN_EMAIL}")
            print(f"⚠️  Não esqueça de verificar SPAM/LIXO ELETRÔNICO")
            print(f"\n📊 Detalhes:")
            print(f"   • Assunto: Confirmação de Pedido #{mock_order.order_number}")
            print(f"   • Método: API REST Brevo")
            print(f"   • Limite: 300 emails/dia (gratuito)")
            print(f"\n💡 Informações no email:")
            print(f"   📧 agente@mutitpay.com | contato@mutitpay.co.mz")
            print(f"   📱 +258 84 913 5181")
            print(f"\n🎉 API REST Brevo funcionando perfeitamente!")
            print(f"✅ Sistema pronto para enviar emails de pedidos")
            return True
        else:
            print("\n" + "="*70)
            print("❌ FALHA AO ENVIAR EMAIL")
            print("="*70)
            print(f"\n🔍 Possíveis causas:")
            print(f"   1. API Key inválida ou expirada")
            print(f"   2. Email {settings.BREVO_SENDER_EMAIL} não verificado no Brevo")
            print(f"   3. Limite de 300 emails/dia atingido")
            print(f"   4. Problemas de rede/conectividade")
            print(f"\n💡 Soluções:")
            print(f"   • Verifique a API Key no painel Brevo")
            print(f"   • Em Senders & IP, verifique se o email está validado")
            print(f"   • Confira os logs do Django para mais detalhes")
            return False
    
    except Exception as e:
        print("\n" + "="*70)
        print("❌ ERRO DURANTE ENVIO")
        print("="*70)
        print(f"\n🐛 Tipo: {type(e).__name__}")
        print(f"   Mensagem: {str(e)}")
        
        # Erro específico de API
        if "unauthorized" in str(e).lower() or "401" in str(e):
            print(f"\n🔑 PROBLEMA: API Key inválida!")
            print(f"   A chave configurada não é aceita pelo Brevo")
            print(f"\n📝 Solução:")
            print(f"   1. Acesse https://app.brevo.com/")
            print(f"   2. Vá em: [Seu Nome] → SMTP & API → API Keys")
            print(f"   3. Copie a chave correta (xkeysib-...)")
            print(f"   4. Atualize BREVO_API_KEY no .env")
        
        elif "not found" in str(e).lower() or "404" in str(e):
            print(f"\n📧 PROBLEMA: Email remetente não verificado!")
            print(f"   O email {settings.BREVO_SENDER_EMAIL} não está validado")
            print(f"\n📝 Solução:")
            print(f"   1. Acesse https://app.brevo.com/")
            print(f"   2. Vá em: Senders & IP → Senders")
            print(f"   3. Adicione e verifique {settings.BREVO_SENDER_EMAIL}")
        
        print(f"\n📋 Traceback completo:")
        import traceback
        traceback.print_exc()
        
        return False

if __name__ == '__main__':
    print("\n🚀 Iniciando teste API REST Brevo...")
    print(f"⏰ {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n")
    
    result = test_api_rest()
    
    print("\n" + "="*70)
    if result:
        print("✅ TESTE CONCLUÍDO COM SUCESSO!")
        print("\nSistema de emails MUTIT PAY está pronto para produção! 🎉")
    else:
        print("❌ TESTE FALHOU")
        print("\nSiga as instruções acima para corrigir o problema.")
    print("="*70 + "\n")

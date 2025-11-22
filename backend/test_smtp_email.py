"""
GUIA: Como obter a API Key correta do Brevo
===========================================

❌ PROBLEMA DETECTADO:
A chave atual no .env começa com "xsmtpsib-" que é uma chave SMTP.
Para enviar emails via API REST, precisamos de uma API Key que começa com "xkeysib-"

📋 PASSOS PARA OBTER A API KEY CORRETA:

1. Acesse: https://app.brevo.com/
2. Faça login na sua conta Brevo
3. No menu superior direito, clique no seu nome
4. Selecione "SMTP & API"
5. Na aba "API Keys", você verá suas chaves
6. Se não tiver uma chave v3, clique em "Create a new API key"
7. Dê um nome (ex: "MutitPay Production API")
8. Copie a chave que começa com "xkeysib-..."

⚠️ IMPORTANTE:
- A chave só é mostrada uma vez
- Guarde em local seguro
- Não compartilhe a chave
- Use apenas a chave v3 (xkeysib-)

📝 DEPOIS DE OBTER A CHAVE:

Atualize o arquivo .env com a nova chave:

backend/.env:
BREVO_API_KEY=xkeysib-SUA_CHAVE_AQUI

.env.production:
BREVO_API_KEY=xkeysib-SUA_CHAVE_AQUI

.env.server:
BREVO_API_KEY=xkeysib-SUA_CHAVE_AQUI

🔄 DEPOIS DE ATUALIZAR:
1. Reinicie o servidor Django local
2. Execute: python test_email_brevo_simulation.py
3. No servidor de produção, reinicie: docker compose restart backend

💡 ALTERNATIVA TEMPORÁRIA:
Use o método SMTP (mais simples mas com menos recursos)
"""

import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chiva_backend.settings')
django.setup()

from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string

def test_smtp_fallback():
    """
    Testa envio via SMTP como alternativa
    (Funciona com a chave xsmtpsib- atual)
    """
    print("\n" + "="*70)
    print("📧 TESTE DE ENVIO VIA SMTP (Método Alternativo)")
    print("="*70)
    
    # Configurar backend SMTP do Django
    from django.core.mail import EmailMultiAlternatives
    from django.conf import settings
    
    print(f"\n📋 Configuração SMTP:")
    print(f"   Servidor: {settings.BREVO_SMTP_SERVER}")
    print(f"   Porta: {settings.BREVO_SMTP_PORT}")
    print(f"   Remetente: {settings.BREVO_SENDER_EMAIL}")
    print(f"   Admin: {settings.ADMIN_EMAIL}")
    
    print(f"\n📨 Preparando email de teste...")
    
    subject = f"🧪 Teste de Email - MUTIT PAY"
    
    # HTML simples para teste
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                       color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .success {{ background: #d4edda; border: 1px solid #c3e6cb; color: #155724;
                       padding: 15px; border-radius: 5px; margin: 20px 0; }}
            .info {{ background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460;
                    padding: 15px; border-radius: 5px; margin: 20px 0; }}
            .contact {{ margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd; }}
            a {{ color: #667eea; text-decoration: none; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ TESTE DE EMAIL BREVO</h1>
                <p>MUTIT PAY - Sistema de E-mail</p>
            </div>
            <div class="content">
                <div class="success">
                    <strong>🎉 Sucesso!</strong><br>
                    Se você está lendo este email, a integração com Brevo está funcionando corretamente!
                </div>
                
                <h2>📋 Informações do Teste</h2>
                <ul>
                    <li><strong>Servidor SMTP:</strong> {settings.BREVO_SMTP_SERVER}</li>
                    <li><strong>Método:</strong> SMTP (Alternativa à API REST)</li>
                    <li><strong>Remetente:</strong> {settings.BREVO_SENDER_EMAIL}</li>
                    <li><strong>Status:</strong> Email enviado com sucesso</li>
                </ul>
                
                <div class="info">
                    <strong>💡 Próximos Passos:</strong><br>
                    Para usar a API REST completa (com mais recursos):
                    <ol>
                        <li>Acesse: <a href="https://app.brevo.com">app.brevo.com</a></li>
                        <li>Vá em: Nome → SMTP & API → API Keys</li>
                        <li>Crie uma nova API Key v3 (xkeysib-...)</li>
                        <li>Atualize BREVO_API_KEY no arquivo .env</li>
                    </ol>
                </div>
                
                <h2>📞 Contatos MUTIT PAY</h2>
                <div class="contact">
                    📧 <a href="mailto:agente@mutitpay.com">agente@mutitpay.com</a><br>
                    📧 <a href="mailto:contato@mutitpay.co.mz">contato@mutitpay.co.mz</a><br>
                    📱 <a href="tel:+258849135181">+258 84 913 5181</a><br>
                    📍 Maputo, Moçambique
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    ✅ TESTE DE EMAIL BREVO - MUTIT PAY
    
    Sucesso! Se você está lendo este email, a integração está funcionando!
    
    Informações do Teste:
    - Servidor: {settings.BREVO_SMTP_SERVER}
    - Método: SMTP
    - Remetente: {settings.BREVO_SENDER_EMAIL}
    
    Contatos:
    📧 agente@mutitpay.com | contato@mutitpay.co.mz
    📱 +258 84 913 5181
    📍 Maputo, Moçambique
    """
    
    try:
        # Criar email com versão HTML e texto
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=f"{settings.BREVO_SENDER_NAME} <{settings.BREVO_SENDER_EMAIL}>",
            to=[settings.ADMIN_EMAIL],
        )
        email.attach_alternative(html_content, "text/html")
        
        # Enviar
        print("🔄 Enviando email via SMTP...")
        email.send()
        
        print(f"\n{'='*70}")
        print(f"✅ EMAIL ENVIADO COM SUCESSO VIA SMTP!")
        print(f"{'='*70}")
        print(f"\n📬 Email enviado para: {settings.ADMIN_EMAIL}")
        print(f"📧 Remetente: {settings.BREVO_SENDER_EMAIL}")
        print(f"\n⏰ Aguarde alguns segundos e verifique sua caixa de entrada")
        print(f"⚠️  Não esqueça de verificar a pasta de SPAM\n")
        
        print("✅ A integração SMTP está funcionando!")
        print("💡 Para recursos completos, obtenha a API Key v3 (veja instruções acima)")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Erro ao enviar email via SMTP:")
        print(f"   {str(e)}")
        import traceback
        traceback.print_exc()
        
        print(f"\n🔍 Verifique:")
        print(f"   1. Credenciais SMTP no arquivo .env")
        print(f"   2. Conexão com internet")
        print(f"   3. Se o email {settings.BREVO_SENDER_EMAIL} está verificado no Brevo")
        
        return False

if __name__ == '__main__':
    print("\n" + "="*70)
    print("📖 GUIA DE CONFIGURAÇÃO DA API BREVO")
    print("="*70)
    
    print(__doc__)
    
    choice = input("\n❓ Deseja testar envio via SMTP agora? (s/n): ").strip().lower()
    
    if choice == 's':
        test_smtp_fallback()
    else:
        print("\n✅ Ok! Configure a API Key v3 primeiro e depois execute:")
        print("   python test_email_brevo_simulation.py")
    
    print("\n" + "="*70)

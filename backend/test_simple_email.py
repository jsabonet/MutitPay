"""
Teste simples de envio de email via SMTP Brevo usando Django
"""

import os
import sys
import django
from datetime import datetime

# Setup Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chiva_backend.settings')
django.setup()

from django.core.mail import EmailMultiAlternatives
from django.conf import settings

def test_email():
    """Envia email de teste simples"""
    
    print("\n" + "="*70)
    print("📧 TESTE DE ENVIO DE EMAIL BREVO VIA SMTP")
    print("="*70)
    
    print(f"\n📋 Configurações:")
    print(f"   Host: {settings.EMAIL_HOST}")
    print(f"   Porta: {settings.EMAIL_PORT}")
    print(f"   TLS: {settings.EMAIL_USE_TLS}")
    print(f"   De: {settings.DEFAULT_FROM_EMAIL}")
    print(f"   Para: {settings.ADMIN_EMAIL}")
    print(f"   User: {settings.EMAIL_HOST_USER[:20]}...")
    
    # Criar email HTML
    subject = "🧪 Teste Email MUTIT PAY - Brevo"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }}
            .container {{
                max-width: 600px;
                margin: 20px auto;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 20px;
                text-align: center;
            }}
            .header h1 {{
                margin: 0;
                font-size: 32px;
            }}
            .content {{
                padding: 40px 30px;
            }}
            .success-box {{
                background: #d4edda;
                border-left: 4px solid #28a745;
                padding: 20px;
                margin: 20px 0;
                border-radius: 5px;
            }}
            .info-box {{
                background: #d1ecf1;
                border-left: 4px solid #17a2b8;
                padding: 20px;
                margin: 20px 0;
                border-radius: 5px;
            }}
            .stats {{
                display: table;
                width: 100%;
                margin: 20px 0;
            }}
            .stat-item {{
                padding: 15px;
                margin: 10px 0;
                background: #f8f9fa;
                border-radius: 5px;
            }}
            .stat-label {{
                font-weight: bold;
                color: #667eea;
            }}
            .footer {{
                background: #f8f9fa;
                padding: 30px;
                text-align: center;
                border-top: 3px solid #667eea;
            }}
            .contact-info {{
                margin: 20px 0;
                line-height: 2;
            }}
            .contact-info a {{
                color: #667eea;
                text-decoration: none;
                font-weight: 500;
            }}
            .btn {{
                display: inline-block;
                padding: 12px 30px;
                background: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Email de Teste</h1>
                <p style="margin: 10px 0 0 0; font-size: 18px;">MUTIT PAY</p>
            </div>
            
            <div class="content">
                <div class="success-box">
                    <h2 style="margin-top: 0;">🎉 Integração Funcionando!</h2>
                    <p style="margin-bottom: 0;">
                        Se você está lendo este email, a integração com <strong>Brevo (Sendinblue)</strong> 
                        está configurada e funcionando corretamente!
                    </p>
                </div>
                
                <h3>📊 Informações da Configuração</h3>
                <div class="stats">
                    <div class="stat-item">
                        <span class="stat-label">Servidor SMTP:</span><br>
                        {settings.EMAIL_HOST}:{settings.EMAIL_PORT}
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Remetente:</span><br>
                        {settings.DEFAULT_FROM_EMAIL}
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Data/Hora:</span><br>
                        {datetime.now().strftime('%d/%m/%Y às %H:%M:%S')}
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Status:</span><br>
                        <span style="color: #28a745; font-weight: bold;">✓ Email enviado com sucesso</span>
                    </div>
                </div>
                
                <div class="info-box">
                    <h3 style="margin-top: 0;">💡 Próximos Passos</h3>
                    <ul style="margin: 10px 0;">
                        <li>✅ Integração SMTP funcionando</li>
                        <li>✅ Templates de email atualizados</li>
                        <li>✅ Contatos adicionados aos templates</li>
                        <li>🔄 Aguardando primeiro pedido real</li>
                    </ul>
                </div>
                
                <h3>🎯 Sistema Pronto Para Produção</h3>
                <p>
                    O sistema de emails da MUTIT PAY está completamente configurado e pronto 
                    para enviar notificações de pedidos, atualizações de pagamento, status de 
                    envio e recuperação de carrinho abandonado.
                </p>
                
                <p><strong>Limite Gratuito Brevo:</strong> 300 emails por dia</p>
            </div>
            
            <div class="footer">
                <h3 style="margin-top: 0;">📞 Contatos MUTIT PAY</h3>
                <div class="contact-info">
                    📧 <a href="mailto:agente@mutitpay.com">agente@mutitpay.com</a><br>
                    📧 <a href="mailto:contato@mutitpay.co.mz">contato@mutitpay.co.mz</a><br>
                    📱 <a href="tel:+258849135181">+258 84 913 5181</a><br>
                    📍 Maputo, Moçambique
                </div>
                
                <p style="color: #666; font-size: 12px; margin-top: 30px;">
                    Este é um email automático de teste do sistema MUTIT PAY<br>
                    Powered by Brevo (Sendinblue)
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    ✅ EMAIL DE TESTE - MUTIT PAY
    
    Integração Funcionando!
    
    Se você está lendo este email, a integração com Brevo está funcionando corretamente!
    
    Informações da Configuração:
    - Servidor: {settings.EMAIL_HOST}:{settings.EMAIL_PORT}
    - Remetente: {settings.DEFAULT_FROM_EMAIL}
    - Data/Hora: {datetime.now().strftime('%d/%m/%Y às %H:%M:%S')}
    - Status: Email enviado com sucesso
    
    Próximos Passos:
    ✅ Integração SMTP funcionando
    ✅ Templates de email atualizados
    ✅ Contatos adicionados aos templates
    🔄 Aguardando primeiro pedido real
    
    Sistema Pronto Para Produção
    O sistema está completamente configurado para enviar notificações.
    Limite: 300 emails/dia (Brevo Free)
    
    Contatos MUTIT PAY:
    📧 agente@mutitpay.com | contato@mutitpay.co.mz
    📱 +258 84 913 5181
    📍 Maputo, Moçambique
    """
    
    try:
        print("\n🔄 Criando mensagem de email...")
        
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.ADMIN_EMAIL],
        )
        email.attach_alternative(html_content, "text/html")
        
        print("📤 Enviando email via SMTP...")
        email.send(fail_silently=False)
        
        print("\n" + "="*70)
        print("✅ EMAIL ENVIADO COM SUCESSO!")
        print("="*70)
        
        print(f"\n📬 Detalhes do Envio:")
        print(f"   De: {settings.DEFAULT_FROM_EMAIL}")
        print(f"   Para: {settings.ADMIN_EMAIL}")
        print(f"   Assunto: {subject}")
        print(f"   Formato: HTML + Texto")
        
        print(f"\n⏰ Aguarde alguns segundos...")
        print(f"📥 Verifique sua caixa de entrada: {settings.ADMIN_EMAIL}")
        print(f"⚠️  Não esqueça de verificar a pasta de SPAM/LIXO ELETRÔNICO")
        
        print(f"\n🎉 Integração Brevo CONFIRMADA e FUNCIONANDO!")
        print(f"✅ Sistema pronto para enviar emails de pedidos")
        
        return True
        
    except Exception as e:
        print("\n" + "="*70)
        print("❌ ERRO AO ENVIAR EMAIL")
        print("="*70)
        
        print(f"\n🐛 Detalhes do Erro:")
        print(f"   {type(e).__name__}: {str(e)}")
        
        print(f"\n📋 Traceback:")
        import traceback
        traceback.print_exc()
        
        print(f"\n🔍 Verificações:")
        print(f"   1. API Key SMTP está correta? (xsmtpsib-...)")
        print(f"   2. Email {settings.BREVO_SENDER_EMAIL} está verificado no Brevo?")
        print(f"   3. Conexão com internet está funcionando?")
        print(f"   4. Firewall não está bloqueando porta {settings.EMAIL_PORT}?")
        
        print(f"\n💡 Dica:")
        print(f"   Acesse https://app.brevo.com/ e verifique:")
        print(f"   - SMTP & API → SMTP")
        print(f"   - Verifique se o email remetente está validado")
        print(f"   - Teste as credenciais SMTP")
        
        return False

if __name__ == '__main__':
    print("\n🚀 Iniciando teste de email Brevo...")
    print(f"⏰ {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n")
    
    test_email()
    
    print("\n" + "="*70)
    print("🏁 Teste concluído")
    print("="*70 + "\n")

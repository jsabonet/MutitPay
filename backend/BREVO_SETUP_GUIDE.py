"""
===================================================================================
🔧 GUIA DE CORREÇÃO: CONFIGURAÇÃO BREVO SMTP
===================================================================================

❌ PROBLEMA DETECTADO:
Erro de autenticação SMTP (535 - Authentication failed)

Isso significa que as credenciais SMTP do Brevo não estão corretas ou a conta 
precisa ser reconfigurada.

===================================================================================
📋 COMO RESOLVER - PASSO A PASSO:
===================================================================================

🌐 PASSO 1: Acessar Painel Brevo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Acesse: https://app.brevo.com/
2. Faça login com suas credenciais
3. Se não lembra a senha, use "Esqueci minha senha"

📧 PASSO 2: Verificar Email Remetente
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. No menu esquerdo, clique em "Senders & IP"
2. Na aba "Senders", verifique se mutitpay@gmail.com está listado
3. Se não estiver, clique em "Add a sender"
4. Adicione: mutitpay@gmail.com
5. Confirme o email verificando sua caixa de entrada do Gmail
6. Clique no link de confirmação recebido

⚠️ ALTERNATIVA: Use contato@mutitpay.co.mz (se já estiver verificado)

🔑 PASSO 3: Obter Credenciais SMTP Corretas
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. No menu superior direito, clique no seu nome de usuário
2. Selecione "SMTP & API"
3. Na seção "SMTP", você verá:
   - Login: algo como "xxx@smtp-brevo.com"
   - Master password: (clique em "Show" para ver)

4. COPIE EXATAMENTE ESSES VALORES!

📝 PASSO 4: Atualizar Arquivo .env
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
No arquivo backend/.env, atualize:

BREVO_SMTP_LOGIN=SEU_LOGIN@smtp-brevo.com   # Login que você copiou
BREVO_API_KEY=sua_senha_master_smtp         # Master password do SMTP
BREVO_SENDER_EMAIL=mutitpay@gmail.com       # Email verificado

Exemplo:
BREVO_SMTP_LOGIN=a1b2c3d@smtp-brevo.com
BREVO_API_KEY=K9xYz...abc123              # Master password (NÃO é xsmtpsib-)
BREVO_SENDER_EMAIL=mutitpay@gmail.com

⚠️ IMPORTANTE:
- O "Master password" do SMTP é DIFERENTE da API Key (xkeysib-)
- Use o Master password para configuração SMTP
- O Login é diferente do seu email de conta

🔄 PASSO 5: Testar Novamente
━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Salve o arquivo .env
2. Execute: python test_simple_email.py
3. Aguarde o resultado

===================================================================================
🆘 SE AINDA NÃO FUNCIONAR:
===================================================================================

OPÇÃO A: Gerar Nova Senha SMTP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Em SMTP & API → SMTP
2. Clique em "Regenerate SMTP key"
3. Copie a nova senha Master
4. Atualize no .env

OPÇÃO B: Usar Email Diferente
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Se mutitpay@gmail.com não funciona:
1. Tente usar contato@mutitpay.co.mz (se verificado)
2. Ou adicione/verifique novo email sender
3. Atualize BREVO_SENDER_EMAIL no .env

OPÇÃO C: Verificar Limites da Conta
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. No dashboard, verifique se:
   - Conta está ativa
   - Não atingiu limite de 300 emails/dia
   - Não há suspensão temporária
2. Em caso de suspensão, contate suporte Brevo

===================================================================================
📞 SUPORTE BREVO:
===================================================================================

Chat: https://help.brevo.com/
Email: contact@brevo.com
Docs: https://developers.brevo.com/docs

===================================================================================
💡 TESTE RÁPIDO VIA TERMINAL:
===================================================================================

Você pode testar SMTP manualmente com Python:

import smtplib

server = smtplib.SMTP('smtp-relay.brevo.com', 587)
server.starttls()
server.login('SEU_LOGIN@smtp-brevo.com', 'SUA_SENHA_MASTER')
server.quit()
print("✅ Conexão SMTP funcionou!")

Se der erro 535, as credenciais estão incorretas.

===================================================================================
"""

def print_instructions():
    with open(__file__, 'r', encoding='utf-8') as f:
        print(f.read())

if __name__ == '__main__':
    print_instructions()
    
    print("\n" + "="*80)
    print("❓ PRECISA DE AJUDA PARA ENCONTRAR AS CREDENCIAIS?")
    print("="*80)
    
    print("""
    Acesse: https://app.brevo.com/
    Clique em: [Seu Nome] → SMTP & API → SMTP
    
    Você verá algo assim:
    
    ┌─────────────────────────────────────────┐
    │ SMTP Configuration                      │
    ├─────────────────────────────────────────┤
    │ Login: abc123xyz@smtp-brevo.com         │
    │ Master password: [Show] [Regenerate]    │
    │ Port: 587                               │
    │ Server: smtp-relay.brevo.com            │
    └─────────────────────────────────────────┘
    
    Copie o Login e clique em [Show] para ver a senha!
    """)
    
    print("\n" + "="*80)
    choice = input("Já atualizou o .env com as credenciais corretas? (s/n): ").strip().lower()
    
    if choice == 's':
        print("\n✅ Ótimo! Execute o teste novamente:")
        print("   python test_simple_email.py")
    else:
        print("\n⏸️  Atualize o .env primeiro e depois execute o teste.")

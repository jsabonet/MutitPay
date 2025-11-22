"""
================================================================================
🔑 GUIA: Como Obter a API Key REST do Brevo (para usar enquanto SMTP não ativa)
================================================================================

📌 SITUAÇÃO ATUAL:
- ✅ Credenciais SMTP corretas
- ❌ Conta SMTP não ativada (erro 502)
- 💡 Solução: Usar API REST (funciona imediatamente!)

================================================================================
🎯 SOLUÇÃO RÁPIDA: USAR API REST
================================================================================

A API REST do Brevo funciona IMEDIATAMENTE, sem precisar de ativação SMTP!
Você só precisa de uma chave diferente (xkeysib- em vez de xsmtpsib-)

📋 PASSO A PASSO:

1️⃣ ACESSE O PAINEL BREVO
   → https://app.brevo.com/
   → Faça login com suas credenciais

2️⃣ VEJA AS API KEYS
   → Clique no seu nome (canto superior direito)
   → Selecione "SMTP & API"
   → Clique na aba "API Keys" (não SMTP!)

3️⃣ CRIE UMA NOVA API KEY (se não tiver)
   → Clique em "Create a new API key"
   → Nome: "MutitPay Production"
   → Clique em "Generate"
   → ⚠️ COPIE A CHAVE IMEDIATAMENTE (só aparece uma vez!)
   → A chave começa com "xkeysib-..."

4️⃣ ATUALIZE O .ENV
   No arquivo backend/.env, adicione uma nova linha:
   
   BREVO_REST_API_KEY=xkeysib-SUA_CHAVE_AQUI
   
   Exemplo:
   BREVO_REST_API_KEY=xkeysib-abc123def456...xyz789

5️⃣ TESTE A API REST
   Execute: python test_brevo_rest_api.py

================================================================================
📊 COMPARAÇÃO: SMTP vs API REST
================================================================================

┌─────────────────────┬──────────────────┬──────────────────┐
│ Característica      │ SMTP             │ API REST         │
├─────────────────────┼──────────────────┼──────────────────┤
│ Ativação            │ Manual (suporte) │ Imediata         │
│ Chave               │ xsmtpsib-...     │ xkeysib-...      │
│ Status Atual        │ ❌ Não ativado   │ ✅ Pronto        │
│ Limite Diário       │ 300 emails       │ 300 emails       │
│ Recursos            │ Básico           │ Completo         │
│ Rastreamento        │ Limitado         │ Avançado         │
│ Webhooks            │ Não              │ Sim              │
└─────────────────────┴──────────────────┴──────────────────┘

💡 RECOMENDAÇÃO: Use API REST! É melhor e funciona agora!

================================================================================
🔍 ONDE ENCONTRAR NO PAINEL BREVO:
================================================================================

Caminho no painel:
┌────────────────────────────────────────┐
│ [Seu Nome] ▼                           │
│   ├─ My Profile                        │
│   ├─ SMTP & API  ← CLIQUE AQUI         │
│   │   ├─ SMTP (não ativado)            │
│   │   └─ API Keys ← VÁ PARA AQUI       │
│   ├─ Account Settings                  │
│   └─ Logout                            │
└────────────────────────────────────────┘

Na página API Keys:
┌────────────────────────────────────────┐
│ API Keys                               │
│                                        │
│ [+ Create a new API key]               │
│                                        │
│ Existing Keys:                         │
│ ┌──────────────────────────────────┐   │
│ │ Name: MutitPay Production        │   │
│ │ Key: xkeysib-abc...xyz (hidden)  │   │
│ │ Created: 22/11/2025              │   │
│ │ [Show] [Delete] [Regenerate]     │   │
│ └──────────────────────────────────┘   │
└────────────────────────────────────────┘

================================================================================
⚡ DEPOIS DE OBTER A CHAVE:
================================================================================

1. Adicione no .env:
   BREVO_REST_API_KEY=xkeysib-sua_chave_completa_aqui

2. Execute o teste:
   python test_brevo_rest_api.py

3. Se funcionar, o sistema MUTIT PAY poderá enviar emails imediatamente!

================================================================================
❓ PERGUNTAS FREQUENTES:
================================================================================

Q: Posso usar as duas chaves (SMTP e API)?
A: Sim! Mantenha ambas. Use API REST agora e SMTP quando ativar.

Q: Qual é melhor?
A: API REST tem mais recursos e é mais confiável.

Q: A API Key REST já vem ativada?
A: Sim! Funciona imediatamente após criar.

Q: Tem limite?
A: Mesma coisa: 300 emails/dia no plano gratuito.

Q: Preciso verificar o email remetente?
A: Sim, em Senders & IP → Senders, adicione e verifique o email.

================================================================================
📞 SUPORTE:
================================================================================

Se tiver problemas:
→ Chat: https://help.brevo.com/
→ Email: contact@brevo.com
→ Docs: https://developers.brevo.com/docs

================================================================================
"""

if __name__ == '__main__':
    print(__doc__)
    
    print("\n" + "="*80)
    print("🚀 PRÓXIMOS PASSOS:")
    print("="*80)
    print("""
    1. Acesse: https://app.brevo.com/
    2. Vá em: [Seu Nome] → SMTP & API → API Keys
    3. Crie uma nova API key (xkeysib-...)
    4. Adicione no .env: BREVO_REST_API_KEY=xkeysib-...
    5. Execute: python test_brevo_rest_api.py
    """)
    
    choice = input("\nJá tem a API Key REST? (s/n): ").strip().lower()
    
    if choice == 's':
        api_key = input("\nCole a API Key aqui (xkeysib-...): ").strip()
        if api_key.startswith('xkeysib-'):
            print(f"\n✅ Chave válida! Tamanho: {len(api_key)} caracteres")
            print("\nAdicione no arquivo backend/.env:")
            print(f"BREVO_REST_API_KEY={api_key}")
            print("\nDepois execute: python test_brevo_rest_api.py")
        else:
            print("\n⚠️ A chave deve começar com 'xkeysib-'")
            print("Verifique se copiou a chave correta da seção API Keys (não SMTP)")
    else:
        print("\n📋 Siga os passos acima para obter a API Key REST")
        print("É rápido e funciona imediatamente!")

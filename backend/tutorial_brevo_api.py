"""
================================================================================
🎯 TUTORIAL VISUAL: COMO OBTER API KEY REST DO BREVO
================================================================================

📍 PASSO 1: ACESSAR O PAINEL
════════════════════════════════════════════════════════════════════════════

1. Abra o navegador
2. Acesse: https://app.brevo.com/
3. Faça login com seu email e senha


📍 PASSO 2: IR PARA SMTP & API
════════════════════════════════════════════════════════════════════════════

No canto superior direito da tela, você verá seu nome/email.

Clique nele e verá um menu dropdown:

    ┌──────────────────────────────┐
    │  jsabonete09@gmail.com    ▼  │
    ├──────────────────────────────┤
    │  👤 My Profile               │
    │  🔑 SMTP & API    ← AQUI!    │
    │  ⚙️  Account Settings         │
    │  🚪 Logout                   │
    └──────────────────────────────┘


📍 PASSO 3: CLICAR NA ABA "API KEYS"
════════════════════════════════════════════════════════════════════════════

Você verá duas abas no topo:

    ┌─────────────────────────────────────────────────┐
    │  [  SMTP  ] [ API Keys ]  ← CLIQUE AQUI         │
    └─────────────────────────────────────────────────┘
    
    ⚠️ NÃO clique em SMTP! Clique em "API Keys"!


📍 PASSO 4: VER OU CRIAR API KEY
════════════════════════════════════════════════════════════════════════════

Na página API Keys, você verá:

    ┌────────────────────────────────────────────────┐
    │  API Keys                                      │
    │                                                │
    │  [➕ Create a new API key]  ← Se não tiver     │
    │                                                │
    │  Your API Keys:                                │
    │  ┌──────────────────────────────────────────┐ │
    │  │ 📝 MutitPay Production                   │ │
    │  │ 🔑 xkeysib-**********************        │ │
    │  │    [👁️ Show] [🔄 Regenerate] [🗑️ Delete]│ │
    │  │ 📅 Created: 2025-11-22                   │ │
    │  └──────────────────────────────────────────┘ │
    └────────────────────────────────────────────────┘


📍 PASSO 5: COPIAR A CHAVE
════════════════════════════════════════════════════════════════════════════

SE JÁ TIVER UMA CHAVE:
  1. Clique no botão [👁️ Show]
  2. A chave completa aparecerá
  3. Clique no botão [📋 Copy] ou selecione e copie
  4. A chave começa com: xkeysib-

SE NÃO TIVER NENHUMA CHAVE:
  1. Clique no botão [➕ Create a new API key]
  2. Digite um nome: "MutitPay Production"
  3. Clique em [Generate]
  4. ⚠️ COPIE IMEDIATAMENTE! A chave só aparece uma vez!


📍 PASSO 6: ADICIONAR NO .ENV
════════════════════════════════════════════════════════════════════════════

1. Abra o arquivo: backend/.env
2. Encontre a linha: BREVO_API_KEY=xsmtpsib-...
3. SUBSTITUA pela nova chave:

   ANTES:
   BREVO_API_KEY=xsmtpsib-SUA_CHAVE_SMTP_ANTIGA

   DEPOIS:
   BREVO_API_KEY=xkeysib-SUA_CHAVE_API_REST_AQUI

4. Salve o arquivo (Ctrl+S)


📍 PASSO 7: TESTAR
════════════════════════════════════════════════════════════════════════════

No terminal, execute:

    cd backend
    python test_brevo_rest_api.py

Se tudo estiver certo, você verá:
    ✅ EMAIL ENVIADO COM SUCESSO VIA API REST!


================================================================================
❓ PERGUNTAS COMUNS:
================================================================================

Q: A chave deve começar com o quê?
A: xkeysib- (não xsmtpsib-)

Q: Onde está o menu "SMTP & API"?
A: Clique no seu nome/email no canto superior direito

Q: Posso usar a mesma chave SMTP?
A: Não. SMTP (xsmtpsib-) é diferente de API REST (xkeysib-)

Q: E se eu não vir "API Keys"?
A: Certifique-se de estar na aba "API Keys", não na aba "SMTP"

Q: A chave funciona imediatamente?
A: Sim! API REST não precisa de ativação

Q: Posso ter várias chaves?
A: Sim, você pode criar várias e usar qualquer uma


================================================================================
🎯 CHECKLIST RÁPIDO:
================================================================================

□ Acessei https://app.brevo.com/
□ Fiz login
□ Cliquei no meu nome (canto superior direito)
□ Selecionei "SMTP & API"
□ Cliquei na aba "API Keys" (não SMTP!)
□ Copiei ou criei uma API Key (xkeysib-...)
□ Atualizei BREVO_API_KEY no backend/.env
□ Salvei o arquivo .env
□ Executei: python test_brevo_rest_api.py


================================================================================
💡 DICA PRO:
================================================================================

Se você ver suas chaves mas elas estão ocultas (***), não se preocupe!
Clique em [Show] para revelar a chave completa.

A chave é longa (mais de 80 caracteres). Copie tudo!


================================================================================
"""

def show_tutorial():
    print(__doc__)
    print("\n" + "="*80)
    print("🚀 PRONTO PARA COMEÇAR?")
    print("="*80)
    print("""
📋 RESUMO DOS 7 PASSOS:

1. Acesse: https://app.brevo.com/
2. Clique no seu nome (canto superior direito)
3. Selecione "SMTP & API"
4. Clique na aba "API Keys"
5. Copie ou crie uma chave (xkeysib-...)
6. Atualize backend/.env
7. Teste com: python test_brevo_rest_api.py
    """)
    
    input("Pressione ENTER para abrir o painel Brevo no navegador...")
    
    import webbrowser
    print("\n🌐 Abrindo https://app.brevo.com/ no navegador...")
    webbrowser.open('https://app.brevo.com/')
    
    print("\n✅ Siga os passos acima!")
    print("💬 Quando tiver a chave, volte aqui e execute:")
    print("   python test_brevo_rest_api.py")

if __name__ == '__main__':
    show_tutorial()

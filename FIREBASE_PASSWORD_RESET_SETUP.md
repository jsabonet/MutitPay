# Configuração de Recuperação de Senha - Firebase

## ✅ Status Atual
A recuperação de senha está **implementada** no código frontend usando Firebase Authentication.

## 📋 Funcionalidades Implementadas

### 1. **Página de Login** (`/login`)
- Botão "Esqueceu a senha?" abre modal
- Modal com formulário de recuperação
- Validação de email
- Mensagens de erro e sucesso
- Tratamento de casos especiais (user-not-found, too-many-requests)

### 2. **Página Dedicada** (`/forgot-password`)
- Rota standalone para recuperação
- Interface completa com Card
- Links para login, registro e loja
- Feedback visual durante envio

### 3. **AuthContext**
- Função `resetPassword(email)` implementada
- Usa `sendPasswordResetEmail` do Firebase
- Integrado com Firebase Auth

## 🔧 Configuração Necessária no Firebase Console

Para que a recuperação de senha funcione corretamente, você precisa configurar no **Firebase Console**:

### Passo 1: Acessar Configurações de Email
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto: **mutitpay-d5a4a**
3. Vá em **Authentication** → **Templates** (ou **Modelos**)

### Passo 2: Configurar Template de Redefinição de Senha
1. Clique em **Redefinição de senha** (Password reset)
2. Configure:
   - **Nome do remetente**: MUTIT PAY
   - **Endereço de email do remetente**: noreply@mutitpay.com (ou seu email)
   - **URL de ação**: `https://mutitpay.com/__/auth/action` (Firebase gerencia automaticamente)
   - **Idioma**: Português

### Passo 3: Personalizar Mensagem (RECOMENDADO)

**IMPORTANTE:** No Firebase Console, você verá este template padrão:
```html
<p>Hello,</p>
<p>Follow this link to reset your %APP_NAME% password for your %EMAIL% account.</p>
<p><a href='%LINK%'>%LINK%</a></p>
<p>If you didn't ask to reset your password, you can ignore this email.</p>
<p>Thanks,</p>
<p>Your %APP_NAME% team</p>
```

**SUBSTITUA** por este template melhorado com as informações da MUTIT PAY:

**Assunto do Email:**
```
🔐 MUTIT PAY - Redefinição de Senha Solicitada
```

**Corpo do Email (HTML) - COPIE E COLE:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #0054A6 0%, #003d7a 100%); padding: 40px 20px; text-align: center; }
        .logo { color: #ffffff; font-size: 32px; font-weight: bold; margin: 0; letter-spacing: 2px; }
        .tagline { color: #D4AF37; font-size: 14px; margin-top: 5px; }
        .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
        .greeting { font-size: 18px; font-weight: 600; color: #0054A6; margin-bottom: 20px; }
        .message { font-size: 15px; margin-bottom: 20px; }
        .button-container { text-align: center; margin: 35px 0; }
        .reset-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #0054A6 0%, #003d7a 100%); 
            color: #ffffff !important; 
            padding: 16px 40px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold; 
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(0, 84, 166, 0.3);
        }
        .expiry-notice { 
            background-color: #fff3cd; 
            border-left: 4px solid #ffc107; 
            padding: 15px; 
            margin: 25px 0; 
            font-size: 14px;
        }
        .security-notice { 
            background-color: #f8f9fa; 
            border-left: 4px solid #6c757d; 
            padding: 15px; 
            margin: 25px 0; 
            font-size: 13px; 
            color: #6c757d;
        }
        .footer { 
            background-color: #f8f9fa; 
            padding: 30px 20px; 
            text-align: center; 
            font-size: 13px; 
            color: #6c757d; 
            border-top: 1px solid #dee2e6;
        }
        .footer-links { margin: 15px 0; }
        .footer-links a { 
            color: #0054A6; 
            text-decoration: none; 
            margin: 0 10px; 
            font-weight: 500;
        }
        .contact-info { margin-top: 15px; font-size: 12px; }
        @media only screen and (max-width: 600px) {
            .content { padding: 30px 20px; }
            .reset-button { padding: 14px 30px; font-size: 15px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1 class="logo">MUTIT PAY</h1>
            <p class="tagline">Luxo e Elegância em Moçambique</p>
        </div>
        
        <!-- Content -->
        <div class="content">
            <p class="greeting">Olá, %EMAIL%! 👋</p>
            
            <p class="message">
                Recebemos uma solicitação para <strong>redefinir a senha</strong> da sua conta MUTIT PAY.
            </p>
            
            <p class="message">
                Para criar uma nova senha e recuperar o acesso à sua conta, clique no botão abaixo:
            </p>
            
            <div class="button-container">
                <a href="%LINK%" class="reset-button">🔐 Redefinir Minha Senha</a>
            </div>
            
            <div class="expiry-notice">
                <strong>⏱️ Atenção:</strong> Este link é válido por <strong>1 hora</strong> a partir do momento em que foi enviado. Após esse período, será necessário solicitar um novo link.
            </div>
            
            <div class="security-notice">
                <strong>🔒 Segurança em Primeiro Lugar</strong><br>
                Se você <strong>NÃO</strong> solicitou esta redefinição de senha, ignore este email. Sua conta permanecerá segura e nenhuma alteração será feita.
            </div>
            
            <p class="message">
                Caso precise de ajuda, nossa equipe está sempre disponível para auxiliá-lo.
            </p>
            
            <p style="margin-top: 30px; font-weight: 500;">
                Atenciosamente,<br>
                <span style="color: #0054A6; font-weight: bold;">Equipe MUTIT PAY</span>
            </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-links">
                <a href="https://mutitpay.com">🏠 Visitar Loja</a>
                <a href="https://mutitpay.com/products">🛍️ Ver Produtos</a>
                <a href="https://mutitpay.com/about">ℹ️ Sobre Nós</a>
            </div>
            
            <div class="contact-info">
                📍 <strong>Localização:</strong> Pemba, Cabo Delgado, Moçambique<br>
                📞 <strong>Telefone:</strong> +258 84 472 0861<br>
                📧 <strong>Email:</strong> suporte@mutitpay.com<br>
                🌐 <strong>Website:</strong> <a href="https://mutitpay.com" style="color: #0054A6;">mutitpay.com</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 11px; color: #999;">
                © 2025 MUTIT PAY. Todos os direitos reservados.<br>
                Este é um email automático, por favor não responda.
            </p>
        </div>
    </div>
</body>
</html>
```

**📝 Variáveis do Firebase:**
- `%LINK%` - Link de redefinição (obrigatório)
- `%EMAIL%` - Email do usuário (opcional, mas recomendado)
- `%APP_NAME%` - Nome do app (não usado neste template customizado)

**Ou versão em texto simples (para clientes de email sem HTML):**
```
============================================
MUTIT PAY - Redefinição de Senha
Luxo e Elegância em Moçambique
============================================

Olá, %EMAIL%! 👋

Recebemos uma solicitação para redefinir a senha da sua conta MUTIT PAY.

Para criar uma nova senha e recuperar o acesso à sua conta, clique no link abaixo:

🔐 REDEFINIR SENHA:
%LINK%

⏱️ ATENÇÃO: Este link é válido por 1 HORA a partir do momento em que foi enviado.

🔒 SEGURANÇA: Se você NÃO solicitou esta redefinição, ignore este email. Sua conta permanecerá segura.

--------------------------------------------
Precisa de ajuda?
--------------------------------------------
📍 Pemba, Cabo Delgado, Moçambique
📞 +258 84 472 0861
📧 suporte@mutitpay.com
🌐 https://mutitpay.com

Atenciosamente,
Equipe MUTIT PAY

© 2025 MUTIT PAY - Todos os direitos reservados
Este é um email automático, por favor não responda.
============================================
```

### Passo 4: Como Aplicar o Template no Firebase

1. **Acesse Firebase Console** → Authentication → Templates
2. **Clique em** "Password reset" (Redefinição de senha)
3. **Clique em** "Edit template" (Editar modelo)
4. **Configure:**
   - **From name (Nome do remetente):** `MUTIT PAY`
   - **From email:** `noreply@mutitpay-d5a4a.firebaseapp.com` (padrão) ou configure SMTP customizado
   - **Reply-to email:** `suporte@mutitpay.com` (opcional)
5. **Cole o template HTML** na seção "Email body"
6. **Clique em** "Save" (Salvar)
7. **Teste** enviando um email de recuperação

**💡 Dica:** O Firebase aceita templates HTML ou texto. Recomendamos HTML para melhor apresentação.

### Passo 5: Configurar Domínio Autorizado
1. Vá em **Authentication** → **Settings** → **Authorized domains**
2. Adicione: `mutitpay.com`
3. Certifique-se que está ativo

### Passo 6: Verificar Email Provider
1. Em **Authentication** → **Sign-in method**
2. Verifique se **Email/Password** está habilitado
3. **Password reset** deve estar ativo

## 🎨 Preview do Email

O email de recuperação terá:

### Características Visuais:
- ✅ **Header azul** com gradiente (cores da marca MUTIT PAY)
- ✅ **Logo MUTIT PAY** em destaque
- ✅ **Tagline dourada**: "Luxo e Elegância em Moçambique"
- ✅ **Botão de ação** grande e visível com gradiente azul
- ✅ **Aviso de expiração** em destaque amarelo
- ✅ **Nota de segurança** em cinza claro
- ✅ **Footer completo** com:
  - Links para loja, produtos e sobre
  - Endereço em Pemba, Cabo Delgado
  - Telefone: +258 84 472 0861
  - Email de suporte
  - Copyright e ano

### Responsivo:
- 📱 **Mobile-friendly** - adaptado para celulares
- 💻 **Desktop** - visual profissional em computadores
- 📧 **Compatível** com Gmail, Outlook, Yahoo, etc.

## 🧪 Como Testar

### Teste Local (Development)
```bash
# 1. Acesse http://localhost:5173/login
# 2. Clique em "Esqueceu a senha?"
# 3. Digite um email cadastrado
# 4. Verifique o email recebido
```

### Teste em Produção
```bash
# 1. Acesse https://mutitpay.com/login
# 2. Clique em "Esqueceu a senha?"
# 3. Digite: jsabonete09@gmail.com (ou outro email cadastrado)
# 4. Verifique caixa de entrada
```

## 🔍 Diagnóstico de Problemas

### Email não chega?
1. **Verifique spam/lixo eletrônico**
2. **Firebase Console** → Authentication → Users → procure o email
3. Se usuário não existe, Firebase não envia (segurança)
4. Verifique quota diária do Firebase (limite gratuito: 100 emails/dia)

### Erro "auth/invalid-email"
- Email mal formatado
- Validação do frontend deve impedir isso

### Erro "auth/user-not-found"
- Usuário não cadastrado
- Frontend mostra mensagem genérica por segurança

### Erro "auth/too-many-requests"
- Muitas tentativas em pouco tempo
- Firebase bloqueia temporariamente
- Espere 15-30 minutos

### Link do email expira?
- Links são válidos por **1 hora** (padrão Firebase)
- Após 1 hora, solicite novo link

## 📧 Configuração de Email Personalizado (Opcional)

Para usar email customizado (ex: noreply@mutitpay.com):

### Opção 1: SMTP Customizado (Blaze Plan)
1. Firebase Console → **Authentication** → **Templates** → **SMTP**
2. Configure servidor SMTP (ex: SendGrid, AWS SES, Brevo)

### Opção 2: Cloud Functions (Recomendado)
```javascript
// functions/index.js
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

exports.sendPasswordResetEmail = functions.auth.user().onCreate(async (user) => {
  // Lógica customizada com template HTML rico
});
```

## ✅ Checklist de Verificação

- [x] Código implementado no frontend
- [x] Modal de recuperação funcional
- [x] Página `/forgot-password` criada
- [x] AuthContext integrado
- [ ] **Template configurado no Firebase Console**
- [ ] **Domínio autorizado adicionado**
- [ ] **Email provider habilitado**
- [ ] **Teste em produção realizado**

## 🎯 Próximos Passos

1. **Configurar Firebase Console** seguindo passos acima
2. **Testar** com email real em produção
3. **Personalizar template** de email (opcional)
4. **Monitorar logs** no Firebase Console

## 📝 Notas Importantes

- Firebase gerencia toda a lógica de token e expiração
- Não é necessário backend Django para isso
- Usuários receberão email do Firebase (noreply@mutitpay-d5a4a.firebaseapp.com por padrão)
- Para email customizado, precisa plano Blaze ou Cloud Functions

## 🔗 Links Úteis

- [Firebase Auth - Password Reset](https://firebase.google.com/docs/auth/web/manage-users#send_a_password_reset_email)
- [Customize Email Templates](https://firebase.google.com/docs/auth/custom-email-handler)
- [Firebase Console](https://console.firebase.google.com/project/mutitpay-d5a4a)

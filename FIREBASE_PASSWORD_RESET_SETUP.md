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

### Passo 3: Personalizar Mensagem (Opcional)
Template padrão do Firebase:
```
Olá,

Você solicitou a redefinição de senha da sua conta MUTIT PAY.

Clique no link abaixo para criar uma nova senha:
%LINK%

Se você não solicitou esta alteração, ignore este email.

Atenciosamente,
Equipe MUTIT PAY
```

### Passo 4: Configurar Domínio Autorizado
1. Vá em **Authentication** → **Settings** → **Authorized domains**
2. Adicione: `mutitpay.com`
3. Certifique-se que está ativo

### Passo 5: Verificar Email Provider
1. Em **Authentication** → **Sign-in method**
2. Verifique se **Email/Password** está habilitado
3. **Password reset** deve estar ativo

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

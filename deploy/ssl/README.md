# SSL Certificates Directory

Este diretório armazenará os certificados SSL do Let's Encrypt.

## Estrutura após configuração:

```
ssl/
├── live/
│   └── mutitpay.com/
│       ├── fullchain.pem
│       ├── privkey.pem
│       └── chain.pem
└── archive/
```

## Como configurar:

Siga as instruções em **DEPLOY.md** seção 6 "Configurar SSL/HTTPS com Let's Encrypt".

## Renovação automática:

O certificado será renovado automaticamente via cronjob configurado durante o deploy.

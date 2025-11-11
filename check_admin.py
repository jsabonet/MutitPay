#!/usr/bin/env python
"""Script para verificar status de admin dos usuários"""

from customers.models import ExternalAuthUser
from decouple import config

admin_emails = config('FIREBASE_ADMIN_EMAILS', default='').split(',')
admin_emails = [e.strip().lower() for e in admin_emails if e.strip()]

print("=" * 60)
print("FIREBASE_ADMIN_EMAILS configurados:")
for email in admin_emails:
    print(f"  - {email}")

print("\n" + "=" * 60)
print("Usuários ExternalAuthUser no banco:")

users = ExternalAuthUser.objects.all()
for user in users:
    email_lower = user.email.lower() if user.email else ''
    in_admin_list = email_lower in admin_emails
    
    print(f"\nEmail: {user.email}")
    print(f"  firebase_uid: {user.firebase_uid}")
    print(f"  is_admin: {user.is_admin}")
    print(f"  in FIREBASE_ADMIN_EMAILS: {in_admin_list}")
    print(f"  display_name: {user.display_name}")

print("\n" + "=" * 60)
print(f"Total de usuários: {users.count()}")

# Verificar usuários que deveriam ser admin mas não são
print("\n" + "=" * 60)
print("Usuários que deveriam ser admin mas não são:")
for user in users:
    email_lower = user.email.lower() if user.email else ''
    if email_lower in admin_emails and not user.is_admin:
        print(f"  ⚠️  {user.email} (uid: {user.firebase_uid})")
        # Corrigir automaticamente
        user.is_admin = True
        user.save()
        print(f"      ✅ Corrigido! is_admin agora é True")

print("\nVerificação concluída!")

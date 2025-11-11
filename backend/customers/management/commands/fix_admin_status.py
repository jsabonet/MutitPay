from django.core.management.base import BaseCommand
from customers.models import ExternalAuthUser
from decouple import config


class Command(BaseCommand):
    help = 'Verifica e corrige status de admin dos usuários configurados em FIREBASE_ADMIN_EMAILS'

    def handle(self, *args, **options):
        admin_emails = config('FIREBASE_ADMIN_EMAILS', default='').split(',')
        admin_emails = [e.strip().lower() for e in admin_emails if e.strip()]

        self.stdout.write("=" * 60)
        self.stdout.write(self.style.SUCCESS("FIREBASE_ADMIN_EMAILS configurados:"))
        for email in admin_emails:
            self.stdout.write(f"  - {email}")

        self.stdout.write("\n" + "=" * 60)
        self.stdout.write("Usuários ExternalAuthUser no banco:")

        users = ExternalAuthUser.objects.all()
        for user in users:
            email_lower = user.email.lower() if user.email else ''
            in_admin_list = email_lower in admin_emails
            
            self.stdout.write(f"\nEmail: {user.email}")
            self.stdout.write(f"  firebase_uid: {user.firebase_uid}")
            self.stdout.write(f"  is_admin: {user.is_admin}")
            self.stdout.write(f"  in FIREBASE_ADMIN_EMAILS: {in_admin_list}")

        self.stdout.write("\n" + "=" * 60)
        self.stdout.write(f"Total de usuários: {users.count()}")

        # Verificar e corrigir usuários que deveriam ser admin mas não são
        self.stdout.write("\n" + "=" * 60)
        self.stdout.write(self.style.WARNING("Verificando usuários que deveriam ser admin..."))
        
        fixed_count = 0
        for user in users:
            email_lower = user.email.lower() if user.email else ''
            if email_lower in admin_emails and not user.is_admin:
                self.stdout.write(self.style.WARNING(f"  ⚠️  {user.email} (uid: {user.firebase_uid}) - is_admin=False"))
                user.is_admin = True
                user.save()
                
                # Atualizar também o Django User
                if user.user:
                    user.user.is_staff = True
                    user.user.is_superuser = True
                    user.user.save()
                
                self.stdout.write(self.style.SUCCESS(f"      ✅ Corrigido! is_admin agora é True"))
                fixed_count += 1

        if fixed_count == 0:
            self.stdout.write(self.style.SUCCESS("\n✅ Todos os admin emails já estão configurados corretamente!"))
        else:
            self.stdout.write(self.style.SUCCESS(f"\n✅ {fixed_count} usuário(s) corrigido(s)!"))

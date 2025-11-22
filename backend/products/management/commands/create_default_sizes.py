"""
Management command to create default sizes for products
"""
from django.core.management.base import BaseCommand
from products.models import Size


class Command(BaseCommand):
    help = 'Creates default product sizes (P, M, G, GG, etc.)'

    def handle(self, *args, **options):
        sizes_data = [
            {'name': 'Extra Pequeno', 'abbreviation': 'XP', 'order': 1},
            {'name': 'Pequeno', 'abbreviation': 'P', 'order': 2},
            {'name': 'Médio', 'abbreviation': 'M', 'order': 3},
            {'name': 'Grande', 'abbreviation': 'G', 'order': 4},
            {'name': 'Extra Grande', 'abbreviation': 'GG', 'order': 5},
            {'name': 'Extra Extra Grande', 'abbreviation': 'XG', 'order': 6},
            
            # Tamanhos numéricos comuns
            {'name': 'Tamanho 36', 'abbreviation': '36', 'order': 10},
            {'name': 'Tamanho 37', 'abbreviation': '37', 'order': 11},
            {'name': 'Tamanho 38', 'abbreviation': '38', 'order': 12},
            {'name': 'Tamanho 39', 'abbreviation': '39', 'order': 13},
            {'name': 'Tamanho 40', 'abbreviation': '40', 'order': 14},
            {'name': 'Tamanho 41', 'abbreviation': '41', 'order': 15},
            {'name': 'Tamanho 42', 'abbreviation': '42', 'order': 16},
            {'name': 'Tamanho 43', 'abbreviation': '43', 'order': 17},
            {'name': 'Tamanho 44', 'abbreviation': '44', 'order': 18},
            {'name': 'Tamanho 45', 'abbreviation': '45', 'order': 19},
            
            # Tamanhos internacionais
            {'name': 'Extra Small', 'abbreviation': 'XS', 'order': 20},
            {'name': 'Small', 'abbreviation': 'S', 'order': 21},
            {'name': 'Medium', 'abbreviation': 'M', 'order': 22},
            {'name': 'Large', 'abbreviation': 'L', 'order': 23},
            {'name': 'Extra Large', 'abbreviation': 'XL', 'order': 24},
            {'name': 'Double XL', 'abbreviation': 'XXL', 'order': 25},
            {'name': 'Triple XL', 'abbreviation': 'XXXL', 'order': 26},
            
            # Tamanhos únicos
            {'name': 'Tamanho Único', 'abbreviation': 'ÚN', 'order': 30},
        ]

        created_count = 0
        updated_count = 0
        skipped_count = 0

        for size_data in sizes_data:
            size, created = Size.objects.get_or_create(
                name=size_data['name'],
                defaults={
                    'abbreviation': size_data['abbreviation'],
                    'order': size_data['order'],
                    'is_active': True
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Criado: {size.name} ({size.abbreviation})')
                )
            else:
                # Atualizar se já existe mas ordem/abbreviation diferentes
                updated = False
                if size.abbreviation != size_data['abbreviation']:
                    size.abbreviation = size_data['abbreviation']
                    updated = True
                if size.order != size_data['order']:
                    size.order = size_data['order']
                    updated = True
                
                if updated:
                    size.save()
                    updated_count += 1
                    self.stdout.write(
                        self.style.WARNING(f'↻ Atualizado: {size.name} ({size.abbreviation})')
                    )
                else:
                    skipped_count += 1
                    self.stdout.write(
                        self.style.NOTICE(f'→ Já existe: {size.name} ({size.abbreviation})')
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Processo concluído: {created_count} criados, {updated_count} atualizados, {skipped_count} ignorados'
            )
        )

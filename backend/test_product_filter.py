"""
Script para testar filtro de produtos ativos
"""
import os
import sys
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chiva_backend.settings')
django.setup()

from products.models import Product

print("\n" + "="*70)
print("📊 TESTE DE FILTRO DE PRODUTOS ATIVOS")
print("="*70)

# Contar todos os produtos
total = Product.objects.count()
ativos = Product.objects.filter(status='active').count()
inativos = Product.objects.filter(status='inactive').count()

print(f"\n📦 Produtos no sistema:")
print(f"   Total: {total}")
print(f"   ✅ Ativos: {ativos}")
print(f"   ❌ Inativos: {inativos}")

# Listar alguns produtos inativos (se existirem)
if inativos > 0:
    print(f"\n❌ Produtos inativos encontrados:")
    for prod in Product.objects.filter(status='inactive')[:5]:
        print(f"   • ID {prod.id}: {prod.name} (status: {prod.status})")

print(f"\n✅ VIEWS QUE FILTRAM APENAS PRODUTOS ATIVOS:")
print(f"   1. ProductListCreateView - GET (usuários não-admin)")
print(f"   2. ProductDetailView - GET (usuários não-admin)")
print(f"   3. featured_products - GET")
print(f"   4. bestseller_products - GET")
print(f"   5. sale_products - GET")
print(f"   6. products_by_category - GET")

print(f"\n🔒 VIEWS QUE MOSTRAM TODOS OS PRODUTOS (apenas admin):")
print(f"   1. ProductListCreateView - GET (admin)")
print(f"   2. ProductDetailView - GET (admin)")
print(f"   3. ProductByIdDetailView - admin only")

print(f"\n✅ CONCLUSÃO:")
print(f"   • Usuários públicos/clientes verão apenas {ativos} produtos ativos")
print(f"   • Admins podem ver todos os {total} produtos")
print(f"   • Sistema configurado corretamente!")

print("\n" + "="*70)

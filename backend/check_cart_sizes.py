#!/usr/bin/env python
"""
Script para verificar se os carrinhos têm tamanhos salvos
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chiva_backend.settings')
django.setup()

from cart.models import Cart, CartItem

print("=" * 80)
print("VERIFICANDO TAMANHOS NOS CARRINHOS")
print("=" * 80)

# Get all carts with items
carts = Cart.objects.filter(items__isnull=False).distinct().order_by('-created_at')
print(f"\n🛒 Total de carrinhos com itens: {carts.count()}\n")

for cart in carts:
    print(f"\n{'='*60}")
    print(f"Carrinho #{cart.id}")
    print(f"Usuário: {cart.user.username if cart.user else 'Anônimo (sessão)'}")
    print(f"Session Key: {cart.session_key or 'N/A'}")
    print(f"Data: {cart.created_at.strftime('%d/%m/%Y %H:%M')}")
    
    items = cart.items.select_related('product', 'color', 'size').all()
    print(f"\n📋 Itens ({items.count()}):")
    
    for item in items:
        print(f"\n   Produto: {item.product.name if item.product else 'N/A'}")
        print(f"   Quantidade: {item.quantity}x")
        print(f"   Preço: {item.price} MZN")
        
        # Color info
        if item.color:
            print(f"   🎨 Cor: ✅ {item.color.name} ({item.color.hex_code})")
        else:
            print(f"   🎨 Cor: ❌ NÃO DEFINIDA")
        
        # Size info - CRITICAL CHECK
        if item.size:
            print(f"   📏 Tamanho: ✅ {item.size.abbreviation} ({item.size.name})")
        else:
            print(f"   📏 Tamanho: ❌ NÃO DEFINIDO")
        
        # Check if product has sizes available
        if item.product and item.product.sizes.exists():
            available_sizes = ", ".join([s.abbreviation for s in item.product.sizes.all()])
            print(f"   ℹ️  Tamanhos disponíveis: {available_sizes}")

print("\n" + "=" * 80)
print("RESUMO")
print("=" * 80)

total_items = CartItem.objects.count()
items_with_size = CartItem.objects.filter(size__isnull=False).count()
items_with_color = CartItem.objects.filter(color__isnull=False).count()

print(f"\nTotal de itens em carrinhos: {total_items}")
print(f"Itens COM size: {items_with_size} ({items_with_size/total_items*100 if total_items > 0 else 0:.1f}%)")
print(f"Itens COM color: {items_with_color} ({items_with_color/total_items*100 if total_items > 0 else 0:.1f}%)")
print(f"Itens SEM tamanho: {total_items - items_with_size} ({(total_items - items_with_size)/total_items*100 if total_items > 0 else 0:.1f}%)")
print(f"Itens SEM cor: {total_items - items_with_color} ({(total_items - items_with_color)/total_items*100 if total_items > 0 else 0:.1f}%)")

print("\n" + "=" * 80)

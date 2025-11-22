#!/usr/bin/env python
"""
Script para verificar se os pedidos têm tamanhos salvos nos OrderItems
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chiva_backend.settings')
django.setup()

from cart.models import Order, OrderItem

print("=" * 80)
print("VERIFICANDO TAMANHOS NOS PEDIDOS")
print("=" * 80)

# Get all orders
orders = Order.objects.all().order_by('-created_at')
print(f"\n📦 Total de pedidos: {orders.count()}\n")

for order in orders:
    print(f"\n{'='*60}")
    print(f"Pedido #{order.id}: {order.order_number}")
    print(f"Data: {order.created_at.strftime('%d/%m/%Y %H:%M')}")
    print(f"Status: {order.status}")
    print(f"Total: {order.total_amount} MZN")
    
    items = order.items.select_related('product', 'color', 'size').all()
    print(f"\n📋 Itens ({items.count()}):")
    
    if not items:
        print("   ⚠️ Nenhum item neste pedido!")
        continue
    
    for item in items:
        print(f"\n   Produto: {item.product_name}")
        print(f"   SKU: {item.sku or 'N/A'}")
        print(f"   Quantidade: {item.quantity}x")
        print(f"   Preço Unit: {item.unit_price} MZN")
        
        # Color info
        if item.color or item.color_name:
            color_display = item.color_name or (item.color.name if item.color else "N/A")
            color_hex = item.color_hex or (item.color.hex_code if item.color else "")
            print(f"   🎨 Cor: {color_display} {color_hex if color_hex else ''}")
        else:
            print(f"   🎨 Cor: ❌ NÃO DEFINIDA")
        
        # Size info - CRITICAL CHECK
        if item.size or item.size_name:
            size_display = item.size_abbreviation or item.size_name or (item.size.abbreviation if item.size else "N/A")
            print(f"   📏 Tamanho: ✅ {size_display}")
        else:
            print(f"   📏 Tamanho: ❌ NÃO DEFINIDO")
        
        # Check if product has sizes available
        if item.product and item.product.sizes.exists():
            available_sizes = ", ".join([s.abbreviation for s in item.product.sizes.all()])
            print(f"   ℹ️  Tamanhos disponíveis no produto: {available_sizes}")

print("\n" + "=" * 80)
print("RESUMO")
print("=" * 80)

total_items = OrderItem.objects.count()
items_with_size = OrderItem.objects.filter(size__isnull=False).count()
items_with_size_name = OrderItem.objects.exclude(size_name='').count()

print(f"\nTotal de itens em pedidos: {total_items}")
print(f"Itens COM size (FK): {items_with_size} ({items_with_size/total_items*100:.1f}%)")
print(f"Itens COM size_name: {items_with_size_name} ({items_with_size_name/total_items*100:.1f}%)")
print(f"Itens SEM tamanho: {total_items - items_with_size} ({(total_items - items_with_size)/total_items*100:.1f}%)")

print("\n" + "=" * 80)

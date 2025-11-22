import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chiva_backend.settings')
django.setup()

from cart.models import Cart, CartItem, Order, OrderItem, Payment
from products.models import Product

print("Verificando carrinhos ativos e pagamentos recentes:\n")

# Check active carts
carts = Cart.objects.filter(status='active').order_by('-last_activity')[:3]
print(f"Carrinhos ativos: {carts.count()}\n")

for cart in carts:
    print(f"Cart ID: {cart.id} - User: {cart.user or 'Anonymous'}")
    print(f"  Last activity: {cart.last_activity}")
    items = CartItem.objects.filter(cart=cart)
    for item in items:
        print(f"  - {item.product.name if item.product else 'N/A'}")
        print(f"    Color: {item.color.name if item.color else 'N/A'} (ID: {item.color_id if item.color else None})")
        print(f"    Size: {item.size.name if item.size else 'N/A'} (ID: {item.size_id if item.size else None})")
    print()

print("="*80)
print("Últimos 3 pagamentos:\n")

payments = Payment.objects.all().order_by('-created_at')[:3]
for payment in payments:
    print(f"Payment ID: {payment.id} - Order: {payment.order_id}")
    print(f"  Created: {payment.created_at}")
    print(f"  Cart: {payment.cart_id}")
    if payment.cart:
        print(f"  Cart items:")
        for item in payment.cart.items.all():
            print(f"    - {item.product.name if item.product else 'N/A'}")
            print(f"      Color: {item.color.name if item.color else 'N/A'}")
            print(f"      Size: {item.size.name if item.size else 'N/A'} (size_id: {item.size_id if item.size else None})")
    print()

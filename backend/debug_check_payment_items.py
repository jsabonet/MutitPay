#!/usr/bin/env python
"""Debug script: list last payments and show request_data items size fields."""
import os, sys, django, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE','chiva_backend.settings')
django.setup()
from cart.models import Payment
from cart.models import OrderItem
from django.utils import timezone

payments = Payment.objects.order_by('-created_at')[:10]
print(f"Total payments fetched: {payments.count()}")
for p in payments:
    print("="*70)
    print(f"Payment {p.id} status={p.status} amount={p.amount} created={p.created_at}")
    rd = p.request_data or {}
    items = []
    if isinstance(rd, dict):
        meta = rd.get('meta')
        if isinstance(meta, dict) and meta.get('items'):
            items = meta.get('items')
        elif rd.get('items'):
            items = rd.get('items')
    print(f"Items in request_data: {len(items)}")
    for it in items:
        print(f" - product_id={it.get('product_id') or it.get('product')} qty={it.get('quantity')} size_id={it.get('size_id')} size={it.get('size')} size_name={it.get('size_name')} size_abbr={it.get('size_abbreviation')}")
    if p.order:
        print(f"Order {p.order.id} has {p.order.items.count()} items:")
        for oi in p.order.items.all():
            print(f"   * {oi.product_name} size_id={oi.size_id} size_name={oi.size_name} size_abbr={oi.size_abbreviation}")

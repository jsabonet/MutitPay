# Correção: Cor e Tamanho nos Pedidos

## Problema Identificado
Cor e tamanho selecionados pelo cliente não estavam sendo salvos nos pedidos em produção.

## Causa Raiz
O sistema tinha suporte parcial para cor e tamanho:
- ✅ Frontend coletava `color_id` e `size_id` ao adicionar produtos ao carrinho
- ✅ Modelo `CartItem` tinha campo `size` (ForeignKey)
- ✅ Modelo `OrderItem` tinha campos para salvar cor e tamanho
- ❌ Backend não salvava `size` ao criar `CartItem`
- ❌ Frontend não enviava `size_id` ao sincronizar carrinho
- ❌ Frontend não passava `size_id` entre páginas de checkout

## Arquivos Modificados

### Backend

#### 1. `backend/cart/views.py`
**Mudança 1 - Método `post` da `CartAPIView` (linha ~96):**
```python
# ANTES
color_id = serializer.validated_data.get('color_id')
quantity = serializer.validated_data['quantity']

product = get_object_or_404(Product, id=product_id, status='active')
color = None
if color_id:
    color = get_object_or_404(Color, id=color_id, is_active=True)

# DEPOIS
color_id = serializer.validated_data.get('color_id')
size_id = serializer.validated_data.get('size_id')  # ✅ NOVO
quantity = serializer.validated_data['quantity']

product = get_object_or_404(Product, id=product_id, status='active')
color = None
size = None  # ✅ NOVO
if color_id:
    color = get_object_or_404(Color, id=color_id, is_active=True)
if size_id:  # ✅ NOVO
    from products.models import Size
    size = get_object_or_404(Size, id=size_id, is_active=True)
```

**Mudança 2 - Busca e criação de `CartItem` (linha ~124):**
```python
# ANTES
cart_item = CartItem.objects.get(
    cart=cart, product=product, color=color
)
# ...
cart_item = CartItem.objects.create(
    cart=cart,
    product=product,
    color=color,
    quantity=quantity,
    price=product.price
)

# DEPOIS
cart_item = CartItem.objects.get(
    cart=cart, product=product, color=color, size=size  # ✅ ADICIONADO size
)
# ...
cart_item = CartItem.objects.create(
    cart=cart,
    product=product,
    color=color,
    size=size,  # ✅ ADICIONADO size
    quantity=quantity,
    price=product.price
)
```

**Mudança 3 - Endpoint `sync_cart` (linha ~323):**
```python
# ANTES
color = None
if color_id:
    try:
        color = Color.objects.get(id=color_id, is_active=True)
    except Color.DoesNotExist:
        warnings.append({'type': 'color_not_found', 'product_id': product.id, 'color_id': color_id})
        color = None

cart_item = CartItem.objects.create(
    cart=cart,
    product=product,
    color=color,
    quantity=quantity,
    price=product.price,
)

# DEPOIS
color = None
size = None  # ✅ NOVO
if color_id:
    try:
        color = Color.objects.get(id=color_id, is_active=True)
    except Color.DoesNotExist:
        warnings.append({'type': 'color_not_found', 'product_id': product.id, 'color_id': color_id})
        color = None

size_id = it.get('size_id')  # ✅ NOVO
if size_id:  # ✅ NOVO
    try:
        from products.models import Size
        size = Size.objects.get(id=size_id, is_active=True)
    except Size.DoesNotExist:
        warnings.append({'type': 'size_not_found', 'product_id': product.id, 'size_id': size_id})
        size = None

cart_item = CartItem.objects.create(
    cart=cart,
    product=product,
    color=color,
    size=size,  # ✅ ADICIONADO size
    quantity=quantity,
    price=product.price,
)
```

### Frontend

#### 2. `frontend/src/hooks/usePayments.ts` (linha ~23)
```typescript
// ANTES
const syncCart = async (items: Array<{ id: number; quantity: number; color_id?: number | null }>) => {
  try {
    const body = { items: items.map(i => ({ product_id: i.id, quantity: i.quantity, color_id: i.color_id })) };

// DEPOIS
const syncCart = async (items: Array<{ id: number; quantity: number; color_id?: number | null; size_id?: number | null }>) => {
  try {
    const body = { items: items.map(i => ({ product_id: i.id, quantity: i.quantity, color_id: i.color_id, size_id: i.size_id })) };
```

#### 3. `frontend/src/pages/Cart.tsx` (linha ~341)
```typescript
// ANTES
items: items.map(item => ({ id: item.id, quantity: item.quantity, color_id: item.color_id || null })),

// DEPOIS
items: items.map(item => ({ id: item.id, quantity: item.quantity, color_id: item.color_id || null, size_id: item.size_id || null })),
```

#### 4. `frontend/src/pages/CheckoutDetails.tsx`
**Mudança 1 - Interface (linha ~18):**
```typescript
// ANTES
items?: Array<{ id: number; quantity: number; color_id?: number | null }>;

// DEPOIS
items?: Array<{ id: number; quantity: number; color_id?: number | null; size_id?: number | null }>;
```

**Mudança 2 - Envio ao backend (linha ~219):**
```typescript
// ANTES
items: state.items || cartItems.map(it => ({ id: it.id, quantity: it.quantity, color_id: it.color_id || null }))

// DEPOIS
items: state.items || cartItems.map(it => ({ id: it.id, quantity: it.quantity, color_id: it.color_id || null, size_id: it.size_id || null }))
```

**Mudança 3 - Key do map (linha ~470):**
```typescript
// ANTES
<div key={`${it.id}-${it.color_id || 'no-color'}`}>

// DEPOIS
<div key={`${it.id}-${it.color_id || 'no-color'}-${it.size_id || 'no-size'}`}>
```

**Mudança 4 - Exibição (linha ~476):**
```typescript
// ANTES
<div>{it.color_name || (it.color_id ? `Cor ${it.color_id}` : '')}</div>

// DEPOIS
<div>
  {it.color_name || (it.color_id ? `Cor ${it.color_id}` : '')}
  {it.size_name && (it.color_name || it.color_id) && ' • '}
  {it.size_name || (it.size_id ? `Tamanho ${it.size_id}` : '')}
</div>
```

#### 5. `frontend/src/pages/Checkout.tsx`
**Mudança 1 - Envio ao backend (linha ~383):**
```typescript
// ANTES
items: items.map(item => ({
  id: item.id,
  quantity: item.quantity,
  color_id: item.color_id || null
}))

// DEPOIS
items: items.map(item => ({
  id: item.id,
  quantity: item.quantity,
  color_id: item.color_id || null,
  size_id: item.size_id || null
}))
```

**Mudança 2 - Key do map (linha ~805):**
```typescript
// ANTES
<div key={`${item.id}-${item.color_id || 'no-color'}`}>

// DEPOIS
<div key={`${item.id}-${item.color_id || 'no-color'}-${item.size_id || 'no-size'}`}>
```

**Mudança 3 - Exibição (linha ~813):**
```typescript
// ANTES
<p className="text-xs text-muted-foreground mt-1">
  {item.color_name && `${item.color_name} • `}Qtd: {item.quantity}
</p>

// DEPOIS
<p className="text-xs text-muted-foreground mt-1">
  {item.color_name && `${item.color_name}`}
  {item.size_name && item.color_name && ' • '}
  {item.size_name && `Tam: ${item.size_name}`}
  {(item.color_name || item.size_name) && ' • '}
  Qtd: {item.quantity}
</p>
```

## Fluxo Corrigido

### 1. Adicionar ao Carrinho (ProductDetails → CartContext)
- ✅ Frontend coleta `selectedSizeId` e envia como `size_id`
- ✅ CartContext armazena `size_id` no localStorage
- ✅ Backend salva `size` no CartItem

### 2. Checkout (Cart → CheckoutDetails)
- ✅ Página Cart passa `size_id` no state ao navegar
- ✅ CheckoutDetails recebe e inclui `size_id` ao sincronizar carrinho

### 3. Pagamento (CheckoutDetails → usePayments)
- ✅ `syncCart` envia `size_id` para backend
- ✅ Backend cria/atualiza CartItem com size correto

### 4. Criação do Pedido (Webhook/Payment)
- ✅ OrderItem é criado a partir de CartItem com size preenchido
- ✅ Snapshot salva `size`, `size_name` e `size_abbreviation`

## Validação

### Teste Manual
1. Acesse detalhes de um produto com opções de cor e tamanho
2. Selecione uma cor e um tamanho
3. Adicione ao carrinho
4. Verifique no carrinho que cor e tamanho aparecem
5. Finalize a compra
6. **Verifique no admin que o pedido tem cor e tamanho salvos**

### Verificação no Admin Django
```python
from cart.models import OrderItem

# Verificar último pedido criado
order_item = OrderItem.objects.order_by('-created_at').first()
print(f"Produto: {order_item.product_name}")
print(f"Cor: {order_item.color_name} ({order_item.color_hex})")
print(f"Tamanho: {order_item.size_name} - {order_item.size_abbreviation}")
```

### Verificação no Banco de Dados
```sql
SELECT 
    oi.product_name,
    oi.color_name,
    oi.size_name,
    oi.size_abbreviation,
    o.order_number,
    o.created_at
FROM cart_orderitem oi
JOIN cart_order o ON oi.order_id = o.id
ORDER BY o.created_at DESC
LIMIT 10;
```

## Impacto

✅ **Resolvido:** Cor e tamanho agora são salvos corretamente em todos os pedidos
✅ **Compatibilidade:** Pedidos antigos sem cor/tamanho não são afetados
✅ **Experiência:** Admin pode ver exatamente qual variante o cliente pediu
✅ **Estoque:** Sistema pode gerenciar estoque por cor e tamanho no futuro

## Deploy

```bash
# Frontend
cd frontend
npm run build
docker compose restart frontend

# Backend (sem mudanças no modelo, não requer migração)
docker compose restart backend
```

## Próximos Passos (Opcional)

- [ ] Adicionar gestão de estoque por cor/tamanho
- [ ] Validar disponibilidade de cor/tamanho antes de finalizar compra
- [ ] Mostrar avisos se cor/tamanho selecionados estão em falta
- [ ] Adicionar imagens por cor (variant images)

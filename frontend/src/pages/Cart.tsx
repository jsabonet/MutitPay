import { useMemo, useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '@/lib/formatPrice';
import { useCart } from '@/contexts/CartContext';
import { usePayments } from '@/hooks/usePayments';
import PaymentMethodSelector from '@/components/payment/PaymentMethodSelector';
import { couponsApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

const Cart = () => {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const { initiatePayment } = usePayments();
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const shipping = 0; // TODO: calcular dinamicamente no futuro
  const discount = appliedCoupon?.discount || 0;
  const total = useMemo(() => Math.max(0, subtotal - discount + shipping), [subtotal, discount, shipping]);
  
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: 'Código necessário',
        description: 'Digite um código de cupom válido.',
        variant: 'destructive',
      });
      return;
    }

    setIsValidatingCoupon(true);
    try {
      // Pass current cart subtotal to get accurate discount calculation
      const validation = await couponsApi.validate(couponCode.trim(), subtotal);
      
      if (!validation.valid) {
        toast({
          title: 'Cupom inválido',
          description: validation.error_message || 'O cupom não é válido.',
          variant: 'destructive',
        });
        return;
      }

      setAppliedCoupon({ code: couponCode.trim(), discount: validation.discount_amount });
      setCouponCode('');
      toast({
        title: 'Cupom aplicado!',
        description: `Desconto de ${formatPrice(validation.discount_amount)} aplicado.`,
      });
    } catch (error) {
      console.error('Error validating coupon:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível validar o cupom.',
        variant: 'destructive',
      });
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast({
      title: 'Cupom removido',
      description: 'O desconto foi removido do carrinho.',
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto text-center">
              <div className="glass-card p-12 space-y-8 animate-fade-in">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                  <ShoppingBag className="h-16 w-16 text-accent" />
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold">
                  Seu carrinho está <span className="text-gradient-gold">vazio</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-md mx-auto">
                  Descubra nossa coleção exclusiva de produtos premium selecionados para você
                </p>
                <Button 
                  size="lg"
                  asChild
                  className="bg-gradient-premium hover:opacity-90 text-white font-semibold text-lg px-8 py-6 group"
                >
                  <Link to="/">
                    <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Explorar Produtos
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12 animate-fade-in">
              <Button 
                variant="ghost" 
                className="mb-6 hover:bg-accent/10 hover:-translate-x-1 transition-all duration-300 glass-card" 
                asChild
              >
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continuar Comprando
                </Link>
              </Button>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Carrinho de <span className="text-gradient-gold">Compras</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'itens'} na sua coleção exclusiva
              </p>
            </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item, index) => (
                <Card key={item.id} className="hover:shadow-xl transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6 lg:p-8">
                    <div className="grid md:grid-cols-4 gap-6 items-center">
                      {/* Product Image and Info */}
                      <div className="md:col-span-2 flex gap-6">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden glass-card border-2 border-border/50 hover:border-accent/50 flex-shrink-0 group">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-grow space-y-2">
                          <p className="text-xs text-accent font-semibold uppercase tracking-wider">
                            {item.category}
                          </p>
                          <h3 className="font-display font-bold text-lg leading-tight group-hover:text-accent transition-colors">
                            {item.name}
                            {item.color_name && (
                              <span className="block text-sm text-muted-foreground font-normal mt-1">
                                Cor: {item.color_name}
                              </span>
                            )}
                          </h3>
                          <p className="text-xl font-bold text-gradient-gold">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-center">
                        <div className="flex items-center glass-card border-2 border-border/50 rounded-xl p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 hover:bg-accent/10 rounded-lg"
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.color_id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1, item.color_id)}
                            className="w-16 text-center border-0 focus:ring-0 font-bold text-lg bg-transparent"
                            min="1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 hover:bg-accent/10 rounded-lg"
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.color_id)}
                            disabled={item.max_quantity ? item.quantity >= item.max_quantity : false}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Total and Remove */}
                      <div className="flex items-center justify-between md:justify-end gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gradient-gold">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 w-12 h-12 rounded-xl transition-all duration-300 hover:scale-110"
                          onClick={() => removeItem(item.id, item.color_id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-32 hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-display font-bold">
                    Resumo do <span className="text-gradient-gold">Pedido</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between text-lg">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  
                  {/* Coupon Section - Enhanced style */}
                  {!appliedCoupon ? (
                    <div className="glass-card p-4 rounded-xl space-y-3">
                      <p className="text-sm font-medium text-muted-foreground">Tem um cupom de desconto?</p>
                      <div className="flex gap-3">
                        <Input
                          placeholder="Código promocional"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleApplyCoupon();
                            }
                          }}
                          disabled={isValidatingCoupon}
                          className="uppercase text-sm font-semibold bg-background/50 border-2 border-border/50 focus:border-accent/50"
                        />
                        <Button
                          variant="outline"
                          onClick={handleApplyCoupon}
                          disabled={isValidatingCoupon || !couponCode.trim()}
                          className="px-6 border-2 border-accent/50 hover:bg-accent/10 font-semibold"
                        >
                          {isValidatingCoupon ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Aplicar'
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="glass-card p-4 rounded-xl bg-green-50/50 border-2 border-green-200/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="bg-green-100 text-green-800 font-bold">
                            {appliedCoupon.code}
                          </Badge>
                          <span className="text-lg font-bold text-green-700">
                            -{formatPrice(appliedCoupon.discount)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveCoupon}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-lg text-green-600 font-semibold">
                      <span>Desconto Aplicado</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg">
                    <span className="text-muted-foreground">Entrega</span>
                    <span className="font-semibold text-accent">Grátis</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total</span>
                    <span className="text-gradient-gold">{formatPrice(total)}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-premium hover:opacity-90 text-white font-semibold text-lg py-6 group" 
                  onClick={() => setShowPaymentModal(true)}
                >
                  Finalizar Compra
                  <ShoppingBag className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full border-2 border-accent/50 hover:bg-accent/10 font-semibold text-lg py-6"
                >
                  Solicitar Orçamento
                </Button>
              </div>

              <Card className="glass-card border-2 border-border/50">
                <CardContent className="p-6">
                  <h4 className="font-display font-bold text-lg mb-4 text-accent">Garantias Premium</h4>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                      <span className="font-medium">Pagamento 100% seguro e protegido</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                      <span className="font-medium">Entrega expressa e rastreável</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                      <span className="font-medium">Garantia de autenticidade certificada</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                      <span className="font-medium">Suporte premium 24/7</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <PaymentMethodSelector
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          totalAmount={total}
          onSubmit={async (paymentData) => {
            // New flow: navigate to checkout details page where full customer, shipping
            // and order information will be collected before redirecting to the gateway.
            setShowPaymentModal(false);
            navigate('/checkout', {
              state: {
                method: paymentData.method,
                items: items.map(item => ({ id: item.id, quantity: item.quantity, color_id: item.color_id || null })),
                amount: total,
                shipping_amount: shipping,
                currency: 'MZN',
                // Pass coupon information to checkout
                coupon_code: appliedCoupon?.code,
                discount_amount: appliedCoupon?.discount || 0
              }
            });
          }}
        />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
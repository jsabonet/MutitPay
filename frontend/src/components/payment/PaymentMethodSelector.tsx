import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Smartphone, Building2 } from 'lucide-react';

interface PaymentMethod {
  id: 'mpesa' | 'emola' | 'card' | 'transfer';
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface PaymentData {
  method: 'mpesa' | 'emola' | 'card' | 'transfer';
  // Para M-Pesa/e-Mola
  phone?: string;
  // Para Cartão
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  // Para Transferência
  accountNumber?: string;
  bankName?: string;
}

interface PaymentMethodSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentData) => void;
  totalAmount: number;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'mpesa',
    name: 'M-Pesa',
    icon: <Smartphone className="h-6 w-6" />,
    description: 'Pagamento via carteira móvel M-Pesa'
  },
  {
    id: 'emola',
    name: 'e-Mola',
    icon: <Smartphone className="h-6 w-6" />,
    description: 'Pagamento via carteira digital e-Mola'
  },
];

export default function PaymentMethodSelector({ isOpen, onClose, onSubmit, totalAmount }: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<'mpesa' | 'emola' | 'card' | 'transfer' | null>(null);
  const [formData, setFormData] = useState<Partial<PaymentData>>({});
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMethod) return;

    setLoading(true);
    try {
      // New flow: don't require phone or card here. Just inform parent of selected method
      // Parent (Cart) will redirect user to the checkout/details page where full info is collected.
      await onSubmit({ method: selectedMethod });
    } catch (error) {
      console.error('Payment submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  // We no longer collect payment details in this modal. The new flow:
  // user selects a method, confirms, and is redirected to a checkout details page
  // where all customer/shipping/order/payment info will be collected.

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-2 border-accent/20">
        <DialogHeader className="border-b border-accent/10 pb-4">
          <DialogTitle className="text-2xl font-bold">
            Escolha o Método de <span className="text-gradient-gold">Pagamento</span>
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-4 rounded-lg border border-accent/20">
            <p className="text-sm text-muted-foreground font-medium">Total a pagar</p>
            <p className="text-3xl font-bold text-gradient-gold">{formatPrice(totalAmount)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!selectedMethod ? (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethod(method.id)}
                  className="w-full p-4 border-2 border-border rounded-lg hover:bg-accent/10 hover:border-accent transition-all duration-300 text-left group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      {method.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-base">{method.name}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/20">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  {paymentMethods.find(m => m.id === selectedMethod)?.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-base">{paymentMethods.find(m => m.id === selectedMethod)?.name}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMethod(null);
                      setFormData({});
                    }}
                    className="text-sm text-primary hover:text-accent transition-colors font-medium"
                  >
                    Alterar método
                  </button>
                </div>
              </div>

              <Separator className="bg-accent/20" />

              <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                  Você selecionou <strong className="text-foreground">{paymentMethods.find(m => m.id === selectedMethod)?.name}</strong>. 
                  Ao confirmar, será redirecionado para a página de finalização onde deverá preencher os dados do pedido e pagamento.
                </p>
              </div>

              <div className="flex space-x-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 border-2 hover:bg-accent/10"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-gradient-premium hover:opacity-90 text-white font-semibold shadow-lg"
                >
                  {loading ? 'Processando...' : 'Confirmar Pagamento'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
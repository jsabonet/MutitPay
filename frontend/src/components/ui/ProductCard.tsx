import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye } from 'lucide-react';
import { formatPrice, getImageUrl, type Product, type ProductListItem } from '@/lib/api';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product | ProductListItem;
  compactPrice?: boolean;
}

const ProductCard = ({ product, compactPrice = false }: ProductCardProps) => {
  const { addItem } = useCart();
  // Type guard to check if product is ProductListItem
  const isProductListItem = (prod: Product | ProductListItem): prod is ProductListItem => {
    return 'main_image_url' in prod || 'category_name' in prod;
  };

  // Helper functions to handle differences between Product and ProductListItem
  const getMainImage = () => {
    return isProductListItem(product) ? product.main_image_url : product.main_image;
  };

  const getCategoryName = () => {
    return isProductListItem(product) ? product.category_name : product.category?.name;
  };

  const getProductSlug = () => {
    return isProductListItem(product) ? product.slug : product.slug || product.id.toString();
  };

  const isLowStock = () => {
    if (isProductListItem(product)) {
      return product.is_low_stock;
    }
    return (product as Product).stock_quantity <= (product as Product).min_stock_level && (product as Product).stock_quantity > 0;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const priceNumber = typeof product.price === 'number' ? product.price : parseFloat(product.price as any);
    const originalNumber = product.original_price ? (typeof product.original_price === 'number' ? product.original_price : parseFloat(product.original_price as any)) : null;
    addItem({
      id: (product as any).id,
      name: product.name,
      price: priceNumber,
      original_price: originalNumber ?? undefined,
      image: getMainImage() || undefined,
      category: getCategoryName() || undefined,
      slug: getProductSlug(),
      quantity: 1,
      max_quantity: (product as any).stock_quantity ?? undefined,
    });
    toast({
      title: 'Adicionado ao carrinho',
      description: product.name,
    });
  };

  const discountPercentage = () => {
    if ('discount_percentage' in product) {
      return product.discount_percentage;
    }
    if (product.original_price && product.price) {
      const original = parseFloat(product.original_price);
      const current = parseFloat(product.price);
      return Math.round(((original - current) / original) * 100);
    }
    return 0;
  };

  return (
    <Link 
      to={`/produto/${getProductSlug()}`} 
      className="group block h-full"
    >
      <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-2xl !border-0 bg-card overflow-hidden">
        {/* Container de Imagem - Responsivo */}
        <div className="relative overflow-hidden aspect-square">
          <OptimizedImage
            src={getImageUrl(getMainImage())}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          
          {/* Overlay gradiente no hover - apenas desktop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Discount badge - Canto superior esquerdo */}
          {discountPercentage() > 0 && (
            <div className="absolute top-2 left-2 z-10">
              <Badge variant="destructive" className="text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 shadow-md">
                -{discountPercentage()}%
              </Badge>
            </div>
          )}
          
          {/* Stock status badge - Apenas se esgotado */}
          {product.stock_quantity === 0 && (
            <div className="absolute bottom-2 left-2 md:top-2 md:right-2 md:bottom-auto md:left-auto z-10">
              <Badge variant="destructive" className="text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 shadow-lg bg-red-600 text-white font-bold border-2 border-white">
                Esgotado
              </Badge>
            </div>
          )}
        </div>

        {/* Conteúdo - Padding responsivo */}
        <CardContent className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col">
          <div className="space-y-1.5 sm:space-y-2 flex-1 flex flex-col">
            {/* Category - Responsivo */}
            <p className="text-[10px] sm:text-xs text-accent font-semibold uppercase tracking-wider line-clamp-1">
              {getCategoryName()}
            </p>

            {/* Product name - Fontes menores em mobile */}
            <h3 className="text-xs sm:text-sm md:text-base font-display font-bold group-hover:text-accent transition-colors line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
              {product.name}
            </h3>

            {/* Price Section - Sempre inline */}
            <div className="mt-auto pt-1 sm:pt-2">
              {/* Preços sempre inline */}
              <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gradient-gold whitespace-nowrap">
                  {formatPrice(product.price)}
                </span>
                {product.original_price && product.original_price !== product.price && (
                  <span className="text-[10px] sm:text-sm text-muted-foreground line-through whitespace-nowrap">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>
              
              {/* Botão mobile - Compacto */}
              <div className="flex sm:hidden">
                <Button
                  variant="gold"
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="w-full h-7 px-2 text-[10px] py-0"
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  <span className="truncate">Adicionar</span>
                </Button>
              </div>

              {/* Stock Badge e Botão - Desktop */}
              <div className="hidden sm:flex items-center justify-between gap-2">
                {/* Stock Badge - Apenas desktop */}
                <div className="flex-shrink-0">
                  {product.stock_quantity > 0 && !isLowStock() && (
                    <Badge className="text-xs bg-gradient-to-r from-primary to-primary/80 text-white border-0 px-2 py-0.5 shadow-sm font-semibold">
                      Em estoque
                    </Badge>
                  )}
                  {isLowStock() && product.stock_quantity > 0 && (
                    <Badge className="text-xs bg-gradient-to-r from-accent to-accent/80 text-white border-0 px-2 py-0.5 shadow-sm font-semibold">
                      Apenas {product.stock_quantity}
                    </Badge>
                  )}
                </div>
                
                {/* Add to cart button - Desktop */}
                <Button
                  variant="gold"
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="gap-1.5 text-xs px-3 h-8"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Adicionar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;

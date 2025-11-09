import { useBestsellerProducts } from '@/hooks/useApi';
import ProductCard from '@/components/ui/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from "@/components/ui/button";
import { ArrowRight, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BestSellers = () => {
  const { products, loading, error } = useBestsellerProducts();
  const navigate = useNavigate();

  if (error) {
    return (
      <section className="py-24 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="glass-card p-12 space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Mais <span className="text-gradient-gold">Vendidos</span>
              </h2>
              <p className="text-red-500 bg-red-50 border border-red-200 rounded-lg p-4 inline-block">
                Erro ao carregar produtos: {error}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="best-sellers" className="py-24 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center">
              <Award className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Mais <span className="text-gradient-gold">Vendidos</span>
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Os produtos favoritos da nossa clientela exclusiva. Peças que conquistaram corações e estabeleceram tendências.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="glass-card p-4 md:p-6 space-y-4" style={{ animationDelay: `${index * 0.1}s` }}>
                <Skeleton className="h-48 md:h-64 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : Array.isArray(products) && products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.slice(0, 8).map((product, index) => (
                <div key={product.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in relative">
                  {/* Badge para Best Seller */}
                  <div className="absolute top-3 left-3 z-10">
                    <div className="glass-card bg-gradient-to-r from-accent to-accent/80 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Award className="h-3 w-3" />
                      Best Seller
                    </div>
                  </div>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <Button
                size="lg"
                onClick={() => navigate('/products?bestsellers=true')}
                className="bg-gradient-premium hover:opacity-90 text-white font-semibold text-lg px-12 py-6 group"
              >
                Ver Todos os Best Sellers
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="glass-card p-8 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg">Nenhum best seller encontrado no momento.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellers;

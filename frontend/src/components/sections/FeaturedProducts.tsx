import { useFeaturedProducts } from '@/hooks/useApi';
import ProductCard from '@/components/ui/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FeaturedProducts = () => {
  const { products, loading, error } = useFeaturedProducts();
  const navigate = useNavigate();

  if (error) {
    return (
      <section className="py-24 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
              Coleção <span className="text-gradient-gold">Exclusiva</span>
            </h2>
            <p className="text-red-500 bg-red-50 border border-red-200 rounded-lg p-4 inline-block">
              Erro ao carregar produtos: {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="colecoes" className="py-24 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Coleção <span className="text-gradient-gold">Exclusiva</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Peças cuidadosamente selecionadas das marcas mais prestigiadas do mundo. Autenticidade garantida.
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
              {products.map((product, index) => (
                <div key={product.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <Button
                size="lg"
                onClick={() => navigate('/products')}
                className="bg-gradient-premium hover:opacity-90 text-white font-semibold text-lg px-12 py-6 group"
              >
                Ver Toda a Coleção
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="glass-card p-8 max-w-md mx-auto">
              <p className="text-muted-foreground text-lg">Nenhum produto em destaque encontrado.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;

import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { productApi, Product, ProductListItem } from '@/lib/api';

interface SearchBoxProps {
  fullWidth?: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ fullWidth = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [onSaleProducts, setOnSaleProducts] = useState<Product[]>([]);
  
  const navigate = useNavigate();
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let active = true;

    const loadRecommendations = async () => {
      try {
        const [bestsellers, sales] = await Promise.all([
          productApi.getBestsellerProducts(4),
          productApi.getSaleProducts(4),
        ]);
        if (active) {
          setRecommendations(bestsellers);
          setOnSaleProducts(sales);
        }
      } catch (error) {
        console.error('Erro ao carregar recomendações:', error);
      }
    };

    if (focused && !searchTerm) {
      loadRecommendations();
    }

    return () => {
      active = false;
    };
  }, [focused, searchTerm]);

  useEffect(() => {
    let active = true;

    const performSearch = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const results = await productApi.searchProducts({ q: searchTerm });
        if (active) {
          setSearchResults(results);
        }
      } catch (error) {
        console.error('Erro na busca:', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(performSearch, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
      setFocused(false);
    }
  };

  return (
    <div ref={searchBoxRef} className={`relative ${fullWidth ? 'w-full' : 'max-w-md'}`}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setFocused(true)}
            className="pr-10"
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-0 top-0 h-full"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {focused && (
          <div className="absolute top-full mt-2 w-full glass-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
            <div className="p-4">
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Buscando...
                </div>
              ) : searchTerm ? (
                searchResults.length > 0 ? (
                  <div>
                    <h3 className="text-sm font-semibold mb-2 text-foreground">
                      Resultados
                    </h3>
                    <ul className="space-y-2">
                      {searchResults.map((product) => (
                        <li key={product.id}>
                          <Link
                            to={`/produto/${product.slug}`}
                            onClick={() => setFocused(false)}
                            className="flex items-center gap-3 p-2 hover:bg-accent/10 rounded"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-foreground">
                                {product.name}
                              </p>
                              <p className="text-sm text-accent font-semibold">
                                {product.price.toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'MZN',
                                })}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Nenhum produto encontrado
                  </div>
                )
              ) : (
                <div>
                  {recommendations.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold mb-2 text-foreground">
                        Mais Vendidos
                      </h3>
                      <ul className="space-y-2">
                        {recommendations.map((product) => (
                          <li key={product.id}>
                            <Link
                              to={`/produto/${product.slug}`}
                              onClick={() => setFocused(false)}
                              className="flex items-center gap-3 p-2 hover:bg-accent/10 rounded"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate text-foreground">
                                  {product.name}
                                </p>
                                <p className="text-sm text-accent font-semibold">
                                  {product.price.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'MZN',
                                  })}
                                </p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {onSaleProducts.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2 text-foreground">
                        Em Promoção
                      </h3>
                      <ul className="space-y-2">
                        {onSaleProducts.map((product) => (
                          <li key={product.id}>
                            <Link
                              to={`/produto/${product.slug}`}
                              onClick={() => setFocused(false)}
                              className="flex items-center gap-3 p-2 hover:bg-accent/10 rounded"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate text-foreground">
                                  {product.name}
                                </p>
                                <div className="flex items-center gap-2">
                                  {product.old_price && (
                                    <span className="text-xs text-muted-foreground line-through">
                                      {product.old_price.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'MZN',
                                      })}
                                    </span>
                                  )}
                                  <p className="text-sm text-accent font-semibold">
                                    {product.price.toLocaleString('pt-BR', {
                                      style: 'currency',
                                      currency: 'MZN',
                                    })}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

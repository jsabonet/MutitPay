import { Menu, X, ShoppingCart, User, Settings, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { Link, useNavigate } from "react-router-dom";
import { useCategories, useSubcategories } from '@/hooks/useApi';
import { productApi, type Product, type ProductListItem, type Category, type Subcategory, formatPrice, getImageUrl } from '@/lib/api';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalQuantity } = useCart();
  const { currentUser } = useAuth();
  const { isAdmin } = useAdminStatus();
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 border-b border-white/20">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/">
              <img 
                src="/mutit_pay_logo.png" 
                alt="MUTIT PAY" 
                className="h-10 md:h-12" 
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='50' viewBox='0 0 200 50'%3E%3Ctext x='10' y='35' font-family='Arial, sans-serif' font-size='24' font-weight='bold' fill='%230054A6'%3EMUTIT PAY%3C/text%3E%3C/svg%3E";
                }}
              />
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <SearchBox />
          </div>

          {/* Desktop Menu & Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              className="text-foreground hover:text-accent transition-colors font-medium cursor-pointer"
              onClick={() => scrollToSection('inicio')}
            >
              Início
            </button>
            <Link
              to="/products"
              className="text-foreground hover:text-accent transition-colors font-medium"
            >
              Produtos
            </Link>
            <button 
              className="text-foreground hover:text-accent transition-colors font-medium cursor-pointer"
              onClick={() => scrollToSection('sobre')}
            >
              Sobre Nós
            </button>
            <button 
              className="text-foreground hover:text-accent transition-colors font-medium cursor-pointer"
              onClick={() => scrollToSection('contactos')}
            >
              Contactos
            </button>

            {/* User Actions - Desktop Only */}
            {currentUser ? (
              <Button variant="ghost" size="icon" asChild title="Minha Conta">
                <Link to="/account">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" size="icon" asChild title="Entrar">
                <Link to="/login">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}
            
            {isAdmin && (
              <Button variant="ghost" size="icon" asChild title="Administração">
                <Link to="/admin">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
            )}

            <Button 
              variant="ghost" 
              size="icon"
              className="relative"
              onClick={() => navigate('/carrinho')}
              title="Carrinho"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {totalQuantity > 99 ? '99+' : totalQuantity}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="relative"
              onClick={() => navigate('/carrinho')}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {totalQuantity > 99 ? '99+' : totalQuantity}
                </span>
              )}
            </Button>
            
            <button 
              className="text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden mt-4">
          <SearchBox fullWidth />
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 animate-fade-in border-t border-white/10 pt-4">
            <button 
              onClick={() => scrollToSection('inicio')} 
              className="block text-foreground hover:text-accent transition-colors font-medium w-full text-left py-2"
            >
              Início
            </button>
            <Link 
              to="/products" 
              className="block text-foreground hover:text-accent transition-colors font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Produtos
            </Link>
            <button 
              onClick={() => scrollToSection('sobre')} 
              className="block text-foreground hover:text-accent transition-colors font-medium w-full text-left py-2"
            >
              Sobre Nós
            </button>
            <button 
              onClick={() => scrollToSection('contactos')} 
              className="block text-foreground hover:text-accent transition-colors font-medium w-full text-left py-2"
            >
              Contactos
            </button>

            {/* User Actions - Mobile Menu Only */}
            <div className="border-t border-white/10 pt-3 mt-3 space-y-3">
              {currentUser ? (
                <Link 
                  to="/account"
                  className="flex items-center gap-3 text-foreground hover:text-accent transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Minha Conta</span>
                </Link>
              ) : (
                <Link 
                  to="/login"
                  className="flex items-center gap-3 text-foreground hover:text-accent transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Entrar</span>
                </Link>
              )}
              
              {isAdmin && (
                <Link 
                  to="/admin"
                  className="flex items-center gap-3 text-foreground hover:text-accent transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span>Administração</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

// --- SearchBox Component ---
const SearchBox: React.FC<{ fullWidth?: boolean }> = ({ fullWidth = false }) => {
  const [term, setTerm] = useState('');
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [recomms, setRecomms] = useState<ProductListItem[]>([]);
  const [sales, setSales] = useState<ProductListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { subcategories } = useSubcategories();

  const normalize = (s: string) => s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');

  // Close on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  // Debounced search
  useEffect(() => {
    let active = true;
    const handler = setTimeout(async () => {
      const q = term.trim();
      if (!active) return;
      if (q.length < 2) {
        setResults([]);
        setError(null);
        // Prefetch recommendations
        try {
          const [b, s] = await Promise.all([
            productApi.getBestsellerProducts(),
            productApi.getSaleProducts(),
          ]);
          if (!active) return;
          setRecomms(Array.isArray(b) ? b.slice(0, 5) : []);
          setSales(Array.isArray(s) ? s.slice(0, 5) : []);
        } catch {
          // ignore
        }
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const found = await productApi.searchProducts({ q });
        if (!active) return;
        setResults(Array.isArray(found) ? found.slice(0, 8) : []);
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : 'Erro na pesquisa');
        setResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }, 300);
    return () => { active = false; clearTimeout(handler); };
  }, [term]);

  const onSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = term.trim();
    if (q.length === 0) return;
    setFocused(false);
    navigate(`/products?q=${encodeURIComponent(q)}`);
  };

  const containerClass = fullWidth ? 'w-full' : 'w-full';

  return (
    <div className={containerClass}>
      <div ref={boxRef} className="relative w-full">
        <form onSubmit={onSubmit} className="w-full">
          <div className="relative">
            <Input
              type="search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="Buscar produtos..."
              className="pl-4 pr-10 w-full bg-background/50 border-border/50 focus:border-accent"
              aria-label="Buscar produtos"
            />
            <Button
              size="sm"
              variant="ghost"
              type="submit"
              aria-label="Pesquisar"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 hover:bg-transparent"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          {/* Suggestions dropdown */}
          {focused && (
            <div className="absolute z-50 mt-2 w-full rounded-lg border border-border bg-popover text-popover-foreground shadow-xl">
              <div className="max-h-[70vh] overflow-y-auto">
                {term.trim().length < 2 ? (
                  <div className="p-4 space-y-4">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sugestões</div>
                    {/* Bestsellers */}
                    {recomms.length > 0 && (
                      <div>
                        <div className="text-sm font-semibold mb-2 text-foreground">Mais vendidos</div>
                        <ul className="divide-y divide-border/50">
                          {recomms.map((p) => (
                            <li key={p.id}>
                              <Link
                                to={`/produto/${p.slug}`}
                                onClick={() => setFocused(false)}
                                className="flex items-center gap-3 p-2 hover:bg-accent/50 rounded transition-colors"
                              >
                                <img src={getImageUrl(p.main_image_url)} alt="" className="h-12 w-12 object-cover rounded" />
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-sm font-medium">{p.name}</div>
                                  {p.is_bestseller && (
                                    <div className="text-[10px] inline-flex px-2 py-0.5 rounded bg-gradient-to-r from-accent to-accent/80 text-white mt-1 font-semibold">TOP</div>
                                  )}
                                </div>
                                <div className="text-sm font-bold text-gradient-gold whitespace-nowrap">{formatPrice(p.price)}</div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* On sale */}
                    {sales.length > 0 && (
                      <div>
                        <div className="text-sm font-semibold mb-2 text-foreground">Em promoção</div>
                        <ul className="divide-y divide-border/50">
                          {sales.map((p) => (
                            <li key={p.id}>
                              <Link
                                to={`/produto/${p.slug}`}
                                onClick={() => setFocused(false)}
                                className="flex items-center gap-3 p-2 hover:bg-accent/50 rounded transition-colors"
                              >
                                <img src={getImageUrl(p.main_image_url)} alt="" className="h-12 w-12 object-cover rounded" />
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-sm font-medium">{p.name}</div>
                                  {p.is_on_sale && (
                                    <div className="text-[10px] inline-flex px-2 py-0.5 rounded bg-red-500 text-white mt-1 font-semibold">SALE</div>
                                  )}
                                </div>
                                <div className="text-sm font-bold text-gradient-gold whitespace-nowrap">{formatPrice(p.price)}</div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {recomms.length === 0 && sales.length === 0 && (
                      <div className="text-sm text-muted-foreground text-center py-4">Digite pelo menos 2 letras para pesquisar.</div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {/* Category/Subcategory matches */}
                    {(() => {
                      const qn = normalize(term.trim());
                      const catMatches = (categories || [])
                        .filter((c: Category) => normalize(c.name).includes(qn))
                        .slice(0, 5);
                      const subMatches = (subcategories || [])
                        .filter((s: Subcategory) => normalize(s.name).includes(qn))
                        .slice(0, 5);
                      return (
                        <>
                          {catMatches.length > 0 && (
                            <div>
                              <div className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Categorias</div>
                              <div className="grid grid-cols-1 gap-1">
                                {catMatches.map((c) => (
                                  <Link
                                    key={c.id}
                                    to={`/products?category=${c.id}`}
                                    onClick={() => setFocused(false)}
                                    className="block rounded-md p-2 text-sm hover:bg-accent/50 transition-colors font-medium"
                                  >
                                    {c.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                          {subMatches.length > 0 && (
                            <div>
                              <div className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Subcategorias</div>
                              <div className="grid grid-cols-1 gap-1">
                                {subMatches.map((s) => (
                                  <Link
                                    key={s.id}
                                    to={`/products?category=${s.category}&subcategory=${s.id}`}
                                    onClick={() => setFocused(false)}
                                    className="block rounded-md p-2 text-sm hover:bg-accent/50 transition-colors font-medium"
                                  >
                                    {s.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}

                    {/* Product results */}
                    {loading && <div className="p-2 text-sm text-muted-foreground text-center">Pesquisando...</div>}
                    {error && <div className="p-2 text-sm text-red-600 text-center">{error}</div>}
                    {!loading && !error && results.length === 0 && (
                      <div className="p-2 text-sm text-muted-foreground text-center">Sem resultados.</div>
                    )}
                    {!loading && !error && results.length > 0 && (
                      <ul className="divide-y divide-border/50">
                        {results.map((p) => {
                          const img = (p as any).main_image_url || (p as any).main_image;
                          const price = (p as any).price;
                          return (
                            <li key={p.id}>
                              <Link
                                to={`/produto/${p.slug}`}
                                onClick={() => setFocused(false)}
                                className="flex items-center gap-3 p-2 hover:bg-accent/50 rounded transition-colors"
                              >
                                <img src={getImageUrl(img)} alt="" className="h-12 w-12 object-cover rounded" />
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-sm font-medium">{p.name}</div>
                                  <div className="text-xs text-muted-foreground truncate">{p.subcategory_name || ''}</div>
                                </div>
                                {price && (
                                  <div className="text-sm font-bold text-gradient-gold whitespace-nowrap">{formatPrice(price)}</div>
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    {/* CTA: See more in dominant category */}
                    {(() => {
                      if (!results || results.length < 3 || !categories || categories.length === 0) return null;
                      const counts = new Map<number, number>();
                      for (const p of results) {
                        const c = (p as any).category;
                        let cid: number | undefined;
                        if (typeof c === 'number') cid = c;
                        else if (c && typeof c === 'object' && 'id' in c) cid = (c as any).id as number;
                        if (cid) counts.set(cid, (counts.get(cid) || 0) + 1);
                      }
                      if (counts.size === 0) return null;
                      let topId: number | null = null;
                      let topCount = 0;
                      counts.forEach((v, k) => { if (v > topCount) { topCount = v; topId = k; } });
                      if (!topId) return null;
                      const ratio = topCount / results.length;
                      if (ratio < 0.6) return null;
                      const catObj = (categories as Category[]).find(c => c.id === topId);
                      if (!catObj) return null;
                      return (
                        <div className="pt-2">
                          <Link
                            to={`/products?category=${topId}`}
                            onClick={() => setFocused(false)}
                            className="block w-full text-center rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent/50 transition-colors"
                          >
                            Ver mais em {catObj.name}
                          </Link>
                        </div>
                      );
                    })()}

                    <div className="pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full font-semibold" 
                        onClick={() => onSubmit()}
                      >
                        Ver todos os resultados
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Header;
import { Menu, X, ShoppingCart, User, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { Link, useNavigate } from "react-router-dom";

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
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img 
                src="/mutitpay-logo.svg" 
                alt="MUTIT PAY" 
                className="h-12 md:h-14" 
                onError={(e) => {
                  // Fallback if logo doesn't exist
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='50' viewBox='0 0 200 50'%3E%3Ctext x='10' y='35' font-family='Arial, sans-serif' font-size='24' font-weight='bold' fill='%230054A6'%3EMUTIT PAY%3C/text%3E%3C/svg%3E";
                }}
              />
            </Link>
          </div>

          {/* Desktop Menu */}
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

            {/* User Actions */}
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
              <Button variant="ghost" size="icon" asChild>
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
            >
              <ShoppingCart className="h-5 w-5" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {totalQuantity > 99 ? '99+' : totalQuantity}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* User and Cart for mobile */}
            {currentUser ? (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/account">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/login">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}
            
            {isAdmin && (
              <Button variant="ghost" size="icon" asChild>
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 animate-fade-in">
            <button 
              onClick={() => scrollToSection('inicio')} 
              className="block text-foreground hover:text-accent transition-colors font-medium w-full text-left"
            >
              Início
            </button>
            <Link 
              to="/products" 
              className="block text-foreground hover:text-accent transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Produtos
            </Link>
            <button 
              onClick={() => scrollToSection('sobre')} 
              className="block text-foreground hover:text-accent transition-colors font-medium w-full text-left"
            >
              Sobre Nós
            </button>
            <button 
              onClick={() => scrollToSection('contactos')} 
              className="block text-foreground hover:text-accent transition-colors font-medium w-full text-left"
            >
              Contactos
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
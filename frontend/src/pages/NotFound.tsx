import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Search, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // 404 Error: User attempted to access non-existent route
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12 px-4 pt-36 md:pt-40">
        <div className="text-center space-y-8 max-w-2xl mx-auto">
          {/* 404 Illustration */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-full"></div>
            <div className="relative">
              <Package className="h-32 w-32 mx-auto text-primary/30 mb-4" strokeWidth={1} />
              <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                404
              </h1>
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Página não encontrada
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Ops! A página que você está procurando não existe ou foi movida.
              Que tal explorar nossos produtos?
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="group">
              <Link to="/">
                <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Voltar ao Início
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="group">
              <Link to="/products">
                <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Ver Produtos
              </Link>
            </Button>
            <Button variant="ghost" size="lg" onClick={() => window.history.back()} className="group">
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Voltar
            </Button>
          </div>
          
          {/* Contact Info */}
          <div className="pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Precisa de ajuda? Entre em contato pelo WhatsApp{" "}
              <a 
                href="https://wa.me/258849135181" 
                className="text-primary hover:text-accent font-medium hover:underline transition-colors inline-flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                +258 84 913 5181
              </a>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;

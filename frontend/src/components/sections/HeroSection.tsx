import heroBackground from "@/assets/hero-background.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {

  return (
    <section 
      id="inicio" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="container mx-auto px-6 py-32 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight">
            Elegância & Luxo <br />
            <span className="text-gradient-gold">Redefinidos</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Descubra uma coleção exclusiva de produtos premium selecionados para os mais exigentes. Qualidade, autenticidade e sofisticação em cada detalhe.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="bg-gradient-premium hover:opacity-90 text-white font-semibold text-lg px-8 py-6 group"
              onClick={() => window.location.href = '/products'}
            >
              Explorar Produtos
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white/80 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-foreground font-semibold text-lg px-8 py-6"
              onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Sobre Nós
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from 'react-router-dom';

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="contactos" className="bg-gradient-to-br from-foreground to-primary text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <img 
              src="/mutitpay-logo.svg" 
              alt="MUTIT PAY" 
              className="h-16 mb-6 brightness-0 invert" 
              onError={(e) => {
                // Fallback if logo doesn't exist
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='50' viewBox='0 0 200 50'%3E%3Ctext x='10' y='35' font-family='Arial, sans-serif' font-size='24' font-weight='bold' fill='%23ffffff'%3EMUTIT PAY%3C/text%3E%3C/svg%3E";
              }}
            />
            <p className="text-white/80 mb-6 max-w-md">
              A sua boutique de luxo em Moçambique. Trazemos até você uma seleção exclusiva 
              das marcas mais prestigiadas do mundo, com garantia de autenticidade e 
              atendimento premium que você merece.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent flex items-center justify-center transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent flex items-center justify-center transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent flex items-center justify-center transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('inicio')}
                  className="text-white/80 hover:text-accent transition-colors cursor-pointer"
                >
                  Início
                </button>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-white/80 hover:text-accent transition-colors"
                >
                  Produtos
                </Link>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('sobre')}
                  className="text-white/80 hover:text-accent transition-colors cursor-pointer"
                >
                  Sobre Nós
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('contactos')}
                  className="text-white/80 hover:text-accent transition-colors cursor-pointer"
                >
                  Contactos
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-0.5 text-accent" />
                <span className="text-white/80">info@mutitpay.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-0.5 text-accent" />
                <span className="text-white/80">+258 84 123 4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-accent" />
                <span className="text-white/80">Cabo Delgado, Moçambique</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 text-center text-white/60">
          <p>&copy; {new Date().getFullYear()} MUTIT PAY. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
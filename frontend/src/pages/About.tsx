import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SEO from '@/components/SEO';
import { Card } from "@/components/ui/card";
import { Shield, Package, Award, Headphones, Users, Target, Heart, TrendingUp } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Sobre Nós | MUTIT PAY - Boutique de Luxo em Moçambique"
        description="Conheça a MUTIT PAY, a boutique de luxo premium em Moçambique. Oferecemos produtos autênticos das marcas mais prestigiadas do mundo com entrega em Pemba e todo Moçambique."
        url="https://mutitpay.com/sobre"
        keywords="boutique luxo Moçambique, sobre MUTIT PAY, história boutique, loja premium Pemba, marcas luxo Moçambique"
      />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Sobre <span className="text-gradient-gold">MUTIT PAY</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                A sua boutique de luxo premium em Moçambique, trazendo sofisticação e exclusividade 
                até à sua porta com produtos autênticos das marcas mais prestigiadas do mundo.
              </p>
            </div>
          </div>
        </section>

        {/* A Nossa História */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  A Nossa <span className="text-gradient-gold">História</span>
                </h2>
              </div>
              
              <div className="bg-gradient-to-r from-accent/5 to-primary/5 rounded-3xl p-12 border-2 border-accent/20 mb-12">
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    Fundada em Cabo Delgado, a <strong className="text-foreground">MUTIT PAY</strong> nasceu 
                    da paixão por produtos de luxo e do compromisso em trazer para Moçambique as marcas mais 
                    prestigiadas do mundo. Cada peça em nossa coleção é cuidadosamente selecionada por 
                    especialistas, garantindo que apenas o melhor chegue até você.
                  </p>
                  <p>
                    Acreditamos que luxo não é apenas sobre produtos, mas sobre a experiência completa. 
                    Desde a navegação em nossa loja até a entrega na sua porta, cada detalhe é pensado 
                    para proporcionar sofisticação e exclusividade.
                  </p>
                  <p>
                    Com anos de experiência no mercado de luxo internacional, construímos parcerias sólidas 
                    com as principais marcas e distribuidores autorizados, garantindo autenticidade e qualidade 
                    premium em cada produto que oferecemos.
                  </p>
                </div>
              </div>

              {/* Valores */}
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                <Card className="p-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">Nossa Missão</h3>
                      <p className="text-muted-foreground">
                        Democratizar o acesso a produtos de luxo autênticos em Moçambique, 
                        oferecendo uma experiência de compra premium com garantia total de 
                        qualidade e satisfação.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-background">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Heart className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">Nossos Valores</h3>
                      <p className="text-muted-foreground">
                        Autenticidade, transparência, excelência no atendimento e compromisso 
                        inabalável com a satisfação dos nossos clientes são os pilares que 
                        guiam cada decisão que tomamos.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Por Que Escolher a Nossa Boutique */}
        <section className="py-20 bg-gradient-to-br from-muted/30 to-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Por Que Escolher a <span className="text-gradient-gold">Nossa Boutique</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprometimento com excelência, autenticidade e satisfação dos nossos clientes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-muted/30 border-2 border-transparent hover:border-accent/20">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">100% Autêntico</h3>
                <p className="text-muted-foreground">
                  Todos os produtos são garantidamente originais e acompanhados de certificado de autenticidade
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-muted/30 border-2 border-transparent hover:border-accent/20">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <Package className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Entrega Segura</h3>
                <p className="text-muted-foreground">
                  Envio expresso e rastreável para todo Moçambique com embalagem premium e discreta
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-muted/30 border-2 border-transparent hover:border-accent/20">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <Award className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Garantia Premium</h3>
                <p className="text-muted-foreground">
                  Garantia internacional e política de devolução de 30 dias sem complicações
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-muted/30 border-2 border-transparent hover:border-accent/20">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <Headphones className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3">Suporte Dedicado</h3>
                <p className="text-muted-foreground">
                  Atendimento personalizado por consultores especializados disponíveis 24/7
                </p>
              </Card>
            </div>

            {/* Diferenciais Adicionais */}
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 border border-border/50 bg-card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Comunidade Exclusiva</h3>
                    <p className="text-sm text-muted-foreground">
                      Acesso a eventos VIP e lançamentos exclusivos para membros
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border border-border/50 bg-card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Sempre Atualizado</h3>
                    <p className="text-sm text-muted-foreground">
                      Coleções renovadas constantemente com as últimas tendências
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border border-border/50 bg-card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Atendimento Humano</h3>
                    <p className="text-sm text-muted-foreground">
                      Consultores dedicados para ajudá-lo em cada etapa da compra
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-primary to-accent">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-4xl font-bold mb-6">
                Pronto para Experienciar o Luxo?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Explore nossa coleção exclusiva e descubra produtos que combinam com seu estilo único
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/products" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-all duration-300 hover:scale-105"
                >
                  Ver Produtos
                </a>
                <a 
                  href="#contactos" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border-2 border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('contactos');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Entre em Contacto
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;

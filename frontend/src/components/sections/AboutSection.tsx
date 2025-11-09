import { Card } from "@/components/ui/card";
import { Shield, Package, Award, Headphones } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <main>        
        {/* Sobre Nós Section */}
        <section id="sobre" className="py-24 bg-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Por Que Escolher a <span className="text-gradient-gold">Nossa Boutique</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprometimento com excelência, autenticidade e satisfação dos nossos clientes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <Card className="p-8 text-center hover:shadow-xl transition-shadow bg-gradient-to-br from-card to-muted/30">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">100% Autêntico</h3>
                <p className="text-muted-foreground">
                  Todos os produtos são garantidamente originais e acompanhados de certificado de autenticidade
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-xl transition-shadow bg-gradient-to-br from-card to-muted/30">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <Package className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">Entrega Segura</h3>
                <p className="text-muted-foreground">
                  Envio expresso e rastreável para todo Moçambique com embalagem premium e discreta
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-xl transition-shadow bg-gradient-to-br from-card to-muted/30">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <Award className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">Garantia Premium</h3>
                <p className="text-muted-foreground">
                  Garantia internacional e política de devolução de 30 dias sem complicações
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-xl transition-shadow bg-gradient-to-br from-card to-muted/30">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                  <Headphones className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">Suporte Dedicado</h3>
                <p className="text-muted-foreground">
                  Atendimento personalizado por consultores especializados disponíveis 24/7
                </p>
              </Card>
            </div>

            <div className="bg-gradient-to-r from-accent/5 to-secondary/5 rounded-3xl p-12 border border-accent/20">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-3xl font-display font-bold mb-6">
                  A Nossa História
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Fundada em Cabo Delgado, a nossa boutique nasceu da paixão por produtos de luxo e do compromisso em trazer para Moçambique as marcas mais prestigiadas do mundo. Cada peça em nossa coleção é cuidadosamente selecionada por especialistas, garantindo que apenas o melhor chegue até você.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Acreditamos que luxo não é apenas sobre produtos, mas sobre a experiência completa. Desde a navegação em nossa loja até a entrega na sua porta, cada detalhe é pensado para proporcionar sofisticação e exclusividade.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;

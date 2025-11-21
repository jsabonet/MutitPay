import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Política de Privacidade - MutitPay</title>
        <meta name="description" content="Política de Privacidade do MutitPay - Como coletamos, usamos e protegemos suas informações pessoais." />
      </Helmet>
      
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              Política de Privacidade
            </h1>
            <p className="text-muted-foreground">
              Última atualização: {new Date().toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                1. Coleta de Informações
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                O MutitPay coleta informações pessoais fornecidas voluntariamente pelo utilizador, 
                como nome, e-mail, telefone, endereço e dados de pagamento, apenas para fins de 
                processamento de pedidos e melhoria dos serviços.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                2. Uso das Informações
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                As informações recolhidas são utilizadas para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Processar e entregar pedidos;</li>
                <li>Comunicar promoções, ofertas e atualizações;</li>
                <li>Garantir segurança e verificação de identidade dos utilizadores.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                O MutitPay não partilha nem vende informações pessoais a terceiros, exceto quando 
                necessário para cumprir obrigações legais ou concluir operações de entrega e pagamento.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                3. Segurança dos Dados
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Os dados são armazenados em servidores protegidos e o site utiliza certificados SSL 
                para garantir a transmissão segura de informações. Os utilizadores devem também 
                proteger seus dados de acesso (login e senha).
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                4. Cookies
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                O MutitPay utiliza cookies para melhorar a experiência de navegação, lembrar 
                preferências e analisar o tráfego do site. O utilizador pode desativar os cookies 
                no navegador, mas algumas funções do site podem ficar limitadas.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                5. Direitos do Usuário
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                O utilizador pode:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Solicitar a atualização ou exclusão de seus dados;</li>
                <li>Cancelar o recebimento de comunicações promocionais a qualquer momento.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                6. Alterações na Política de Privacidade
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                O MutitPay poderá atualizar esta Política de Privacidade periodicamente. 
                As mudanças serão publicadas nesta página, com data de atualização visível.
              </p>
            </section>

            {/* Section 7 - Contact */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                7. Contacto
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Para questões sobre privacidade ou tratamento de dados:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-foreground">
                  <strong>Email:</strong> <a href="mailto:agente@mutitpay.com" className="text-primary hover:underline">agente@mutitpay.com</a>
                </p>
                <p className="text-foreground">
                  <strong>Endereço:</strong> Mocímboa da Praia, Província de Cabo Delgado, Moçambique
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default PrivacyPolicy;

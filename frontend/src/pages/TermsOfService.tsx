import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { FileText } from 'lucide-react';

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Termos de Uso - MutitPay</title>
        <meta name="description" content="Termos de Uso do MutitPay - Condições para utilização da nossa plataforma de e-commerce." />
      </Helmet>
      
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              Termos de Uso
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
                1. Introdução
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Bem-vindo ao MutitPay! Ao aceder e utilizar o nosso site, o utilizador concorda 
                com os presentes Termos de Uso.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-3">
                O MutitPay é uma plataforma de e-commerce moçambicana, dedicada à compra e venda 
                de produtos diversos, garantindo segurança, transparência e conveniência para 
                clientes e vendedores.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Sede:</strong> Mocímboa da Praia, Província de Cabo Delgado, Moçambique.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                2. Cadastro e Responsabilidades do Usuário
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Para realizar compras ou vendas na plataforma, é necessário criar uma conta com 
                informações verdadeiras e atualizadas.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-3">
                O utilizador é responsável por:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Manter a confidencialidade das suas credenciais de acesso;</li>
                <li>Usar a plataforma de forma ética e conforme a lei;</li>
                <li>Não praticar fraudes, falsificações ou atividades que prejudiquem terceiros.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                3. Envio de Produtos e Entrega
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>O MutitPay realiza entregas em todas as províncias de Moçambique.</li>
                <li>O prazo máximo de entrega é de <strong>7 dias úteis</strong>, contados a partir da confirmação do pagamento.</li>
                <li>As entregas são efetuadas através de transportadoras parceiras ou correios locais.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                4. Frete
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                O valor do frete é calculado conforme a província de destino, exceto nas seguintes 
                localidades, onde o frete é <strong>gratuito</strong>:
              </p>
              <div className="bg-primary/5 rounded-lg p-4 mb-3">
                <ul className="list-disc list-inside space-y-2 text-foreground ml-4">
                  <li>Distrito de Mocímboa da Praia</li>
                  <li>Distrito de Palma</li>
                  <li>Distrito de Mueda</li>
                </ul>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Em todas as demais províncias, o custo do frete será exibido no momento da 
                finalização da compra.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                5. Política de Reembolso e Devolução
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                O cliente pode solicitar o reembolso dentro do prazo estipulado pela loja, desde que:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mb-3">
                <li>O produto esteja nas mesmas condições em que foi enviado (sem danos, sem uso e com embalagem original).</li>
                <li>Caso o produto apresente sinais de uso, danos, falta de peças ou adulteração, o pedido de reembolso será automaticamente recusado.</li>
                <li>O reembolso será processado pelo mesmo método de pagamento utilizado na compra, após avaliação do produto devolvido.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                6. Limitação de Responsabilidade
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                O MutitPay não se responsabiliza por:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Erros de endereço fornecidos pelo cliente;</li>
                <li>Danos causados por mau uso do produto;</li>
                <li>Atrasos de entrega motivados por causas de força maior (condições climáticas, greves, conflitos, etc.).</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                7. Alterações dos Termos
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                O MutitPay reserva-se o direito de alterar estes Termos de Uso a qualquer momento, 
                sem aviso prévio. As alterações entram em vigor imediatamente após sua publicação no site.
              </p>
            </section>

            {/* Section 8 - Contact */}
            <section className="border-t pt-8">
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                8. Contacto
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Para qualquer dúvida, reclamação ou suporte, entre em contacto através de:
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

export default TermsOfService;

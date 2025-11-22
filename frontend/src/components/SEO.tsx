import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  productData?: {
    price?: number;
    currency?: string;
    availability?: 'in_stock' | 'out_of_stock';
    brand?: string;
    category?: string;
  };
}

export const SEO = ({
  title = 'MUTIT PAY - Boutique de Luxo em Moçambique | Marcas Premium',
  description = 'Descubra a maior boutique de luxo em Moçambique. Marcas premium internacionais, moda de alta qualidade, acessórios exclusivos e atendimento VIP. Entrega rápida em Cabo Delgado e todo Moçambique.',
  keywords = 'boutique luxo Moçambique, marcas premium, moda luxo, roupas de grife, acessórios premium, boutique online Moçambique, loja luxo Pemba, comprar marcas internacionais Moçambique, moda feminina luxo, moda masculina premium, bolsas de luxo, relógios premium, MUTIT PAY',
  image = 'https://mutitpay.com/mutit_pay_logo.png',
  url = 'https://mutitpay.com',
  type = 'website',
  productData,
}: SEOProps) => {
  const siteTitle = title.includes('MUTIT PAY') ? title : `${title} | MUTIT PAY`;

  // Gerar JSON-LD para structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MUTIT PAY',
    description: 'Boutique de luxo líder em Moçambique com marcas premium internacionais',
    url: 'https://mutitpay.com',
    logo: 'https://mutitpay.com/mutit_pay_logo.png',
    sameAs: [
      'https://www.facebook.com/mutitpay',
      'https://www.instagram.com/mutitpay',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+258-84-913-5181',
      contactType: 'customer service',
      email: 'agente@mutitpay.com',
      availableLanguage: ['pt', 'en'],
      areaServed: 'MZ',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MZ',
      addressRegion: 'Cabo Delgado',
      addressLocality: 'Pemba',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MUTIT PAY',
    url: 'https://mutitpay.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://mutitpay.com/produtos?search={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: 'https://mutitpay.com',
      },
    ],
  };

  let productSchema = null;
  if (type === 'product' && productData) {
    productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: title,
      description: description,
      image: image,
      brand: productData.brand ? {
        '@type': 'Brand',
        name: productData.brand,
      } : undefined,
      offers: {
        '@type': 'Offer',
        price: productData.price,
        priceCurrency: productData.currency || 'MZN',
        availability: productData.availability === 'in_stock' 
          ? 'https://schema.org/InStock' 
          : 'https://schema.org/OutOfStock',
        url: url,
        seller: {
          '@type': 'Organization',
          name: 'MUTIT PAY',
        },
      },
      category: productData.category,
    };
  }

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang="pt-MZ" />
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="MUTIT PAY" />
      <meta property="og:locale" content="pt_MZ" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="author" content="MUTIT PAY" />
      <meta name="geo.region" content="MZ-P" />
      <meta name="geo.placename" content="Pemba, Cabo Delgado" />
      <meta name="geo.position" content="-12.9718;40.5172" />
      <meta name="ICBM" content="-12.9718, 40.5172" />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=yes" />

      {/* Structured Data - JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

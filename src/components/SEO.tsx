import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  url?: string;
  noindex?: boolean;
}

export default function SEO({
  title,
  description,
  image = '/images/sobre_nos.png',
  type = 'article',
  publishedTime,
  modifiedTime,
  author = 'Brincar Educando',
  section,
  tags = [],
  url,
  noindex = false,
}: SEOProps) {
  const siteUrl = 'https://brincareducando.com.br';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const fullTitle = `${title} | Brincar Educando`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="Brincar Educando" />
      <meta property="og:locale" content="pt_BR" />

      {/* Article specific tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && tags.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* JSON-LD Structured Data */}
      {type === 'article' && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: title,
            description: description,
            image: fullImage,
            datePublished: publishedTime,
            dateModified: modifiedTime || publishedTime,
            author: {
              '@type': 'Organization',
              name: author,
              url: siteUrl,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Brincar Educando',
              url: siteUrl,
              logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/images/sobre_nos.png`,
              },
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': fullUrl,
            },
          })}
        </script>
      )}
    </Helmet>
  );
}

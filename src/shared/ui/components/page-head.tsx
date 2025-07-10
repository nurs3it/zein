import Head from 'next/head';

interface PageHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
}

export const PageHead = ({
  title = 'Zein',
  description = 'Платформа для создания учебных материалов с помощью искусственного интеллекта',
  keywords = ['ИИ', 'образование', 'учителя'],
  ogImage = '/og-image.png',
}: PageHeadProps) => {
  const fullTitle = title === 'Zein' ? title : `${title} - Zein`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="ru_RU" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

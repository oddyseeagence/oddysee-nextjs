export const metadata = {
  metadataBase: new URL('https://oddysee.fr'),
  title: 'Oddysee',
  description:
    'Agence marketing digital orientée conversion: acquisition, SEO, publicité Meta/Google, automatisation et création de sites web.',
  alternates: {
    canonical: '/'
  },
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: 'Oddysee',
    description:
      'Faites croître votre entreprise avec un marketing pensé pour la conversion.',
    url: 'https://oddysee.fr/',
    siteName: 'Oddysee',
    locale: 'fr_FR',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oddysee',
    description:
      'Faites croître votre entreprise avec un marketing pensé pour la conversion.'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

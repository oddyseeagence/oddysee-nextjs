import { LegacyPage, loadLegacyPage } from './lib/legacy-page';

const HTML_FILE = 'get-ads.html';

export async function generateMetadata() {
  const pageData = await loadLegacyPage(HTML_FILE);
  return {
    title: pageData.title,
    alternates: {
      canonical: '/'
    }
  };
}

export default async function HomePage() {
  const pageData = await loadLegacyPage(HTML_FILE);
  return <LegacyPage pageKey="get-ads" pageData={pageData} />;
}

import { LegacyPage, loadLegacyPage } from './lib/legacy-page';

const HTML_FILE = 'index.html';

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
  return <LegacyPage pageKey="index" pageData={pageData} />;
}

import { LegacyPage, loadLegacyPage } from '../lib/legacy-page';

const HTML_FILE = 'resultat.html';

export async function generateMetadata() {
  const pageData = await loadLegacyPage(HTML_FILE);
  return {
    title: pageData.title,
    alternates: {
      canonical: '/resultat'
    }
  };
}

export default async function ResultatPage() {
  const pageData = await loadLegacyPage(HTML_FILE);
  return <LegacyPage pageKey="resultat" pageData={pageData} />;
}

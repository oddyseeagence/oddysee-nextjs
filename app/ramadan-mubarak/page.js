import { LegacyPage, loadLegacyPage } from '../lib/legacy-page';

const HTML_FILE = 'ramadan-mubarak.html';

export async function generateMetadata() {
  const pageData = await loadLegacyPage(HTML_FILE);
  return {
    title: pageData.title,
    alternates: {
      canonical: '/ramadan-mubarak'
    }
  };
}

export default async function RamadanMubarakPage() {
  const pageData = await loadLegacyPage(HTML_FILE);
  return <LegacyPage pageKey="ramadan-mubarak" pageData={pageData} />;
}

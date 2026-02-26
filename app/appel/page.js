import { LegacyPage, loadLegacyPage } from '../lib/legacy-page';

const HTML_FILE = 'appel.html';

export async function generateMetadata() {
  const pageData = await loadLegacyPage(HTML_FILE);
  return {
    title: pageData.title,
    alternates: {
      canonical: '/appel'
    }
  };
}

export default async function AppelPage() {
  const pageData = await loadLegacyPage(HTML_FILE);
  return <LegacyPage pageKey="appel" pageData={pageData} />;
}

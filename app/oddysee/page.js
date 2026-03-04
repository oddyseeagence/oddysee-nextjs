import { LegacyPage, loadLegacyPage } from '../lib/legacy-page';

const HTML_FILE = 'index.html';

export async function generateMetadata() {
  const pageData = await loadLegacyPage(HTML_FILE);
  return {
    title: pageData.title,
    alternates: {
      canonical: '/oddysee'
    }
  };
}

export default async function OddyseePage() {
  const pageData = await loadLegacyPage(HTML_FILE);
  return <LegacyPage pageKey="oddysee" pageData={pageData} />;
}

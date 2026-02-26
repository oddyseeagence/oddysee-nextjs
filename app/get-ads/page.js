import { LegacyPage, loadLegacyPage } from '../lib/legacy-page';

const HTML_FILE = 'get-ads.html';

export async function generateMetadata() {
  const pageData = await loadLegacyPage(HTML_FILE);
  return {
    title: pageData.title,
    alternates: {
      canonical: '/get-ads'
    }
  };
}

export default async function GetAdsPage() {
  const pageData = await loadLegacyPage(HTML_FILE);
  return <LegacyPage pageKey="get-ads" pageData={pageData} />;
}

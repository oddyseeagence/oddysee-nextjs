import { LegacyPage, loadLegacyPage } from '../lib/legacy-page';

const HTML_FILE = 'questionnaire.html';

export async function generateMetadata() {
  const pageData = await loadLegacyPage(HTML_FILE);
  return {
    title: pageData.title,
    alternates: {
      canonical: '/questionnaire'
    }
  };
}

export default async function QuestionnairePage() {
  const pageData = await loadLegacyPage(HTML_FILE);
  return <LegacyPage pageKey="questionnaire" pageData={pageData} />;
}

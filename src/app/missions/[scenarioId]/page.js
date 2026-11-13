import ScenarioMissionsClient from './ScenarioMissionsClient';

export function generateStaticParams() {
  return [
    { scenarioId: 'moon-exploration' },
    { scenarioId: 'mars-exploration' },
    { scenarioId: 'earth-observation' },
  ];
}

export default async function ScenarioMissionsPage({ params }) {
  const { scenarioId } = await params;
  return <ScenarioMissionsClient scenarioId={scenarioId} />;
}

import FlightSceneClient from './FlightSceneClient';

export function generateStaticParams() {
  return [
    { missionId: 'moon-m1' }, { missionId: 'moon-m2' }, { missionId: 'moon-m3' }, { missionId: 'moon-m4' }, { missionId: 'moon-m5' },
    { missionId: 'mars-m1' }, { missionId: 'mars-m2' }, { missionId: 'mars-m3' }, { missionId: 'mars-m4' }, { missionId: 'mars-m5' },
    { missionId: 'earth-m1' }, { missionId: 'earth-m2' }, { missionId: 'earth-m3' }, { missionId: 'earth-m4' }, { missionId: 'earth-m5' },
  ];
}

export default async function FlightScenePage({ params }) {
  const { missionId } = await params;
  return <FlightSceneClient missionId={missionId} />;
}

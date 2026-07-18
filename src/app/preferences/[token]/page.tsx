import PreferenceCenter from './PreferenceCenter'

export default async function PreferencesPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return <PreferenceCenter token={token} />
}

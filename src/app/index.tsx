import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RiotIdForm } from '../components/riot-id-form';
import { Action, Feedback, Heading, Screen, styles } from '../components/ui';
import { useApp } from '../lib/app-state';

export default function Welcome() {
  const { ready, preferences, setRiotId, storageError, retryStorage } = useApp();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function enter(riotId: string | null) {
    setBusy(true);
    setError('');
    try {
      await setRiotId(riotId);
    } catch {
      setError('Não foi possível salvar suas preferências. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <Screen>{storageError
    ? <Feedback message="Não foi possível abrir suas preferências." retry={retryStorage} />
    : <Feedback message="Abrindo Stats Valo…" busy />}</Screen>;
  if (preferences.started) return <Redirect href="/agentes" />;

  return (
    <Screen>
      <View style={welcome.intro}>
        <Heading>Stats Valo</Heading>
        <Text style={styles.body}>Explore agentes, encontre composições por mapa e acompanhe suas partidas de Valorant.</Text>
      </View>
      <RiotIdForm label="Continuar" onSubmit={enter} disabled={busy} />
      <Action label="Explorar sem Riot ID" onPress={() => void enter(null)} secondary disabled={busy} />
      {!!error && <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text>}
      <View style={welcome.links}>
        <Action label="Termos de uso" onPress={() => router.push('/termos')} secondary />
        <Action label="Política de privacidade" onPress={() => router.push('/privacidade')} secondary />
      </View>
    </Screen>
  );
}

const welcome = StyleSheet.create({
  intro: { paddingTop: 40, paddingBottom: 12, gap: 8 },
  links: { gap: 8, paddingTop: 12 },
});

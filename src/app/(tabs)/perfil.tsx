import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { PlayerStats } from '../../components/player-stats';
import { RiotIdForm } from '../../components/riot-id-form';
import { Action, Feedback, Heading, Screen, styles } from '../../components/ui';
import { useApp } from '../../lib/app-state';

export default function Profile() {
  const { ready, storageError, retryStorage, preferences, setRiotId } = useApp();
  const { riotId } = preferences;
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function save(value: string | null) {
    setBusy(true);
    setError('');
    try {
      await setRiotId(value);
      setEditing(false);
    } catch {
      setError('Não foi possível atualizar o Riot ID salvo.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <Heading brand>Perfil</Heading>
      {!ready
        ? storageError
          ? <Feedback message="Não foi possível abrir suas preferências." retry={retryStorage} />
          : <Feedback message="Abrindo perfil…" busy />
        : editing || !riotId
          ? <>
            <Text style={styles.muted}>Salve seu Riot ID neste aparelho para acessar suas estatísticas.</Text>
            <RiotIdForm label="Salvar Riot ID" onSubmit={save} initial={riotId ?? ''} disabled={busy} />
            {!!riotId && <Action label="Cancelar" onPress={() => setEditing(false)} secondary disabled={busy} />}
          </>
          : <>
            <PlayerStats key={riotId} riotId={riotId} agentFirst />
            <Action label="Trocar Riot ID" onPress={() => setEditing(true)} secondary disabled={busy} />
            <Action label="Remover Riot ID salvo" onPress={() => void save(null)} secondary disabled={busy} />
          </>}
      {!!error && <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text>}
      <View style={{ gap: 8 }}>
        <Action label="Sobre o Stats Valo" onPress={() => router.push('/sobre')} secondary />
        <Action label="Termos de uso" onPress={() => router.push('/termos')} secondary />
        <Action label="Política de privacidade" onPress={() => router.push('/privacidade')} secondary />
      </View>
    </Screen>
  );
}

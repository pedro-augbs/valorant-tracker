import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PlayerStats } from '../../components/player-stats';
import { RiotIdForm } from '../../components/riot-id-form';
import { Action, Feedback, Heading, Screen, styles } from '../../components/ui';
import { useApp } from '../../lib/app-state';
import { colors, fonts } from '../../lib/theme';

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
      <Heading brand>{riotId && !editing ? 'Minha evolução' : 'Perfil'}</Heading>
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
      <View style={local.footer}>
        <Pressable accessibilityRole="link" accessibilityLabel="Sobre o Stats Valo"
          onPress={() => router.push('/sobre')} style={local.link}>
          <Text style={local.linkText}>Sobre</Text>
        </Pressable>
        <Pressable accessibilityRole="link" onPress={() => router.push('/termos')} style={local.link}>
          <Text style={local.linkText}>Termos de uso</Text>
        </Pressable>
        <Pressable accessibilityRole="link" accessibilityLabel="Política de privacidade"
          onPress={() => router.push('/privacidade')} style={local.link}>
          <Text style={local.linkText}>Privacidade</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const local = StyleSheet.create({
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  link: { minHeight: 48, paddingHorizontal: 8, justifyContent: 'center' },
  linkText: { color: colors.muted, fontFamily: fonts.body, fontSize: 13 },
});

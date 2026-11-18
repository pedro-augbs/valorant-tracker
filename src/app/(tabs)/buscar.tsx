import { useState } from 'react';
import { Text } from 'react-native';
import { PlayerStats } from '../../components/player-stats';
import { RiotIdForm } from '../../components/riot-id-form';
import { Heading, Screen, styles } from '../../components/ui';

export default function SearchPlayer() {
  const [search, setSearch] = useState<{ riotId: string; attempt: number }>();
  return (
    <Screen>
      <Heading brand>Buscar</Heading>
      <Text style={styles.muted}>Consulte o rank e as partidas competitivas de um jogador autorizado para a demonstração.</Text>
      <RiotIdForm label="Buscar jogador" onSubmit={(riotId) => setSearch((previous) => ({ riotId, attempt: (previous?.attempt ?? 0) + 1 }))} />
      {search && <PlayerStats key={search.attempt} riotId={search.riotId} />}
    </Screen>
  );
}

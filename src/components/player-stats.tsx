import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../lib/app-state';
import { formatKd, type Player } from '../lib/player';
import { colors } from '../lib/theme';
import { Feedback, styles } from './ui';

export function PlayerStats({ riotId, agentFirst = false }: { riotId: string; agentFirst?: boolean }) {
  const { agents, maps } = useApp();
  const [player, setPlayer] = useState<Player>();
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch('/api/jogador', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ riotId }),
          signal: controller.signal,
        });
        const result = await response.json();
        if (controller.signal.aborted) return;
        if (response.ok) setPlayer(result);
        else setError(typeof result.message === 'string' ? result.message : 'A consulta está indisponível.');
      } catch {
        if (!controller.signal.aborted) {
          setError('Não foi possível carregar as estatísticas. Verifique a conexão e tente novamente.');
        }
      }
    }
    void load();
    return () => controller.abort();
  }, [riotId, attempt]);

  const retry = () => { setError(''); setPlayer(undefined); setAttempt((previous) => previous + 1); };
  if (error) return <Feedback message={error} retry={retry} />;
  if (!player) return <Feedback message="Consultando estatísticas…" busy />;

  return (
    <View style={local.stats}>
      <View style={styles.panel}>
        <Text accessibilityRole="header" style={styles.subtitle}>{player.riotId}</Text>
        <Text style={styles.body}>Nível {player.level}</Text>
        <Text style={styles.body}>{player.rank ? player.rank + ' · ' + player.rr + ' RR' : 'Rank indisponível'}</Text>
      </View>
      <View style={styles.panel}>
        <Text style={styles.label}>K/D nas partidas exibidas</Text>
        <Text style={styles.subtitle}>{formatKd(player.matches ?? [])}</Text>
      </View>
      <Text accessibilityRole="header" style={styles.subtitle}>Partidas competitivas recentes</Text>
      {player.matches === null
        ? <Feedback message="O histórico está indisponível." retry={retry} />
        : player.matches.length === 0
          ? <Text style={styles.muted}>Nenhuma partida competitiva recente encontrada no PC.</Text>
          : player.matches.map((match) => {
            const agent = agents.items?.find((item) => item.uuid === match.agentId || item.displayName === match.agent);
            const map = maps.items?.find((item) => item.uuid === match.mapId || item.displayName === match.map);
            const mapImage = map?.listViewIcon ?? map?.splash;
            const agentName = agent?.displayName ?? match.agent;
            const mapName = map?.displayName ?? match.map;
            const matchTitle = agentFirst ? `${agentName} · ${mapName}` : `${mapName} · ${agentName}`;
            return (
              <View key={match.id} style={[styles.panel, local.match]}>
                {agent && <Image source={agent.displayIcon} style={local.agent} accessible={false} />}
                <View style={local.matchInfo}>
                  <Text style={styles.label}>{matchTitle}</Text>
                  <Text style={[styles.muted, match.outcome === 'Vitória' && local.win, match.outcome === 'Derrota' && local.loss]}>{match.outcome}</Text>
                  <Text style={local.score} accessibilityLabel={`K/D/A: ${match.kills} abates, ${match.deaths} mortes, ${match.assists} assistências`}>
                    K/D/A {match.kills} / {match.deaths} / {match.assists}
                  </Text>
                </View>
                {mapImage && <Image source={mapImage} style={local.map} accessible={false} />}
              </View>
            );
          })}
    </View>
  );
}

const local = StyleSheet.create({
  stats: { gap: 12 },
  match: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  matchInfo: { flex: 1, gap: 2 },
  agent: { width: 48, height: 48, borderRadius: 6, backgroundColor: colors.background },
  map: { width: 76, height: 58, borderRadius: 5, backgroundColor: colors.background },
  score: { color: colors.muted, fontSize: 13, fontVariant: ['tabular-nums'] },
  win: { color: colors.green },
  loss: { color: colors.coral },
});

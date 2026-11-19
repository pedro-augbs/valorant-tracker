import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feedback, Screen, styles } from '../../components/ui';
import { useApp } from '../../lib/app-state';
import { colors, fonts } from '../../lib/theme';
import { usePlayer } from '../../lib/use-player';

export default function MatchDetail() {
  const { id, riotId } = useLocalSearchParams<{ id: string; riotId: string }>();
  const { agents, maps } = useApp();
  const { player, error, retry } = usePlayer(typeof riotId === 'string' ? riotId : '');
  const match = player?.matches?.find((item) => item.id === id);
  if (error) return <Screen top={false}><Feedback message={error} retry={retry} /></Screen>;
  if (!player) return <Screen top={false}><Feedback message="Abrindo partida…" busy /></Screen>;
  if (!match) return <Screen top={false}><Feedback message="Esta partida não está no histórico recente disponível." /></Screen>;

  const map = maps.items?.find((item) => item.uuid === match.mapId || item.displayName === match.map);
  const agent = agents.items?.find((item) => item.uuid === match.agentId || item.displayName === match.agent);
  const rounds = (match.roundsWon ?? 0) + (match.roundsLost ?? 0);
  const metrics = [
    ['K/D/A', match.kills + ' / ' + match.deaths + ' / ' + match.assists],
    ['Headshots', match.shots && match.headshots != null ? Math.round(match.headshots / match.shots * 100) + '%' : '—'],
    ['ACS', rounds && match.score != null ? String(Math.round(match.score / rounds)) : '—'],
    ['Dano / round', rounds && match.damage != null ? String(Math.round(match.damage / rounds)) : '—'],
  ];

  return (
    <Screen top={false}>
      <View style={local.hero}>
        {map && <Image source={map.splash ?? map.listViewIcon} style={StyleSheet.absoluteFill} />}
        <View style={local.mapLabel}><Text style={styles.subtitle}>{map?.displayName ?? match.map}</Text></View>
      </View>
      <View style={local.result}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.subtitle, { color: match.outcome === 'Vitória' ? colors.green : colors.coral }]}>{match.outcome}</Text>
          <Text style={styles.muted}>{match.startedAt && !Number.isNaN(Date.parse(match.startedAt)) ? new Date(match.startedAt).toLocaleString('pt-BR') : 'Data indisponível'}</Text>
        </View>
        <Text style={local.score}>{match.roundsWon ?? '—'} : {match.roundsLost ?? '—'}</Text>
      </View>
      <View style={local.metrics}>
        {metrics.map(([label, value]) => (
          <View key={label} style={local.metric}><Text style={styles.muted}>{label}</Text><Text style={styles.subtitle}>{value}</Text></View>
        ))}
      </View>
      <Text style={styles.muted}>
        {match.durationSeconds != null ? Math.round(match.durationSeconds / 60) + ' min · ' : ''}ACS é a pontuação média de combate por round.
      </Text>
      {agent && <Link href={{ pathname: '/agente/[id]', params: { id: agent.uuid } }} asChild>
        <Pressable accessibilityLabel={'Revisar habilidades de ' + agent.displayName} style={StyleSheet.flatten([styles.panel, local.agent])}>
          <Image source={agent.displayIcon} style={local.agentIcon} />
          <View style={{ flex: 1 }}><Text style={styles.label}>{agent.displayName}</Text><Text style={styles.muted}>Revisar habilidades →</Text></View>
        </Pressable>
      </Link>}
      {match.participants?.length ? [true, false].map((ally) => (
        <View key={String(ally)} style={{ gap: 8 }}>
          <Text accessibilityRole="header" style={styles.subtitle}>{ally ? 'Sua equipe' : 'Adversários'}</Text>
          <View style={local.tableHeader}><Text style={[styles.muted, { flex: 1 }]}>Agente</Text><Text style={styles.muted}>K / D / A</Text></View>
          {match.participants!.filter((item) => item.ally === ally).sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).map((item, index) => {
            const character = agents.items?.find((entry) => entry.uuid === item.agentId || entry.displayName === item.agent);
            return (
              <View key={item.agentId + index} style={[local.row, item.self && local.self]}>
                {character && <Image source={character.displayIcon} style={local.smallIcon} />}
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>{character?.displayName ?? item.agent}</Text>
                  {item.self && <Text style={local.you}>Você</Text>}
                </View>
                <Text style={local.kda}>{item.kills} / {item.deaths} / {item.assists}</Text>
              </View>
            );
          })}
        </View>
      )) : <Text style={styles.muted}>Placar detalhado indisponível para esta partida.</Text>}
    </Screen>
  );
}

const local = StyleSheet.create({
  hero: { height: 165, backgroundColor: colors.surface, borderRadius: 8, overflow: 'hidden', justifyContent: 'flex-end', alignItems: 'flex-start' },
  mapLabel: { backgroundColor: colors.background, margin: 12, paddingHorizontal: 10, borderLeftWidth: 3, borderLeftColor: colors.coral },
  result: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  score: { fontFamily: fonts.title, fontSize: 42, color: colors.text },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metric: { flexBasis: '44%', flexGrow: 1, backgroundColor: colors.surface, padding: 14, borderRadius: 8 },
  agent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  agentIcon: { width: 54, height: 54 },
  tableHeader: { flexDirection: 'row', paddingHorizontal: 12, gap: 8 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center', minHeight: 60, padding: 10, backgroundColor: colors.surface, borderRadius: 6 },
  self: { borderLeftWidth: 3, borderLeftColor: colors.coral },
  smallIcon: { width: 32, height: 32 },
  you: { color: colors.coral, fontSize: 12 },
  kda: { color: colors.text, fontSize: 13, fontVariant: ['tabular-nums'] },
});

import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../lib/app-state';
import { formatKd } from '../lib/player';
import { colors, fonts } from '../lib/theme';
import { usePlayer } from '../lib/use-player';
import { AgentPerformance, PerformanceSummary } from './performance';
import { Action, Feedback, styles } from './ui';

const sections = ['Resumo', 'Agentes', 'Partidas'] as const;

export function PlayerStats({ riotId, agentFirst = false }: { riotId: string; agentFirst?: boolean }) {
  const { agents, maps } = useApp();
  const { player, error, retry } = usePlayer(riotId);
  const [section, setSection] = useState<typeof sections[number]>('Resumo');
  const [limit, setLimit] = useState(10);

  if (error) return <Feedback message={error} retry={retry} />;
  if (!player) return <Feedback message="Consultando estatísticas…" busy />;
  const matches = player.matches?.slice(0, agentFirst ? limit : 5);

  return (
    <View style={local.stats}>
      <View style={local.identity}>
        <Text accessibilityRole="header" style={styles.subtitle}>{player.riotId}</Text>
        <Text style={styles.muted}>Nível {player.level} · Competitivo PC</Text>
        <Text style={local.rank}>{player.rank ? player.rank + ' · ' + player.rr + ' RR' : 'Rank indisponível'}</Text>
      </View>
      {agentFirst && !!matches?.length && (
        <>
          <View style={local.range}>
            <Text style={styles.label}>Últimas partidas</Text>
            <View style={local.rangeButtons}>
              {[5, 10].map((value) => (
                <Pressable key={value} accessibilityRole="button" accessibilityLabel={'Últimas ' + value + ' partidas'}
                  accessibilityState={{ selected: limit === value }} onPress={() => setLimit(value)}
                  style={[local.rangeButton, limit === value && local.selected]}>
                  <Text style={[styles.label, limit === value && local.selectedText]}>{value}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <Text style={styles.muted}>Análise de {matches.length} partidas disponíveis no recorte.</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={local.tabs}>
            {sections.map((name) => (
              <Pressable key={name} accessibilityRole="button" accessibilityState={{ selected: section === name }}
                onPress={() => setSection(name)} style={[local.tab, section === name && local.activeTab]}>
                <Text style={[styles.label, section === name && local.tabText]}>{name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </>
      )}
      {player.matches === null
        ? <Feedback message="O histórico está indisponível." retry={retry} />
        : !matches?.length
          ? <Text style={styles.muted}>Nenhuma partida competitiva recente encontrada no PC.</Text>
          : agentFirst && section === 'Resumo'
            ? <>
              <PerformanceSummary matches={matches} />
              <Action label="Explorar minhas partidas" onPress={() => setSection('Partidas')} secondary />
            </>
            : agentFirst && section === 'Agentes'
              ? <AgentPerformance matches={matches} />
              : <>
                {!agentFirst && <View style={styles.panel}>
                  <Text style={styles.label}>K/D nas partidas exibidas</Text>
                  <Text style={styles.subtitle}>{formatKd(matches)}</Text>
                </View>}
                <Text accessibilityRole="header" style={styles.subtitle}>Partidas competitivas recentes</Text>
                {matches.map((match) => {
                  const agent = agents.items?.find((item) => item.uuid === match.agentId || item.displayName === match.agent);
                  const map = maps.items?.find((item) => item.uuid === match.mapId || item.displayName === match.map);
                  const mapImage = map?.listViewIcon ?? map?.splash;
                  const agentName = agent?.displayName ?? match.agent;
                  const mapName = map?.displayName ?? match.map;
                  const title = agentFirst ? agentName + ' · ' + mapName : mapName + ' · ' + agentName;
                  return (
                    <Pressable key={match.id} accessibilityRole="button" accessibilityLabel={'Ver partida: ' + title}
                      onPress={() => router.push({ pathname: '/partida/[id]', params: { id: match.id, riotId } })}
                      style={({ pressed }) => [styles.panel, local.match, pressed && { opacity: 0.7 }]}>
                      {agent && <Image source={agent.displayIcon} style={local.agent} accessible={false} />}
                      <View style={local.matchInfo}>
                        <Text style={styles.label}>{title}</Text>
                        <Text style={[styles.muted, match.outcome === 'Vitória' && local.win, match.outcome === 'Derrota' && local.loss]}>
                          {match.outcome}{match.roundsWon != null && match.roundsLost != null ? ' · ' + match.roundsWon + '–' + match.roundsLost : ''}
                        </Text>
                        <Text style={local.score} accessibilityLabel={'K/D/A: ' + match.kills + ' abates, ' + match.deaths + ' mortes, ' + match.assists + ' assistências'}>
                          K/D/A {match.kills} / {match.deaths} / {match.assists}
                        </Text>
                      </View>
                      {mapImage && <Image source={mapImage} style={local.map} accessible={false} />}
                    </Pressable>
                  );
                })}
              </>}
    </View>
  );
}

const local = StyleSheet.create({
  stats: { gap: 14 },
  identity: { padding: 18, gap: 5, backgroundColor: colors.surface, borderRadius: 8, borderLeftWidth: 3, borderLeftColor: colors.coral },
  rank: { color: colors.coral, fontFamily: fonts.title, fontSize: 27, marginTop: 6 },
  range: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  rangeButtons: { flexDirection: 'row', gap: 6 },
  rangeButton: { minWidth: 48, minHeight: 48, backgroundColor: colors.surface, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  selected: { backgroundColor: colors.coral },
  selectedText: { color: colors.background },
  tabs: { flexGrow: 1, gap: 8 },
  tab: { flex: 1, minHeight: 48, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: colors.divider },
  activeTab: { borderBottomColor: colors.coral },
  tabText: { color: colors.coral },
  match: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  matchInfo: { flex: 1, gap: 2 },
  agent: { width: 44, height: 44, borderRadius: 6, backgroundColor: colors.background },
  map: { width: 64, height: 58, borderRadius: 5, backgroundColor: colors.background },
  score: { color: colors.muted, fontSize: 13, fontVariant: ['tabular-nums'] },
  win: { color: colors.green },
  loss: { color: colors.coral },
});

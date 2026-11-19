import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../lib/app-state';
import { summarizeMatches, type Match } from '../lib/player';
import { colors, fonts } from '../lib/theme';
import { styles } from './ui';

function percentage(value: number | null) {
  return value === null ? '—' : value + '%';
}

export function PerformanceSummary({ matches }: { matches: Match[] }) {
  const { maps } = useApp();
  const summary = summarizeMatches(matches);
  const chronological = [...matches].reverse();
  const maxKills = Math.max(1, ...matches.map((match) => match.kills));
  const mapNames = [...new Set(matches.map((match) => match.mapId ?? match.map))];

  return (
    <View style={local.section}>
      <View style={local.metrics}>
        {[
          ['Vitórias', percentage(summary.winRate)],
          ['K/D', summary.kd],
          ['Headshots', percentage(summary.headshotRate)],
          ['Partidas', String(matches.length)],
        ].map(([label, value]) => (
          <View key={label} style={local.metric}>
            <Text style={local.metricValue}>{value}</Text>
            <Text style={styles.muted}>{label}</Text>
          </View>
        ))}
      </View>
      <View style={styles.panel}>
        <Text accessibilityRole="header" style={styles.subtitle}>Seu ritmo de jogo</Text>
        <Text style={styles.muted}>{summary.wins} vitórias · {summary.losses} derrotas · {summary.draws} empates</Text>
        <View style={local.results}>
          {chronological.map((match, index) => (
            <View key={match.id} accessibilityLabel={'Partida ' + (index + 1) + ': ' + match.outcome}
              style={[local.result, { backgroundColor: match.outcome === 'Vitória' ? colors.green : match.outcome === 'Derrota' ? colors.coral : colors.divider }]}>
              <Text style={local.resultLabel}>{match.outcome === 'Vitória' ? 'V' : match.outcome === 'Derrota' ? 'D' : '—'}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.muted}>Da mais antiga à mais recente</Text>
      </View>
      <View style={styles.panel}>
        <Text accessibilityRole="header" style={styles.subtitle}>Abates por partida</Text>
        <View style={local.chart}>
          {chronological.map((match, index) => (
            <View key={match.id} style={local.column}
              accessibilityLabel={'Partida ' + (index + 1) + ': ' + match.kills + ' abates e ' + match.deaths + ' mortes'}>
              <Text style={local.chartNumber}>{match.kills}</Text>
              <View style={[local.bar, { height: Math.max(2, match.kills / maxKills * 105), backgroundColor: match.outcome === 'Vitória' ? colors.green : colors.coral }]} />
              <Text style={styles.muted}>{index + 1}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.muted}>O número identifica a ordem da partida no recorte.</Text>
      </View>
      <View style={styles.panel}>
        <Text accessibilityRole="header" style={styles.subtitle}>Por mapa</Text>
        {mapNames.map((key) => {
          const list = matches.filter((match) => (match.mapId ?? match.map) === key);
          const map = maps.items?.find((item) => item.uuid === list[0].mapId || item.displayName === list[0].map);
          return (
            <View key={key} style={local.mapRow}>
              {map && <Image source={map.listViewIcon ?? map.splash} style={local.mapImage} />}
              <View style={local.mapText}>
                <Text style={styles.label}>{map?.displayName ?? list[0].map}</Text>
                <Text style={styles.muted}>{list.length} partidas · K/D {summarizeMatches(list).kd}</Text>
              </View>
              <Text style={local.rate}>{percentage(summarizeMatches(list).winRate)}</Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.muted}>As métricas representam apenas este recorte. Headshots considera os impactos registrados na cabeça sobre o total de impactos.</Text>
    </View>
  );
}

export function AgentPerformance({ matches }: { matches: Match[] }) {
  const { agents, preferences } = useApp();
  const groups = [...new Set(matches.map((match) => match.agentId ?? match.agent))]
    .map((key) => matches.filter((match) => (match.agentId ?? match.agent) === key))
    .sort((a, b) => b.length - a.length || a[0].agent.localeCompare(b[0].agent));

  return (
    <View style={local.section}>
      <Text style={styles.muted}>Compare os agentes usados nas partidas selecionadas.</Text>
      {groups.map((list) => {
        const first = list[0];
        const agent = agents.items?.find((item) => item.uuid === first.agentId || item.displayName === first.agent);
        const summary = summarizeMatches(list);
        const favorite = !!agent && preferences.favorites.includes(agent.uuid);
        const content = (
          <View style={styles.panel}>
            <View style={local.agentHeader}>
              {agent && <Image source={agent.displayIcon} style={local.agentImage} />}
              <View style={local.mapText}>
                <Text style={styles.subtitle}>{agent?.displayName ?? first.agent}{favorite ? ' ★' : ''}</Text>
                <Text style={styles.muted}>{agent?.role.displayName ?? 'Agente'} · {list.length} partidas</Text>
              </View>
              {agent && <Text style={local.rate}>↗</Text>}
            </View>
            <View style={local.agentNumbers}>
              <View><Text style={local.smallValue}>{summary.kd}</Text><Text style={styles.muted}>K/D</Text></View>
              <View><Text style={local.smallValue}>{percentage(summary.winRate)}</Text><Text style={styles.muted}>Vitórias</Text></View>
              <View><Text style={local.smallValue}>{percentage(summary.headshotRate)}</Text><Text style={styles.muted}>Headshots</Text></View>
            </View>
            {list.length < 3 && <Text style={styles.muted}>Amostra de {list.length} {list.length === 1 ? 'partida' : 'partidas'} neste recorte.</Text>}
          </View>
        );
        return agent
          ? <Link key={first.agentId ?? first.agent} href={{ pathname: '/agente/[id]', params: { id: agent.uuid } }} asChild>
            <Pressable accessibilityLabel={'Revisar habilidades de ' + agent.displayName}>{content}</Pressable>
          </Link>
          : <View key={first.agent}>{content}</View>;
      })}
    </View>
  );
}

const local = StyleSheet.create({
  section: { gap: 14 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metric: { flexBasis: '44%', flexGrow: 1, padding: 16, backgroundColor: colors.surface, borderRadius: 8, borderTopWidth: 2, borderTopColor: colors.coral },
  metricValue: { color: colors.text, fontFamily: fonts.title, fontSize: 36 },
  results: { flexDirection: 'row', gap: 5, flexWrap: 'wrap', paddingVertical: 6 },
  result: { width: 24, height: 30, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  resultLabel: { fontFamily: fonts.title, color: colors.background, fontSize: 18 },
  chart: { flexDirection: 'row', gap: 5, alignItems: 'flex-end', minHeight: 150, paddingTop: 12 },
  column: { flex: 1, gap: 4, alignItems: 'center', justifyContent: 'flex-end' },
  chartNumber: { color: colors.text, fontSize: 12, fontVariant: ['tabular-nums'] },
  bar: { width: '100%', maxWidth: 32, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  mapRow: { flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 8 },
  mapText: { flex: 1 },
  mapImage: { width: 54, height: 42, borderRadius: 4 },
  rate: { color: colors.coral, fontFamily: fonts.title, fontSize: 24 },
  agentHeader: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  agentImage: { width: 58, height: 58, borderRadius: 6, backgroundColor: colors.background },
  agentNumbers: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, paddingTop: 12 },
  smallValue: { color: colors.text, fontFamily: fonts.title, fontSize: 28 },
});

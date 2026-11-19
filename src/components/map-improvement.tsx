import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../lib/app-state';
import type { GameMap } from '../lib/catalog';
import { getImprovementSuggestions, summarizeMatches } from '../lib/player';
import { colors } from '../lib/theme';
import { usePlayer } from '../lib/use-player';
import { Action, Feedback, styles } from './ui';

export function MapImprovement({ map }: { map: GameMap }) {
  const { preferences } = useApp();
  return (
    <View style={local.section}>
      <Text accessibilityRole="header" style={styles.subtitle}>Como melhorar neste mapa</Text>
      {preferences.riotId
        ? <PersonalMapTips key={preferences.riotId} map={map} riotId={preferences.riotId} />
        : <View style={styles.panel}>
          <Text style={styles.body}>Salve seu Riot ID no Perfil para analisar seu desempenho em {map.displayName} e receber sugestões para a próxima partida.</Text>
          <Action label="Abrir meu perfil" secondary onPress={() => router.push('/perfil')} />
        </View>}
    </View>
  );
}

function PersonalMapTips({ map, riotId }: { map: GameMap; riotId: string }) {
  const { player, error, retry } = usePlayer(riotId);
  if (error) return <Feedback message={error} retry={retry} />;
  if (!player) return <Feedback message="Analisando suas partidas neste mapa…" busy />;
  if (player.matches === null) return <Feedback message="Seu histórico está indisponível para esta análise." retry={retry} />;
  const matches = player.matches.filter((match) => match.mapId === map.uuid || match.map.toLowerCase() === map.displayName.toLowerCase());
  if (!matches.length) return (
    <View style={styles.panel}>
      <Text style={styles.body}>Nenhuma partida de {map.displayName} entre as {player.matches.length} partidas recentes disponíveis.</Text>
      <Text style={styles.muted}>Experimente uma das composições abaixo e combine o papel de cada agente antes de entrar na partida.</Text>
    </View>
  );

  const summary = summarizeMatches(matches);
  const review = matches.find((match) => match.outcome === 'Derrota') ?? matches[0];
  return (
    <View style={local.section}>
      <View style={styles.panel}>
        <Text style={styles.label}>{player.riotId} · {matches.length} {matches.length === 1 ? 'partida' : 'partidas'} em {map.displayName}</Text>
        <Text style={styles.body}>K/D {summary.kd} · {summary.wins}V / {summary.losses}D / {summary.draws}E</Text>
        <Text style={styles.muted}>Recorte das últimas {player.matches.length} partidas disponíveis. As sugestões usam os totais deste mapa e propõem ajustes para você experimentar.</Text>
      </View>
      {getImprovementSuggestions(matches).map((suggestion) => (
        <View key={suggestion.title} style={[styles.panel, local.tip]}>
          <Text style={styles.label}>{suggestion.title}</Text>
          <Text style={local.observation}>{suggestion.observation}</Text>
          <Text style={styles.body}>{suggestion.action}</Text>
        </View>
      ))}
      <Action label={review.outcome === 'Derrota' ? 'Revisar uma derrota neste mapa' : 'Revisar minha partida neste mapa'}
        secondary onPress={() => router.push({ pathname: '/partida/[id]', params: { id: review.id, riotId } })} />
    </View>
  );
}

const local = StyleSheet.create({
  section: { gap: 12 },
  tip: { borderLeftWidth: 3, borderLeftColor: colors.coral },
  observation: { color: colors.coral, fontSize: 14, lineHeight: 21 },
});

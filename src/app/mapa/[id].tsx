import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feedback, Heading, Screen, styles } from '../../components/ui';
import { useApp } from '../../lib/app-state';
import { alternatives, compositions } from '../../lib/compositions';
import { colors } from '../../lib/theme';

export default function MapDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { agents, maps, preferences } = useApp();
  const map = maps.items?.find((item) => item.uuid === id);
  const picks = compositions[id];
  const alternative = alternatives[id];

  if (!map || !picks) return (
    <Screen top={false}>
      {maps.error
        ? <Feedback message="Não foi possível carregar o mapa." retry={maps.retry} />
        : <Feedback message={maps.items ? 'Mapa não encontrado.' : 'Carregando mapa…'} busy={!maps.items} />}
    </Screen>
  );

  return (
    <Screen top={false}>
      <Image source={map.splash ?? map.listViewIcon} style={local.hero} />
      <Heading>{map.displayName}</Heading>
      {agents.error && <Feedback message="Não foi possível carregar os retratos dos agentes." retry={agents.retry} />}
      {[{ title: 'Formação principal', picks }, alternative].map((formation) => (
        <View key={formation.title} style={local.formation}>
          <Text accessibilityRole="header" style={styles.subtitle}>{formation.title}</Text>
          {formation.picks.map(([name, contribution]) => {
            const agent = agents.items?.find((item) => item.displayName === name);
            const favorite = !!agent && preferences.favorites.includes(agent.uuid);
            const content = (
              <>
                {agent && <Image source={agent.displayIcon} style={local.icon} />}
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={local.name}>
                    <Text style={styles.label}>{name}</Text>
                    {favorite && <Ionicons name="star" size={16} color={colors.coral} />}
                  </View>
                  {agent && <Text style={styles.muted}>{agent.role.displayName}</Text>}
                  <Text style={styles.body}>{contribution}</Text>
                </View>
              </>
            );
            return agent
              ? <Link key={name} href={{ pathname: '/agente/[id]', params: { id: agent.uuid } }} asChild>
                <Pressable accessibilityLabel={'Ver detalhes de ' + name + (favorite ? ', favorito' : '')}
                  style={StyleSheet.flatten([styles.panel, local.pick, favorite && local.favorite])}>{content}</Pressable>
              </Link>
              : <View key={name} style={[styles.panel, local.pick]}>{content}</View>;
          })}
        </View>
      ))}
    </Screen>
  );
}

const local = StyleSheet.create({
  hero: { height: 175, backgroundColor: colors.surface, borderRadius: 6 },
  formation: { gap: 10 },
  pick: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  favorite: { borderLeftWidth: 3, borderLeftColor: colors.coral },
  icon: { width: 52, height: 52 },
});

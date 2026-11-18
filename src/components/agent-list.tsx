import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../lib/app-state';
import type { Agent } from '../lib/catalog';
import { colors, fonts } from '../lib/theme';
import { Feedback, Heading, Screen, styles } from './ui';

const roles = ['Todos', 'Duelista', 'Controlador', 'Iniciador', 'Sentinela'];
const featured = ['Jett', 'Omen'];
const priority = (agent: Agent) => {
  const index = featured.indexOf(agent.displayName);
  return index === -1 ? featured.length : index;
};

export function FavoriteButton({ agent }: { agent: Agent }) {
  const { preferences, toggleFavorite } = useApp();
  const selected = preferences.favorites.includes(agent.uuid);
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  async function toggle() {
    setPending(true);
    setError(false);
    try {
      await toggleFavorite(agent.uuid);
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <View>
      <Pressable accessibilityRole="button"
        accessibilityLabel={(selected ? 'Remover dos favoritos: ' : 'Adicionar aos favoritos: ') + agent.displayName}
        accessibilityState={{ selected, disabled: pending }}
        disabled={pending}
        style={local.star}
        onPress={() => void toggle()}>
        <Ionicons name={selected ? 'star' : 'star-outline'} color={colors.coral} size={27} />
      </Pressable>
      {error && <Text accessibilityLiveRegion="polite" style={styles.error}>Falha ao salvar</Text>}
    </View>
  );
}

export function AgentList({ favorites = false }: { favorites?: boolean }) {
  const [role, setRole] = useState('Todos');
  const { agents, preferences, ready, storageError, retryStorage } = useApp();
  const title = favorites ? 'Favoritos' : 'Agentes';
  const list = agents.items?.filter((agent) => favorites
    ? preferences.favorites.includes(agent.uuid)
    : role === 'Todos' || agent.role.displayName === role,
  ).sort((a, b) => priority(a) - priority(b) || a.displayName.localeCompare(b.displayName, 'pt-BR'));
  const header = (
    <View style={local.header}>
      <View style={local.heading}><Heading brand>{title}</Heading></View>
      {!favorites && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={local.filters}>
          {roles.map((item) => (
            <Pressable accessibilityRole="button" accessibilityState={{ selected: role === item }}
              key={item} onPress={() => setRole(item)} style={[local.filter, role === item && local.activeFilter]}>
              <Text style={[local.filterLabel, role === item && local.activeText]}>{item}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );

  return (
    <Screen scroll={false}>
      <FlatList style={{ flex: 1 }} contentContainerStyle={[styles.content, local.list]} data={list ?? []}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={header} keyExtractor={(agent) => agent.uuid}
        ListEmptyComponent={storageError
          ? <Feedback message="Não foi possível abrir suas preferências." retry={retryStorage} />
          : agents.error
            ? <Feedback message="Não foi possível carregar os agentes." retry={agents.retry} />
            : !agents.items || !ready
              ? <Feedback message="Carregando agentes…" busy />
              : <Feedback message={favorites ? 'Marque a estrela de um agente para vê-lo aqui.' : 'Nenhum agente nesta função.'} />}
        renderItem={({ item: agent }) => (
          <View style={local.card}>
            <View style={local.diagonal} />
            <View pointerEvents="none" style={local.art}>
              <Image source={agent.bustPortrait ?? agent.displayIcon}
                style={agent.bustPortrait ? local.portrait : local.iconFallback}
                contentFit="contain" recyclingKey={agent.uuid} />
            </View>
            <Link href={{ pathname: '/agente/[id]', params: { id: agent.uuid } }} asChild>
              <Pressable accessibilityLabel={'Ver detalhes de ' + agent.displayName} style={local.cardLink}>
                <Text style={local.agentName}>{agent.displayName}</Text>
                <View style={local.roleBadge}><Text style={local.role}>{agent.role.displayName}</Text></View>
              </Pressable>
            </Link>
            {ready && <View style={local.favorite}><FavoriteButton agent={agent} /></View>}
          </View>
        )} />
    </Screen>
  );
}

const local = StyleSheet.create({
  list: { paddingHorizontal: 0, gap: 10 },
  header: { gap: 12, paddingBottom: 8 },
  heading: { paddingHorizontal: 20 },
  filters: { flexGrow: 1, gap: 9, paddingHorizontal: 16 },
  filter: { minHeight: 48, paddingHorizontal: 13, justifyContent: 'center', borderWidth: 1, borderColor: colors.divider, backgroundColor: colors.surface, transform: [{ skewX: '-14deg' }] },
  activeFilter: { backgroundColor: colors.coral, borderColor: colors.coral },
  filterLabel: { color: colors.text, fontFamily: fonts.title, fontSize: 19, textTransform: 'uppercase', transform: [{ skewX: '14deg' }] },
  activeText: { color: colors.background },
  card: { minHeight: 216, backgroundColor: '#191D25', overflow: 'hidden', justifyContent: 'center' },
  diagonal: { position: 'absolute', top: 0, bottom: 0, width: '53%', right: '-10%', backgroundColor: colors.coral, transform: [{ skewX: '-34deg' }] },
  art: { position: 'absolute', top: 0, bottom: 0, left: '36%', right: 0, overflow: 'hidden' },
  portrait: { position: 'absolute', width: '244%', height: '260%', left: '-59%', top: '-29%' },
  iconFallback: { position: 'absolute', width: '100%', height: '100%' },
  cardLink: { flex: 1, paddingLeft: 22, paddingRight: '42%', paddingTop: 34, paddingBottom: 66, justifyContent: 'center', alignItems: 'flex-start' },
  agentName: { color: colors.text, fontFamily: fonts.title, fontSize: 42, textTransform: 'uppercase', textShadowColor: colors.background, textShadowRadius: 8, textShadowOffset: { width: 1, height: 2 } },
  roleBadge: { backgroundColor: colors.divider, paddingHorizontal: 9, paddingVertical: 2, transform: [{ skewX: '-14deg' }] },
  role: { color: colors.text, fontFamily: fonts.title, fontSize: 18, textTransform: 'uppercase', transform: [{ skewX: '14deg' }] },
  favorite: { position: 'absolute', left: 15, bottom: 14 },
  star: { minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
});

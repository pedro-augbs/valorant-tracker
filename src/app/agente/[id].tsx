import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { FavoriteButton } from '../../components/agent-list';
import { Feedback, Heading, Screen, styles } from '../../components/ui';
import { useApp } from '../../lib/app-state';
import { plainCatalogText } from '../../lib/catalog';
import { colors } from '../../lib/theme';

const slots = ['Grenade', 'Ability1', 'Ability2', 'Ultimate'];

export default function AgentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { agents, ready } = useApp();
  const agent = agents.items?.find((item) => item.uuid === id);
  if (!agent) return (
    <Screen top={false}>
      {agents.error
        ? <Feedback message="Não foi possível carregar o agente." retry={agents.retry} />
        : <Feedback message={agents.items ? 'Agente não encontrado.' : 'Carregando agente…'} busy={!agents.items} />}
    </Screen>
  );

  return (
    <Screen top={false}>
      <View style={local.hero}>
        <Image source={agent.bustPortrait ?? agent.displayIcon} style={local.portrait} contentFit="contain" />
      </View>
      <View style={local.heading}>
        <View style={{ flex: 1 }}>
          <Heading>{agent.displayName}</Heading>
          <Text style={styles.muted}>{agent.role.displayName}</Text>
        </View>
        {ready && <FavoriteButton agent={agent} />}
      </View>
      <Text style={styles.body}>{plainCatalogText(agent.description)}</Text>
      <Text style={styles.subtitle}>Habilidades</Text>
      {slots.map((slot) => {
        const ability = agent.abilities.find((item) => item.slot === slot);
        if (!ability) return null;
        return (
          <View key={slot} style={[styles.panel, local.ability]}>
            {ability.displayIcon && <Image source={ability.displayIcon} style={local.icon} contentFit="contain" />}
            <View style={{ flex: 1, gap: 5 }}>
              <Text style={styles.label}>{ability.displayName}</Text>
              <Text style={styles.muted}>{plainCatalogText(ability.description)}</Text>
            </View>
          </View>
        );
      })}
    </Screen>
  );
}

const local = StyleSheet.create({
  hero: { height: 246, borderRadius: 8, backgroundColor: colors.surface, overflow: 'hidden', borderBottomWidth: 4, borderBottomColor: colors.coral },
  portrait: { width: '100%', height: '100%' },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ability: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  icon: { width: 38, height: 38 },
});

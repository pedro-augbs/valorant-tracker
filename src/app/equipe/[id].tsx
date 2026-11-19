import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Action, Feedback, Heading, Screen, styles } from '../../components/ui';
import { useApp } from '../../lib/app-state';
import { alternatives, compositions } from '../../lib/compositions';
import { colors } from '../../lib/theme';

const roles = ['Duelista', 'Controlador', 'Iniciador', 'Sentinela'];

export default function TeamBuilder() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { agents, maps, preferences } = useApp();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const map = maps.items?.find((item) => item.uuid === id);
  const team = selected.flatMap((uuid) => agents.items?.find((item) => item.uuid === uuid) ?? []);
  const available = agents.items?.filter((agent) => agent.displayName.toLocaleLowerCase().includes(search.toLocaleLowerCase().trim()))
    .sort((a, b) => Number(preferences.favorites.includes(b.uuid)) - Number(preferences.favorites.includes(a.uuid)) || a.displayName.localeCompare(b.displayName));
  const missingRoles = roles.filter((role) => !team.some((agent) => agent.role.displayName === role));
  const suggested = compositions[id]?.flatMap(([name]) => {
    const agent = agents.items?.find((item) => item.displayName === name);
    return agent && !selected.includes(agent.uuid) && missingRoles.includes(agent.role.displayName) ? [agent] : [];
  }).sort((a, b) => Number(preferences.favorites.includes(b.uuid)) - Number(preferences.favorites.includes(a.uuid)));

  function toggle(uuid: string) {
    setSelected((previous) => previous.includes(uuid)
      ? previous.filter((item) => item !== uuid)
      : previous.length < 5 ? [...previous, uuid] : previous);
  }

  function selectFormation(names: string[]) {
    setSelected(names.flatMap((name) => agents.items?.find((agent) => agent.displayName === name)?.uuid ?? []));
  }

  if (!map) return <Screen top={false}>{maps.error
    ? <Feedback message="Não foi possível carregar o mapa." retry={maps.retry} />
    : <Feedback message={maps.items ? 'Mapa não encontrado.' : 'Carregando mapa…'} busy={!maps.items} />}</Screen>;

  return (
    <Screen top={false}>
      <Heading>Monte sua equipe</Heading>
      <Text style={styles.body}>{map.displayName} · {selected.length}/5 agentes</Text>
      <View style={local.slots}>
        {Array.from({ length: 5 }, (_, index) => {
          const agent = team[index];
          return (
            <Pressable key={index} accessibilityRole="button" disabled={!agent}
              accessibilityLabel={agent ? 'Remover ' + agent.displayName + ' da equipe' : 'Espaço vazio ' + (index + 1)}
              onPress={() => agent && toggle(agent.uuid)} style={local.slot}>
              {agent ? <Image source={agent.displayIcon} style={local.portrait} /> : <Text style={styles.subtitle}>+</Text>}
              <Text style={local.slotName}>{agent?.displayName ?? 'Vazio'}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.panel}>
        <Text accessibilityRole="header" style={styles.subtitle}>Cobertura de funções</Text>
        {roles.map((role) => (
          <View key={role} style={local.roleRow}>
            <Text style={styles.body}>{role}</Text>
            <Text style={[styles.label, { color: team.some((agent) => agent.role.displayName === role) ? colors.green : colors.muted }]}>
              {team.filter((agent) => agent.role.displayName === role).length}
            </Text>
          </View>
        ))}
        {team.length < 5
          ? <Text style={styles.muted}>Escolha mais {5 - team.length} {team.length === 4 ? 'agente' : 'agentes'} para completar a equipe.</Text>
          : <Text style={styles.body}>{missingRoles.length
            ? 'Sua equipe está completa. Vale experimentar uma troca para cobrir: ' + missingRoles.join(', ') + '.'
            : 'Sua equipe reúne as quatro funções. Combine utilitários e entradas para executar a estratégia.'}</Text>}
        {!!suggested?.length && <Text style={styles.muted}>
          Opção da formação principal para ampliar a cobertura: {suggested[0].displayName}
          {preferences.favorites.includes(suggested[0].uuid) ? ' ★, um dos seus favoritos' : ''}.
        </Text>}
        <Text style={styles.muted}>Esta leitura considera as funções. Os estilos de jogo e a estratégia do time também influenciam a escolha.</Text>
      </View>
      {!!compositions[id] && <View style={{ gap: 8 }}>
        <Action label="Usar formação principal" secondary disabled={!agents.items}
          onPress={() => selectFormation(compositions[id].map(([name]) => name))} />
        <Action label="Usar formação alternativa" secondary disabled={!agents.items}
          onPress={() => selectFormation(alternatives[id].picks.map(([name]) => name))} />
      </View>}
      <TextInput accessibilityLabel="Buscar agente para a equipe" value={search} onChangeText={setSearch}
        placeholder="Buscar agente" placeholderTextColor={colors.muted} style={styles.input} autoCorrect={false} />
      {agents.error
        ? <Feedback message="Não foi possível carregar os agentes." retry={agents.retry} />
        : !agents.items
          ? <Feedback message="Carregando agentes…" busy />
          : <View style={local.agents}>
            {available?.map((agent) => {
              const picked = selected.includes(agent.uuid);
              const disabled = !picked && selected.length === 5;
              return (
                <Pressable key={agent.uuid} accessibilityRole="button" accessibilityState={{ selected: picked, disabled }}
                  accessibilityLabel={(picked ? 'Remover ' : 'Selecionar ') + agent.displayName} disabled={disabled}
                  onPress={() => toggle(agent.uuid)} style={[local.option, picked && local.picked, disabled && { opacity: 0.45 }]}>
                  <Image source={agent.displayIcon} style={local.optionIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>{agent.displayName}{preferences.favorites.includes(agent.uuid) ? ' ★' : ''}</Text>
                    <Text style={styles.muted}>{agent.role.displayName}</Text>
                  </View>
                  <Text style={styles.body}>{picked ? '✓' : '+'}</Text>
                </Pressable>
              );
            })}
            {!available?.length && <Text style={styles.muted}>Nenhum agente encontrado.</Text>}
          </View>}
    </Screen>
  );
}

const local = StyleSheet.create({
  slots: { flexDirection: 'row', gap: 5 },
  slot: { flex: 1, minHeight: 80, backgroundColor: colors.surface, borderRadius: 6, alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 8 },
  portrait: { width: 40, height: 40 },
  slotName: { color: colors.text, fontSize: 10, textAlign: 'center' },
  roleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  agents: { gap: 8 },
  option: { padding: 12, flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: colors.surface, borderRadius: 6 },
  picked: { borderLeftWidth: 3, borderLeftColor: colors.coral },
  optionIcon: { width: 42, height: 42 },
});

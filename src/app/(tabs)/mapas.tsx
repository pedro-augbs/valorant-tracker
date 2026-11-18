import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';
import { Feedback, Heading, Screen, styles } from '../../components/ui';
import { useApp } from '../../lib/app-state';
import { compositions } from '../../lib/compositions';
import { colors, fonts } from '../../lib/theme';

export default function Maps() {
  const { maps } = useApp();
  const list = maps.items?.filter((map) => map.uuid in compositions)
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  return (
    <Screen scroll={false}>
      <FlatList style={{ flex: 1 }} contentContainerStyle={styles.content}
        data={list ?? []} keyExtractor={(map) => map.uuid}
        ListHeaderComponent={<Heading brand>Mapas</Heading>}
        ListEmptyComponent={maps.error
          ? <Feedback message="Não foi possível carregar os mapas." retry={maps.retry} />
          : <Feedback message={maps.items ? 'Nenhum mapa disponível.' : 'Carregando mapas…'} busy={!maps.items} />}
        renderItem={({ item: map }) => (
          <Link href={{ pathname: '/mapa/[id]', params: { id: map.uuid } }} asChild>
            <Pressable accessibilityLabel={'Ver composição de ' + map.displayName} style={local.card}>
              <Image source={map.splash ?? map.listViewIcon} style={local.image} recyclingKey={map.uuid} />
              <Text style={local.name}>{map.displayName}</Text>
            </Pressable>
          </Link>
        )} />
    </Screen>
  );
}

const local = StyleSheet.create({
  card: { minHeight: 156, backgroundColor: colors.surface, overflow: 'hidden', justifyContent: 'flex-end', alignItems: 'flex-start', borderRadius: 6, borderBottomWidth: 3, borderBottomColor: colors.coral },
  image: { position: 'absolute', width: '100%', height: '100%' },
  name: { fontFamily: fonts.title, fontSize: 32, color: colors.text, backgroundColor: colors.background, textTransform: 'uppercase', paddingHorizontal: 12, margin: 12 },
});

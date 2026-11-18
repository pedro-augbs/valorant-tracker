import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../lib/theme';

const tabs = [
  ['agentes', 'Agentes', 'people-outline'],
  ['mapas', 'Mapas', 'map-outline'],
  ['perfil', 'Perfil', 'person-outline'],
  ['buscar', 'Buscar', 'search-outline'],
  ['favoritos', 'Favoritos', 'star-outline'],
] as const;

export default function TabLayout() {
  const { bottom } = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.coral,
      tabBarInactiveTintColor: colors.muted,
      tabBarHideOnKeyboard: true,
      tabBarLabelPosition: 'below-icon',
      tabBarItemStyle: { justifyContent: 'center', paddingVertical: 0 },
      tabBarStyle: {
        backgroundColor: colors.background,
        borderTopColor: colors.divider,
        height: 68 + bottom + Math.ceil(20 * Math.max(0, fontScale - 1)),
        paddingBottom: bottom + 4,
      },
    }}>
      {tabs.map(([name, title, icon]) => (
        <Tabs.Screen key={name} name={name} options={{
          title,
          tabBarAccessibilityLabel: title,
          tabBarLabel: ({ color }) => <Text style={[local.label, { color }]}>{title}</Text>,
          tabBarIcon: ({ focused, size }) => <Ionicons name={icon} color={focused ? colors.coral : colors.muted} size={size} />,
        }} />
      ))}
    </Tabs>
  );
}

const local = StyleSheet.create({
  label: { fontSize: 12, lineHeight: 20, textAlign: 'center' },
});

import type { PropsWithChildren } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../lib/theme';

export function Screen({ children, scroll = true, top = true }: PropsWithChildren<{ scroll?: boolean; top?: boolean }>) {
  return (
    <SafeAreaView style={styles.screen} edges={top ? ['top', 'left', 'right'] : ['bottom', 'left', 'right']}>
      {scroll
        ? <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">{children}</ScrollView>
        : children}
    </SafeAreaView>
  );
}

export function Heading({ children, brand = false }: PropsWithChildren<{ brand?: boolean }>) {
  return (
    <View style={styles.heading}>
      {brand && <Text style={styles.brand}>STATS VALO</Text>}
      <Text accessibilityRole="header" style={styles.title}>{children}</Text>
    </View>
  );
}

export function Action({ label, onPress, secondary = false, disabled = false }: {
  label: string; onPress: () => void; secondary?: boolean; disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, secondary && styles.secondary, (pressed || disabled) && styles.dimmed]}
    >
      <Text style={[styles.buttonLabel, secondary && styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
}

export function Feedback({ message, busy = false, retry }: { message: string; busy?: boolean; retry?: () => void }) {
  return (
    <View style={styles.feedback}>
      {busy && <ActivityIndicator color={colors.coral} />}
      <Text accessibilityLiveRegion="polite" style={styles.muted}>{message}</Text>
      {retry && <Action secondary label="Tentar novamente" onPress={retry} />}
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, width: '100%', maxWidth: 700, alignSelf: 'center', padding: 20, paddingBottom: 32, gap: 20 },
  heading: { gap: 3 },
  brand: { color: colors.coral, fontFamily: fonts.title, fontSize: 20, letterSpacing: 2 },
  title: { color: colors.text, fontFamily: fonts.title, fontSize: 46, textTransform: 'uppercase' },
  subtitle: { color: colors.text, fontFamily: fonts.title, fontSize: 28 },
  body: { color: colors.text, fontFamily: fonts.body, fontSize: 16, lineHeight: 24 },
  muted: { color: colors.muted, fontFamily: fonts.body, fontSize: 14, lineHeight: 21 },
  label: { color: colors.text, fontFamily: fonts.body, fontSize: 14, fontWeight: '600' },
  input: { minHeight: 54, color: colors.text, backgroundColor: colors.surface, borderColor: colors.divider, borderWidth: 1, borderRadius: 8, paddingHorizontal: 14, fontFamily: fonts.body, fontSize: 16 },
  button: { minHeight: 48, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6, backgroundColor: colors.coral },
  secondary: { borderColor: colors.divider, borderWidth: 1, backgroundColor: colors.surface },
  dimmed: { opacity: 0.65 },
  buttonLabel: { color: colors.background, fontFamily: fonts.body, fontSize: 15, fontWeight: '700', textAlign: 'center' },
  secondaryLabel: { color: colors.text },
  feedback: { padding: 18, gap: 14, alignItems: 'flex-start' },
  panel: { backgroundColor: colors.surface, padding: 16, borderRadius: 8, gap: 8 },
  error: { color: colors.coral, fontFamily: fonts.body, fontSize: 14, lineHeight: 21 },
});

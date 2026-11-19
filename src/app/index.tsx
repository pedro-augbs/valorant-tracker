import { Image } from 'expo-image';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RiotIdForm } from '../components/riot-id-form';
import { Action, Feedback, Screen, styles } from '../components/ui';
import { useApp } from '../lib/app-state';
import { colors, fonts } from '../lib/theme';

export default function Welcome() {
  const { ready, preferences, setRiotId, storageError, retryStorage } = useApp();
  const { height } = useWindowDimensions();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function enter(riotId: string | null) {
    setBusy(true);
    setError('');
    try {
      await setRiotId(riotId);
    } catch {
      setError('Não foi possível salvar suas preferências. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <Screen>{storageError
    ? <Feedback message="Não foi possível abrir suas preferências." retry={retryStorage} />
    : <Feedback message="Abrindo Stats Valo…" busy />}</Screen>;
  if (preferences.started) return <Redirect href="/agentes" />;

  return (
    <SafeAreaView style={welcome.screen}>
      <KeyboardAvoidingView style={welcome.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={welcome.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={[welcome.hero, { height: Math.min(390, Math.max(270, height * 0.46)) }]}>
            <View pointerEvents="none" style={welcome.diagonal} />
            <Image source={require('../../assets/images/jett.png')} style={welcome.portrait} contentFit="contain" accessible={false} />
            <View style={welcome.brand}>
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={welcome.mark} />
              <Text style={welcome.wordmark}>STATS VALO</Text>
            </View>
            <View style={welcome.headline}>
              <View style={welcome.slash} />
              <Text accessibilityRole="header" style={welcome.title}>{'SEU PRÓXIMO\nROUND COMEÇA\nAQUI.'}</Text>
            </View>
          </View>
          <View style={welcome.form}>
            <Text style={welcome.description}>Agentes, mapas e suas estatísticas em um só lugar.</Text>
            <RiotIdForm label={busy ? 'Entrando…' : 'FAZER LOGIN  →'} onSubmit={enter} disabled={busy}
              hint="Seu Riot ID fica salvo neste aparelho." />
            <Action label="ENTRAR SEM LOGIN" onPress={() => void enter(null)} secondary disabled={busy} />
            {!!error && <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text>}
          </View>
          <View style={welcome.links}>
            <Pressable accessibilityRole="link" onPress={() => router.push('/termos')} style={welcome.footerLink}>
              <Text style={welcome.linkText}>Termos de uso</Text>
            </Pressable>
            <Text style={welcome.linkText}>·</Text>
            <Pressable accessibilityRole="link" onPress={() => router.push('/privacidade')} style={welcome.footerLink}>
              <Text style={welcome.linkText}>Privacidade</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const welcome = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, width: '100%', maxWidth: 520, alignSelf: 'center' },
  hero: { overflow: 'hidden' },
  diagonal: { position: 'absolute', width: '52%', height: '140%', right: '-14%', top: '-10%', backgroundColor: colors.coral, transform: [{ skewX: '-32deg' }] },
  portrait: { position: 'absolute', width: '230%', height: '230%', left: '-44%', top: '-25%' },
  brand: { position: 'absolute', left: 24, top: 24, flexDirection: 'row', gap: 12, alignItems: 'center' },
  mark: { width: 8, height: 28, transform: [{ skewX: '-24deg' }], backgroundColor: colors.coral },
  wordmark: { color: colors.text, fontFamily: fonts.title, fontSize: 27, letterSpacing: 0.5 },
  headline: { position: 'absolute', left: 24, top: '36%', flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  slash: { width: 4, height: 44, marginTop: 4, backgroundColor: colors.coral, transform: [{ skewX: '-20deg' }] },
  title: { color: colors.text, fontFamily: fonts.title, fontSize: 42, lineHeight: 43, textShadowColor: colors.background, textShadowRadius: 8, textShadowOffset: { width: 0, height: 2 } },
  form: { paddingHorizontal: 24, paddingTop: 18, gap: 14 },
  description: { color: colors.muted, fontFamily: fonts.body, fontSize: 16, lineHeight: 23, marginBottom: 6 },
  links: { marginTop: 'auto', paddingTop: 18, paddingBottom: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  footerLink: { minHeight: 48, paddingHorizontal: 8, justifyContent: 'center' },
  linkText: { color: colors.muted, fontFamily: fonts.body, fontSize: 13 },
});

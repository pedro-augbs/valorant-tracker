import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../lib/app-state';
import { colors } from '../lib/theme';

export default function RootLayout() {
  const [loaded, error] = useFonts({
    BarlowCondensed: require('../../assets/fonts/BarlowCondensed-Bold.ttf'),
    Inter: require('../../assets/fonts/Inter.ttf'),
  });

  if (!loaded && !error) return null;
  return (
    <AppProvider>
      <Head><title>Stats Valo</title></Head>
      <StatusBar style="light" />
      <Stack screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="agente/[id]" options={{ title: 'Agente' }} />
        <Stack.Screen name="mapa/[id]" options={{ title: 'Composição recomendada' }} />
        <Stack.Screen name="partida/[id]" options={{ title: 'Detalhe da partida' }} />
        <Stack.Screen name="equipe/[id]" options={{ title: 'Montador de equipe' }} />
        <Stack.Screen name="sobre" options={{ title: 'Sobre' }} />
        <Stack.Screen name="termos" options={{ title: 'Termos de uso' }} />
        <Stack.Screen name="privacidade" options={{ title: 'Política de privacidade' }} />
      </Stack>
    </AppProvider>
  );
}

import { Text } from 'react-native';
import { Heading, Screen, styles } from '../components/ui';

export default function Terms() {
  return (
    <Screen top={false}>
      <Heading>Termos de uso</Heading>
      <Text style={styles.body}>O Stats Valo é um projeto acadêmico independente desenvolvido por Pedro Augusto e Yago Presot para uma demonstração fechada. Valorant e seus elementos pertencem à Riot Games.</Text>
      <Text style={styles.subtitle}>Consultas e recomendações</Text>
      <Text style={styles.body}>Use a busca para consultar contas autorizadas para a demonstração. As estatísticas dependem dos dados disponíveis na HenrikDev. As composições refletem escolhas editoriais para ajudar a planejar partidas.</Text>
    </Screen>
  );
}

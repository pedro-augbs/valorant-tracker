import { Text } from 'react-native';
import { Heading, Screen, styles } from '../components/ui';

export default function About() {
  return (
    <Screen top={false}>
      <Heading>Sobre</Heading>
      <Text style={styles.body}>O Stats Valo é um projeto acadêmico para explorar agentes e mapas, consultar composições recomendadas e acompanhar estatísticas de Valorant.</Text>
      <Text style={styles.subtitle}>Autores</Text>
      <Text style={styles.body}>Pedro Augusto e Yago Presot</Text>
      <Text style={styles.subtitle}>Fontes de dados</Text>
      <Text style={styles.body}>Valorant-API fornece os agentes, mapas e imagens. HenrikDev fornece nível, rank e partidas recentes das contas autorizadas.</Text>
    </Screen>
  );
}

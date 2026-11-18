import { Text } from 'react-native';
import { Heading, Screen, styles } from '../components/ui';

export default function Privacy() {
  return (
    <Screen top={false}>
      <Heading>Política de privacidade</Heading>
      <Text style={styles.subtitle}>Dados salvos no aparelho</Text>
      <Text style={styles.body}>O app salva o Riot ID informado na tela inicial ou no Perfil e os agentes marcados como favoritos. Você pode remover o Riot ID no Perfil e desmarcar agentes na aba Favoritos.</Text>
      <Text style={styles.subtitle}>Dados enviados em consultas</Text>
      <Text style={styles.body}>Ao consultar o Perfil ou buscar um jogador, o Riot ID é enviado ao servidor da demonstração e à HenrikDev para buscar nível, rank e partidas. O servidor limita as consultas aos Riot IDs autorizados para o trabalho. O app não solicita sua senha da Riot.</Text>
      <Text style={styles.subtitle}>Catálogo</Text>
      <Text style={styles.body}>Agentes, mapas e imagens são carregados da Valorant-API. Para solicitar a retirada de um Riot ID da lista de demonstração, fale com Pedro Augusto ou Yago Presot pelos canais da turma.</Text>
    </Screen>
  );
}

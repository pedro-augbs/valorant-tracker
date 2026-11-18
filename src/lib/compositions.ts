type Pick = [agent: string, contribution: string];

export const compositions: Record<string, Pick[]> = {
  // Ascent
  '7eaecc1b-4337-bbf6-6ab9-04b8f06b3319': [
    ['Jett', 'Avança pelo meio ou abre o bombsite com o impulso.'],
    ['Omen', 'Bloqueia a visão da Árvore no A e do Mercado no B.'],
    ['Sova', 'Revela quem segura o Fundo do B antes da entrada.'],
    ['KAY/O', 'Suprime utilitários defensivos e prepara a entrada com flash.'],
    ['Killjoy', 'Vigia o flanco e fecha as passagens estreitas do B.'],
  ],
  // Split
  'd960549e-485c-e861-8d71-aa9d1aed12a2': [
    ['Raze', 'Limpa os cantos da Rampa A e acelera a entrada com cargas.'],
    ['Omen', 'Corta a visão das Torres A e B.'],
    ['Breach', 'Atordoa pelas paredes da Garagem e da Rampa.'],
    ['Viper', 'Divide o meio e restringe a visão em entradas coordenadas.'],
    ['Cypher', 'Protege o flanco e observa os corredores com a câmera.'],
  ],
  // Fracture
  'b529448b-4d60-346e-e89e-00a4c527a405': [
    ['Neon', 'Acelera uma entrada quando o time pressiona pelos dois lados.'],
    ['Brimstone', 'Bloqueia vários ângulos de visão na entrada coordenada.'],
    ['Breach', 'Atordoa corredores longos e limpa posições através das paredes.'],
    ['Fade', 'Usa os rastreadores para limpar cantos antes da entrada.'],
    ['Killjoy', 'Protege a retaguarda numa investida pelos dois acessos.'],
  ],
  // Bind
  '2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba': [
    ['Raze', 'Limpa a Hookah e os cantos do Curto A.'],
    ['Brimstone', 'Isola a Torre A e os acessos defensivos do B.'],
    ['Skye', 'Confere Banheiros e Hookah com o rastreador.'],
    ['Viper', 'Separa linhas de visão do A com a cortina tóxica.'],
    ['Cypher', 'Vigia o Longo B e avisa o time sobre avanços pelo flanco.'],
  ],
  // Breeze
  '2fb9a4fd-47b8-4e7d-a969-74b4046ebd53': [
    ['Jett', 'Pressiona linhas longas e cruza áreas expostas com o impulso.'],
    ['Viper', 'Divide os bombsites amplos com a cortina tóxica.'],
    ['Sova', 'Sonda o espaço atrás das Pirâmides antes da entrada.'],
    ['KAY/O', 'Desativa armadilhas enquanto o time atravessa a cortina.'],
    ['Cypher', 'Controla o meio e cobre as rotações pelo flanco.'],
  ],
  // Abyss
  '224b0a95-48b9-f703-1bd8-67aca101a61f': [
    ['Jett', 'Cruza as passagens expostas perto das bordas com o impulso.'],
    ['Omen', 'Bloqueia os pontos altos que enxergam a entrada do bombsite.'],
    ['Sova', 'Usa o drone para checar as plataformas do outro lado.'],
    ['Breach', 'Pressiona quem se protege atrás das paredes nas passagens estreitas.'],
    ['Cypher', 'Monitora o meio enquanto o time executa em um bombsite.'],
  ],
  // Lotus
  '2fe4ed3a-450a-948b-6d6b-e89a78e680a9': [
    ['Raze', 'Disputa o Rubble no A e limpa os cantos de entrada no C.'],
    ['Omen', 'Cobre cruzamentos durante as rotações entre os três bombsites.'],
    ['Fade', 'Rastreia defensores perto das portas giratórias.'],
    ['Viper', 'Divide a defesa do A com a cortina e atrasa retomadas.'],
    ['Killjoy', 'Vigia acessos do flanco enquanto o time troca de bombsite.'],
  ],
  // Sunset
  '92584fbe-486a-b1b2-9faa-39b0f486b498': [
    ['Raze', 'Destrói utilitários e ganha espaço na entrada principal do B.'],
    ['Omen', 'Bloqueia a visão do Mercado durante o avanço pelo meio.'],
    ['Sova', 'Investiga as posições de trás do B com drone ou flecha.'],
    ['KAY/O', 'Suprime armadilhas nas entradas estreitas.'],
    ['Cypher', 'Monitora o meio e protege o B contra avanços pelo flanco.'],
  ],
  // Pearl
  'fd267378-4d1d-484f-ff52-77821ed10dc2': [
    ['Jett', 'Ganha espaço no Longo B sob cobertura do time.'],
    ['Astra', 'Coloca fumaças na Torre B e nos acessos do meio.'],
    ['Fade', 'Limpa cantos perto da Arte e dos corredores curtos.'],
    ['Viper', 'Divide a linha longa do B e cobre o plantio.'],
    ['Killjoy', 'Protege o pós-plantio ou segura a entrada do A.'],
  ],
  // Summit
  '756da597-416b-c0f2-f47b-afbdf28670bc': [
    ['Neon', 'Acelera a travessia quando uma parede muda a passagem.'],
    ['Omen', 'Reposiciona a cobertura visual conforme as paredes baixam.'],
    ['Sova', 'Reconhece posições expostas pela mudança de percurso.'],
    ['Breach', 'Atordoa corredores para sincronizar a entrada do time.'],
    ['Cypher', 'Monitora uma rota enquanto o restante do time pressiona outra.'],
  ],
  // Icebox
  'e2ad5c54-4114-a870-9641-8ea21279579a': [
    ['Jett', 'Ocupa os níveis altos do A e atravessa linhas expostas.'],
    ['Viper', 'Corta a visão do B ao longo dos contêineres.'],
    ['Sova', 'Verifica as plataformas do A com drone e flecha.'],
    ['Sage', 'Fecha ângulos com a barreira para proteger o plantio.'],
    ['Killjoy', 'Vigia o meio e apoia o pós-plantio com granadas.'],
  ],
  // Corrode
  '1c18ab1f-420d-0d8b-71d0-77ad3c439115': [
    ['Raze', 'Limpa os cantos antes de avançar pelos corredores do bombsite.'],
    ['Omen', 'Isola cruzamentos e encurta linhas de visão no meio.'],
    ['Sova', 'Revela posições de defesa antes de o time virar a esquina.'],
    ['Breach', 'Atordoa pelas paredes para apoiar disputas de espaço.'],
    ['Cypher', 'Observa as rotas alternativas com câmera e fios.'],
  ],
  // Haven
  '2bee0dc9-4ffe-519b-1cbd-7fbe763a6047': [
    ['Jett', 'Cria espaço no Longo C e força o recuo da primeira defesa.'],
    ['Omen', 'Tapa a Garagem ou o Céu A na hora da entrada.'],
    ['Sova', 'Sonda os fundos dos bombsites e o Longo C.'],
    ['Breach', 'Atordoa a Garagem e apoia entradas pelo Curto A.'],
    ['Killjoy', 'Segura um dos três bombsites e cobre as rotações do time.'],
  ],
};

export const alternatives: Record<string, { title: string; picks: Pick[] }> = {
  '7eaecc1b-4337-bbf6-6ab9-04b8f06b3319': {
    title: 'Pressão no meio',
    picks: [
      ['Phoenix', 'Usa o flash para disputar o meio de perto.'],
      ['Astra', 'Isola o Mercado e a Passarela.'],
      ['Fade', 'Limpa a Árvore com os rastreadores.'],
      ['Breach', 'Atordoa a defesa através da parede da Árvore.'],
      ['Cypher', 'Vigia o flanco enquanto o time avança pelo meio.'],
    ],
  },
  'd960549e-485c-e861-8d71-aa9d1aed12a2': {
    title: 'Entrada pela Rampa',
    picks: [
      ['Jett', 'Cria espaço na Rampa A com o impulso.'],
      ['Astra', 'Isola a Torre e a saída do elevador.'],
      ['Skye', 'Sonda o caminho para o bombsite A.'],
      ['KAY/O', 'Suprime as armadilhas antes da entrada.'],
      ['Sage', 'Fecha a passagem do meio para atrasar a rotação.'],
    ],
  },
  'b529448b-4d60-346e-e89e-00a4c527a405': {
    title: 'Pressão pelos flancos',
    picks: [
      ['Raze', 'Abre caminho pelos cantos estreitos da Torre B.'],
      ['Omen', 'Cobre a travessia entre as rotas do ataque.'],
      ['Breach', 'Sincroniza os avanços dos dois lados com atordoamento.'],
      ['KAY/O', 'Suprime armadilhas quando o time fecha o cerco.'],
      ['Cypher', 'Monitora o lado oposto enquanto a equipe avança.'],
    ],
  },
  '2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba': {
    title: 'Pressão pelos teleportadores',
    picks: [
      ['Yoru', 'Ameaça rotações com teleporte e clone.'],
      ['Omen', 'Tapa a visão da saída antes da travessia.'],
      ['Fade', 'Rastreia defensores perto da Hookah e dos Banheiros.'],
      ['Breach', 'Atordoa a defesa através das paredes estreitas.'],
      ['Killjoy', 'Segura a retaguarda quando o time muda de lado.'],
    ],
  },
  '2fb9a4fd-47b8-4e7d-a969-74b4046ebd53': {
    title: 'Cobertura dupla',
    picks: [
      ['Neon', 'Cruza os espaços amplos protegida pela cobertura do time.'],
      ['Viper', 'Divide a visão das Pirâmides com a cortina.'],
      ['Harbor', 'Adiciona cobertura para o plantio ou a retomada.'],
      ['Sova', 'Checa ângulos longos antes da travessia.'],
      ['Chamber', 'Segura uma linha longa com rota de fuga.'],
    ],
  },
  '224b0a95-48b9-f703-1bd8-67aca101a61f': {
    title: 'Entrada com cobertura dupla',
    picks: [
      ['Neon', 'Atravessa rapidamente o espaço aberto do bombsite.'],
      ['Astra', 'Bloqueia linhas elevadas e atrasa o avanço rival.'],
      ['Harbor', 'Protege a travessia e o plantio perto da borda.'],
      ['Fade', 'Checa os cantos da entrada com os rastreadores.'],
      ['Killjoy', 'Observa o flanco e protege o pós-plantio.'],
    ],
  },
  '2fe4ed3a-450a-948b-6d6b-e89a78e680a9': {
    title: 'Rotações entre os bombsites',
    picks: [
      ['Neon', 'Chega cedo às disputas e muda de lado com rapidez.'],
      ['Astra', 'Usa estrelas para apoiar os três bombsites de longe.'],
      ['Breach', 'Atordoa quem disputa as passagens junto às portas.'],
      ['Skye', 'Reconhece a próxima entrada antes da rotação.'],
      ['Cypher', 'Mantém visão da rota que o time deixou para trás.'],
    ],
  },
  '92584fbe-486a-b1b2-9faa-39b0f486b498': {
    title: 'Disputa pelo Mercado',
    picks: [
      ['Phoenix', 'Usa o flash de perto para disputar o meio.'],
      ['Astra', 'Separa a visão do Mercado e da parte superior do meio.'],
      ['Fade', 'Confere os cantos do Mercado com os rastreadores.'],
      ['Breach', 'Atordoa a defesa por trás das paredes na entrada do B.'],
      ['Killjoy', 'Fecha o flanco enquanto a equipe controla o meio.'],
    ],
  },
  'fd267378-4d1d-484f-ff52-77821ed10dc2': {
    title: 'Pressão pela Arte',
    picks: [
      ['Raze', 'Limpa cantos próximos na Arte e na entrada do A.'],
      ['Omen', 'Cobre o cruzamento entre o meio e a Arte.'],
      ['Skye', 'Envia o rastreador antes do avanço pelo corredor.'],
      ['KAY/O', 'Suprime a defesa quando o time converge no A.'],
      ['Cypher', 'Vigia a passagem que liga o meio ao B.'],
    ],
  },
  '756da597-416b-c0f2-f47b-afbdf28670bc': {
    title: 'Controle dos corredores',
    picks: [
      ['Raze', 'Limpa os cantos liberados pelas paredes móveis.'],
      ['Astra', 'Prepara a cobertura dos cruzamentos à distância.'],
      ['Fade', 'Investiga as rotas liberadas antes do avanço.'],
      ['KAY/O', 'Prepara o flash quando uma passagem se abre.'],
      ['Killjoy', 'Monitora a rota que ficou exposta após a mudança.'],
    ],
  },
  'e2ad5c54-4114-a870-9641-8ea21279579a': {
    title: 'Plantio protegido no B',
    picks: [
      ['Raze', 'Limpa os cantos junto aos contêineres.'],
      ['Viper', 'Corta a visão ao longo do B.'],
      ['Harbor', 'Protege o plantio com a cobertura de água.'],
      ['KAY/O', 'Desativa armadilhas antes da chegada ao bombsite.'],
      ['Sage', 'Fecha um ângulo durante a colocação da Spike.'],
    ],
  },
  '1c18ab1f-420d-0d8b-71d0-77ad3c439115': {
    title: 'Controle do meio',
    picks: [
      ['Jett', 'Cruza os ângulos do meio e força a defesa a recuar.'],
      ['Astra', 'Isola os cruzamentos para dividir a defesa.'],
      ['Fade', 'Investiga os cantos antes de o time cruzar.'],
      ['KAY/O', 'Suprime a defesa no momento do avanço.'],
      ['Killjoy', 'Avisa sobre flancos enquanto a equipe ocupa o meio.'],
    ],
  },
  '2bee0dc9-4ffe-519b-1cbd-7fbe763a6047': {
    title: 'Pressão pela Garagem',
    picks: [
      ['Neon', 'Acelera pela Garagem quando a defesa perde visão.'],
      ['Astra', 'Corta a visão do Longo C e apoia a entrada pelo B.'],
      ['Skye', 'Confere os cantos próximos antes de o time avançar.'],
      ['KAY/O', 'Desativa armadilhas nas passagens para C.'],
      ['Cypher', 'Vigia os flancos enquanto o time disputa a Garagem.'],
    ],
  },
};

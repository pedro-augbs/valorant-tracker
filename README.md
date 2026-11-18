# Stats Valo

Projeto acadêmico de Pedro Augusto e Yago Presot para consultar agentes, mapas e estatísticas de Valorant. A identidade visual está em [DESIGN.md](DESIGN.md).

## Rodar a demonstração

Use Node.js 22.18 ou superior.

1. Rode `npm ci`.
2. Copie `.env.example` para `.env.local`. Preencha `HENRIK_API_KEY` com a chave da HenrikDev e `STATS_VALO_ALLOWED_RIOT_IDS` com os Riot IDs das contas autorizadas, separados por vírgula. Em arquivos de ambiente, coloque a lista entre aspas para preservar o caractere `#`.
3. Rode `npm run web` para abrir no navegador ou `npm start` para iniciar o servidor Expo. Para demonstrar no aparelho, use um cliente compatível com o Expo SDK 58 e mantenha o servidor acessível ao aparelho.

Agentes, mapas e favoritos funcionam sem configuração da HenrikDev. A rota de estatísticas usa a chave somente no servidor. Reinicie o servidor depois de mudar as variáveis. Um aplicativo nativo distribuído separadamente precisa do servidor implantado e da origem configurada no Expo Router.

## Verificar

Rode `npm test`, `npm run lint` e `npx tsc --noEmit`.

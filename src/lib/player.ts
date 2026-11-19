export function parseRiotId(value: string) {
  const parts = value.split('#').map((part) => part.trim());
  if (parts.length !== 2 || parts.some((part) => !part || part.length > 64 || /[\u0000-\u001f\u007f]/.test(part))) {
    return null;
  }
  return { name: parts[0], tag: parts[1] };
}

export type Match = {
  id: string;
  map: string;
  mapId?: string;
  agent: string;
  agentId?: string;
  kills: number;
  deaths: number;
  assists: number;
  outcome: 'Vitória' | 'Derrota' | 'Empate' | '—';
  startedAt?: string;
  durationSeconds?: number | null;
  roundsWon?: number | null;
  roundsLost?: number | null;
  headshots?: number | null;
  shots?: number | null;
  damage?: number | null;
  score?: number | null;
  participants?: {
    agent: string;
    agentId: string;
    ally: boolean;
    self: boolean;
    kills: number;
    deaths: number;
    assists: number;
    score: number | null;
  }[];
};

export type Player = {
  riotId: string;
  level: number;
  rank: string | null;
  rr: number | null;
  matches: Match[] | null;
};

export function formatKd(matches: Pick<Match, 'kills' | 'deaths'>[]) {
  const totals = matches.reduce((sum, match) => ({
    kills: sum.kills + match.kills,
    deaths: sum.deaths + match.deaths,
  }), { kills: 0, deaths: 0 });
  if (!totals.deaths) return totals.kills ? '∞' : '—';
  return (totals.kills / totals.deaths).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function summarizeMatches(matches: Match[]) {
  const wins = matches.filter((match) => match.outcome === 'Vitória').length;
  const losses = matches.filter((match) => match.outcome === 'Derrota').length;
  const draws = matches.filter((match) => match.outcome === 'Empate').length;
  const knownResults = wins + losses + draws;
  const impacts = matches.filter((match) => match.headshots != null && match.shots != null);
  const shots = impacts.reduce((sum, match) => sum + (match.shots ?? 0), 0);
  const headshots = impacts.reduce((sum, match) => sum + (match.headshots ?? 0), 0);
  return {
    wins, losses, draws,
    winRate: knownResults ? Math.round(wins / knownResults * 100) : null,
    kd: formatKd(matches),
    headshotRate: shots ? Math.round(headshots / shots * 100) : null,
  };
}

export function getImprovementSuggestions(matches: Match[]) {
  if (!matches.length) return [];
  const totals = matches.reduce((sum, match) => ({
    kills: sum.kills + match.kills,
    deaths: sum.deaths + match.deaths,
  }), { kills: 0, deaths: 0 });
  const summary = summarizeMatches(matches);
  const suggestions = [{
    title: totals.deaths > totals.kills ? 'Prepare melhor os confrontos' : 'Mantenha as trocas em dupla',
    observation: totals.kills + ' abates e ' + totals.deaths + ' mortes neste mapa.',
    action: totals.deaths > totals.kills
      ? 'Na próxima partida, combine uma entrada com um aliado. Espere o utilitário e avance perto o bastante para que um possa trocar a eliminação do outro.'
      : 'Experimente repetir as entradas que funcionaram, avançando com um aliado e preservando a vantagem numérica depois da primeira eliminação.',
  }];
  if (summary.losses) suggestions.push({
    title: 'Revise uma derrota',
    observation: summary.losses + (summary.losses === 1 ? ' derrota no recorte.' : ' derrotas no recorte.'),
    action: 'Abra uma partida perdida e escolha um ajuste de entrada coordenada, rotação ou posicionamento após o plantio. Use o placar como ponto de partida e leve em conta o que aconteceu nos rounds.',
  });
  if (summary.headshotRate !== null) suggestions.push({
    title: 'Aqueça a precisão',
    observation: summary.headshotRate + '% dos impactos registrados acertaram a cabeça.',
    action: 'Antes da próxima partida, pratique parar antes de disparar e manter a mira na altura da cabeça. Compare suas próximas sessões usando o mesmo agente e tipo de arma.',
  });
  return suggestions;
}

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

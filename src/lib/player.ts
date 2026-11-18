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

import { parseRiotId, type Match, type Player } from '../../lib/player';

type Account = { puuid: string; region: string; name: string; tag: string; account_level: number };
type Rank = { current?: { tier: { id: number; name: string }; rr: number } };
type HenrikMatch = {
  metadata: { match_id: string; map: { id: string; name: string }; started_at: string; is_completed: boolean };
  players: { puuid: string; agent: { id: string; name: string }; team_id: string; stats: Pick<Match, 'kills' | 'deaths' | 'assists'> }[];
  teams: { team_id: string; won: boolean; rounds: { won: number; lost: number } }[];
};

function reply(body: Player | { message: string }, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

async function henrik<T>(path: string, key: string) {
  const response = await fetch('https://api.henrikdev.xyz/valorant/' + path, {
    headers: { Authorization: key },
    signal: AbortSignal.timeout(12000),
  });
  const body = await response.json() as { data?: T; errors?: { code: number }[] };
  return { status: response.status, ok: response.ok, data: response.ok ? body.data : undefined, code: body.errors?.[0]?.code };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const id = typeof body?.riotId === 'string' ? parseRiotId(body.riotId) : null;
  if (!id) return reply({ message: 'Digite o Riot ID no formato nome#tag.' }, 400);

  const key = process.env.HENRIK_API_KEY;
  const configuredIds: string = process.env.STATS_VALO_ALLOWED_RIOT_IDS ?? '';
  const allowed = configuredIds.split(',').map((value) => value.trim().toLowerCase()).filter(Boolean);
  if (!key || !allowed.length) return reply({ message: 'A consulta de estatísticas ainda não foi configurada para esta demonstração.' }, 503);
  if (!allowed.includes((id.name + '#' + id.tag).toLowerCase())) {
    return reply({ message: 'Este Riot ID não está autorizado para a demonstração.' }, 403);
  }

  try {
    const account = await henrik<Account>('v2/account/' + encodeURIComponent(id.name) + '/' + encodeURIComponent(id.tag), key);
    if (!account.data) {
      if (account.code === 22) return reply({ message: 'Jogador não encontrado. Confira o Riot ID.' }, 404);
      if (account.status === 429) return reply({ message: 'Limite de consultas atingido. Tente novamente em instantes.' }, 429);
      return reply({ message: 'Não foi possível consultar o jogador agora.' }, 502);
    }

    const player = account.data;
    const path = encodeURIComponent(player.region) + '/pc/' + encodeURIComponent(player.puuid);
    const [rank, history] = await Promise.allSettled([
      henrik<Rank>('v3/by-puuid/mmr/' + path, key),
      henrik<HenrikMatch[]>('v4/by-puuid/matches/' + path + '?mode=competitive&size=5', key),
    ]);
    const current = rank.status === 'fulfilled' ? rank.value.data?.current : undefined;
    const recent = history.status === 'fulfilled' && Array.isArray(history.value.data) ? history.value.data : null;
    const matches = recent?.filter((match) => match.metadata.is_completed)
      .sort((a, b) => Date.parse(b.metadata.started_at) - Date.parse(a.metadata.started_at))
      .flatMap((match): Match[] => {
        const entry = match.players.find((item) => item.puuid === player.puuid);
        if (!entry) return [];
        const team = match.teams.find((item) => item.team_id === entry.team_id);
        const { kills, deaths, assists } = entry.stats;
        if (![kills, deaths, assists].every((value) => Number.isInteger(value) && value >= 0)) return [];
        return [{
          id: match.metadata.match_id,
          map: match.metadata.map.name,
          mapId: match.metadata.map.id,
          agent: entry.agent.name,
          agentId: entry.agent.id,
          kills, deaths, assists,
          outcome: !team ? '—' : team.rounds.won === team.rounds.lost ? 'Empate' : team.won ? 'Vitória' : 'Derrota',
        }];
      }).slice(0, 5) ?? null;

    return reply({
      riotId: player.name + '#' + player.tag,
      level: player.account_level,
      rank: current?.tier?.id ? current.tier.name : null,
      rr: current?.tier?.id ? current.rr : null,
      matches,
    });
  } catch {
    return reply({ message: 'Não foi possível consultar as estatísticas. Tente novamente.' }, 502);
  }
}

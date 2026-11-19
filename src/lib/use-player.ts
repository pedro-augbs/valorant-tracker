import { useEffect, useState } from 'react';
import type { Player } from './player';

const cache = new Map<string, { player: Player; expiresAt: number }>();

export function usePlayer(riotId: string) {
  const [player, setPlayer] = useState<Player>();
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const key = riotId.toLowerCase();
    async function load() {
      const saved = cache.get(key);
      if (saved && saved.expiresAt > Date.now()) {
        setPlayer(saved.player);
        return;
      }
      try {
        const response = await fetch('/api/jogador', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ riotId }),
          signal: controller.signal,
        });
        const result = await response.json();
        if (controller.signal.aborted) return;
        if (response.ok && typeof result.riotId === 'string' && (result.matches === null || Array.isArray(result.matches))) {
          cache.set(key, { player: result, expiresAt: Date.now() + 60000 });
          setPlayer(result);
        } else {
          setError(typeof result.message === 'string' ? result.message : 'A consulta está indisponível.');
        }
      } catch {
        if (!controller.signal.aborted) setError('Não foi possível carregar as estatísticas. Verifique a conexão e tente novamente.');
      }
    }
    void load();
    return () => controller.abort();
  }, [riotId, attempt]);

  function retry() {
    cache.delete(riotId.toLowerCase());
    setError('');
    setPlayer(undefined);
    setAttempt((previous) => previous + 1);
  }

  return { player, error, retry };
}

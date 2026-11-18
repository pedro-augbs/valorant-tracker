import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { getCatalog, type Agent, type GameMap } from './catalog';

type Preferences = { riotId: string | null; started: boolean; favorites: string[] };
const empty: Preferences = { riotId: null, started: false, favorites: [] };
const key = '@stats-valo/preferences';

function useCatalog<T>(resource: string) {
  const [items, setItems] = useState<T[]>();
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getCatalog<T>(resource, controller.signal).then(
      (result) => { if (!controller.signal.aborted) setItems(result); },
      () => { if (!controller.signal.aborted) setError(true); },
    );
    return () => controller.abort();
  }, [attempt, resource]);

  return {
    items,
    error,
    retry: () => {
      setError(false);
      setAttempt((current) => current + 1);
    },
  };
}

function useAppState() {
  const [preferences, setPreferences] = useState(empty);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const saved = useRef(empty);
  const writes = useRef(Promise.resolve());
  const agents = useCatalog<Agent>('agents?language=pt-BR&isPlayableCharacter=true');
  const maps = useCatalog<GameMap>('maps?language=pt-BR');

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(key).then((value) => {
      if (!active) return;
      if (value) {
        const data = JSON.parse(value) as Partial<Preferences>;
        saved.current = {
          riotId: typeof data.riotId === 'string' ? data.riotId : null,
          started: data.started === true,
          favorites: Array.isArray(data.favorites) ? data.favorites.filter((id) => typeof id === 'string') : [],
        };
      }
      setPreferences(saved.current);
      setReady(true);
    }).catch(() => { if (active) setStorageError(true); });
    return () => { active = false; };
  }, [loadAttempt]);

  function save(change: (previous: Preferences) => Preferences) {
    const write = writes.current.then(async () => {
      const next = change(saved.current);
      await AsyncStorage.setItem(key, JSON.stringify(next));
      saved.current = next;
      setPreferences(next);
    });
    writes.current = write.catch(() => {});
    return write;
  }

  return {
    preferences, ready, storageError, agents, maps,
    retryStorage: () => { setStorageError(false); setLoadAttempt((previous) => previous + 1); },
    setRiotId: (riotId: string | null) => save((previous) => ({ ...previous, started: true, riotId })),
    toggleFavorite: (id: string) => save((previous) => ({
      ...previous,
      favorites: previous.favorites.includes(id)
        ? previous.favorites.filter((favorite) => favorite !== id)
        : [...previous.favorites, id],
    })),
  };
}

const AppContext = createContext<ReturnType<typeof useAppState> | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const value = useAppState();
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const state = useContext(AppContext);
  if (!state) throw new Error('AppProvider ausente.');
  return state;
}

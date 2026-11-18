export type Agent = {
  uuid: string;
  displayName: string;
  description: string;
  displayIcon: string;
  bustPortrait: string | null;
  role: { displayName: string; description: string; displayIcon: string };
  abilities: { slot: string; displayName: string; description: string; displayIcon: string | null }[];
};

export type GameMap = {
  uuid: string;
  displayName: string;
  splash: string | null;
  listViewIcon: string | null;
};

export function plainCatalogText(text: string) {
  return text.replace(/<\/?[a-z][a-z\d]*>|<\/>/gi, '');
}

export async function getCatalog<T>(resource: string, signal: AbortSignal): Promise<T[]> {
  const response = await fetch('https://valorant-api.com/v1/' + resource, { signal });
  if (!response.ok) throw new Error('Não foi possível carregar o catálogo.');
  const { data } = await response.json();
  if (!Array.isArray(data)) throw new Error('O catálogo retornou dados inválidos.');
  return data;
}

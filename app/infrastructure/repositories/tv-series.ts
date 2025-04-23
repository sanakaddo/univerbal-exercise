import { TvSeries } from 'domain/tv-series';

import { createAPIUrl } from '@/utils';

const apiUrl = createAPIUrl();

export async function findTvSeriesMatchingQuery(
  params: Partial<TvSeries>,
  signal?: AbortSignal,
): Promise<TvSeries[]> {
  const url = new URL('/tv-series', apiUrl);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value.toString());
  }

  const request = await fetch(url.toString(), signal ? { signal } : undefined);
  if (!request.ok) return [];

  return await request.json();
}

export async function getTvSeriesByIdQuery(
  signal: AbortSignal,
  id: TvSeries['id'],
): Promise<TvSeries | undefined> {
  const url = new URL(`/tv-series/${id}`, apiUrl);

  const request = await fetch(url.toString(), { signal });
  if (!request.ok) return;

  return await request.json();
}

export async function getFeaturedTvSeriesQuery(
  signal: AbortSignal,
): Promise<TvSeries[]> {
  const url = new URL('/tv-series/recommended', apiUrl);

  const request = await fetch(url.toString(), { signal });
  if (!request.ok) return [];

  return await request.json();
}

export async function getTopRatedTvSeriesQuery(): Promise<TvSeries[]> {
  try {
    const url = new URL('/tv-series', apiUrl);
    const request = await fetch(url.toString());
    if (!request.ok) return [];

    const json = (await request.json()) as TvSeries[];

    // top rated has to have a rating above 60
    return json.filter((it) => it.rating > 60);
  } catch (err) {
    console.error('[getTopRatedTvSeriesQuery] error:', err);
    return [];
  }
}

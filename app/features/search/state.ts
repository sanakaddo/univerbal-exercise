import { atom } from 'jotai';
import { findMoviesMatchingQuery } from '@/infrastructure/repositories/movie';
import { findTvSeriesMatchingQuery } from '@/infrastructure/repositories/tv-series';

export const inputValue$ = atom<string | undefined>();

export type Suggestion = {
  title: string;
  id: string;
  type: 'movie' | 'tv-series';
};

export const suggestions$ = atom(async (get, { signal }) => {
  const title = get(inputValue$);
  if (!title) return [];

  const query = { title };

  try {
    // Parallelise the requests
    const [movies, tvSeries] = await Promise.all([
      findMoviesMatchingQuery(query, signal),
      findTvSeriesMatchingQuery(query, signal),
    ]);

    return [
      ...movies.map((item) => ({
        id: item.id,
        title: item.title,
        type: 'movie' as const,
      })),
      ...tvSeries.map((item) => ({
        id: item.id,
        title: item.title,
        type: 'tv-series' as const,
      })),
    ];
  } catch (err) {
    console.error('[suggestions$] fetch error:', err);
    return [];
  }
});

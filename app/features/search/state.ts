import { atom } from 'jotai';
import { findMoviesMatchingQuery } from '@/infrastructure/repositories/movie';
import { findTvSeriesMatchingQuery } from '@/infrastructure/repositories/tv-series';

export const inputValue$ = atom<string | undefined>();

type Suggestion = { title: string; id: string };

export const suggestions$ = atom(async (get, { signal }) => {
  const title = get(inputValue$);
  if (!title) return [];

  const query = { title };

  try {
    // Parallelise the requests  
    const [movies, tvSeries] = await Promise.all([
      findMoviesMatchingQuery( query, signal),
      findTvSeriesMatchingQuery( query, signal),
    ]);

    return [...movies, ...tvSeries]
      .map((item) => ({ id: item.id, title: item.title })) satisfies Suggestion[];
  } catch (err) {
    console.error('[suggestions$] fetch error:', err);
    return [];
  }
});

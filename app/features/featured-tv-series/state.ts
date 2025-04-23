import { TvSeries } from 'domain/tv-series';

import { atom } from 'jotai';

import { getFeaturedTvSeriesQuery } from '@/infrastructure/repositories/tv-series';

export const featuredTvSeries$ = atom(
  async (_, { signal }): Promise<TvSeries[]> => {
    const response = await getFeaturedTvSeriesQuery();
    return response;
  },
);

import { TvSeries } from 'domain/tv-series';

import { useAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { useEffect, useState, type ReactNode } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';

import { topRatedMovies$ } from './state';

import { getTopRatedTvSeriesQuery } from '@/infrastructure/repositories/tv-series';
import { List } from '@/ui/list';
import { Loader } from '@/ui/loader';

// Displays movies with rating above 75%
export default function TopRatedScreen(): ReactNode {
  const [topRatedMoviesLoadable] = useAtom(loadable(topRatedMovies$));

  const [tvSeres, set] = useState<TvSeries[]>([]);

  // fetches data for tv series
  useEffect(() => {
    getTopRatedTvSeriesQuery().then((res) => {
      set(res as TvSeries[]);
    });
  }, []);

  if (topRatedMoviesLoadable.state === 'loading') {
    return <Loader />;
  }

  // error
  if (topRatedMoviesLoadable.state === 'hasError') {
    return <Text>{JSON.stringify(topRatedMoviesLoadable.error)}</Text>;
  }

  if (topRatedMoviesLoadable.state === 'hasData') {
    return (
      <ScrollView style={styles.root}>
        {/* movies */}
        <Text style={styles.title}>Top rated movies</Text>
        <List data={topRatedMoviesLoadable.data} style={{ marginBottom: 40 }} />

        {/* tv series */}
        <Text style={styles.title}>Top rated tv series</Text>
        <List data={tvSeres} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    padding: 16,
    flexGrow: 1, 
  },

  section: {
    marginBottom: 32, 
  },

  title: {
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333', 
  },

  list: {
    marginBottom: 40, 
  },

  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

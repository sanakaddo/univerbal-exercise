import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Poster } from '@/ui/poster';
import {
  getMovieByIdQuery,
  getMoviePosterUrlById,
} from '@/infrastructure/repositories/movie';
import { Movie } from 'domain/movie';

type MovieScreenProps = {
  route: { params: { id: string } };
};

export default function MovieScreen({ route }: MovieScreenProps) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const movieData = await getMovieByIdQuery(
          controller.signal,
          route.params.id,
        );
        const poster = await getMoviePosterUrlById(route.params.id);
        setMovie(movieData ?? null);
        setPosterUrl(poster ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [route.params.id]);

  if (loading)
    return <ActivityIndicator size="large" style={styles.centered} />;
  if (!movie) return <Text style={styles.centered}>Movie not found</Text>;

  return (
    <View style={styles.container}>
      {posterUrl && (
        <Poster
          title={movie.title}
          src={posterUrl}
          isFavorite={false}
          onFavoritePress={() => {}}
        />
      )}
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.info}>Directed by: {movie.director}</Text>
      <Text style={styles.info}>Release Year: {movie.releaseYear}</Text>
      <Text style={styles.info}>Rating: {movie.rating}/100</Text>
      {movie.runtimeMinutes && (
        <Text style={styles.info}>Runtime: {movie.runtimeMinutes} mins</Text>
      )}
      <Text style={styles.info}>
        Genres: {movie.genres.length > 0 ? movie.genres.join(', ') : 'N/A'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 8,
  },
  info: {
    fontSize: 16,
    marginVertical: 2,
  },
});

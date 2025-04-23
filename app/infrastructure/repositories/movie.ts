import { Movie } from 'domain/movie';

import { createAPIUrl } from '@/utils';


const apiUrl = createAPIUrl();

export async function findMoviesMatchingQuery(
  params: Partial<Movie>,
  signal: AbortSignal,
): Promise<Movie[]> {
  const url = new URL('/movies', apiUrl);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value.toString());
  }

  const request = await fetch(url, { signal });
  if (!request.ok) return [];

  const json = (await request.json()) as Movie[];
  return json;
}

export async function getMovieByIdQuery(
  signal: AbortSignal,
  movieId: Movie['id'],
): Promise<Movie | undefined> {
  const url = new URL(`/movies/${movieId}`, apiUrl);

  const request = await fetch(url, { signal });
  if (!request.ok) return;

  return (await request.json()) as Movie;
}


export async function getFeaturedMoviesQuery(
  signal: AbortSignal,
): Promise<Movie[]> {
  const url = new URL('/movies/recommended', apiUrl);

  const request = await fetch(url.toString(), { signal });
  if (!request.ok) return [];

  return await request.json();
}

export async function getTopRatedMoviesQuery(): Promise<Movie[]> {
  // TODO: implement on backend side
  try {
    const url = new URL('/movies', apiUrl);
    const request = await fetch(url);
    if (!request.ok) return [];

    const json = (await request.json()) as Movie[];

    // top rated has to have a rating above 75%
    return json.filter((it) => it.rating >= 75 && it.rating <= 100);
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function getMoviePosterUrlById(movieId: string): Promise<string | undefined> {
  try {
    const url = new URL(`/movies/${movieId}/poster`, apiUrl);
    const res = await fetch(url.toString());
    if (!res.ok) return;
    const json = await res.json();
    return json.url; // e.g., "/movies/123/poster/img/poster.jpg"
  } catch (err) {
    console.error('[getMoviePosterUrlById] error:', err);
    return;
  }
}
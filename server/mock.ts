import { Movie } from 'domain/movie';
import { User } from 'domain/user';
import { Opaque } from 'domain/utils';

import express from 'express';

import { corsConfig } from './cors';
import moviesData from './data/movies.json';
import tvSeriesData from './data/tv-series.json';
import usersData from './data/users.json';

const sleep = async (ms: number) =>
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const app = express();

app.use(corsConfig);

const port = 3003;

app.get('/movies', (req, res) => {
  const movies: Movie[] = moviesData.movies.map((movie) => ({
    ...movie,
    id: movie.id as Opaque<'movie-id'>,
  }));

  let results = movies;
  const { title, releaseYear, genres, rating } = req.query;

  if (title && typeof title === 'string') {
    const lower = title.toLowerCase();
    results = results.filter((movie) =>
      movie.title.toLowerCase().includes(lower),
    );
  }

  if (releaseYear && !isNaN(Number(releaseYear))) {
    results = results.filter(
      (movie) => movie.releaseYear === Number(releaseYear),
    );
  }

  if (genres && typeof genres === 'string') {
    const genreList = genres.split(',').map((g) => g.trim().toLowerCase());
    results = results.filter((movie) =>
      movie.genres.some((g) => genreList.includes(g.toLowerCase())),
    );
  }

  if (rating && !isNaN(Number(rating))) {
    results = results.filter((movie) => movie.rating >= Number(rating));
  }

  res.json(results);
});

app.get('/movies/:movieId', (req, res) => {
  res.json(moviesData.movies.find((it) => it.id === req.params.movieId));
});

app.get('/tv-series/:movieId/poster', (req, res) => {
  res.json({ url: req.url + '/img/poster.jpg' });
});

app.get('/movies/:movieId/poster', (req, res) => {
  res.json({ url: req.url + '/img/poster.jpg' });
});

app.get('/movies/recommended', async (req, res) => {
  const timeoutMs = Math.max(1, Math.random() * 3) * 1000;
  await sleep(timeoutMs);

  res.json(moviesData.movies.slice(0, 5));
});

app.get('/tv-series', (req, res) => {
  let results = tvSeriesData.tvSeries;

  const { title, releaseYear, genres, rating } = req.query;

  if (title && typeof title === 'string') {
    const lower = title.toLowerCase();
    results = results.filter((series) =>
      series.title.toLowerCase().includes(lower),
    );
  }

  if (releaseYear && !isNaN(Number(releaseYear))) {
    results = results.filter(
      (series) => series.releaseYear === Number(releaseYear),
    );
  }

  if (genres && typeof genres === 'string') {
    const genreList = genres.split(',').map((g) => g.trim().toLowerCase());
    results = results.filter((series) =>
      series.genres.some((g) => genreList.includes(g.toLowerCase())),
    );
  }

  if (rating && !isNaN(Number(rating))) {
    results = results.filter((series) => series.rating >= Number(rating));
  }

  res.json(results);
});

app.get('/tv-series/recommended', async (req, res) => {
  const timeoutMs = Math.max(2, Math.random() * 5) * 1000;
  await sleep(timeoutMs);

  res.json(tvSeriesData.tvSeries.slice(0, 5));
});

app.get('/tv-series/:seriesId', (req, res) => {
  res.json(tvSeriesData.tvSeries.find((it) => it.id === req.params.seriesId));
});

app.get('/tv-series/:seriesId/poster', (req, res) => {
  res.json({ url: req.url + '/img/poster.jpg' });
});

let user: User | undefined;

app.get('/users/:userId', (req, res) => {
  res.json(usersData.filter((it) => it.id === req.params.userId));
});

app.post('/users/:userId/favorite-movies', (req, res) => {
  user ??= usersData.filter(
    (it) => it.id === req.params.userId,
  )[0] as unknown as User;

  const body = JSON.parse(req.body);

  user.favoriteMovies.push(body);

  res.status(200);
});

app.delete('/users/:userId/favorite-movies', (req, res) => {
  user ??= usersData.filter(
    (it) => it.id === req.params.userId,
  )[0] as unknown as User;

  const body = JSON.parse(req.body);

  user.favoriteMovies = user?.favoriteMovies.filter((it) => it.id !== body.id);

  res.status(200);
});

app.listen(port, () => {
  console.info(`[server]: Server is running at http://localhost:${port}`);
});

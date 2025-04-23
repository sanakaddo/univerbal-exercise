import request from 'supertest';
import express from 'express';
import * as mock from '../mock';

describe('API Server', () => {
  let app: express.Express;

  beforeAll(() => {
    app = mock;
  });

  describe('GET /movies', () => {
    it('should return all movies', async () => {
      const res = await request(app).get('/movies');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should filter movies by title', async () => {
      const res = await request(app).get('/movies').query({ title: 'matrix' });
      expect(res.statusCode).toBe(200);
      expect(res.body.every((m: any) => m.title.toLowerCase().includes('matrix'))).toBe(true);
    });
  });

  describe('GET /movies/:movieId', () => {
    it('should return a specific movie by ID', async () => {
      const res = await request(app).get('/movies/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', '1');
    });
  });

  describe('POST /users/:userId/favorite-movies', () => {
    it('should add a movie to user\'s favorites', async () => {
      const movie = { id: '1', title: 'Matrix' };
      const res = await request(app)
        .post('/users/1/favorite-movies')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(movie));

      expect(res.statusCode).toBe(200);
    });
  });

  describe('DELETE /users/:userId/favorite-movies', () => {
    it('should remove a movie from user\'s favorites', async () => {
      const movie = { id: '1' };
      const res = await request(app)
        .delete('/users/1/favorite-movies')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(movie));

      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /users/:userId', () => {
    it('should return the user data', async () => {
      const res = await request(app).get('/users/1');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('id', '1');
    });
  });
});

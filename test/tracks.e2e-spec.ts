import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Tracks, Albums, Artists, Playlists (e2e)', () => {
  let app: INestApplication<App>;
  let tokenA: string;
  let tokenB: string;
  let artistId: number;
  let albumId: number;
  let trackId: number;
  let playlistAId: number;
  let playlistBId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // 1. Create User A & User B
    const userA = { userId: 101, username: 'usera', password: 'passworda' };
    const userB = { userId: 102, username: 'userb', password: 'passwordb' };

    const regA = await request(app.getHttpServer()).post('/users').send(userA);
    console.log('Registration A status:', regA.status, 'body:', regA.body);
    const regB = await request(app.getHttpServer()).post('/users').send(userB);
    console.log('Registration B status:', regB.status, 'body:', regB.body);

    // 2. Login to get JWT tokens
    const resA = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: userA.username, password: userA.password });
    console.log('Login A status:', resA.status, 'body:', resA.body);
    tokenA = resA.body.token;

    const resB = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: userB.username, password: userB.password });
    console.log('Login B status:', resB.status, 'body:', resB.body);
    tokenB = resB.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Artists CRUD', () => {
    it('should create an artist', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/artists')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ name: 'Daft Punk' })
        .expect(201);

      expect(res.body.name).toBe('Daft Punk');
      expect(res.body.id).toBeDefined();
      artistId = res.body.id;
    });

    it('should list artists', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/artists')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should update artist details', async () => {
      await request(app.getHttpServer())
        .patch(`/api/artists/${artistId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ name: 'Daft Punk Updated' })
        .expect(200);

      const res = await request(app.getHttpServer())
        .get(`/api/artists/${artistId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(res.body.name).toBe('Daft Punk Updated');
    });
  });

  describe('Albums CRUD', () => {
    it('should create an album associated with the artist', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/albums')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ name: 'Discovery', artistId })
        .expect(201);

      expect(res.body.name).toBe('Discovery');
      expect(res.body.artist.id).toBe(artistId);
      albumId = res.body.id;
    });

    it('should list albums', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/albums')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should update album details', async () => {
      await request(app.getHttpServer())
        .patch(`/api/albums/${albumId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ name: 'Discovery Gold Edition' })
        .expect(200);

      const res = await request(app.getHttpServer())
        .get(`/api/albums/${albumId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(res.body.name).toBe('Discovery Gold Edition');
    });
  });

  describe('Tracks CRUD and File Upload', () => {
    it('should create a track manually', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/tracks')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ title: 'One More Time', artistId, albumId })
        .expect(201);

      expect(res.body.title).toBe('One More Time');
      expect(res.body.artist.id).toBe(artistId);
      expect(res.body.album.id).toBe(albumId);
      trackId = res.body.id;
    });

    it('should list tracks with filters', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/tracks')
        .set('Authorization', `Bearer ${tokenA}`)
        .query({ title: 'One More' })
        .expect(200);

      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe('One More Time');
    });

    it('should upload a music file and save it (fallback metadata)', async () => {
      const dummyBuffer = Buffer.from('dummy mp3 file contents');
      const res = await request(app.getHttpServer())
        .post('/api/tracks')
        .set('Authorization', `Bearer ${tokenA}`)
        .attach('file', dummyBuffer, 'harder_better_faster_stronger.mp3')
        .expect(201);

      expect(res.body.title).toBe('harder_better_faster_stronger.mp3');
      expect(res.body.filePath).toBeDefined();
    });

    it('should update track metadata', async () => {
      await request(app.getHttpServer())
        .patch(`/api/tracks/${trackId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ title: 'One More Time (Radio Edit)' })
        .expect(200);

      const res = await request(app.getHttpServer())
        .get(`/api/tracks/${trackId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(res.body.title).toBe('One More Time (Radio Edit)');
    });
  });

  describe('Playlists CRUD & IDOR Security Verification', () => {
    it('should create separate playlists for User A and User B', async () => {
      // User A playlist
      const resA = await request(app.getHttpServer())
        .post('/api/me/playlists')
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ name: 'User A Playlists' })
        .expect(201);
      playlistAId = resA.body.id;

      // User B playlist
      const resB = await request(app.getHttpServer())
        .post('/api/me/playlists')
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ name: 'User B Playlists' })
        .expect(201);
      playlistBId = resB.body.id;
    });

    it('should separate list of playlists based on the logged-in user', async () => {
      const resA = await request(app.getHttpServer())
        .get('/api/me/playlists')
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(resA.body.length).toBe(1);
      expect(resA.body[0].name).toBe('User A Playlists');

      const resB = await request(app.getHttpServer())
        .get('/api/me/playlists')
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(200);

      expect(resB.body.length).toBe(1);
      expect(resB.body[0].name).toBe('User B Playlists');
    });

    it('should block User B from fetching User A playlist (IDOR Prevention)', async () => {
      await request(app.getHttpServer())
        .get(`/api/me/playlists/${playlistAId}`)
        .set('Authorization', `Bearer ${tokenB}`)
        .expect(403);
    });

    it('should allow User A to add a track to User A playlist', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/me/playlists/${playlistAId}/tracks`)
        .set('Authorization', `Bearer ${tokenA}`)
        .send({ trackId })
        .expect(201);

      expect(res.body.tracks.length).toBe(1);
      expect(res.body.tracks[0].id).toBe(trackId);
    });

    it('should block User B from adding a track to User A playlist (IDOR Prevention)', async () => {
      await request(app.getHttpServer())
        .post(`/api/me/playlists/${playlistAId}/tracks`)
        .set('Authorization', `Bearer ${tokenB}`)
        .send({ trackId })
        .expect(403);
    });

    it('should allow User A to remove the track from User A playlist', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/me/playlists/${playlistAId}/tracks/${trackId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      expect(res.body.tracks.length).toBe(0);
    });

    it('should allow User A to delete User A playlist', async () => {
      await request(app.getHttpServer())
        .delete(`/api/me/playlists/${playlistAId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/api/me/playlists/${playlistAId}`)
        .set('Authorization', `Bearer ${tokenA}`)
        .expect(404);
    });
  });
});

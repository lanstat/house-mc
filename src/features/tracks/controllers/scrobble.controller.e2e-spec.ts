import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import { TrackModule } from '../tracks.module';
import { UserScrobbleEntity } from '../entities/user-scrobble.entity';
import { UserTrackStatsEntity } from '../entities/user-track-stats.entity';
import { UserScrobbleDto } from '../dtos/user-scrobble.dto';
import * as request from 'supertest';

describe('ScrobbleController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TrackModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /tracks/:id/scrobble', () => {
    it('should record a scrobble', async () => {
      const dto: UserScrobbleDto = {
        userId: 1,
        trackId: 5,
      };

      const response = await request(app.getHttpServer())
        .post('/tracks/5/scrobble')
        .send(dto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toMatchObject({
        userId: 1,
        trackId: 5,
      });
    });
  });

  describe('GET /tracks/:userId/top-tracks', () => {
    it('should return top tracks for a user', async () => {
      const response = await request(app.getHttpServer())
        .get('/tracks/1/top-tracks')
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /tracks/:userId/top-artists', () => {
    it('should return top artists for a user', async () => {
      const response = await request(app.getHttpServer())
        .get('/tracks/1/top-artists')
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('GET /tracks/:userId/recent', () => {
    it('should return recent scrobbles for a user', async () => {
      const response = await request(app.getHttpServer())
        .get('/tracks/1/recent')
        .expect(HttpStatus.OK);

      expect(response.body).toBeInstanceOf(Array);
    });
  });
});

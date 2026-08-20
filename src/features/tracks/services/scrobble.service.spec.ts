import { Test, TestingModule } from '@nestjs/testing';
import { ScrobbleService } from './scrobble.service';
import { UserScrobbleEntity } from '../entities/user-scrobble.entity';
import { UserTrackStatsEntity } from '../entities/user-track-stats.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TrackScrobbledEvent } from '../events/track-scrobbled';

describe('ScrobbleService', () => {
  let service: ScrobbleService;
  let scrobbleRepo: Repository<UserScrobbleEntity>;
  let statsRepo: Repository<UserTrackStatsEntity>;
  let eventEmitter: EventEmitter2;

  const mockScrobbleRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockStatsRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScrobbleService,
        {
          provide: 'UserScrobbleRepository',
          useValue: mockScrobbleRepo,
        },
        {
          provide: 'UserTrackStatsRepository',
          useValue: mockStatsRepo,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<ScrobbleService>(ScrobbleService);
    scrobbleRepo = module.get('UserScrobbleRepository');
    statsRepo = module.get('UserTrackStatsRepository');
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('scrobble', () => {
    it('should create and save a scrobble and emit event', async () => {
      const userId = 1;
      const trackId = 5;
      const mockScrobble = new UserScrobbleEntity();

      mockScrobbleRepo.create.mockReturnValue(mockScrobble);
      mockScrobbleRepo.save.mockResolvedValue(mockScrobble);

      const result = await service.scrobble(userId, trackId);

      expect(scrobbleRepo.create).toHaveBeenCalledWith({
        userId,
        trackId,
      });
      expect(scrobbleRepo.save).toHaveBeenCalledWith(mockScrobble);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'track.scrobbled',
        expect.any(TrackScrobbledEvent),
      );
      expect(result).toBe(mockScrobble);
    });
  });

  describe('getTopTracks', () => {
    it('should return top tracks for a user', async () => {
      const userId = 1;
      const limit = 10;
      const mockStats = [
        {
          track: { id: 1, title: 'Track 1' },
          playCount: 15,
        },
        {
          track: { id: 2, title: 'Track 2' },
          playCount: 10,
        },
      ];

      mockStatsRepo.findMany = jest.fn().mockResolvedValue(mockStats);

      const result = await service.getTopTracks(userId, limit);

      expect(result).toEqual(mockStats);
    });
  });

  describe('getTopArtists', () => {
    it('should return top artists for a user', async () => {
      const userId = 1;
      const limit = 10;
      const mockArtists = [
        { artist: { id: 1, name: 'Artist 1' }, totalPlays: 25 },
        { artist: { id: 2, name: 'Artist 2' }, totalPlays: 20 },
      ];

      mockStatsRepo.getRawAndEntities = jest.fn().mockResolvedValue({
        entities: mockArtists,
        raw: [{ totalPlays: '25' }, { totalPlays: '20' }],
      });

      const result = await service.getTopArtists(userId, limit);

      expect(result).toEqual(mockArtists);
    });
  });

  describe('getRecentScrobbles', () => {
    it('should return recent scrobbles for a user', async () => {
      const userId = 1;
      const limit = 20;
      const mockScrobbles = [
        {
          id: 1,
          track: { id: 1, title: 'Track 1' },
          createdAt: new Date(),
        },
      ];

      mockScrobbleRepo.findMany = jest.fn().mockResolvedValue(mockScrobbles);

      const result = await service.getRecentScrobbles(userId, limit);

      expect(result).toEqual(mockScrobbles);
    });
  });
});

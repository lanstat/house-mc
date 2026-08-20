import { Test, TestingModule } from '@nestjs/testing';
import { UserTrackStatsListener } from './user-track-stats.listener';
import { UserTrackStatsEntity } from '../entities/user-track-stats.entity';
import { Repository } from 'typeorm';
import { TrackScrobbledEvent } from '../events/track-scrobbled';
import { UserScrobbleEntity } from '../entities/user-scrobble.entity';

describe('UserTrackStatsListener', () => {
  let listener: UserTrackStatsListener;
  let statsRepo: Repository<UserTrackStatsEntity>;

  const mockStatsRepo = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserTrackStatsListener,
        {
          provide: 'UserTrackStatsRepository',
          useValue: mockStatsRepo,
        },
      ],
    }).compile();

    listener = module.get<UserTrackStatsListener>(UserTrackStatsListener);
    statsRepo = module.get('UserTrackStatsRepository');
  });

  it('should be defined', () => {
    expect(listener).toBeDefined();
  });

  describe('handleTrackScrobbled', () => {
    it('should create new stats if none exist', async () => {
      const scrobble = new UserScrobbleEntity();
      scrobble.userId = 1;
      scrobble.trackId = 5;

      mockStatsRepo.findOne.mockResolvedValue(null);
      mockStatsRepo.create.mockReturnValue({
        userId: 1,
        trackId: 5,
        playCount: 0,
      });
      mockStatsRepo.save.mockResolvedValue({
        userId: 1,
        trackId: 5,
        playCount: 1,
      });

      await listener.handleTrackScrobbled(new TrackScrobbledEvent(scrobble));

      expect(statsRepo.findOne).toHaveBeenCalledWith({
        where: { userId: 1, trackId: 5 },
      });
      expect(statsRepo.create).toHaveBeenCalledWith({
        userId: 1,
        trackId: 5,
        playCount: 0,
      });
      expect(statsRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          playCount: 1,
          lastPlayedAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('should increment existing stats', async () => {
      const scrobble = new UserScrobbleEntity();
      scrobble.userId = 1;
      scrobble.trackId = 5;

      const existingStats = new UserTrackStatsEntity();
      existingStats.playCount = 5;

      mockStatsRepo.findOne.mockResolvedValue(existingStats);
      mockStatsRepo.save.mockResolvedValue({
        ...existingStats,
        playCount: 6,
      });

      await listener.handleTrackScrobbled(new TrackScrobbledEvent(scrobble));

      expect(statsRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          playCount: 6,
        }),
      );
    });
  });
});

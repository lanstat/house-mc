import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserScrobbleEntity } from '../entities/user-scrobble.entity';
import { UserTrackStatsEntity } from '../entities/user-track-stats.entity';
import { UserScrobbleDto } from '../dtos/user-scrobble.dto';
import { TrackScrobbledEvent } from '../events/track-scrobbled';

@Injectable()
export class ScrobbleService {
  constructor(
    @InjectRepository(UserScrobbleEntity)
    private readonly _scrobbleRepo: Repository<UserScrobbleEntity>,
    @InjectRepository(UserTrackStatsEntity)
    private readonly _statsRepo: Repository<UserTrackStatsEntity>,
    private readonly _eventEmitter: EventEmitter2,
  ) {}

  async scrobble(userId: number, trackId: number): Promise<UserScrobbleEntity> {
    const scrobble = this._scrobbleRepo.create({
      userId,
      trackId,
    });
    await this._scrobbleRepo.save(scrobble);
    this._eventEmitter.emit('track.scrobbled', new TrackScrobbledEvent(scrobble));
    return scrobble;
  }

  async getTopTracks(userId: number, limit: number = 10) {
    return this._statsRepo
      .createQueryBuilder('stats')
      .orderBy('stats.playCount', 'DESC')
      .leftJoinAndSelect('stats.track', 'track')
      .leftJoinAndSelect('track.artist', 'artist')
      .where('stats.userId = :userId', { userId })
      .take(limit)
      .getMany();
  }

  async getTopArtists(userId: number, limit: number = 10) {
    const results = await this._statsRepo
      .createQueryBuilder('stats')
      .select([
        'artist.id',
        'artist.name',
        'SUM(stats.playCount) as totalPlays',
      ])
      .innerJoin('stats.track', 'track')
      .innerJoin('track.artist', 'artist')
      .where('stats.userId = :userId', { userId })
      .groupBy('artist.id, artist.name')
      .orderBy('totalPlays', 'DESC')
      .limit(limit)
      .getRawAndEntities();

    return results.entities.map((entity, index) => ({
      artist: entity.track.artist,
      totalPlays: parseInt(results.raw[index].totalPlays, 10),
    }));
  }

  async getRecentScrobbles(userId: number, limit: number = 20) {
    return this._scrobbleRepo
      .createQueryBuilder('scrobble')
      .orderBy('scrobble.createdAt', 'DESC')
      .leftJoinAndSelect('scrobble.track', 'track')
      .leftJoinAndSelect('track.artist', 'artist')
      .leftJoinAndSelect('track.album', 'album')
      .where('scrobble.userId = :userId', { userId })
      .take(limit)
      .getMany();
  }
}

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackScrobbledEvent } from '../events/track-scrobbled';
import { UserTrackStatsEntity } from '../entities/user-track-stats.entity';

@Injectable()
export class UserTrackStatsListener {
  constructor(
    @InjectRepository(UserTrackStatsEntity)
    private readonly _statsRepo: Repository<UserTrackStatsEntity>,
  ) {}

  @OnEvent('track.scrobbled')
  async handleTrackScrobbled(event: TrackScrobbledEvent) {
    const { scrobble } = event;

    let stats = await this._statsRepo.findOne({
      where: { userId: scrobble.userId, trackId: scrobble.trackId },
    });

    if (!stats) {
      stats = this._statsRepo.create({
        userId: scrobble.userId,
        trackId: scrobble.trackId,
        playCount: 0,
      });
    }

    stats.playCount += 1;
    stats.lastPlayedAt = new Date();
    stats.updatedAt = new Date();

    await this._statsRepo.save(stats);
  }
}

import { UserScrobbleEntity } from '../entities/user-scrobble.entity';

export class TrackScrobbledEvent {
  constructor(public readonly scrobble: UserScrobbleEntity) {}
}

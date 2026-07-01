import { Type } from 'class-transformer';
import { User } from 'src/core/users';
import { Track } from './track.model';

export class Playlist {
  id: number;
  name: string;

  @Type(() => User)
  user: User;

  @Type(() => Track)
  tracks: Track[];
}

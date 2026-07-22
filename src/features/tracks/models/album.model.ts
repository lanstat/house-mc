import { Type } from 'class-transformer';
import { Artist } from './artist.model';

export class Album {
  id: number;
  name: string;
  coverPath: string;

  @Type(() => Artist)
  artist: Artist | null;
}

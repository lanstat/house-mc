import { Type } from 'class-transformer';
import { Artist } from './artist.model';
import { Album } from './album.model';

export class Track {
  id: number;
  title: string;
  duration: number | null;
  filePath: string;

  @Type(() => Artist)
  artist: Artist | null;

  @Type(() => Album)
  album: Album | null;
}

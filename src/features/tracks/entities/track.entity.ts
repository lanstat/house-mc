import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArtistEntity } from './artist.entity';
import { AlbumEntity } from './album.entity';

@Entity('track_tracks')
export class TrackEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'float', nullable: true })
  duration: number | null;

  @Column()
  filePath: string;

  @ManyToOne(() => ArtistEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'artistId' })
  artist: ArtistEntity | null;

  @ManyToOne(() => AlbumEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'albumId' })
  album: AlbumEntity | null;
}

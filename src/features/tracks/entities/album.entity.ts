import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArtistEntity } from './artist.entity';

@Entity('track_albums')
export class AlbumEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => ArtistEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'artistId' })
  artist: ArtistEntity | null;
}

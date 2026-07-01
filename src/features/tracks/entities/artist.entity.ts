import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('track_artists')
export class ArtistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}

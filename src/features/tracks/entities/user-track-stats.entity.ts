import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/core/users/entities/user.entity';
import { TrackEntity } from './track.entity';

@Entity('user_track_stats')
export class UserTrackStatsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  trackId: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => TrackEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trackId' })
  track: TrackEntity;

  @Column({ default: 0 })
  playCount: number;

  @Column({ nullable: true })
  lastPlayedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  updatedAt: Date;
}

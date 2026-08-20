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

@Entity('user_scrobbles')
export class UserScrobbleEntity {
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

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  playedAt: Date;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;
}

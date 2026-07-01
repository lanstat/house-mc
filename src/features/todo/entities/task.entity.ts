import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectEntity } from './project.entity';
import { UserEntity } from 'src/core/users';

@Entity('todo_tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  completed: boolean;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  isPublic: boolean;

  @Column()
  priority: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  dueDate: Date | null;

  @ManyToOne(() => ProjectEntity)
  @JoinColumn({ name: 'projectId' })
  project: ProjectEntity | null;
}

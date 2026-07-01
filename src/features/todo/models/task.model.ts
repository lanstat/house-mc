import { Type } from 'class-transformer';
import { Project } from './project.model';
import { User } from 'src/core/users';

export enum Priority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
}

export class Task {
  id: number;
  title: string;
  completed: boolean;
  isPublic: boolean;
  priority: Priority;
  dueDate: Date | null;

  @Type(() => Project)
  project: Project | null;

  @Type(() => User)
  user: User;
}

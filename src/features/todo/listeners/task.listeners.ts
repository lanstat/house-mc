import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../../../core/users/events/user-created';
import { UserDeletedEvent } from '../../../core/users/events/user-deleted';
import { TaskService } from '../services/task.service';
import { plainToClass } from 'class-transformer';
import { Task } from '../models/task.model';

@Injectable()
export class TaskListeners {
  constructor(private readonly _service: TaskService) {}

  @OnEvent('user.created')
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    await this._service.create(
      plainToClass(Task, {
        title: 'Cambiar contrasenha',
        user: {
          id: event.user.id,
        },
        isPublic: false,
      }),
    );
  }

  @OnEvent('user.deleted')
  async handleUserDeletedEvent(event: UserDeletedEvent) {
    await this._service.removeAllByUser(event.user.id);
  }
}

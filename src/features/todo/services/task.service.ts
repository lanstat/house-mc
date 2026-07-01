import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Priority, Task } from '../models/task.model';
import { TaskProvider } from '../providers/task.provider';

@Injectable()
export class TaskService {
  constructor(private _provider: TaskProvider) {}

  create(record: Task): Promise<Task> {
    console.log(record);
    return this._provider.create(record);
  }

  findAllByUser(userId: number): Promise<Task[]> {
    return this._provider.findAllByUser(userId);
  }

  async findAllPublic(): Promise<Task[]> {
    return await this._provider.findAll();
  }

  async update(id: number, userId: number, data: Task): Promise<Task> {
    const task = await this._provider.findOne(id);
    if (!task) {
      throw new NotFoundException();
    }
    if (task?.user.id !== userId) {
      throw new ForbiddenException('You can only edit your own tasks');
    }
    await this._provider.update(id, {
      title: data.title,
      dueDate: data.dueDate,
      priority: data.priority,
      isPublic: data.isPublic,
    });
    return task;
  }

  async toggleStatus(id: number, userId: number): Promise<Task> {
    const task = await this._provider.findOne(id);
    if (!task) {
      throw new NotFoundException();
    }
    if (task.user.id !== userId) {
      throw new ForbiddenException(
        'You can only update status of your own tasks',
      );
    }

    await this._provider.update(id, {
      completed: !task.completed,
    });

    return task;
  }

  async remove(id: number, userId: number) {
    const task = await this._provider.findOne(id);
    if (!task) {
      throw new NotFoundException();
    }
    if (task.user.id !== userId) {
      throw new ForbiddenException(
        'You can only update status of your own tasks',
      );
    }

    await this._provider.delete(id);
  }

  async removeAllByUser(userId: number) {
    await this._provider.deleteByUser(userId);
  }
}

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { TaskEntity } from '../entities/task.entity';
import { Task } from '../models/task.model';

export class TaskProvider {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly _repository: Repository<TaskEntity>,
  ) {}

  async findAll(): Promise<Task[]> {
    const records = await this._repository.find({
      relations: {
        project: true,
        user: true,
      },
      select: {
        id: true,
        title: true,
        completed: true,
        isPublic: true,
        priority: true,
        dueDate: true,
        project: {
          id: true,
          name: true,
        },
        user: {
          id: true,
          username: true,
        },
      },
    });
    return plainToInstance(Task, records);
  }

  async findOne(id: number): Promise<Task | null> {
    const record = await this._repository.findOne({
      where: { id: id },
      relations: {
        project: true,
      },
    });
    return plainToInstance(Task, record);
  }

  async findAllByUser(userId: number): Promise<Task[]> {
    const record = await this._repository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        project: true,
      },
    });
    return plainToInstance(Task, record);
  }

  async create(record: Task): Promise<Task> {
    const entity = instanceToPlain(record);

    const task = await this._repository.save(entity);

    return plainToInstance(Task, task);
  }

  async update(id: number, record: Partial<Task>): Promise<Task> {
    const task = await this._repository.update(
      {
        id: id,
      },
      record,
    );

    return plainToInstance(Task, task);
  }

  delete(id: number) {
    return this._repository.delete({ id: id });
  }

  deleteByUser(userId: number) {
    return this._repository.delete({ user: { id: userId } });
  }
}

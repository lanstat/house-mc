import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../events/user-created';
import { UserDeletedEvent } from '../events/user-deleted';
import { User } from '../models/user.model';
import { UserProvider } from '../providers/user.provider';

@Injectable()
export class UsersService {
  constructor(
    private _eventEmitter: EventEmitter2,
    private _provider: UserProvider,
  ) {}

  findOne(username: string): Promise<User | null> {
    return this._provider.findByName(username);
  }

  findById(id: number): Promise<User | null> {
    return this._provider.findOne(id);
  }

  findAll(): Promise<User[]> {
    return this._provider.findAll();
  }

  async create(user: User): Promise<User> {
    const record = await this._provider.create(user);
    this._eventEmitter.emit('user.created', new UserCreatedEvent(record));
    return record;
  }

  async delete(userId: number): Promise<void> {
    const user = await this._provider.findOne(userId);
    if (user == null) {
      throw new Error('Usuario no encontrado');
    }
    await this._provider.delete(userId);
    this._eventEmitter.emit('user.deleted', new UserDeletedEvent(user));
  }
}

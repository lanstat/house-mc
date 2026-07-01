import { User } from '../models/user.model';

export class UserCreatedEvent {
  constructor(public readonly user: User) {}
}

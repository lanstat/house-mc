import { User } from '../models/user.model';

export class UserDeletedEvent {
  constructor(public readonly user: User) {}
}

import { Type } from 'class-transformer';
import { Role } from './role.model';

export class User {
  id: number;
  username: string;
  password: string;
  fullName: string;
  phone: string;
  email: string;

  @Type(() => Role)
  role: Role;
}

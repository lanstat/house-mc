import { Injectable } from '@nestjs/common';
import { Role } from '../models/role.model';

@Injectable()
export class RoleService {
  private readonly roles = [
    {
      id: 1,
      name: 'Administrator',
    },
    {
      id: 2,
      name: 'Customer',
    },
    {
      id: 3,
      name: 'Manager',
    },
    {
      id: 4,
      name: 'Driver',
    },
  ];

  findAll(): Role[] {
    return this.roles;
  }
}

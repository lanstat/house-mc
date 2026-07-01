import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user.model';
import { plainToInstance } from 'class-transformer';
import { Role } from '../models/role.model';

export class UserProvider {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _repository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<User[]> {
    const records = await this._repository.find({
      relations: {
        role: true,
      },
    });
    return plainToInstance(User, records);
  }

  async findOne(id: number): Promise<User | null> {
    const record = await this._repository.findOne({
      where: { id: id },
      relations: {
        role: true,
      },
    });
    return plainToInstance(User, record);
  }

  async findByName(username: string): Promise<User | null> {
    const record = await this._repository.findOne({
      where: {
        username: username,
      },
      relations: {
        role: true,
      },
    });

    return plainToInstance(User, record);
  }

  async create(record: User): Promise<User> {
    const entity = new UserEntity();
    entity.username = record.username;
    entity.password = record.password;
    entity.fullName = '';
    entity.phone = '';
    entity.role = new Role();
    entity.role.id = 1;
    entity.email = '';

    await this._repository.save(entity);

    record.id = entity.id;

    return record;
  }

  async delete(id: number) {
    return this._repository.delete({ id: id });
  }
}

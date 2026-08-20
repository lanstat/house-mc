import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserScrobbleEntity } from '../entities/user-scrobble.entity';

@Injectable()
export class ScrobbleProvider {
  constructor(
    @InjectRepository(UserScrobbleEntity)
    private readonly _repo: Repository<UserScrobbleEntity>,
  ) {}

  create(scrobble: UserScrobbleEntity): Promise<UserScrobbleEntity> {
    return this._repo.save(scrobble);
  }

  async findOne(id: number): Promise<UserScrobbleEntity | null> {
    return this._repo.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this._repo.delete(id);
  }
}

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { PlaylistEntity } from '../entities/playlist.entity';
import { Playlist } from '../models/playlist.model';

export class PlaylistProvider {
  constructor(
    @InjectRepository(PlaylistEntity)
    private readonly _repository: Repository<PlaylistEntity>,
  ) {}

  async findAllByUser(userId: number): Promise<Playlist[]> {
    const records = await this._repository.find({
      where: { user: { id: userId } },
      relations: { tracks: { artist: true, album: true } },
    });
    return plainToInstance(Playlist, records);
  }

  async findOne(id: number): Promise<Playlist | null> {
    const record = await this._repository.findOne({
      where: { id },
      relations: { user: true, tracks: { artist: true, album: true } },
    });
    return plainToInstance(Playlist, record);
  }

  async findEntity(id: number): Promise<PlaylistEntity | null> {
    return await this._repository.findOne({
      where: { id },
      relations: { user: true, tracks: { artist: true, album: true } },
    });
  }

  async create(record: Playlist): Promise<Playlist> {
    const entity = this._repository.create(instanceToPlain(record));
    const saved = await this._repository.save(entity);
    return plainToInstance(Playlist, saved);
  }

  async update(id: number, record: Partial<Playlist>): Promise<Playlist | null> {
    const entity = await this.findEntity(id);
    if (!entity) return null;
    Object.assign(entity, record);
    const saved = await this._repository.save(entity);
    return plainToInstance(Playlist, saved);
  }

  async saveEntity(entity: PlaylistEntity): Promise<Playlist> {
    const saved = await this._repository.save(entity);
    return plainToInstance(Playlist, saved);
  }

  async delete(id: number): Promise<void> {
    await this._repository.delete({ id });
  }
}

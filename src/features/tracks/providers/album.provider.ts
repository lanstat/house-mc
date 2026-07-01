import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { AlbumEntity } from '../entities/album.entity';
import { Album } from '../models/album.model';

export class AlbumProvider {
  constructor(
    @InjectRepository(AlbumEntity)
    private readonly _repository: Repository<AlbumEntity>,
  ) {}

  async findAll(): Promise<Album[]> {
    const records = await this._repository.find({
      relations: { artist: true },
    });
    return plainToInstance(Album, records);
  }

  async findOne(id: number): Promise<Album | null> {
    const record = await this._repository.findOne({
      where: { id },
      relations: { artist: true },
    });
    return plainToInstance(Album, record);
  }

  async findByNameAndArtist(name: string, artistId: number | null): Promise<Album | null> {
    const record = await this._repository.findOne({
      where: {
        name,
        artist: artistId ? { id: artistId } : undefined,
      },
      relations: { artist: true },
    });
    return plainToInstance(Album, record);
  }

  async create(record: Album): Promise<Album> {
    const entity = instanceToPlain(record);
    const saved = await this._repository.save(entity);
    return plainToInstance(Album, saved);
  }

  async update(id: number, record: Partial<Album>): Promise<Album> {
    await this._repository.update({ id }, record);
    const updated = await this.findOne(id);
    return updated!;
  }

  async delete(id: number): Promise<void> {
    await this._repository.delete({ id });
  }
}

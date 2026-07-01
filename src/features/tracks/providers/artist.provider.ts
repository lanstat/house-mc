import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { ArtistEntity } from '../entities/artist.entity';
import { Artist } from '../models/artist.model';

export class ArtistProvider {
  constructor(
    @InjectRepository(ArtistEntity)
    private readonly _repository: Repository<ArtistEntity>,
  ) {}

  async findAll(): Promise<Artist[]> {
    const records = await this._repository.find();
    return plainToInstance(Artist, records);
  }

  async findOne(id: number): Promise<Artist | null> {
    const record = await this._repository.findOne({ where: { id } });
    return plainToInstance(Artist, record);
  }

  async findByName(name: string): Promise<Artist | null> {
    const record = await this._repository.findOne({ where: { name } });
    return plainToInstance(Artist, record);
  }

  async create(record: Artist): Promise<Artist> {
    const entity = instanceToPlain(record);
    const saved = await this._repository.save(entity);
    return plainToInstance(Artist, saved);
  }

  async update(id: number, record: Partial<Artist>): Promise<Artist> {
    await this._repository.update({ id }, record);
    const updated = await this.findOne(id);
    return updated!;
  }

  async delete(id: number): Promise<void> {
    await this._repository.delete({ id });
  }
}

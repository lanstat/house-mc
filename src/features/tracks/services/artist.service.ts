import { Injectable, NotFoundException } from '@nestjs/common';
import { ArtistProvider } from '../providers/artist.provider';
import { Artist } from '../models/artist.model';

@Injectable()
export class ArtistService {
  constructor(private readonly _provider: ArtistProvider) {}

  create(record: Artist): Promise<Artist> {
    return this._provider.create(record);
  }

  findAll(): Promise<Artist[]> {
    return this._provider.findAll();
  }

  async findOne(id: number): Promise<Artist> {
    const record = await this._provider.findOne(id);
    if (!record) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return record;
  }

  async findOrCreateByName(name: string): Promise<Artist> {
    const existing = await this._provider.findByName(name);
    if (existing) {
      return existing;
    }
    const newArtist = new Artist();
    newArtist.name = name;
    return this._provider.create(newArtist);
  }

  async update(id: number, data: Partial<Artist>): Promise<Artist> {
    const existing = await this._provider.findOne(id);
    if (!existing) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return this._provider.update(id, data);
  }

  async remove(id: number): Promise<void> {
    const existing = await this._provider.findOne(id);
    if (!existing) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    await this._provider.delete(id);
  }
}

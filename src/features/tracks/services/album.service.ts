import { Injectable, NotFoundException } from '@nestjs/common';
import { AlbumProvider } from '../providers/album.provider';
import { Album } from '../models/album.model';
import { Artist } from '../models/artist.model';

@Injectable()
export class AlbumService {
  constructor(private readonly _provider: AlbumProvider) {}

  create(record: Album): Promise<Album> {
    return this._provider.create(record);
  }

  findAll(): Promise<Album[]> {
    return this._provider.findAll();
  }

  async findOne(id: number): Promise<Album> {
    const record = await this._provider.findOne(id);
    if (!record) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return record;
  }

  async findOrCreateByNameAndArtist(name: string, artist: Artist | null): Promise<Album> {
    const existing = await this._provider.findByNameAndArtist(name, artist ? artist.id : null);
    if (existing) {
      return existing;
    }
    const newAlbum = new Album();
    newAlbum.name = name;
    newAlbum.artist = artist;
    return this._provider.create(newAlbum);
  }

  async update(id: number, data: Partial<Album>): Promise<Album> {
    const existing = await this._provider.findOne(id);
    if (!existing) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return this._provider.update(id, data);
  }

  async remove(id: number): Promise<void> {
    const existing = await this._provider.findOne(id);
    if (!existing) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    await this._provider.delete(id);
  }
}

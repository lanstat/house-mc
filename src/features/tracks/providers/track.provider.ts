import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { TrackEntity } from '../entities/track.entity';
import { Track } from '../models/track.model';

export class TrackProvider {
  constructor(
    @InjectRepository(TrackEntity)
    private readonly _repository: Repository<TrackEntity>,
  ) {}

  async findAll(filters?: { title?: string; album?: string; artist?: string }): Promise<Track[]> {
    const query = this._repository.createQueryBuilder('track')
      .leftJoinAndSelect('track.artist', 'artist')
      .leftJoinAndSelect('track.album', 'album');

    if (filters?.title) {
      query.andWhere('track.title LIKE :title', { title: `%${filters.title}%` });
    }
    if (filters?.album) {
      query.andWhere('album.name LIKE :album', { album: `%${filters.album}%` });
    }
    if (filters?.artist) {
      query.andWhere('artist.name LIKE :artist', { artist: `%${filters.artist}%` });
    }

    const records = await query.getMany();
    return plainToInstance(Track, records);
  }

  async findOne(id: number): Promise<Track | null> {
    const record = await this._repository.findOne({
      where: { id },
      relations: { artist: true, album: true },
    });
    return plainToInstance(Track, record);
  }

  async create(record: Track): Promise<Track> {
    const entity = instanceToPlain(record);
    const saved = await this._repository.save(entity);
    return plainToInstance(Track, saved);
  }

  async update(id: number, record: Partial<Track>): Promise<Track> {
    await this._repository.update({ id }, record);
    const updated = await this.findOne(id);
    return updated!;
  }

  async delete(id: number): Promise<void> {
    await this._repository.delete({ id });
  }
}

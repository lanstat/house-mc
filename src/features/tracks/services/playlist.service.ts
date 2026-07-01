import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PlaylistProvider } from '../providers/playlist.provider';
import { TrackProvider } from '../providers/track.provider';
import { Playlist } from '../models/playlist.model';

@Injectable()
export class PlaylistService {
  constructor(
    private readonly _provider: PlaylistProvider,
    private readonly _trackProvider: TrackProvider,
  ) {}

  async create(name: string, userId: number): Promise<Playlist> {
    const playlist = new Playlist();
    playlist.name = name;
    playlist.user = { id: userId } as any;
    playlist.tracks = [];
    return this._provider.create(playlist);
  }

  findAllByUser(userId: number): Promise<Playlist[]> {
    return this._provider.findAllByUser(userId);
  }

  async findOne(id: number, userId: number): Promise<Playlist> {
    const record = await this._provider.findOne(id);
    if (!record) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }
    if (record.user.id !== userId) {
      throw new ForbiddenException('You do not own this playlist');
    }
    return record;
  }

  async update(id: number, userId: number, name: string): Promise<Playlist> {
    await this.findOne(id, userId);
    const updated = await this._provider.update(id, { name });
    if (!updated) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.findOne(id, userId);
    await this._provider.delete(id);
  }

  async addTrack(id: number, userId: number, trackId: number): Promise<Playlist> {
    const playlistEntity = await this._provider.findEntity(id);
    if (!playlistEntity) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }
    if (playlistEntity.user.id !== userId) {
      throw new ForbiddenException('You do not own this playlist');
    }

    const track = await this._trackProvider.findOne(trackId);
    if (!track) {
      throw new NotFoundException(`Track with ID ${trackId} not found`);
    }

    if (!playlistEntity.tracks.some(t => t.id === trackId)) {
      playlistEntity.tracks.push(track as any);
      return this._provider.saveEntity(playlistEntity);
    }

    const playlist = await this._provider.findOne(id);
    return playlist!;
  }

  async removeTrack(id: number, userId: number, trackId: number): Promise<Playlist> {
    const playlistEntity = await this._provider.findEntity(id);
    if (!playlistEntity) {
      throw new NotFoundException(`Playlist with ID ${id} not found`);
    }
    if (playlistEntity.user.id !== userId) {
      throw new ForbiddenException('You do not own this playlist');
    }

    playlistEntity.tracks = playlistEntity.tracks.filter(t => t.id !== trackId);
    return this._provider.saveEntity(playlistEntity);
  }
}

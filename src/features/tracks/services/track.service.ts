import { Injectable, NotFoundException } from '@nestjs/common';
import { TrackProvider } from '../providers/track.provider';
import { Track } from '../models/track.model';
import { ArtistService } from './artist.service';
import { AlbumService } from './album.service';
import { Artist } from '../models/artist.model';
import { Album } from '../models/album.model';

@Injectable()
export class TrackService {
  constructor(
    private readonly _provider: TrackProvider,
    private readonly _artistService: ArtistService,
    private readonly _albumService: AlbumService,
  ) { }

  create(record: Track): Promise<Track> {
    return this._provider.create(record);
  }

  findAll(filters?: { title?: string; album?: string; artist?: string }): Promise<Track[]> {
    return this._provider.findAll(filters);
  }

  async findOne(id: number): Promise<Track> {
    const record = await this._provider.findOne(id);
    if (!record) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return record;
  }

  async update(id: number, data: Partial<Track>): Promise<Track> {
    const existing = await this._provider.findOne(id);
    if (!existing) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return this._provider.update(id, data);
  }

  async remove(id: number): Promise<void> {
    const existing = await this._provider.findOne(id);
    if (!existing) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    await this._provider.delete(id);
  }

  async uploadTrack(file: any): Promise<Track> {
    const fs = await import('fs/promises');
    const path = await import('path');

    let title = file.originalname;
    let artistName: string | null = null;
    let albumName: string | null = null;
    let duration: number | null = null;
    let coverBuffer: Buffer | null = null;
    let coverFormat: string | null = null;

    try {
      const { parseBuffer } = await import('music-metadata');
      const metadata = await parseBuffer(file.buffer, { mimeType: file.mimetype });
      if (metadata.common?.title) {
        title = metadata.common.title;
      }
      artistName = metadata.common?.artist || null;
      albumName = metadata.common?.album || null;
      duration = metadata.format?.duration || null;

      const picture = metadata.common.picture?.[0];
      if (picture) {
        coverBuffer = Buffer.from(picture.data);
        coverFormat = picture.format || 'jpg';
      }
    } catch (err) {
      console.warn('Failed to parse music metadata:', err);
    }

    // Automatically create artist if it exists in metadata
    let artist: Artist | null = null;
    if (artistName) {
      artist = await this._artistService.findOrCreateByName(artistName);
    }

    // Automatically create album if it exists in metadata
    let album: Album | null = null;
    if (albumName) {
      album = await this._albumService.findOrCreateByNameAndArtist(albumName, artist);
    }

    // Save the file to disk
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, file.buffer);

    // Extract and save album cover if available
    if (coverBuffer && album) {
      const coversDir = path.join(uploadsDir, 'covers');
      await fs.mkdir(coversDir, { recursive: true });
      const coverExt = coverFormat === 'png' ? 'png' : 'jpg';
      const coverFilename = `album-${album.id}.${coverExt}`;
      const coverPath = path.join(coversDir, coverFilename);
      await fs.writeFile(coverPath, coverBuffer);
      album.coverPath = `covers/${coverFilename}`;

      await this._albumService.update(album.id, album);
    }

    // Persist Track
    const track = new Track();
    track.title = title;
    track.duration = duration;
    track.filePath = filePath;
    track.artist = artist;
    track.album = album;

    return this._provider.create(track);
  }
}

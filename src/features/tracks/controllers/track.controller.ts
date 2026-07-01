import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TrackService } from '../services/track.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Track } from '../models/track.model';

@Controller('api/tracks')
export class TrackController {
  constructor(
    private readonly _service: TrackService,
    private readonly _artistService: ArtistService,
    private readonly _albumService: AlbumService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: any,
    @Body('title') title?: string,
    @Body('artistId') artistId?: number,
    @Body('albumId') albumId?: number,
  ) {
    if (file) {
      return this._service.uploadTrack(file);
    }

    if (!title) {
      throw new BadRequestException('Either a file upload or a title must be provided');
    }

    const track = new Track();
    track.title = title;
    track.filePath = '';
    track.duration = null;

    if (artistId) {
      const artist = await this._artistService.findOne(artistId);
      track.artist = artist;
    } else {
      track.artist = null;
    }

    if (albumId) {
      const album = await this._albumService.findOne(albumId);
      track.album = album;
    } else {
      track.album = null;
    }

    return this._service.create(track);
  }

  @Get()
  findAll(
    @Query('title') title?: string,
    @Query('album') album?: string,
    @Query('artist') artist?: string,
  ) {
    return this._service.findAll({ title, album, artist });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this._service.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body('title') title?: string,
    @Body('duration') duration?: number,
    @Body('artistId') artistId?: number,
    @Body('albumId') albumId?: number,
  ) {
    const updateData: Partial<Track> = {};
    if (title !== undefined) updateData.title = title;
    if (duration !== undefined) updateData.duration = duration;

    if (artistId !== undefined) {
      if (artistId === null) {
        updateData.artist = null;
      } else {
        const artist = await this._artistService.findOne(artistId);
        updateData.artist = artist;
      }
    }

    if (albumId !== undefined) {
      if (albumId === null) {
        updateData.album = null;
      } else {
        const album = await this._albumService.findOne(albumId);
        updateData.album = album;
      }
    }

    return this._service.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this._service.remove(id);
  }
}

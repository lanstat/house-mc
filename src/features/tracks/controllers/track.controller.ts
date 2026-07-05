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
  Res,
  StreamableFile,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TrackService } from '../services/track.service';
import { ArtistService } from '../services/artist.service';
import { AlbumService } from '../services/album.service';
import { Track } from '../models/track.model';
import { createReadStream, statSync } from 'fs';
import { Public } from 'src/core/auth/auth.decorator';
import type { Response } from 'express';

@Controller('api/tracks')
export class TrackController {
  constructor(
    private readonly _service: TrackService,
    private readonly _artistService: ArtistService,
    private readonly _albumService: AlbumService,
  ) { }

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

  @Public()
  @Get(':id/stream')
  async play(
    @Param('id', ParseIntPipe) id: number,
    @Headers('range') range: string,
    @Res({ passthrough: true }) response: Response
  ) {
    let track = await this._service.findOne(id);
    const filePath = track.filePath;

    const { size } = statSync(filePath);

    if (!range) {
      response.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': size.toString(),
        'Accept-Ranges': 'bytes'
      })
      const file = createReadStream(filePath);
      return new StreamableFile(file);
    }

    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    // Si no especifican el final, leemos hasta el último byte disponible
    const end = parts[1] ? parseInt(parts[1], 10) : size - 1;

    // Validación de seguridad para no desbordar el archivo
    if (start >= size || end >= size) {
      response.status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE).set({
        'Content-Range': `bytes */${size}`,
      });
      return;
    }

    const chunkSize = end - start + 1;
    const fileStream = createReadStream(filePath, { start, end });

    // 4. Configurar las cabeceras para una respuesta parcial (HTTP 206)
    response.status(HttpStatus.PARTIAL_CONTENT).set({
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize.toString(),
      'Content-Type': 'audio/mpeg',
    });

    // 5. Retornar el StreamableFile mapeado al rango de bytes solicitado
    return new StreamableFile(fileStream);
  }
}

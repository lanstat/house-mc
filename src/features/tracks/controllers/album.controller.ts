import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AlbumService } from '../services/album.service';
import { ArtistService } from '../services/artist.service';
import { Album } from '../models/album.model';

@Controller('api/albums')
export class AlbumController {
  constructor(
    private readonly _service: AlbumService,
    private readonly _artistService: ArtistService,
  ) {}

  @Post()
  async create(
    @Body('name') name: string,
    @Body('artistId') artistId?: number,
  ) {
    const album = new Album();
    album.name = name;
    if (artistId) {
      const artist = await this._artistService.findOne(artistId);
      album.artist = artist;
    } else {
      album.artist = null;
    }
    return this._service.create(album);
  }

  @Get()
  findAll() {
    return this._service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this._service.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name?: string,
    @Body('artistId') artistId?: number,
  ) {
    const updateData: Partial<Album> = {};
    if (name !== undefined) {
      updateData.name = name;
    }
    if (artistId !== undefined) {
      if (artistId === null) {
        updateData.artist = null;
      } else {
        const artist = await this._artistService.findOne(artistId);
        updateData.artist = artist;
      }
    }
    return this._service.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this._service.remove(id);
  }
}
